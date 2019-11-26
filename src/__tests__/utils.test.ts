import { firstUpperCase } from '../utils/utils';

describe('utils working', () => {
  it('firstUpperCase', () => {
    const upper = firstUpperCase('app')
    expect(upper).toBe('App')
  })
})
