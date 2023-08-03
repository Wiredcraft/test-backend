module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Se o seu código TypeScript estiver em um diretório "src", caso contrário, ajuste o caminho.
  },
  transformIgnorePatterns: ['/node_modules/(?!(prisma|@prisma)/)'],
};

