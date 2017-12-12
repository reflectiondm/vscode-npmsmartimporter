import { readFile } from 'fs';
import { join } from 'path';
import { wordBasedMatch, exactMatch, conventionalMatch } from './dependencies-matcher';
import { getConfig } from './config';
import { Uri } from 'vscode';

const knownConventions = [
  { conventionalVariableName: 'ko', packageName: 'knockout' },
  { conventionalVariableName: '_', packageName: 'lodash' },
];

const nodePackages = [
  'assert', 'buffer', 'crypto', 'dns', 'fs', 'http', 'https', 'net', 'os', 'path', 'querystring',
  'readline', 'stream', 'tls', 'tty', 'dgram', 'url', 'util', 'v8', 'vm', 'zlib',
];

function getConventions(workspaceFsUri: Uri) {
  return knownConventions.concat(getConfig(workspaceFsUri).customNamingConventions);
}

function readJson(file) {
  return new Promise<any>((resolve, reject) => {
    readFile(file, (err, data) => err ? reject(err) : resolve(JSON.parse(data.toString())));
  });
}

function mapToProjectDependencies(packageJson) {
  return {
    dependencies: Object.keys(packageJson.dependencies),
    devDependencies: Object.keys(packageJson.devDependencies),
  };
}

function findNpmPackageName(packageName: string, workspaceFsUri: Uri): Promise<string[]> {
  if (!packageName) {
    return Promise.resolve([]);
  }

  const packageJsonPath = join(workspaceFsUri.fsPath, 'package.json');
  return readJson(packageJsonPath)
    .then(mapToProjectDependencies)
    .then((project) => [].concat(...
      wordBasedMatch(packageName, project.dependencies),
      wordBasedMatch(packageName, project.devDependencies),
      conventionalMatch(packageName, getConventions(workspaceFsUri), project.dependencies),
      conventionalMatch(packageName, getConventions(workspaceFsUri), project.devDependencies),
      exactMatch(packageName, nodePackages),
    ));
}

export {
  findNpmPackageName,
};
