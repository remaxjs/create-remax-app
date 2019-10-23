import Metalsmith from 'metalsmith';
import chalk from 'chalk';
import consolidate from 'consolidate';
import async from 'async';
import path from 'path';
import { Arguments } from 'yargs';

import { checkRepoVersion } from './check-version';
import user from './git-user';
import { firstUpperCase } from  '../utils/utils';
import ask, { CustomQuestionObjectType } from './ask';


export interface GeneratorValues {
  [key: string]: string
}

export interface ArgvType extends Arguments {
  t: boolean,
  projectDirectory: string,
}

export default async (renderObj: GeneratorValues, macros: MacrosType) => {
  const remaxTagName = await checkRepoVersion(macros.remaxRepo);
  const {
    templatePath,
    destPath,
    description,
    projectDirectory
  } = renderObj
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
  .build((err: Error) => {
    if (!err) {
      console.log(chalk.green('create project success!'))
    }
  })
}

const filterPlatform = () => {
  return (_: any, metalsmith: any, done: () => void): void => {
    const { platform } = metalsmith._metadata;
    metalsmith._metadata.platformTitle = firstUpperCase(platform)
    done()
  }
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


export const pathAndRepoUrlGenerator = (argv: ArgvType, macros: MacrosType): GeneratorValues => {
  const { projectDirectory, t } = argv;
  const destPath = path.join(process.cwd(), projectDirectory)
  let tmpPath = path.join(__dirname, '../..', macros.tmpPathName)
  let templateRepo = macros.templateRepo
  let description = macros.description
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
