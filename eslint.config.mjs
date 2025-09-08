import eslintPluginPrettier from 'eslint-plugin-prettier';
import fs from 'fs';
const prettierConfig = JSON.parse(fs.readFileSync('./.prettierrc.json', 'utf-8'));

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': ['error', prettierConfig],
    },
  },
];
