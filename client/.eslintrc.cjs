/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  env: {
    node: true,
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    'vue/require-v-for-key': 'off',
    'vue/multi-word-component-names': 'off'
  },
}
