module.exports = {
  // The test environment that will be used for testing
  testEnvironment: 'jsdom',
  
  // The glob patterns Jest uses to detect test files
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  
  // An array of directory names to be searched recursively up from the requiring module's location
  moduleDirectories: ['node_modules', 'src'],
  
  // An array of file extensions your modules use
  moduleFileExtensions: ['js', 'json', 'jsx', 'node'],
  
  // Setup files to run before each test
  
  // Mocks CSS files to return an empty object
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  
  // Collect coverage information from specified folders
  collectCoverageFrom: ['src/**/*.js'],
  
  // Output coverage information
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  globals: {
    TextEncoder: require('util').TextEncoder,
  },
  "setupFilesAfterEnv": ["./src/setupTests.js"]
};
