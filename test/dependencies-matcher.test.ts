import { expect } from 'chai';
import * as sut from '../src/dependencies-matcher';

suite.only('dependencies-matcher', () => {
  suite('fuzzyMatch', () => {
    suite('should return matches containing full word', () => {
      const dependencies = [
        'shell',
        'gulp',
        'gulp-shell',
        'express',
        'body-parser',
        'expect.js',
        'moment',
        'moment-timezone',
        'custom-plugin-react',
        'custom-react',
        'custom-plugin-preact',
      ];
      const testCases = [
        { searchWord: 'express', expectedMatches: ['express']},
        { searchWord: 'expect', expectedMatches: ['expect.js']},
        { searchWord: 'moment', expectedMatches: ['moment', 'moment-timezone']},
        { searchWord: 'bodyParser', expectedMatches: ['body-parser']},
        { searchWord: 'gulpShell', expectedMatches: ['gulp-shell']},
        { searchWord: 'customReact', expectedMatches: ['custom-react', 'custom-plugin-react']},
      ];

      testCases.forEach((testCase) => {
        test(`should return ${testCase.expectedMatches}`, () => {
          const result = sut.wordBasedMatch(testCase.searchWord, dependencies);
          expect(result).to.have.same.members(testCase.expectedMatches);
        });
      });
    });
  });
});
