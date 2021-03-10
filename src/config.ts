import path from 'path'
import { Choice } from 'prompts'

export const description = 'Remax Project'
export const descriptionTS = 'Remax Project With TypeScript'
export const templatesPath = path.join(__dirname, '..', 'templates')
export const templateDir = 'template'
export const choices: Choice[] = [
  { value: 'one', title: '跨平台小程序' },
  { value: 'wechat', title: '微信小程序' },
  { value: 'ali', title: '阿里（支付宝）小程序' },
  { value: 'toutiao', title: '头条小程序' },
]
