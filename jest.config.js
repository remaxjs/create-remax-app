module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/temp/', '/node_modules/'],
  testRegex: '.*\\.test\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'node'],
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
};
