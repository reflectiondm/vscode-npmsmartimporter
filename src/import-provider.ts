import {
  CancellationToken,
  CodeActionContext,
  CodeActionProvider,
  Command,
  Diagnostic,
  ProviderResult,
  Range,
  TextDocument,
} from 'vscode';

import { findNpmPackageName } from './dependencies-resolver';
import { getConfig } from './config';
import { IWorkspaceModuleProvider } from './workspace-module-provider';
import { findWorkspaceModules } from './workspace-module-resolver';

function isValueNotDefinedDiagnostic(context: CodeActionContext) {
  return context.diagnostics.find((diagnostic) => diagnostic.source === 'eslint' && diagnostic.code === 'no-undef') ||
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
    let wordText;
    if (diagnostic) {
      wordText = getUndeclaredVariableName(diagnostic, document);
    } else if (config.provideImportSuggestionsOnSelection) {
      const word = document.getWordRangeAtPosition(range.start);
      wordText = document.getText(word);
    }

    return Promise.all([
      findNpmPackageName(wordText),
      findWorkspaceModules(this.moduleProvider, document.fileName, wordText),
    ]).then(([npmPackageNames, moduleNames]) => npmPackageNames.concat(moduleNames))
      .then((packageNames) => {
        return packageNames.map((packageName) => {
          return {
            title: `Import ${packageName}`,
            command: 'npmSmartImporter.import',
            arguments: [packageName, wordText],
          };
        });
      });
  }

  public dispose() {
    this.moduleProvider.dispose();
    console.log('Import provider is disposed');
  }
}
