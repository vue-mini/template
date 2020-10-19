# <%= context.outDirName %>

## 依赖安装

```bash
<% if (context.npmClient === 'yarn') { %>yarn install<% } else { %>npm install<% } %>
```

## 本地开发

```bash
<% if (context.npmClient === 'yarn') { %>yarn start<% } else { %>npm run start<% } %>
```

## 代码检查

```bash
<% if (context.npmClient === 'yarn') { %>yarn lint:script<% } else { %>npm run lint:script<% } %>
<% if (context.npmClient === 'yarn') { %>yarn lint:style<% } else { %>npm run lint:style<% } %>
```

## 代码检查及修复

```bash
<% if (context.npmClient === 'yarn') { %>yarn lint:script --fix<% } else { %>npm run lint:script -- --fix<% } %>
<% if (context.npmClient === 'yarn') { %>yarn lint:style --fix<% } else { %>npm run lint:style -- --fix<% } %>
```

## 类型检查

```bash
<% if (context.npmClient === 'yarn') { %>yarn type<% } else { %>npm run type<% } %>
```

## 测试

```bash
<% if (context.npmClient === 'yarn') { %>yarn test<% } else { %>npm run test<% } %>
```

## 生产构建

```bash
<% if (context.npmClient === 'yarn') { %>yarn build<% } else { %>npm run build<% } %>
```
