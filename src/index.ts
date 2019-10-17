import cli from 'yargs';
import chalk from 'chalk';
import create from './create';

export function run(args: any) {
  const scriptName = 'create-remax-app'
  const placeholder = 'project-directory'
  cli
    .scriptName(scriptName)
    .usage<any>(
      `$0 <${placeholder}> [options]`, 
      "创建 remax 项目", 
      (yargs) => {
        yargs.positional(placeholder, {
          describe: '项目目录',
          type: 'string'
        })
      }, 
      (argv) => {
        create(argv)
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
    .showHelpOnFail(true)
    .parse(args);
}
