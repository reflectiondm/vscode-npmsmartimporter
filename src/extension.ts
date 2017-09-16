import * as vscode from 'vscode';
import { ImportProvider } from './import-provider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(vscode.languages.registerCodeActionsProvider('javascript', new ImportProvider()));
  context.subscriptions.push(vscode.commands.registerTextEditorCommand('npm-smart-importer.import',
    (textEditor, edit, packageName, wordText) => {
      if (!packageName || !wordText) {
        return;
      }
      const lineToInsert = `const ${wordText} = require('${packageName}');\n`;
      edit.insert(new vscode.Position(0, 0), lineToInsert);
    }));
}
