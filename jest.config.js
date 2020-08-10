module.exports = {
  moduleFileExtensions: ["js", "json", "vue"],
  transform: {
    ".*\\.(vue)$": "vue-jest",
  },
  coverageDirectory: "tests/coverage",
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{js,vue}", "!src/main.js"],
};
