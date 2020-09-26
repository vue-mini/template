'use strict';

const os = require('os');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs-extra');
const chokidar = require('chokidar');
const babel = require('@babel/core');
const posthtml = require('posthtml');
const less = require('less');
const postcss = require('postcss');
const pxtorpx = require('postcss-pxtorpx-pro');
const url = require('postcss-url');
const rollup = require('rollup');
const replace = require('@rollup/plugin-replace');
const { default: resolve } = require('@rollup/plugin-node-resolve');

const NODE_ENV = process.env.NODE_ENV || 'production';
const __DEV__ = NODE_ENV === 'development';
const localPath = `http://${getLocalIP()}:5000/`;
const publicPath = 'https://your.static.server/';

process.on('unhandledRejection', (error) => {
  throw error;
});

function getLocalIP() {
  const ifaces = Object.values(os.networkInterfaces());
  for (const iface of ifaces) {
    for (const alias of iface) {
      if (alias.internal || alias.family !== 'IPv4') continue;
      return alias.address;
    }
  }
}

function getImagePathWithHash(imagePath, originPath) {
  const buffer = fs.readFileSync(imagePath);
  const hash = crypto
    .createHash('md5')
    .update(buffer)
    .digest('hex')
    .slice(0, 8);
  return originPath.replace(/\.(png|jpe?g|gif|svg)$/, `.${hash}.$1`);
}

const bundledModules = new Set();
async function bundleModule(module) {
  if (bundledModules.has(module)) return;
  bundledModules.add(module);

  if (module === 'regenerator-runtime') {
    fs.copy(require.resolve(module), `dist/miniprogram_npm/${module}/index.js`);
    return;
  }

  const pkg = path.join(module, 'package.json');
  let fields;
  try {
    fields = require(pkg);
  } catch {}

  if (fields && !fields.module) {
    throw new Error(`Can't found esm bundle of ${module}`);
  }

  const entry = fields
    ? path.join(path.dirname(require.resolve(pkg)), fields.module)
    : require.resolve(module);

  const bundle = await rollup.rollup({
    input: entry,
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
      }),
      resolve(),
    ],
  });
  bundle.write({
    exports: 'named',
    file: `dist/miniprogram_npm/${module}/index.js`,
    format: 'cjs',
  });
}

async function processScript(filePath) {
  const { code } = await babel.transformFileAsync(path.resolve(filePath));
  for (const [, module] of code.matchAll(/require\("(.+?)"\)/g)) {
    if (module.startsWith('.')) continue;
    bundleModule(module);
  }

  const destination = filePath.replace('src', 'dist').replace(/\.ts$/, '.js');
  // Make sure the directory already exists when write file
  await fs.copy(filePath, destination);
  fs.writeFile(destination, code);
}

async function processTemplate(filePath, origin = localPath, addHash = false) {
  const source = await fs.readFile(filePath, 'utf8');
  const { html } = await posthtml()
    .use((tree) => {
      tree.match([{ tag: 'image' }, { tag: 'cover-image' }], (node) => {
        const pathname = node.attrs.src;
        if (
          (pathname.startsWith('{{') && pathname.endsWith('}}')) ||
          pathname.includes('/assets/')
        ) {
          return node;
        }

        const absolutePath = pathname.startsWith('/')
          ? path.resolve('src', pathname.slice(1))
          : path.resolve(path.dirname(filePath), pathname);
        const href = origin + path.relative('src', absolutePath);
        node.attrs.src = addHash
          ? getImagePathWithHash(absolutePath, href)
          : href;
        return node;
      });
    })
    .process(source, { xmlMode: true, singleTags: [/<>/] });
  const destination = filePath.replace('src', 'dist');
  // Make sure the directory already exists when write file
  await fs.copy(filePath, destination);
  fs.writeFile(destination, html);
}

async function processStyle(filePath, origin = localPath, addHash = false) {
  let source = await fs.readFile(filePath, 'utf8');
  source =
    `@import '${path.resolve('src/styles/mixins.less')}';\n` +
    `@import '${path.resolve('src/styles/variables.less')}';\n` +
    source;
  const { css } = await less.render(source, {
    filename: path.resolve(filePath),
  });
  const { css: wxss } = await postcss()
    .use(pxtorpx({ transform: (x) => x }))
    .use(
      url({
        url({ pathname }) {
          const absolutePath = pathname.startsWith('/')
            ? path.resolve('src', pathname.slice(1))
            : path.resolve(path.dirname(filePath), pathname);
          const href = origin + path.relative('src', absolutePath);
          return addHash ? getImagePathWithHash(absolutePath, href) : href;
        },
      })
    )
    .process(css, { map: false, from: undefined });
  const destination = filePath
    .replace('src', 'dist')
    .replace(/\.less$/, '.wxss');
  // Make sure the directory already exists when write file
  await fs.copy(filePath, destination);
  fs.writeFile(destination, wxss);
}

function recompileStyles() {
  const watcher = chokidar.watch(['src/**/*.less', '!src/styles/**/*']);
  watcher.on('add', (filePath) => {
    processStyle(filePath);
  });
  watcher.on('ready', () => watcher.close());
}

async function dev() {
  await fs.remove('dist');
  const cb = (filePath) => {
    if (/\.ts$/.test(filePath)) {
      processScript(filePath);
      return;
    }

    if (/\.wxml$/.test(filePath)) {
      processTemplate(filePath);
      return;
    }

    if (/\.less$/.test(filePath)) {
      processStyle(filePath);
      return;
    }

    fs.copy(filePath, filePath.replace('src', 'dist'));
  };

  chokidar
    .watch(['src', '!src/images/**/*'], {
      ignored: ['**/.{gitkeep,DS_Store}'],
    })
    .on('add', (filePath) => {
      if (filePath.includes('src/styles')) return;
      cb(filePath);
    })
    .on('change', (filePath) => {
      if (filePath.includes('src/styles')) {
        recompileStyles();
        return;
      }

      cb(filePath);
    });
}

async function prod() {
  await fs.remove('dist');
  await fs.remove('temp');
  const watcher = chokidar.watch(['src', '!src/styles/**/*'], {
    ignored: ['**/.{gitkeep,DS_Store}'],
  });
  watcher.on('add', (filePath) => {
    if (/\.ts$/.test(filePath)) {
      processScript(filePath);
      return;
    }

    if (/\.wxml$/.test(filePath)) {
      processTemplate(filePath, publicPath, true);
      return;
    }

    if (/\.less$/.test(filePath)) {
      processStyle(filePath, publicPath, true);
      return;
    }

    if (filePath.includes('src/images')) {
      fs.copy(
        filePath,
        getImagePathWithHash(filePath, filePath.replace('src', 'temp'))
      );
      return;
    }

    fs.copy(filePath, filePath.replace('src', 'dist'));
  });
  watcher.on('ready', () => watcher.close());
}

if (__DEV__) {
  dev();
} else {
  prod();
}
