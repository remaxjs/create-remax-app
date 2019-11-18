import ask from '../create/ask';
import inquirer, { PromptModule } from 'inquirer';

jest.mock('inquirer');

describe('Ask', () => {
  it('ask should return correct answer', async (done) => {
    const data: ObjectValueType = {
      name: 'my-app',
      description: 'Remax Project',
      remaxVersion: '^1.4.5'
    };
    const mock = { name: 'my-app', author: 'QC-L',  description: 'first remax project', platform: 'wechat' }
    inquirer.prompt = jest.fn().mockResolvedValue(mock) as any;
    await ask({
      name: { default: 'my-app', type: 'string' },
      author: { default: 'QC-L <github@liqichang.com>', type: 'string' },
      description: { default: '第一个 remax 项目', type: 'string' },
      platform: {
        default: 'wechat',
        type: 'list',
        choices: [
          'wechat',
          'alipay',
          'toutiao'
        ]
      }
    }, data, () => {
      expect(data.name).toBe('my-app')
      expect(data.author).toBe('QC-L')
      expect(data.description).toBe('first remax project')
      expect(data.platform).toBe('wechat')
      done()
    });
  })
})