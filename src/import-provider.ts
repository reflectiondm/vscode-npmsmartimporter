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

    const config = getConfig(document.uri);
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

    const workspaceFsUri = currentDocumentWorkspace.uri;
    const workspaceModuleProvider = this.moduleRepository.getWorkspaceModuleProvider(workspaceFsUri.fsPath);

    return Promise.all([
      findNpmPackageName(searchVariableName, workspaceFsUri),
      findWorkspaceModules(workspaceModuleProvider, document.uri, searchVariableName),
    ]).then(([npmPackageInfos, workspaceModuleInfos]) => npmPackageInfos.concat(workspaceModuleInfos))
      .then((moduleInfos) => {
        return moduleInfos.map((moduleInfo) => {
          const packageName = moduleInfo.moduleName;
          return {
            title: `Import ${packageName}`,
            command: 'npmSmartImporter.import',
            arguments: [packageName, searchVariableName, moduleInfo.moduleType],
          };
        });
      });
  }

  public dispose() {
    this.moduleRepository.dispose();
    console.log('Import provider is disposed');
  }
}
