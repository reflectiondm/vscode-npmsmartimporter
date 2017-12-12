import * as Glob from 'glob';
import { workspace, FileSystemWatcher, Uri } from 'vscode';
import * as path from 'path';

import { stripExtension } from './utils';
import { getConfig } from './config';
import { IDisposable } from './common-interfaces';

const allModuleFilesGlobPattern = '**/*.{js,jsx,ts,tsx}';

export interface IWorkspaceModuleProvider extends IDisposable {
  getWorkspaceModules(): IFileInfo[];
}

export interface IFileInfo {
  fileName: string;
  fsPath: string;
}

function toFileInfo(fsPath: string): IFileInfo {
  return {
    fileName: stripExtension(path.basename(fsPath)),
    fsPath,
  };
}

export class WorkspaceModuleProvider implements IWorkspaceModuleProvider {
  private files: IFileInfo[] = [];
  private fsWatcher: FileSystemWatcher;
  constructor(workspaceFsUri: Uri) {
    this.watchWorkspaceFiles(workspaceFsUri);
    this.cacheModulePaths(workspaceFsUri);
  }

  public getWorkspaceModules(): IFileInfo[] {
    return this.files;
  }

  public dispose() {
    this.fsWatcher.dispose();
  }

  private watchWorkspaceFiles(workspaceFsPath: Uri) {
    this.fsWatcher = workspace.createFileSystemWatcher(`${workspaceFsPath.fsPath}/${allModuleFilesGlobPattern}`, false, true);

    this.fsWatcher.onDidCreate((uri) => {
      this.files.push(toFileInfo(uri.fsPath));
    });

    this.fsWatcher.onDidDelete((uri) => {
      const itemIndex = this.files.findIndex((file) => file.fsPath === uri.fsPath);
      if (itemIndex) {
        this.files.splice(itemIndex, 1);
      }
    });
  }

  private cacheModulePaths(workspacePath: Uri) {
    const excludedSearchPatterns = getConfig(workspacePath).searchExcludeGlobPatterns
      .map((pattern) => `${pattern}/**`);
    const glob = new Glob(`${workspacePath.fsPath}/${allModuleFilesGlobPattern}`, {
      ignore: excludedSearchPatterns,
    }, (err, matches) => {
      if (err) {
        console.log(err);
      }
      this.files = matches.map(toFileInfo);
    });
  }
}
