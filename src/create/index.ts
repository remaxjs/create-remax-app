import ora from 'ora';
import clone from './clone';
import { checkCurrentRepoVersion } from './check-version'
import render, { ArgvType, pathAndRepoUrlGenerator } from './render';

export { ArgvType }
export default async (argv: ArgvType, macros: MacrosType) => {
  await checkCurrentRepoVersion(macros.scriptName)
  const spinner = ora(macros.download).start();
  const generatorValues = pathAndRepoUrlGenerator(argv, macros);
  const {
    tmpPath,
    templateRepo,
  } = generatorValues
  clone(templateRepo, tmpPath).then(() => {
    spinner.stop();
    render(generatorValues, macros)
  });
}
