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

function isValueNotDefinedDiagnostic(context: CodeActionContext) {
  return context.diagnostics.find((diagnostic) => diagnostic.source === 'eslint' && diagnostic.code === 'no-undef') ||
    context.diagnostics.find((diagnostic) => diagnostic.source === 'jshint' && diagnostic.code === 'W117');
}

function getUndeclaredVariableName(diagnostic: Diagnostic, document: TextDocument) {
  if (diagnostic.source === 'eslint') {
    return document.getText(diagnostic.range);
  } else if (diagnostic.source === 'jshint') {
    // sadly jshint only contains the start of position of the diagnostic warning
    return document.getText(document.getWordRangeAtPosition(diagnostic.range.start));
  }
  return "";
}

export class ImportProvider implements CodeActionProvider {
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

    return findNpmPackageName(wordText)
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
}
