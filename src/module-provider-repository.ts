import { IWorkspaceModuleProvider, WorkspaceModuleProvider } from "./workspace-module-provider";
import { workspace, Disposable, WorkspaceFoldersChangeEvent } from "vscode";
import { IDisposable } from "./common-interfaces";

export interface IModuleProviderRepository extends IDisposable {
  getWorkspaceModuleProvider(workspaceFsPath: string): IWorkspaceModuleProvider;
}

export class ModuleProviderRepository implements IModuleProviderRepository {
  private workspaceModuleProviders = new Map<string, IWorkspaceModuleProvider>();
  private onDidChangeWorkspaceFoldersHandle: Disposable;

  constructor() {
    workspace.workspaceFolders.forEach((workspaceFolder) => {
      const workspaceFsPath = workspaceFolder.uri.fsPath;
      const workspaceModuleProvider = new WorkspaceModuleProvider(workspaceFsPath);
      this.workspaceModuleProviders.set(workspaceFsPath, workspaceModuleProvider);
    });

    this.onDidChangeWorkspaceFoldersHandle = workspace.onDidChangeWorkspaceFolders(this.updateModuleProviders);
  }

  public getWorkspaceModuleProvider(workspaceFsPath: string) {
    return this.workspaceModuleProviders.get(workspaceFsPath);
  }

  public dispose(): void {
    this.onDidChangeWorkspaceFoldersHandle.dispose();
    this.workspaceModuleProviders.forEach((provider) => provider.dispose());
  }

  private updateModuleProviders = (e: WorkspaceFoldersChangeEvent) => {
    e.added.forEach((wsFolder) => {
      const fsPath = wsFolder.uri.fsPath;
      const moduleProvider = new WorkspaceModuleProvider(fsPath);
      this.workspaceModuleProviders.set(fsPath, moduleProvider);
    });

    e.removed.forEach((wsFolder) => {
      const fsPath = wsFolder.uri.fsPath;
      const provider = this.workspaceModuleProviders.get(fsPath);
      this.workspaceModuleProviders.delete(fsPath);
      provider.dispose();
    });
  }
}
