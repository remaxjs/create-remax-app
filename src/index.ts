import cli from 'yargs';
import chalk from 'chalk';
import { checkCurrentRepoVersion } from './check-version'
import render, { ArgvType } from './render';

const scriptName = require('../package.json').name
const placeholder = 'project-directory'

export function run(args: string[]) {
  cli
    .scriptName(scriptName)
    .usage<any>(
      `$0 <${placeholder}> [options]`,
      "创建 remax 项目",
      (yargs) => {
        return yargs.positional(placeholder, {
          describe: '项目目录',
          type: 'string'
        })
      },
      create,
    )
    .option('h', { alias: 'help' })
    .option('v', { alias: 'version' })
    .option('t', {
      alias: 'typescript',
      default: false,
      describe: 'create remax typescript app',
      type: 'boolean'
    })
    .option('c', {
      alias: 'check',
      default: true,
      describe: 'ignore version check',
      type: 'boolean'
    })
    .fail((msg: string, err: Error) => {
      if (err) throw err
      console.error('Please specify the project directory:')
      console.error('  ', chalk.blue(scriptName), chalk.green(`<${placeholder}>`))
      console.error('\t')
      console.error('For example:')
      console.error('  ', chalk.blue(scriptName), chalk.green('first-remax-app'))
      console.error('\t')
      console.error('Run', chalk.blue(`${scriptName} --help`), 'to see all options.')
      process.exit(1)
    })
    .parse(args);
}

function create(argv: ArgvType) {
  if (argv.check) {
    try {
      checkCurrentRepoVersion(scriptName)
    } catch {}
  }

  render(argv)
}
