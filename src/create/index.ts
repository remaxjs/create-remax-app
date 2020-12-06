import { checkCurrentRepoVersion } from './check-version'
import render, { ArgvType, pathAndRepoUrlGenerator } from './render';
import { MacrosType } from '../utils/macros'

export { ArgvType }
export default async (argv: ArgvType, macros: MacrosType) => {
  // 如果有 -c 则忽略版本检查
  if (!argv.c) {
    try {
      checkCurrentRepoVersion(macros.scriptName)
    } catch {}
  }

  render(pathAndRepoUrlGenerator(argv, macros), macros)
}
