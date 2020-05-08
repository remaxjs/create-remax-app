import Metalsmith from 'metalsmith';
import chalk from 'chalk';
import consolidate from 'consolidate';
import async from 'async';
import path from 'path';
import { Arguments } from 'yargs';
import fs from 'fs-extra';

import { checkRepoVersion, generatorPrompt } from './check-version';
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
let currentPlatformName = ''
let currentPlatform = ''
export default async (renderObj: GeneratorValues, macros: MacrosType) => {
  const {
    templatePath,
    destPath,
    description,
    projectDirectory
  } = renderObj
  // const isExt fs.ensureDirSync(destPath)
  let newProjectDirectory = projectDirectory
  let newDestPath = destPath
  const isExists = fs.pathExistsSync(destPath)
  if (isExists) {
    console.log(chalk.red('此项目已存在，请变更名字后重试'))
    return
  }
  Metalsmith(process.cwd())
  .metadata({
    name: newProjectDirectory,
    description: description,
  })
  .source(templatePath)
  .destination(newDestPath)
  .clean(false)
  .use(askQuestions({
    name: { default: newProjectDirectory, type: 'string' },
    author: { default: user(), type: 'string' },
    description: { default: description, type: 'string' },
    platform: {
      default: macros.defaultPlatform,
      type: 'list',
      choices: macros.choices
    }
  }))
  .use(filterPlatform(macros))
  .use(renderTemplateFiles())
  .use(removeFile())
  .use(generatorOutputInfo(macros))
  .build((err: Error) => {
    if (!err) {
      const cd = chalk.cyan(` cd ${newProjectDirectory} && npm i`)
      const platformList = chalk.yellow('ali, wechat, toutiao, web')
      const oneCommandArray = [
        { command: chalk.cyan('npm run dev <platform>'), description: `根据传入平台进行调试，支持参数为: ${platformList}` },
        { command: chalk.cyan('npm run dev ali'), description: '调试阿里小程序' },
        { command: chalk.cyan('npm run build <platform>'), description: `根据传入平台构建小程序，支持参数为: ${platformList}` },
        { command: chalk.cyan('npm run build ali'), description: '构建阿里小程序' },
      ]
      const otherCommandArray = [
        { command: chalk.cyan('npm run dev'), description: `调试${currentPlatformName}` },
        { command: chalk.cyan('npm run build'), description: `构建${currentPlatformName}` }
      ]
      const newCommandArray = oneCommandArray.map(item => {
        return ` ${item.command} \t\n\t\n  ${item.description}`
      })
      const newOtherCommandArray = otherCommandArray.map(item => {
        return ` ${item.command} \t\n\t\n  ${item.description}`
      })
      const oneCommandInfo = `\t\n你可以进入 ${chalk.cyanBright(newProjectDirectory)} 执行以下命令: \t\n\t\n${cd}\t\n\t\n  进入项目目录并安装依赖\t\n\t\n${newCommandArray.join('\t\n\t\n')}`
      const otherCommandInfo = `\t\n你可以进入 ${chalk.cyanBright(newProjectDirectory)} 执行以下命令: \t\n\t\n${cd}\t\n\t\n  进入项目目录并安装依赖\t\n\t\n${newOtherCommandArray.join('\t\n\t\n')}`
      const currentCommandInfo = currentPlatform === 'one' ? oneCommandInfo : otherCommandInfo
      console.log('\t')
      console.log(`创建 ${chalk.cyan(currentPlatformName)} 成功！`)
      console.log(currentCommandInfo)
      console.log('\t\n欲了解更多请查阅官方文档：https://remaxjs.org')
    }
  })
}

const generatorOutputInfo = (macros: MacrosType) => {
  return (_: any, metalsmith: any, done: () => void): void => {
    const { platform } = metalsmith._metadata;
    macros.choices.some((item: any) => {
      if (item.value === platform) {
        currentPlatformName = item.name
        currentPlatform = item.value
        return
      }
    })
    done()
  }
}

const filterPlatform = (macros: MacrosType) => {
  return (_: any, metalsmith: any, done: () => void): void => {
    const { platform } = metalsmith._metadata;
    metalsmith._metadata.platformTitle = firstUpperCase(platform)
    macros.choices.forEach((item: any) => {
      metalsmith._metadata[item.value] = item.value === platform ? true : false
    })
    done()
  }
}

const removeFile = () => {
  return (files: any, metalsmith: any, done: () => void): void => {
    const { platform } = metalsmith._metadata;
    if (platform === 'wechat') {
      Object.keys(files).forEach(function (file) {
        if (file === 'mini.project.json') {
          delete files[file]
        }
      })
    } else if (platform === 'toutiao') {
      Object.keys(files).forEach(function (file) {
        if (file === 'mini.project.json' || file === 'project.config.json') {
          delete files[file]
        }
      })
    } else if (platform === 'ali') {
      Object.keys(files).forEach(function (file) {
        if (file === 'project.config.json') {
          delete files[file]
        }
      })
    }
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
