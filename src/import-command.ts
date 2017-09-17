import { TextEditor, TextEditorEdit, Position, TextDocument } from 'vscode';
import { getConfig } from './config';

export function importPackageEditorCommand(
  textEditor: TextEditor,
  edit: TextEditorEdit,
  packageName: string,
  wordText: string) {
  if (!packageName || !wordText) {
    return;
  }

  const config = getConfig();
  const useEs6Import = config.autoDetectImportStatement ? detectIfEs6ImportIsUsed(textEditor.document) :
    config.useES6Import;

  const lineToInsert = getImportStatement(wordText, packageName, useEs6Import);
  edit.insert(new Position(0, 0), lineToInsert);
}

function detectIfEs6ImportIsUsed(textDocument: TextDocument) {
  for (let i = 0; i < textDocument.lineCount; i++) {
    const line = textDocument.lineAt(0);
    if (line.text.includes('import') && line.text.includes('from')) {
      return true;
    }
    if (line.text.includes('= require(')) {
      return false;
    }
  }
  return getConfig().useES6Import;
}

function getImportStatement(wordText: string, packageName: string, useEs6Import: boolean) {
  return useEs6Import ? `import ${wordText} from '${packageName}';\n` :
    `const ${wordText} = require('${packageName}');\n`;
}
