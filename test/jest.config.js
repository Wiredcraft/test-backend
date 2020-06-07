module.exports = {
  displayName: "integration",
  testMatch: ["<rootDir>/**/*.test.js"],
  runner: "jest-runner-newman",
  globalSetup: "./jest.setup.js",
  globalTeardown: "./jest.teardown.js",
};
