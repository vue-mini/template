# Vue Mini 脚手架

## 使用前

请先全局安装 [SAO](https://github.com/saojs/sao) v2

```bash
npm install -g sao@beta
# OR
yarn global add sao@beta
```

## 使用

```bash
sao vue-mini/template new-miniprogram
```

## 说明

这是一个自以为是的 Vue Mini 微信小程序脚手架（其实用来写原生小程序也很合适），目前并没有提供自定义项（将来会 🚩）。此脚手架预设你使用 TS + Less + WXML 技术栈，并提供了从开发到测试直至生产构建的一整套方案。以下为此脚手架所包含的功能：

- NPM 包构建提取（目前仅支持包含 ESM Build 的包）：Rollup
- 代码检查及格式化：ESLint, StyleLint, Prettier
- 类型检查：TypeScript
- 最新 ES 语法支持：Babel
- 环境变量替换：babel-plugin-transform-inline-environment-variables
- 路径别名（@ -> src）：babel-plugin-module-resolver
- 路径尾部 index 自动填充：babel-plugin-autocomplete-index
- 单元测试：Jest
- Git hooks：husky
- 开发时图片静态服务：serve
- WXML 图片路径替换（生产构建带 Hash）：PostHTML
- Less 背景图片路径替换（生产构建带 Hash）：PostCSS
- 开发时监听文件修改并实时构建：chokidar

## 约定

### 图片

- 需要本地访问的图片（如：tabBar icon）请放在 `src/assets` 目录内，此目录会被打入生产包。
- 可以走网络访问的图片请放在 `src/images` 目录内，此目录不会被打入生产包，生产构建会将其拷贝到临时的 `temp` 目录下，并且会给每个文件名加上内容 Hash 以方便做长期缓存，你可以将 `temp` 目录下的内容自行上传到你的服务器或云存储，并将 `build.js` 中的 `publicPath` 修改为你的静态服务地址。

### 样式

- `src/styles` 目录仅用于存放抽象样式文件，如变量、Mixin 等，此目录不会被打入生产包。构建脚本会在 `src/styles` 目录外的每个 Less 文件头部自动导入 `src/styles/variables.less` 及 `src/styles/mixins.less` 这两个文件，所以你可以直接使用其中的变量或 Mixins 而无需额外步骤。

## FAQ

### 此脚手架并不满足我的需求怎么办？

你可以提交 Feature Request 或者自行魔改，此脚手架基本是零封装的，这很方便你根据自己的需求进行自定义。

### Git hook 不生效怎么办？

如果你提交时看到 `The '.husky/pre-commit' hook was ignored because it's not set as executable.` 这个提示，请尝试 https://stackoverflow.com/a/66757359

## 许可证

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2020-present Yang Mingshan
