import { Choice } from 'prompts'

export interface MacrosType {
  scriptName: string,
  placeholder: string,
  description: string,
  descriptionTS: string,
  tmpPathName: string,
  templatePathName: string,
  choices: Choice[]
}

const macros = {
  scriptName: 'create-remax-app',
  placeholder: 'project-directory',
  description: 'Remax Project',
  descriptionTS: 'Remax Project With TypeScript',
  tmpPathName: 'temp',
  templatePathName: 'template',
  choices: [
    { value: 'one', title: '跨平台小程序' },
    { value: 'wechat', title: '微信小程序' },
    { value: 'ali', title: '阿里（支付宝）小程序' },
    { value: 'toutiao', title: '头条小程序' },
  ]
}

export default macros;
