declare module 'degit';
declare module 'metalsmith';
declare module 'metalsmith-markdown';
declare module 'consolidate';

interface ObjectValueType {
  [key: string]: string | boolean | { [key: string]: any }
}