'use strict';

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  extends: ['stylelint-config-xo', 'stylelint-prettier/recommended'],
  rules: {
    'prettier/prettier': isProd ? true : null,
    'color-function-notation': 'legacy',
    'selector-type-no-unknown': [
      true,
      {
        ignoreTypes: ['page'],
      },
    ],
  },
};
