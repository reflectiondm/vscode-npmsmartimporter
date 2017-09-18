import { readFile } from 'fs';
import { join } from 'path';
import { workspace } from 'vscode';

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

function findNpmPackageName(packageName: string): Promise<string[]> {
  if (!packageName) {
    return Promise.resolve([]);
  }
  const packageJsonPath = join(workspace.rootPath, 'package.json');
  return readJson(packageJsonPath).then((packageJson) => {
    return [].concat(...
      Object.keys(packageJson.dependencies).filter((dep) => dep.includes(packageName)),
      Object.keys(packageJson.devDependencies).filter((dep) => dep.includes(packageName)),
      getNodePackages().filter((dep) => dep.toLowerCase() === packageName.toLowerCase()),
    );
  });
}

export {
  findNpmPackageName,
};
