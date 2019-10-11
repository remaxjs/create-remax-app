import cli from 'yargs';
import chalk from 'chalk';
import create from './create';

export function run(args: any) {
  cli
    .scriptName('create-remax-app')
    .usage<any>(
      '$0 <project-name> [options]', 
      "创建 remax 项目", 
      (yargs) => {
        yargs.positional('project-name', {
          describe: '项目名',
          type: 'string'
        })
      }, 
      (argv) => {
        create(argv)
      }
    )
    .showHelpOnFail(true)
    .parse(args);
}
