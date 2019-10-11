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

export default async (argv: any) => {
  const spinner = ora('downloading template...').start();
  const emitter = degit('QC-L/remax-template', {
    cache: false,
    force: true,
    verbose: true,
  });

  let json = await axios.get('https://api.github.com/repos/remaxjs/remax/releases/latest');
  let { tag_name } = json.data;

  const destPath = path.join(process.cwd(), argv.projectName)
  const tmp = path.join(__dirname, '../..', 'tmp')
  const template = path.join(tmp, 'template')

  emitter.clone(tmp).then(() => {
    spinner.stop();
    Metalsmith(process.cwd())
      .metadata({
        name: argv.projectName,
        description: 'remax project',
        remaxVersion: `^${tag_name.replace(/^./, '')}`
      })
      .source(template)
      .destination(destPath)
      .clean(false)
      .use(askQuestions({
        name: { default: argv.projectName, type: 'string' },
        author: { default: user(), type: 'string' },
        description: { default: 'remax project', type: 'string' },
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
      .use(renderTemplateFiles())
      .build(function (err: Error) {
        if (!err) {
          console.log(chalk.green('create project success!'))
        }
      })
  });
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
