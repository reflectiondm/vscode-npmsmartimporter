import { words, toLower } from 'lodash';

export function stripExtension(fileName: string) {
  const index = fileName.lastIndexOf('.');
  return index > 0 ? fileName.substring(0, index) : fileName;
}

const isInArray = (arr: string[]) => (s: string) => arr.some((str) => str === s);

export function splitToLowerCasedWords(s: string) {
  return words(s).map(toLower);
}

export function matchByWords(searchValue: string, testedItem: string) {
  return splitToLowerCasedWords(searchValue).every(isInArray(splitToLowerCasedWords(testedItem)));
}
