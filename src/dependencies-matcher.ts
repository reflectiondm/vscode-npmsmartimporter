import { words, map, toLower } from 'lodash';

const splitToLowerCasedWords = (s: string) => words(s).map(toLower);
const isInArray = (arr: string[]) => (s: string) => arr.some((str) => str === s);

export function wordBasedMatch(searchWord: string, data: string[]) {
  return data
    .map((item) => ({
      item,
      words: splitToLowerCasedWords(item)}))
    .filter((enrichedItem) => splitToLowerCasedWords(searchWord).every(isInArray(enrichedItem.words)))
    .map((enrichedItem) => enrichedItem.item);
}
