const macros = {
  scriptName: 'create-remax-app',
  placeholder: 'project-directory',
  download: 'downloading template...',
  remaxRepo: 'remaxjs/remax',
  templateRepo: 'QC-L/remax-template',
  templateTSRepo: 'QC-L/remax-template-typescript',
  description: 'Remax Project',
  descriptionTS: 'Remax Project With TypeScript',
  tmpPathName: 'tmp',
  templatePathName: 'template',
  defaultPlatform: 'wechat'
}

export interface MacrosType {
  scriptName: string,
  placeholder: string,
  download: string,
  remaxRepo: string,
  templateRepo: string,
  templateTSRepo: string,
  description: string,
  descriptionTS: string,
  tmpPathName: string,
  templatePathName: string,
  defaultPlatform: string
}

export default macros;
