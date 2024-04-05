/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  parser: 'vue-eslint-parser',
  plugins: ['@typescript-eslint'],
  root: true,
  extends: [
    'plugin:@typescript-eslint/recommended',
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-prettier",
    "plugin:cypress/recommended"
  ],
  parserOptions: {
    ecmaVersion: "latest",
      "parser": "@typescript-eslint/parser"
  },
  rules: {
    // Add specific rules if needed
  },
};