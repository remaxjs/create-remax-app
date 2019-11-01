import * as ora from 'ora';
import chalk from 'chalk';
import clone from './clone';
import { checkCurrentRepoVersion, checkCurrentTemplateVersion } from './check-version'
import render, { ArgvType, pathAndRepoUrlGenerator } from './render';

export { ArgvType }
export default async (argv: ArgvType, macros: MacrosType) => {
  await checkCurrentRepoVersion(macros.scriptName)
  const generatorValues = pathAndRepoUrlGenerator(argv, macros);
  const {
    tmpPath,
    templateRepo,
  } = generatorValues
  const isClone = await checkCurrentTemplateVersion(macros, argv.t, tmpPath)
  if (isClone) {
    const spinnerDownload = generatorOraStart(macros.download)
    clone(templateRepo, tmpPath).then(() => {
      spinnerDownload.stop();
      render(generatorValues, macros)
    });
  } else {
    render(generatorValues, macros)
  }
}

const generatorOraStart = (oraContent: string) => {
  const spinner = ora.default({ 
    text: chalk.yellow(oraContent),
    color: "yellow"
  }).start()
  return spinner
}
