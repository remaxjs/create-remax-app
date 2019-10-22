import ora from 'ora';
import degit from 'degit';
import path from 'path';
import Metalsmith from 'metalsmith';
import chalk from 'chalk';
import consolidate from 'consolidate';
import async from 'async';

import { checkRepoVersion } from './check-version';
import { MacrosType } from '../utils/macros';
import { Arguments } from 'yargs';
import user from './git-user';
import ask, { CustomQuestionObjectType } from './ask';

interface GeneratorValues {
  [key: string]: string
}

export interface ArgvType extends Arguments {
  t: boolean,
  projectDirectory: string,
}

export default async (argv: ArgvType, macros: MacrosType) => {
  const spinner = ora(macros.download).start();
  const {
    templatePath,
    tmpPath,
    destPath,
    templateRepo,
    description,
    projectDirectory
  } = pathAndRepoUrlGenerator(argv, macros)
  // 初始化下载
  const emitter = degit(templateRepo, {
    cache: false,
    force: true,
    verbose: true,
  });
  // 获取 remax 版本
  const remaxTagName = await checkRepoVersion(macros.remaxRepo);
  // 下载并进行数据处理
  emitter.clone(tmpPath).then(() => {
    spinner.stop();
    Metalsmith(process.cwd())
      .metadata({
        name: projectDirectory,
        description: description,
        remaxVersion: `^${remaxTagName.replace(/^./, '')}`,
      })
      .source(templatePath)
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

const pathAndRepoUrlGenerator = (argv: ArgvType, macros: MacrosType): GeneratorValues => {
  const { projectDirectory, t } = argv;
  const destPath = path.join(process.cwd(), projectDirectory)
  let tmpPath = path.join(__dirname, '../..', macros.tmpPathName)
  let templateRepo = macros.templateRepo
  let description = macros.description
  // 判断是否是 ts
  if (t) {
    templateRepo = macros.templateTSRepo
    description = macros.descriptionTS
    tmpPath = path.join(tmpPath, 'ts')
  } else {
    tmpPath = path.join(tmpPath, 'js')
  }
  const templatePath = path.join(tmpPath, macros.templatePathName)
  return {
    templatePath,
    tmpPath,
    destPath,
    templateRepo,
    description,
    projectDirectory
  }
}

const filterPlatform = () => {
  return (_: any, metalsmith: any, done: () => void): void => {
    const { platform } = metalsmith._metadata;
    metalsmith._metadata.platformTitle = firstUpperCase(platform)
    done()
  }
}

const firstUpperCase = (str: string) => {
  return str.toLowerCase().replace(/^./, (s: string): string => {
    return s.toUpperCase()
  })
}

const askQuestions = (prompts: CustomQuestionObjectType) => {
  return (_: any, metalsmith: any, done: () => void): void => {
    ask(prompts, metalsmith.metadata(), done)
  }
}

const renderTemplateFiles = () => {
  return (files: any, metalsmith: any, done: () => void): void => {
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
