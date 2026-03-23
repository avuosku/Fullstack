// eslint.config.js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      'no-console': 'off', // sallii console.log-käytön
      '@typescript-eslint/no-require-imports': 'off' // sallii require-käytön, jos vielä tarvitset
    },
  },
];
