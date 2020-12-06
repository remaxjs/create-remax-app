declare module 'metalsmith';
declare module 'semver';

declare module "*.json" {
  const value: any;
  export default value;
}
