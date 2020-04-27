import * as ora from 'ora';
import chalk from 'chalk';
import clone from './clone';
import { checkCurrentRepoVersion, checkCurrentTemplateVersion } from './check-version'
import render, { ArgvType, pathAndRepoUrlGenerator } from './render';

export { ArgvType }
export default async (argv: ArgvType, macros: MacrosType) => {
  try {
    await checkCurrentRepoVersion(macros.scriptName)
  } catch(e) {}
  const generatorValues = pathAndRepoUrlGenerator(argv, macros);
  // TODO
  render(generatorValues, macros)
}

const generatorOraStart = (oraContent: string) => {
  const spinner = ora.default({ 
    text: chalk.yellow(oraContent),
    color: "yellow"
  }).start()
  return spinner
}
