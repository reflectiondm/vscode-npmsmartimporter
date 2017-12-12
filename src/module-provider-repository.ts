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
      const workspaceFsUri = workspaceFolder.uri;
      const workspaceModuleProvider = new WorkspaceModuleProvider(workspaceFsUri);
      this.workspaceModuleProviders.set(workspaceFsUri.fsPath, workspaceModuleProvider);
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
      const fsUri = wsFolder.uri;
      const moduleProvider = new WorkspaceModuleProvider(fsUri);
      this.workspaceModuleProviders.set(fsUri.fsPath, moduleProvider);
    });

    e.removed.forEach((wsFolder) => {
      const fsPath = wsFolder.uri.fsPath;
      const provider = this.workspaceModuleProviders.get(fsPath);
      this.workspaceModuleProviders.delete(fsPath);
      provider.dispose();
    });
  }
}
