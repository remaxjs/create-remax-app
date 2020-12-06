import fs from 'fs';
import Metalsmith from 'metalsmith';
import chalk from 'chalk';
import ejs from 'ejs';
import async from 'async';
import path from 'path';
import { Arguments } from 'yargs';
import prompts, {PromptObject} from 'prompts'
import user from './git-user';
import {MacrosType} from '../utils/macros'

export interface GeneratorValues {
  [key: string]: string
}

export interface ArgvType extends Arguments {
  t: boolean,
  projectDirectory: string,
}

let currentPlatformName = ''
let currentPlatform = ''

export default async (info: GeneratorValues, macros: MacrosType) => {
  if (fs.existsSync(info.destPath)) {
    console.log(chalk.red('此项目已存在，请变更名字后重试'))
    return
  }

  const { destPath, templatePath, description, projectDirectory } = info
  Metalsmith(process.cwd())
    .metadata({
      name: projectDirectory,
      description,
    })
    .source(templatePath)
    .destination(destPath)
    .clean(false)
    .use(ask([
      {
        name: 'name',
        message: 'name',
        initial: projectDirectory,
        type: 'text',
      },
      {
        name: 'author',
        message: 'author',
        initial: user(),
        type: 'text',
      },
      {
        name: 'description',
        message: 'description',
        initial: description,
        type: 'text'
      },
      {
        name: 'platform',
        message: 'platform',
        type: 'select',
        choices: macros.choices,
      },
    ]))
    .use(filterPlatform(macros))
    .use(renderTemplateFiles())
    .use(removeFile())
    .use(generatorOutputInfo(macros))
    .build((err: Error) => {
      if (!err) {
        const cd = chalk.cyan(` cd ${projectDirectory} && npm i`)
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
        const oneCommandInfo = `\t\n你可以进入 ${chalk.cyanBright(projectDirectory)} 执行以下命令: \t\n\t\n${cd}\t\n\t\n  进入项目目录并安装依赖\t\n\t\n${newCommandArray.join('\t\n\t\n')}`
        const otherCommandInfo = `\t\n你可以进入 ${chalk.cyanBright(projectDirectory)} 执行以下命令: \t\n\t\n${cd}\t\n\t\n  进入项目目录并安装依赖\t\n\t\n${newOtherCommandArray.join('\t\n\t\n')}`
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
        currentPlatformName = item.title
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
    metalsmith._metadata.platformTitle = platform[0].toUpperCase() + platform.slice(1).toLowerCase()
    macros.choices.forEach((item: any) => {
      metalsmith._metadata[item.value] = item.value === platform ? true : false
    })
    done()
  }
}

const removeFile = () => {
  const filesToRemove: Record<string, string[]> = {
    'mini.project.json': ['wechat', 'toutiao'],
    'project.project.json': ['ali', 'toutiao'],
  }

  return (files: Record<string, any>, metalsmith: any, done: () => void): void => {
    const { platform } = metalsmith._metadata;
    for (const file of Object.keys(files)) {
      if (filesToRemove[file]?.includes(platform)) {
        delete files[file]
      }
    }
    done()
  }
}

const ask = (list: PromptObject[]) => {
  return async (_: any, metalsmith: any, done: any) => {
    const data = await prompts(list)
    Object.keys(data).forEach(k => {
      metalsmith.metadata()[k] = data[k]
    })
    done()
  }
}

const renderTemplateFiles = () => {
  return (files: any, metalsmith: any, done: () => void) => {
    const keys = Object.keys(files)
    const metalsmithMetadata = metalsmith.metadata()
    async.each(keys, (file, next) => {
      const str = files[file].contents.toString()

      try {
        const res = ejs.render(str, metalsmithMetadata)
        files[file].contents = Buffer.from(res, 'utf-8')
      } catch (err) {
        console.log({str, err})
        err.message = `[${file}] ${err.message}`
        return next(err)
      }

      next()
    }, done)
  }
}


export const pathAndRepoUrlGenerator = (argv: ArgvType, macros: MacrosType) => {
  const { projectDirectory, t } = argv;
  const destPath = path.join(process.cwd(), projectDirectory)
  let tmpPath = path.join(__dirname, '../..', macros.tmpPathName)
  let description = macros.description
  if (t) {
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
    description,
    projectDirectory
  }
}
