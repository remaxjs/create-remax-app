# create-remax-app 模板使用说明

## 参数 `-t`

根据 -t 是否需要生成 TypeScript 项目

如 t 为 `true`，则取 ts 目录下内容；否则，则获取 js 目录下的内容

## 参数 `-p`

根据平台生成文件，共有如下平台：

* one
* wechat
* ali
* toutiao

### one 跨平台

需生成所有模板中的文件

### wechat 微信

移除以下文件

* ~~mini.project.json~~

### ali 阿里

移除以下文件

* ~~project.config.json~~

### toutiao 头条

移除以下文件

* ~~mini.project.json~~
* ~~project.config.json~~
