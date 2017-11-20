import {
  CancellationToken,
  CodeActionContext,
  CodeActionProvider,
  Command,
  Diagnostic,
  ProviderResult,
  Range,
  TextDocument,
  workspace,
} from 'vscode';

import { findNpmPackageName } from './dependencies-resolver';
import { getConfig } from './config';
import { IWorkspaceModuleProvider } from './workspace-module-provider';
import { findWorkspaceModules } from './workspace-module-resolver';

const esLintDiagnosticCodes = [
  'no-undef',
  'react/jsx-no-undef',
];

function isValueNotDefinedDiagnostic(context: CodeActionContext) {
  return context.diagnostics.find((diagnostic) => diagnostic.source === 'eslint' && esLintDiagnosticCodes.some((code) => code === diagnostic.code)) ||
    context.diagnostics.find((diagnostic) => diagnostic.source === 'jshint' && diagnostic.code === 'W117');
}

function getUndeclaredVariableName(diagnostic: Diagnostic, document: TextDocument) {
    // sometimes diagnostic only contains the start of position of the diagnostic warning
    return document.getText(document.getWordRangeAtPosition(diagnostic.range.start));
}

export class ImportProvider implements CodeActionProvider {
  private moduleProvider: IWorkspaceModuleProvider;
  constructor(moduleProvider: IWorkspaceModuleProvider) {
    this.moduleProvider = moduleProvider;
  }

  public provideCodeActions(
    document: TextDocument,
    range: Range,
    context: CodeActionContext,
    token: CancellationToken): ProviderResult<Command[]> {

    const config = getConfig();
    const diagnostic = isValueNotDefinedDiagnostic(context);
    let searchVariableName;
    if (diagnostic) {
      searchVariableName = getUndeclaredVariableName(diagnostic, document);
    } else if (config.provideImportSuggestionsOnSelection) {
      const word = document.getWordRangeAtPosition(range.start);
      searchVariableName = document.getText(word);
    }

    const currentDocumentWorkspace = workspace.getWorkspaceFolder(document.uri);

    const workspaceFsPath = currentDocumentWorkspace.uri.fsPath;

    return Promise.all([
      findNpmPackageName(searchVariableName, workspaceFsPath),
      findWorkspaceModules(this.moduleProvider, document.fileName, searchVariableName),
    ]).then(([npmPackageNames, moduleNames]) => npmPackageNames.concat(moduleNames))
      .then((packageNames) => {
        return packageNames.map((packageName) => {
          return {
            title: `Import ${packageName}`,
            command: 'npmSmartImporter.import',
            arguments: [packageName, searchVariableName],
          };
        });
      });
  }

  public dispose() {
    this.moduleProvider.dispose();
    console.log('Import provider is disposed');
  }
}
