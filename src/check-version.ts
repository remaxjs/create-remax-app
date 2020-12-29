import { execSync } from 'child_process'
import semver from 'semver';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';

export function getLocalVersion(): string {
  const packagePath = require.resolve('../package.json');
  return require(packagePath).version
}

const TIMEOUT = 3000 // 3s
export function getLastVersion(repoName: string) {
  return execSync(`npm view ${repoName} dist-tags.latest`, { timeout: TIMEOUT })
    .toString()
    .trim()
}

export const generatorSymbol = (count: number, symbol = '*') => {
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

export function checkCurrentRepoVersion(repoName: string) {
  const latestVersion = getLastVersion(repoName);
  const localVersion = getLocalVersion();

  if (!semver.lt(localVersion, latestVersion)) {
    return
  }

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
