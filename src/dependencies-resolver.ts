import { readFile } from 'fs';
import { join } from 'path';
import { workspace } from 'vscode';
import { wordBasedMatch } from './dependencies-matcher';

function readJson(file) {
  return new Promise<any>((resolve, reject) => {
    readFile(file, (err, data) => err ? reject(err) : resolve(JSON.parse(data.toString())));
  });
}

function getNodePackages() {
  return [
    'assert', 'buffer', 'crypto', 'dns', 'fs', 'http', 'https', 'net', 'os', 'path', 'querystring',
    'readline', 'stream', 'tls', 'tty', 'dgram', 'url', 'util', 'v8', 'vm', 'zlib',
  ];
}

function mapToProjectDependencies(packageJson) {
  return {
    dependencies: Object.keys(packageJson.dependencies),
    devDependencies: Object.keys(packageJson.devDependencies),
  };
}

function findNpmPackageName(packageName: string): Promise<string[]> {
  if (!packageName) {
    return Promise.resolve([]);
  }
  const packageJsonPath = join(workspace.rootPath, 'package.json');
  return readJson(packageJsonPath)
    .then(mapToProjectDependencies)
    .then((project) => [].concat(...
      wordBasedMatch(packageName, project.dependencies),
      wordBasedMatch(packageName, project.devDependencies),
      getNodePackages().filter((dep) => dep.toLowerCase() === packageName.toLowerCase()),
    ));
}

export {
  findNpmPackageName,
};
