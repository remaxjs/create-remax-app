import ora from 'ora';
import clone from './clone';
import render, { ArgvType, pathAndRepoUrlGenerator } from './render';

export default (argv: ArgvType, macros: MacrosType) => {
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
