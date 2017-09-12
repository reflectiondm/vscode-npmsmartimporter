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

function isValueNotDefinedDiagnostic(context: CodeActionContext) {
  return context.diagnostics.find((diagnostic) => diagnostic.source === 'eslint' && diagnostic.code === 'no-undef');
}

function getRangeFromDiagnostic(diagnostic: Diagnostic) {
  return diagnostic.range;
}

export class ImportProvider implements CodeActionProvider {
  public provideCodeActions(
    document: TextDocument,
    range: Range,
    context: CodeActionContext,
    token: CancellationToken): ProviderResult<Command[]> {

    const diagnostic = isValueNotDefinedDiagnostic(context);
    let wordText;
    if (diagnostic) {
      const word = getRangeFromDiagnostic(diagnostic);
      wordText = document.getText(word);
    } else {
      const word = document.getWordRangeAtPosition(range.start);
      wordText = document.getText(word);
    }

    return findNpmPackageName(wordText)
      .then((packageName) => {
        if (!packageName) {
          return [];
        }

        const title = `Import ${packageName}`;
        const command: Command = {
          title,
          command: 'test command',
          tooltip: `const ${wordText} = require('${packageName}')`,
          arguments: ['testarg'],
        };
        return [command];
      });
  }
}
