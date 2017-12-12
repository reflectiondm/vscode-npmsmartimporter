export interface IDisposable {
  dispose(): void;
}

export enum ModuleType {
  npmPackage = 'npmPackage',
  workspaceModule = 'workspaceModule',
}

export interface IModuleInfo {
  moduleName: string;
  moduleType: ModuleType;
}
