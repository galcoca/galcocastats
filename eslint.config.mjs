import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import importRules from 'eslint-plugin-import'
import hooksPlugin from 'eslint-plugin-react-hooks'

// Paths to exclude from linting
const EXCLUDE = [
  'node_modules/**',
  '.next/**',
  'out/**',
  '.vercel/**',
  'coverage/**',
  '*.d.ts',
  '*.config.js',
  '*.config.mjs',
  '*.config.ts',
  '.env*',
]

// Runtime globals
const RUNTIME_GLOBALS = {
  console: 'readonly',
  process: 'readonly',
  Buffer: 'readonly',
  Promise: 'readonly',
  Map: 'readonly',
  Set: 'readonly',
}

// Web/Fetch API globals
const WEB_GLOBALS = {
  URL: 'readonly',
  URLSearchParams: 'readonly',
  fetch: 'readonly',
  Request: 'readonly',
  Response: 'readonly',
  Headers: 'readonly',
  HeadersInit: 'readonly',
  TextEncoder: 'readonly',
  TextDecoder: 'readonly',
}

// Browser globals
const BROWSER_GLOBALS = {
  window: 'readonly',
  document: 'readonly',
  navigator: 'readonly',
  setTimeout: 'readonly',
  clearTimeout: 'readonly',
}

// React globals
const REACT_GLOBALS = {
  React: 'readonly',
  JSX: 'readonly',
}

export default [
  { ignores: EXCLUDE.map(p => `**/${p}`) },
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      globals: {
        ...RUNTIME_GLOBALS,
        ...WEB_GLOBALS,
        ...BROWSER_GLOBALS,
        ...REACT_GLOBALS,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importRules,
      'react-hooks': hooksPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: { alwaysTryTypes: true },
        node: { extensions: ['.ts', '.tsx'] },
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,

      // TypeScript
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-redeclare': ['error', { ignoreDeclarationMerge: true }],
      'no-redeclare': 'off',

      // Imports
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', ['internal', 'parent', 'sibling', 'index']],
          'newlines-between': 'always',
          pathGroups: [{ pattern: '@/**', group: 'internal', position: 'after' }],
          pathGroupsExcludedImportTypes: ['builtin'],
        },
      ],
      'import/no-duplicates': 'error',
      'import/no-unresolved': 'off',
      'import/extensions': 'off',

      // Best practices
      'no-undef': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-eval': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-template': 'error',
      'prefer-arrow-callback': 'error',
      'object-shorthand': 'error',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      curly: ['error', 'all'],

      // React
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
]
