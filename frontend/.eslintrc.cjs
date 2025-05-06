/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript/recommended',
    'eslint-config-prettier' // Make sure this is last to override other configs
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    // Add specific project rules here if needed
    // e.g., 'vue/multi-word-component-names': 'off',
  }
} 