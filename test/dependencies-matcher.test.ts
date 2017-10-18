import { expect } from 'chai';
import * as sut from '../src/dependencies-matcher';

suite('dependencies-matcher', () => {
  suite('wordBasedMatch', () => {
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
        'react-dom',
      ];
      const testCases = [
        { searchWord: 'express', expectedMatches: ['express'] },
        { searchWord: 'expect', expectedMatches: ['expect.js'] },
        { searchWord: 'moment', expectedMatches: ['moment', 'moment-timezone'] },
        { searchWord: 'bodyParser', expectedMatches: ['body-parser'] },
        { searchWord: 'gulpShell', expectedMatches: ['gulp-shell'] },
        { searchWord: 'customReact', expectedMatches: ['custom-react', 'custom-plugin-react'] },
        { searchWord: 'reactDOM', expectedMatches: ['react-dom'] },
        { searchWord: 'unknownPackage', expectedMatches: [] },
        { searchWord: '_', expectedMatches: [] },
      ];

      testCases.forEach((testCase) => {
        test(`search for "${testCase.searchWord}" should return [${testCase.expectedMatches}]`, () => {
          const result = sut.wordBasedMatch(testCase.searchWord, dependencies);
          expect(result).to.have.same.members(testCase.expectedMatches);
        });
      });
    });

    suite('exactMatch', () => {
      suite('should return matches containing exact', () => {
        const dependencies = [
          'assert', 'buffer', 'crypto', 'dns', 'fs', 'http', 'https', 'net', 'os', 'path', 'querystring',
          'readline', 'stream', 'tls', 'tty', 'dgram', 'url', 'util', 'v8', 'vm', 'zlib',
        ];
        const testCases = [
          { searchWord: 'fs', expectedMatches: ['fs'] },
          { searchWord: 'crypto', expectedMatches: ['crypto'] },
          { searchWord: 'readline', expectedMatches: ['readline'] },
          { searchWord: 'fsExtension', expectedMatches: [] },
        ];

        testCases.forEach((testCase) => {
          test(`search for "${testCase.searchWord}" should return [${testCase.expectedMatches}]`, () => {
            const result = sut.exactMatch(testCase.searchWord, dependencies);
            expect(result).to.have.same.members(testCase.expectedMatches);
          });
        });
      });
    });

    suite('conventionalMatch', () => {
      suite('should return matches containing real package name based on a convention', () => {
        const conventions = [
          { conventionalVariableName: 'ko', packageName: 'knockout' },
          { conventionalVariableName: '_', packageName: 'lodash' },
          { conventionalVariableName: 'clashedName', packageName: 'clashedName1' },
          { conventionalVariableName: 'clashedName', packageName: 'clashedName2' },
        ];

        const testCases = [
          { searchWord: 'ko', expectedMatches: ['knockout'], dependencies: ['knockout'] },
          { searchWord: 'ko', expectedMatches: [], dependencies: ['lodash'] },
          { searchWord: '_', expectedMatches: ['lodash'], dependencies: ['lodash']  },
          { searchWord: '_', expectedMatches: [], dependencies: ['knockout']  },
          { searchWord: '_ko', expectedMatches: [], dependencies: ['knockout', 'lodash'] },
          { searchWord: 'clashedName', expectedMatches: ['clashedName1', 'clashedName2'], dependencies: ['clashedName1', 'clashedName2'] },
          { searchWord: 'clashedName', expectedMatches: ['clashedName2'], dependencies: ['clashedName2'] },
        ];

        testCases.forEach((testCase) => {
          test(`search for "${testCase.searchWord}" should return [${testCase.expectedMatches}]`, () => {
            const result = sut.conventionalMatch(testCase.searchWord, conventions, testCase.dependencies);
            expect(result).to.have.same.members(testCase.expectedMatches);
          });
        });
      });
    });
  });
});
