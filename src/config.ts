import { workspace } from "vscode";

interface IConfiguration {
  autoDetectImportStatement: boolean;
  useES6Import: boolean;
  provideImportSuggestionsOnSelection: boolean;
}

export function getConfig(): IConfiguration {
  const config = workspace.getConfiguration("npmSmartImporter");

  return {
    autoDetectImportStatement: config.get<boolean>('autoDetectImportStatement'),
    useES6Import: config.get<boolean>('useES6Import'),
    provideImportSuggestionsOnSelection: config.get<boolean>('provideImportSuggestionsOnSelection'),
  };
}
