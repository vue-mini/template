'use strict';

const runtimeVersion = require('@babel/runtime/package.json').version;

module.exports = ({ env }) => ({
  presets: [
    [
      '@babel/preset-env',
      {
        loose: true,
        bugfixes: true,
        modules: 'commonjs',
        targets: env('test') ? { node: 'current' } : undefined,
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        useESModules: !env('test'),
        regenerator: false,
        version: runtimeVersion,
      },
    ],
    !env('test') && '@babel/plugin-transform-regenerator',
    !env('test') && '@babel/plugin-transform-destructuring',
    'transform-inline-environment-variables',
    [
      'module-resolver',
      {
        alias: {
          '@': './src',
        },
      },
    ],
    'autocomplete-index',
  ].filter(Boolean),
});
