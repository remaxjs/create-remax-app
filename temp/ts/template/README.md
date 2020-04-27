# Remax One TypeScript Template

使用 Remax 开发跨平台小程序的 TypeScript 模板。

通过该模板创建一个新项目：

```bash
$ npx degit remaxjs/template-one-typescript my-app
$ cd my-app
```

## 开始开发

安装依赖

```bash
$ npm install
```

开始构建

```bash
# 选定要开发的平台
$ npm run dev -- wechat
# 或者用 yarn
$ yarn dev wechat
```

使用小程序开发者工具打开项目下的 `dist/[target]` 目录。

## 发布

```bash
# 选定要开发的平台
$ npm run build -- wechat
# 或者用 yarn
$ yarn build wechat
```

使用小程序开发者工具上传版本。
