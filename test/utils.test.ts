import { expect } from 'chai';
import * as sut from '../src/utils';

suite('utils', () => {
  suite('stripExtension', () => {
    const testCases = [
      { fileName: 'some-file.js', expectedName: 'some-file' },
      { fileName: 'some-file.jsx', expectedName: 'some-file' },
      { fileName: 'some.file.with.dots.js', expectedName: 'some.file.with.dots' },
      { fileName: 'some-file-with-no-extension', expectedName: 'some-file-with-no-extension' },
    ];

    testCases.forEach((testCase) => {
      test(`when called with ${testCase.fileName} should return ${testCase.expectedName}`, () => {
        const result = sut.stripExtension(testCase.fileName);
        expect(result).to.eql(testCase.expectedName);
      });
    });
  });
});
