import { getLocalVersion, generatorSymbol } from '../check-version';

const { version } = require('../../package.json')

describe('Check Version', () => {
  it(`local version should be ${version}`, () => {
    const localVersion = getLocalVersion();
    const local = version;
    expect(localVersion).toBe(local);
  });

  const targetSymbol = '===='
  it(`symbol should be ${targetSymbol}`, () => {
    const symbol = generatorSymbol(4, '=');
    expect(symbol).toBe(targetSymbol)
  });
})
