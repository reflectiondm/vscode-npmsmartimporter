import { TextEditor, TextEditorEdit, Position, TextDocument } from 'vscode';
import { getConfig } from './config';
import { ModuleType } from './common-interfaces';

const importTypes = {
  es6: 'es6',
  require: 'require',
  none: 'none',
};

export function importPackageEditorCommand(
  textEditor: TextEditor,
  edit: TextEditorEdit,
  packageName: string,
  wordText: string,
  moduleType: ModuleType) {
  if (!packageName || !wordText) {
    return;
  }

  const config = getConfig(textEditor.document.uri);
  const importInformation = findFirstImportStatement(textEditor.document);
  const useEs6Import = config.autoDetectImportStatement && importInformation.importType !== importTypes.none ?
    importInformation.importType === importTypes.es6 :
    config.useES6Import;

  const languageId = textEditor.document.languageId;
  const lineToInsert = getImportStatement(wordText, packageName, moduleType, languageId, useEs6Import);
  edit.insert(importInformation.position, lineToInsert);
}

function findFirstImportStatement(textDocument: TextDocument) {
  for (let i = 0; i < textDocument.lineCount; i++) {
    const line = textDocument.lineAt(i);
    if (line.text.includes('import') && line.text.includes('from')) {
      return {
        importType: importTypes.es6,
        position: new Position(i, 0),
      };
    }
    if (line.text.includes('= require(')) {
      return {
        importType: importTypes.require,
        position: new Position(i, 0),
      };
    }
  }
  return {
    importType: importTypes.none,
    position: new Position(0, 0),
  };
}

function getImportStatement(wordText: string, packageName: string, moduleType: ModuleType, languageId: string,  useEs6Import: boolean) {
  let importStatement = 'import';
  if (languageId.includes('typescript') && moduleType === ModuleType.npmPackage) {
    importStatement = `${importStatement} * as`;
  }

  return useEs6Import ? `${importStatement} ${wordText} from '${packageName}';\n` :
    `const ${wordText} = require('${packageName}');\n`;
}
