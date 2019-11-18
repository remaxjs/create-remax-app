module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/tmp/'],
  testRegex: '.*\\.test\\.tsx?$',
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
};
