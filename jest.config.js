// const ts_preset = require('ts-jest/jest-preset')
// const puppeteer_preset = require('jest-puppeteer/jest-preset')
// module.exports = Object.assign(
//   ts_preset,
//   puppeteer_preset
// )

module.exports = {
  preset: 'jest-puppeteer',
  testMatch: ['./**.test.js'],
  verbose: false,
  notifyMode: 'always',
  maxWorkers: '50%',
  maxConcurrency: 1,
  // reporters: [
  //   'default',
  //   '<rootDir>/utils/custom-reporter.js'
  // ],
};
