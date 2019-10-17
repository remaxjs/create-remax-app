import ora from 'ora';
import degit from 'degit';
import path from 'path';
import Metalsmith from 'metalsmith';
import chalk from 'chalk';
import consolidate from 'consolidate';
import async from 'async';
import axios from 'axios';

import user from './git-user'
import ask from './ask';

export default async (argv: any = {}) => {
  const spinner = ora('downloading template...').start();
  const remaxUrl = `https://api.github.com/repos/remaxjs/remax/releases/latest`
  const { projectDirectory } = argv;
  const destPath = path.join(process.cwd(), projectDirectory)
  let tmp = path.join(__dirname, '../..', 'tmp')
  let templateRepo = 'QC-L/remax-template'
  let typescript = ''
  let description = 'Remax Project'
  // 判断是否是 ts
  if (argv.t) {
    templateRepo = 'QC-L/remax-template-typescript'
    typescript = 'TypeScript'
    description = `${description} With ${typescript}`
    tmp = path.join(tmp, 'ts')
  } else {
    tmp = path.join(tmp, 'js')
  }
  const template = path.join(tmp, 'template')
  // 初始化下载
  const emitter = degit(templateRepo, {
    cache: false,
    force: true,
    verbose: true,
  });
  // 获取 remax 版本
  let json = await axios.get(remaxUrl);
  let { tag_name } = json && json.data;
  // 下载并进行数据处理
  emitter.clone(tmp).then(() => {
    spinner.stop();
    Metalsmith(process.cwd())
      .metadata({
        name: projectDirectory,
        description: description,
        remaxVersion: `^${tag_name.replace(/^./, '')}`,
      })
      .source(template)
      .destination(destPath)
      .clean(false)
      .use(askQuestions({
        name: { default: projectDirectory, type: 'string' },
        author: { default: user(), type: 'string' },
        description: { default: description, type: 'string' },
        platform: {
          default: 'wechat',
          type: 'list',
          choices: [
            'wechat',
            'alipay',
            'toutiao'
          ]
        }
      }))
      .use(filterPlatform())
      .use(renderTemplateFiles())
      .build(function (err: Error) {
        if (!err) {
          console.log(chalk.green('create project success!'))
        }
      })
  });
}

const filterPlatform = () => {
  return (files: any, metalsmith: any, done: any) => {
    const { platform } = metalsmith._metadata;
    metalsmith._metadata.platformTitle = firstUpperCase(platform)
    done()
  }
}

const firstUpperCase = (str: string) => {
  return str.toLowerCase().replace(/^./, (s: string) => {
    return s.toUpperCase()
  })
}

const askQuestions = (prompts: any) => {
  return (files: any, metalsmith: any, done: any) => {
    ask(prompts, metalsmith.metadata(), done)
  }
}

const renderTemplateFiles = () => {
  return (files: any, metalsmith: any, done: any) => {
    const keys = Object.keys(files)
    const metalsmithMetadata = metalsmith.metadata()
    async.each(keys, (file, next) => {
      const str = files[file].contents.toString()
      if (!/{{([^{}]+)}}/g.test(str)) {
        return next()
      }
      consolidate.handlebars.render(str, metalsmithMetadata, (err: Error, res: string) => {
        if (err) {
          err.message = `[${file}] ${err.message}`
          return next(err)
        }
        files[file].contents = Buffer.from(res, 'utf-8')
        next()
      })
    }, done)
  }
}
