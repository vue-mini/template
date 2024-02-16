/* eslint-disable unicorn/prefer-module */
'use strict';

module.exports = {
  customSyntax: require('postcss-less'),
  extends: 'stylelint-config-standard',
  rules: {
    'alpha-value-notation': 'number',
    'color-function-notation': 'legacy',
    'selector-type-no-unknown': [
      true,
      {
        ignoreTypes: ['page'],
      },
    ],
  },
};
