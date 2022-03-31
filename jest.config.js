/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: [
        "**/__tests__/**/*.test.ts",
        "**/?(*.)+(spec|test).+.test.ts"
    ],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
};
