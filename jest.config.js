module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src/tests"],
  testMatch: ["**/*.test.ts"],
  moduleNameMapper: {
    "^@/config/db$": "<rootDir>/src/tests/__mocks__/db.ts",
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@/tests/(.*)$": "<rootDir>/src/tests/$1",
  },
};
