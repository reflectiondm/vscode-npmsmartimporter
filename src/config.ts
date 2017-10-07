import { workspace, WorkspaceConfiguration } from 'vscode';
import { IConvention } from './dependencies-matcher';

interface IConfiguration {
  autoDetectImportStatement: boolean;
  useES6Import: boolean;
  provideImportSuggestionsOnSelection: boolean;
  customNamingConventions: IConvention[];
}

export function getConfig(): IConfiguration {
  const config = workspace.getConfiguration('npmSmartImporter');

  return {
    autoDetectImportStatement: config.get<boolean>('autoDetectImportStatement'),
    useES6Import: config.get<boolean>('useES6Import'),
    provideImportSuggestionsOnSelection: config.get<boolean>('provideImportSuggestionsOnSelection'),
    customNamingConventions: getConventionsArray(config),
  };
}

function getConventionsArray(config: WorkspaceConfiguration): IConvention[] {
  // This is required to make sure the extension won't crash no matter what user has  provided in settings
  // Typescript does not ensure types from objects provided by external sources
  const conventionsSettings = config.get('customNamingConventions');
  if (typeof(conventionsSettings) !== 'object') {
    return [];
  }
  return Object.keys(conventionsSettings)
    .map((key) => ({
      conventionalVariableName: key,
      packageName: `${conventionsSettings[key]}`,
    }));
}
