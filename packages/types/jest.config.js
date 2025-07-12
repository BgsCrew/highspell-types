/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};

module.exports = config;
