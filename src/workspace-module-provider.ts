import * as Glob from 'glob';
import { workspace, FileSystemWatcher } from 'vscode';
import * as path from 'path';

import { stripExtension } from './utils';
import { getConfig } from './config';

const allJsFilesGlobPattern = '**/*.{js,jsx}';

export interface IWorkspaceModuleProvider {
  getWorkspaceModules(): IFileInfo[];
  dispose(): void;
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
  constructor() {
    this.watchWorkspaceFiles();
    this.cacheModulePaths();
  }

  public getWorkspaceModules(): IFileInfo[] {
    return this.files;
  }

  public dispose() {
    this.fsWatcher.dispose();
  }

  private watchWorkspaceFiles() {
    this.fsWatcher = workspace.createFileSystemWatcher(allJsFilesGlobPattern, false, true);

    this.fsWatcher.onDidCreate((uri) => {
      this.files.push(toFileInfo(uri.fsPath));
      console.log(this.files);
    });

    this.fsWatcher.onDidDelete((uri) => {
      const itemIndex = this.files.findIndex((file) => file.fsPath === uri.fsPath);
      if (itemIndex) {
        this.files.splice(itemIndex, 1);
      }
      console.log(this.files);
    });
  }

  private cacheModulePaths() {
    const workspacePath = workspace.workspaceFolders[0].uri.fsPath;
    const excludedSearchPatterns = getConfig().searchExcludeGlobPatterns
      .map((pattern) => `${pattern}/**`);
    const glob = new Glob(`${workspacePath}/${allJsFilesGlobPattern}`, {
      ignore: excludedSearchPatterns,
    }, (err, matches) => {
      if (err) {
        console.log(err);
      }
      this.files = matches.map(toFileInfo);
      console.log(this.files);
    });
  }
}
