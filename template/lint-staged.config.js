'use strict';

module.exports = {
  '**/*.js': (filenames) => [
    `env NODE_ENV=production eslint --fix ${filenames.join(' ')}`,
  ],
  '**/*.ts': (filenames) => [
    `env NODE_ENV=production eslint --fix ${filenames.join(' ')}`,
    'tsc --noEmit',
  ],
  '**/*.less': (filenames) => [
    `env NODE_ENV=production stylelint --fix ${filenames.join(' ')}`,
  ],
  '**/*.wxml': (filenames) => [
    `prettier --write --parser html ${filenames.join(' ')}`,
  ],
  '**/*.json': (filenames) => [`prettier --write ${filenames.join(' ')}`],
  '**/*.md': (filenames) => [`prettier --write ${filenames.join(' ')}`],
};
