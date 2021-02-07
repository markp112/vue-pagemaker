module.exports = {
  roots: ["<rootDir>/tests"],

  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },

  // testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  },

  setupFiles: ["<rootDir>/src/setupTests.ts"],

  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel"
};
