import { getLocalVersion, generatorSymbol, checkCurrentRepoVersion } from '../create/check-version';
import pkgConfig from '../../package.json'

describe('Check Version', () => {
  it(`local version should be ${pkgConfig.version}`, () => {
    const localVersion = getLocalVersion();
    const local = pkgConfig.version;
    expect(localVersion).toBe(local);
  });

  const targetSymbol = '===='
  it(`symbol should be ${targetSymbol}`, () => {
    const symbol = generatorSymbol(4, '=');
    expect(symbol).toBe(targetSymbol)
  });

  it('check current repo version error', async () => {
    const isSame = await checkCurrentRepoVersion('create-remax-app')
    expect(isSame).toBeDefined()
  })
})