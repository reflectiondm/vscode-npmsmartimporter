import * as vscode from 'vscode';
import { ImportProvider } from './import-provider';
import { importPackageEditorCommand } from './import-command';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(vscode.languages.registerCodeActionsProvider('javascript', new ImportProvider()));
  context.subscriptions.push(vscode.commands.registerTextEditorCommand('npmSmartImporter.import', importPackageEditorCommand));
}
