import { readFile } from 'fs';
import { join } from 'path';
import { workspace } from 'vscode';

function readJson(file) {
  return new Promise<any>((resolve, reject) => {
    readFile(file, (err, data) => err ? reject(err) : resolve(JSON.parse(data.toString())));
  });
}

function findNpmPackageName(packageName: string) {
  const packageJsonPath = join(workspace.rootPath, 'package.json');
  return readJson(packageJsonPath).then((packageJson) => {
    return Object.keys(packageJson.dependencies).find((dep) => dep.includes(packageName)) ||
      Object.keys(packageJson.devDependencies).find((dep) => dep.includes(packageName));
  });
}

export {
  findNpmPackageName,
};
