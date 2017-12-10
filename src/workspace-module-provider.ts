import * as Glob from 'glob';
import { workspace, FileSystemWatcher } from 'vscode';
import * as path from 'path';

import { stripExtension } from './utils';
import { getConfig } from './config';
import { IDisposable } from './common-interfaces';

const allJsFilesGlobPattern = '**/*.{js,jsx}';

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
  constructor(workspaceFsPath: string) {
    this.watchWorkspaceFiles(workspaceFsPath);
    this.cacheModulePaths(workspaceFsPath);
  }

  public getWorkspaceModules(): IFileInfo[] {
    return this.files;
  }

  public dispose() {
    this.fsWatcher.dispose();
  }

  private watchWorkspaceFiles(workspaceFsPath) {
    this.fsWatcher = workspace.createFileSystemWatcher(`${workspaceFsPath}/${allJsFilesGlobPattern}`, false, true);

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

  private cacheModulePaths(workspacePath) {
    const excludedSearchPatterns = getConfig().searchExcludeGlobPatterns
      .map((pattern) => `${pattern}/**`);
    const glob = new Glob(`${workspacePath}/${allJsFilesGlobPattern}`, {
      ignore: excludedSearchPatterns,
    }, (err, matches) => {
      if (err) {
        console.log(err);
      }
      this.files = matches.map(toFileInfo);
    });
  }
}
