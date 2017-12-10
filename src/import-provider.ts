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
import { IModuleProviderRepository } from './module-provider-repository';

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
  private moduleRepository: IModuleProviderRepository;

  constructor(moduleRepository: IModuleProviderRepository) {
    this.moduleRepository = moduleRepository;
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

    if (!currentDocumentWorkspace) {
      return [];
    }

    const workspaceFsPath = currentDocumentWorkspace.uri.fsPath;
    const workspaceModuleProvider = this.moduleRepository.getWorkspaceModuleProvider(workspaceFsPath);

    return Promise.all([
      findNpmPackageName(searchVariableName, workspaceFsPath),
      findWorkspaceModules(workspaceModuleProvider, document.fileName, searchVariableName),
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
    this.moduleRepository.dispose();
    console.log('Import provider is disposed');
  }
}
