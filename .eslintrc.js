module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "jest"],
  extends: [
    "eslint:recommended",
    "prettier/@typescript-eslint",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jest/recommended",
  ],
  settings: {
    react: {
      version: "17.0",
    },
  },
  rules: {
    quotes: ["error", "double"],
  },
};
