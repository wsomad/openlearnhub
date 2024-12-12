// import js from '@eslint/js'
// import globals from 'globals'
// import react from 'eslint-plugin-react'
// import reactHooks from 'eslint-plugin-react-hooks'
// import reactRefresh from 'eslint-plugin-react-refresh'

// export default [
//   { ignores: ['dist', 'functions'] },
//   {
//     files: ['**/*.{js,jsx.ts,tsx}'],
//     languageOptions: {
//       ecmaVersion: 2021,
//       globals: globals.browser,
//       parserOptions: {
//         ecmaVersion: 'latest',
//         ecmaFeatures: { jsx: true },
//         sourceType: 'module',
//       },
//     },
//     settings: { react: { version: '18.3' } },
//     plugins: {
//       react,
//       'react-hooks': reactHooks,
//       'react-refresh': reactRefresh,
//     },
//     // rules: {
//     //   ...js.configs.recommended.rules,
//     //   ...react.configs.recommended.rules,
//     //   ...react.configs['jsx-runtime'].rules,
//     //   ...reactHooks.configs.recommended.rules,
//     //   'react/jsx-no-target-blank': 'off',
//     //   'react-refresh/only-export-components': [
//     //     'warn',
//     //     { allowConstantExport: true },
//     //   ],
//     // },
//     'rules': {
//       'constructor-super': 'off',
//       ...js.configs.recommended.rules,
//       ...react.configs.recommended.rules,
//       ...react.configs['jsx-runtime'].rules,
//       ...reactHooks.configs.recommended.rules,
//       'react/jsx-no-target-blank': 'off',
//       'react-refresh/only-export-components': [
//         'warn',
//         { allowConstantExport: true },
//       ],
//     },
//     globals: {
//       ...globals.browser,
//       structuredClone: 'readonly',
//     },
//   },
// ]

import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import typescript from '@typescript-eslint/parser'
import typescriptPlugin from '@typescript-eslint/eslint-plugin'

export default [
  { ignores: ['dist', '/functions'] },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2021, // ECMAScript 2021 to support structuredClone
      parser: typescript, // Use TypeScript parser
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
      globals: globals.browser,
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@typescript-eslint': typescriptPlugin, // Correct way to import the TypeScript plugin
    },
    rules: {
      'constructor-super': 'off', // Disable constructor-super rule
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'off', // Optional: Modify according to your needs
    },
  },
]
