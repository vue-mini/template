/* eslint-disable unicorn/prefer-module */
'use strict';

module.exports = {
  '**/*.js': (filenames) => [
    `prettier --write ${filenames.join(' ')}`,
    `eslint ${filenames.join(' ')}`,
  ],
  '**/*.ts': (filenames) => [
    `prettier --write ${filenames.join(' ')}`,
    `eslint ${filenames.join(' ')}`,
    'tsc --noEmit',
  ],
  '**/*.less': (filenames) => [
    `prettier --write ${filenames.join(' ')}`,
    `stylelint ${filenames.join(' ')}`,
  ],
  '**/*.wxml': (filenames) => [
    `prettier --write --parser html ${filenames.join(' ')}`,
  ],
  '**/*.json': (filenames) => [`prettier --write ${filenames.join(' ')}`],
  '**/*.md': (filenames) => [`prettier --write ${filenames.join(' ')}`],
};
