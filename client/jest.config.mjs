/** @type {import('jest').Config} */
const config = {
  testEnvironment: "jsdom",
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  testPathIgnorePatterns: ["/node_modules/", "/.next/", "__tests__/__mocks__/"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^@/(.*)$": "<rootDir>/$1",
    "^next-intl$": "<rootDir>/__tests__/__mocks__/next/next-intl.js",
  },
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": [
      "babel-jest",
      { configFile: "./.babel-jest.config.js" }
    ],
  },
  transformIgnorePatterns: [
    "/node_modules/(?!next-intl|@formatjs|react-intl|intl-messageformat)/",
  ],
};

export default config;
