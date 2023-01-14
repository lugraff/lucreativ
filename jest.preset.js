const nxPreset = require('@nrwl/jest/preset').default;
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig.base.json');

module.exports = {
  ...nxPreset,
  testEnvironment: 'jsdom',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: process.cwd(),
  }),
};
