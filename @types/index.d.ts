declare module 'degit';
declare module 'metalsmith';
declare module 'metalsmith-markdown';
declare module 'consolidate';
declare module 'semver';

declare module "*.json" {
  const value: any;
  export default value;
}

interface ObjectValueType {
  [key: string]: string | boolean | { [key: string]: any }
}

interface MacrosType {
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
  defaultPlatform: string,
  choices: string[]
}
