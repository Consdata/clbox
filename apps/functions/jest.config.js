module.exports = {
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/apps/functions',
  globals: { 'ts-jest': { tsConfig: '<rootDir>/tsconfig.spec.json' } },
  displayName: 'functions',
};
