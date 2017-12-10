import { toLower } from 'lodash';
import { matchByWords, splitToLowerCasedWords } from './utils';

const getConventionalPackageNames = (s: string, conventions: IConvention[]) =>
  conventions.filter((convention) => toLower(convention.conventionalVariableName) === toLower(s))
    .map((convention) => convention.packageName);

export interface IConvention {
  conventionalVariableName: string;
  packageName: string;
}

export function wordBasedMatch(searchWord: string, packageNames: string[]) {
  const splitSearchWord = splitToLowerCasedWords(searchWord);
  if (splitSearchWord.length === 0) {
    return [];
  }

  return packageNames.filter((item) => matchByWords(searchWord, item));
}

export function exactMatch(searchWord: string, packageNames: string[]) {
  return packageNames.filter((dep) => toLower(dep) === toLower(searchWord));
}

export function conventionalMatch(searchWord: string, conventions: IConvention[], packageNames: string[]) {
  return packageNames
    .filter((item) => getConventionalPackageNames(searchWord, conventions).some((packageName) => packageName === item));
}
