import cli from 'yargs';
import chalk from 'chalk';
import create, { ArgvType } from './create';
import macros from './utils/macros';

export function run(args: string[]) {
  const { scriptName, placeholder } = macros;
  cli
    .scriptName(macros.scriptName)
    .usage<any>(
      `$0 <${macros.placeholder}> [options]`, 
      "创建 remax 项目", 
      (yargs) => {
        return yargs.positional(macros.placeholder, {
          describe: '项目目录',
          type: 'string'
        })
      }, 
      (argv: ArgvType) => {
        create(argv, macros)
      }
    )
    .option('h', {
      alias: 'help'
    })
    .option('v', {
      alias: 'version'
    })
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
