import * as path from 'path';

import { IWorkspaceModuleProvider } from './workspace-module-provider';
import { matchByWords, stripExtension } from './utils';
import { getConfig } from './config';
import { Uri } from 'vscode';
import { IModuleInfo, ModuleType } from './common-interfaces';

export function findWorkspaceModules(moduleProvider: IWorkspaceModuleProvider, currentDocumentUri: Uri, packageName: string): IModuleInfo[] {
  if (!packageName) {
    return [];
  }

  return moduleProvider.getWorkspaceModules()
    .filter((fileInfo) => matchByWords(packageName, fileInfo.fileName))
    .map((fileInfo) => composeImportPath(currentDocumentUri, fileInfo.fsPath))
    .filter((importString) => !!importString)
    .map((moduleName) => ({
      moduleName,
      moduleType: ModuleType.workspaceModule,
    }));
}

function composeImportPath(currentDocumentUri: Uri, fsPath: string) {
  let relativePath = path.relative(currentDocumentUri.fsPath, fsPath).replace('.', '');
  const config = getConfig(currentDocumentUri);

  if (config.skipInitialDotForRelativePath && relativePath.startsWith('./..')) {
    relativePath = relativePath.substring(2);
  }

  if (config.excludeExtension) {
    relativePath = stripExtension(relativePath);
  }

  return normalizeWindowsPath(relativePath);
}

function normalizeWindowsPath(windowsPath: string) {
  return windowsPath.replace(/\\/g, "/");
}
