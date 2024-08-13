import fileTransformer from './fileTransformer.js';

module.exports = {
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.{js,jsx}'], // Include both JS and JSX files for coverage
    coveragePathIgnorePatterns: [
      '/node_modules/',
    ],
    coverageReporters: [
      'json',
      'lcov',
      'text',
      'clover',
    ],
    moduleFileExtensions: ['js', 'jsx', 'mp4', 'png', 'jpg'], // Add file extensions to Jest module resolution
    transform: {
      '\\.(js|jsx)$': 'babel-jest', // Add Babel transformation for JS and JSX files
      '\\.(mp4|png|jpg)$': fileTransformer,
    },
  };