import { ExtensionContext, languages, commands } from 'vscode';

import { ImportProvider } from './import-provider';
import { importPackageEditorCommand } from './import-command';
import { WorkspaceModuleProvider } from './workspace-module-provider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  const moduleProvider = new WorkspaceModuleProvider();
  context.subscriptions.push(languages.registerCodeActionsProvider(['javascript', 'javascriptreact'], new ImportProvider(moduleProvider)));
  context.subscriptions.push(commands.registerTextEditorCommand('npmSmartImporter.import', importPackageEditorCommand));
}
