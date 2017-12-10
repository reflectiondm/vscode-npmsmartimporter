import { ExtensionContext, languages, commands } from 'vscode';

import { ImportProvider } from './import-provider';
import { importPackageEditorCommand } from './import-command';
import { ModuleProviderRepository } from './module-provider-repository';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  const moduleProviderRepository = new ModuleProviderRepository();
  context.subscriptions.push(languages.registerCodeActionsProvider(['javascript', 'javascriptreact'], new ImportProvider(moduleProviderRepository)));
  context.subscriptions.push(commands.registerTextEditorCommand('npmSmartImporter.import', importPackageEditorCommand));
}
