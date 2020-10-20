const macros = {
  scriptName: 'create-remax-app',
  placeholder: 'project-directory',
  download: 'downloading template...',
  remaxRepo: 'remaxjs/remax',
  templateRepo: 'QC-L/remax-template',
  templateTSRepo: 'QC-L/remax-template-typescript',
  description: 'Remax Project',
  descriptionTS: 'Remax Project With TypeScript',
  tmpPathName: 'temp',
  templatePathName: 'template',
  defaultPlatform: 'one',
  choices: [
    { value: 'one', name: '跨平台小程序' },
    { value: 'wechat', name: '微信小程序' },
    { value: 'ali', name: '阿里（支付宝）小程序' },
    { value: 'toutiao', name: '头条小程序' },
    { value: 'baidu', name: '百度小程序' }
  ]
}

export default macros;
