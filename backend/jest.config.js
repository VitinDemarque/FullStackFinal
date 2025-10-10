const { createDefaultPreset } = require("ts-jest");
//Esta é uma funcao utilitaria do ts-jest, fazendo com que ele entenda TypeScript

const tsJestTransformCfg = createDefaultPreset().transform;
// Faz a transformação do codigo em TypeScrip para JavaScript permitindo a execução

/** @type {import("jest").Config} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",

  roots: ["<rootDir>/tests"],
  // Onde o Jest vai procurar os testes

  moduleFileExtensions: ["ts", "js", "json"],
  // Extensões que o Jest deve entender

  // Transforma arquivos TypeScript
  transform: {
    ...tsJestTransformCfg,
  },

  // Facilita imports absolutos (ex: "@/services/userService")
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  // Ignora pastas desnecessárias nos testes
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],

  // Gera relatório de cobertura
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts"],
  coverageDirectory: "coverage",
};