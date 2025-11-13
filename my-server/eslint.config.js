// .eslintrc.ts
import { configApp } from '@adonisjs/eslint-config'

export default configApp({
  rules: {
    // 👇 turn off strict rules that cause red lines
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-explicit-any': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-undef': 'off',
    'no-console': 'off',
    'prefer-const': 'off',
    'no-empty-function': 'off',
    'no-useless-constructor': 'off',
    'class-methods-use-this': 'off',
    'no-unused-expressions': 'off',
    "no-multi-spaces": "off",
    "space-in-parens": "off",
    "no-trailing-spaces": "off"
  },
})
