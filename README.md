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
- Git 提交前代码增量检查及格式化：lint-staged
- 开发时图片静态服务：serve
- WXML 图片路径替换（生产构建带 Hash）：PostHTML
- Less 背景图片路径替换（生产构建带 Hash）：PostCSS
- 开发时监听文件修改并实时构建：chokidar

## 约定

## FAQ

## 许可证

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2020-present Yang Mingshan
