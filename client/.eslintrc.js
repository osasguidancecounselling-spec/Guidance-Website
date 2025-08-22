/* eslint-env node */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
  settings: {
    react: { version: 'detect' },
  },
  overrides: [
    {
      files: [
        '.eslintrc.js',
        'jest.config.js',
        'cypress.config.js',
      ],
      env: { node: true },
      globals: { module: 'readonly', require: 'readonly' },
    },
    {
      files: ['cypress/e2e/**/*.cy.js'],
      env: { mocha: true },
      globals: {
        cy: 'readonly',
        Cypress: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        before: 'readonly',
        after: 'readonly',
      },
    },
    {
      files: ['**/*.test.js', '**/*.test.jsx', '**/__tests__/**/*'],
      env: { jest: true },
      globals: {
        jest: 'readonly',
        describe: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
      },
    },
  ],
};
