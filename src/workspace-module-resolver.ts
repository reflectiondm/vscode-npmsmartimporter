import * as path from 'path';

import { IWorkspaceModuleProvider } from './workspace-module-provider';
import { matchByWords, stripExtension } from './utils';
import { getConfig } from './config';

export function findWorkspaceModules(moduleProvider: IWorkspaceModuleProvider, currentDocumentPath: string, packageName: string) {
  if (!packageName) {
    return [];
  }

  return moduleProvider.getWorkspaceModules()
    .filter((fileInfo) => matchByWords(packageName, fileInfo.fileName))
    .map((fileInfo) => composeImportPath(currentDocumentPath, fileInfo.fsPath));
}

function composeImportPath(currentDocumentPath: string, fsPath: string) {
  let relativePath = path.relative(currentDocumentPath, fsPath).replace('.', '');
  const config = getConfig();

  if (config.skipInitialDotForRelativePath && relativePath.startsWith('./..')) {
    relativePath = relativePath.substring(2);
  }

  if (config.excludeExtension) {
    relativePath = stripExtension(relativePath);
  }

  return relativePath;
}
