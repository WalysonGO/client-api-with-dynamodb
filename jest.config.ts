export default {
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testMatch: ["**/unit/*.test.ts"],
  setupFilesAfterEnv: ['./setupDynamoDB.js'],
};
