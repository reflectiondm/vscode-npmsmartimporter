import { IWorkspaceModuleProvider } from './workspace-module-provider';
import { matchByWords } from './utils';
import * as path from 'path';

export function findWorkspaceModules(moduleProvider: IWorkspaceModuleProvider, currentDocumentPath: string, packageName: string) {
  if (!packageName) {
    return [];
  }

  return moduleProvider.getWorkspaceModules()
    .filter((fileInfo) => matchByWords(packageName, fileInfo.fileName))
    .map((fileInfo) => path.relative(currentDocumentPath, fileInfo.fsPath).replace('.', ''));
}
