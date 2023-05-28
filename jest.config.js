const tsconfig = require("./tsconfig.json");
const moduleNameMapper = require("tsconfig-paths-jest")(tsconfig);

module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testEnvironment: "node",
  testRegex: "spec.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  preset: "ts-jest",
  moduleNameMapper,
};
