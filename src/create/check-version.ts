import axios from 'axios';
import semver from 'semver';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';

import packageConfig from '../../package.json'

const checkRepoVersion = async (repoName: string) => {
  const { tag_name } = await getResult(`https://api.github.com/repos/${repoName}/releases/latest`)
  return tag_name
}

const getResult = (url: string) => {
  return axios.get(url).then(data => {
    return data.data
  })
}

const checkCurrentTemplateVersion = async (macros: MacrosType, isTypeScript: boolean, tmpPath: string) => {
  let repoName = isTypeScript ? macros.templateRepo : macros.templateTSRepo
  const pkgPath = path.join(tmpPath, 'package.json')
  
  if (fs.existsSync(pkgPath)) {
    const tmpPackageConfig = require(pkgPath)
    const latestVersion = await checkRepoVersion(repoName)
    return semver.lt(tmpPackageConfig.version, latestVersion)
  } else {
    return true
  }
}

const checkCurrentRepoVersion = async (repoName: string) => {
  try {
    const res = await getResult(`https://registry.npmjs.org/${repoName}`)
    const latestVersion = res['dist-tags'].latest
    const localVersion = packageConfig.version
    if (semver.lt(localVersion, latestVersion)) {
      const placeholder = '*                                                     *'
      const origin = '*                                                               *'
      const latest = 'latest:    ' + chalk.green(latestVersion)
      const installed = 'installed: ' + chalk.red(localVersion)
      const longLength = latest.length > installed.length ? latest.length : installed.length

      console.log('*******************************************************')
      console.log(placeholder)
      console.log('*', chalk.yellow(` A newer version of ${repoName} is available. `), '*')
      console.log(placeholder)
      console.log(generatorPlace(origin, latest, longLength))
      console.log(generatorPlace(origin, installed, longLength))
      console.log(placeholder)
      console.log('*******************************************************')
    }
  } catch (err) {
    // console.log(err)
  }

}

const generatorPlace = (origin: string, replace: string, longLength: number): string => {
  const index = Math.round(origin.length / 2) - Math.round(longLength / 2) - 1
  const length = replace.length
  let originArray = origin.split('')
  const replaceArray = replace.split('')
  for (let i = 0; i < length; i++) {
    originArray[i + index] = replaceArray[i]
  }

  return originArray.join('')
}

export { checkRepoVersion, checkCurrentRepoVersion, checkCurrentTemplateVersion }