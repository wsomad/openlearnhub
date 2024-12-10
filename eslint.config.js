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

export default [
  { ignores: ['dist', 'functions'] },
  {
    files: ['**/*.{js,jsx.ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2021, // Updated to ECMAScript 2021
      globals: {
        ...globals.browser,
        structuredClone: 'readonly', // Added structuredClone to globals
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      'constructor-super': 'off', // Turn off constructor-super rule if needed
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]
