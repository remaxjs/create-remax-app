import axios from 'axios';
import semver from 'semver';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';

export interface VersionValueType extends ObjectValueType {
  localVersion: string;
  latestVersion: string;
  repoName: string;
}

const getResult = (url: string) => {
  return axios.get(url).then(data => {
    return data.data
  }).catch(e => {})
}

const checkRepoVersion = async (repoName: string) => {
  const { tag_name } = await getResult(`https://api.github.com/repos/${repoName}/releases/latest`)
  return tag_name
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

const getLocalVersion = (): string => {
  const packagePath = require.resolve('../../package.json');
  const packageConfig = require(packagePath)
  const localVersion = packageConfig.version
  return localVersion
}

const getLastVersion = async (repoName: string) => {
  // TODO：
  // 1. npm info 替换网络请求
  // 2. 添加版本缓存，24 小时
  let latestVersion = ''
  try {
    // 添加异常处理，如未联网，直接 return
    const res = await getResult(`https://registry.npmjs.org/${repoName}`);
    latestVersion = res['dist-tags'].latest;
  } catch(e) {}
  return latestVersion
}

const generatorSymbol = (count: number, symbol = '*') => {
  let starSymbol = '';
  for (let i = 0; i < count; i++) {
    starSymbol += symbol;
  }
  return starSymbol;
};

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

const generatorPrompt = ({ latestVersion, localVersion, repoName }: VersionValueType) => {
  const placeholder = `*${generatorSymbol(53, ' ')}*`
  const origin = `*${generatorSymbol(63, ' ')}*`
  const latest = 'latest:    ' + chalk.green(latestVersion)
  const installed = 'installed: ' + chalk.red(localVersion)
  const longLength = latest.length > installed.length ? latest.length : installed.length

  console.log(generatorSymbol(55))
  console.log(placeholder)
  console.log('*', chalk.yellow(` A newer version of ${repoName} is available. `), '*')
  console.log(placeholder)
  console.log(generatorPlace(origin, latest, longLength))
  console.log(generatorPlace(origin, installed, longLength))
  console.log(placeholder)
  console.log(generatorSymbol(55))
}

const checkCurrentRepoVersion = async (repoName: string) => {
  try {
    const latestVersion = await getLastVersion(repoName);
    if (!latestVersion) return
    const localVersion = getLocalVersion();
    if (semver.lt(localVersion, latestVersion)) {
      generatorPrompt({
        localVersion,
        latestVersion,
        repoName
      });
      return true
    } else {
      return false
    }
  } catch (err) {
    // console.log(err)
  }
}

export {
  getResult,
  getLocalVersion,
  getLastVersion,
  generatorSymbol,
  generatorPrompt,
  checkRepoVersion,
  checkCurrentRepoVersion,
  checkCurrentTemplateVersion
}
