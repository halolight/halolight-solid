import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import solid from 'eslint-plugin-solid/configs/typescript'

export default tseslint.config(
  { ignores: ['.output/', '.vinxi/', 'node_modules/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    ...solid,
    languageOptions: {
      parserOptions: {
        project: 'tsconfig.json',
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      'solid/reactivity': 'off',
      'solid/no-destructure': 'off',
      'solid/jsx-no-undef': 'error',
    },
  }
)
