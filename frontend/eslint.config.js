import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import * as vueParser from 'vue-eslint-parser';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  // Global ignores
  {
    ignores: [
      'node_modules/',
      'dist/',
      '*.d.ts', // Typically, declaration files are not linted for style/rules
      '.turbo/',
      '.wrangler/'
    ]
  },

  // Base configurations for all relevant files
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'], // For Vue 3
  eslintConfigPrettier, // Make sure this is last in the main extends to override others

  // Configuration for Vue files
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser, // Use TypeScript parser for <script> blocks
        sourceType: 'module',
        ecmaVersion: 'latest',
        extraFileExtensions: ['.vue'],
      },
      globals: {
        ...globals.browser,
        // Add any Vue-specific globals if needed, e.g., defineProps, defineEmits
        // Though eslint-plugin-vue usually handles these well with <script setup>
        defineProps: 'readonly',
        defineEmits: 'readonly',
        defineExpose: 'readonly',
        withDefaults: 'readonly',
      }
    },
    rules: {
      // Vue specific rules can be adjusted here
      'vue/multi-word-component-names': 'off',
      'vue/no-unused-vars': 'warn', // or 'error'
    }
  },

  // Configuration for TypeScript files (outside .vue)
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
      globals: {
        ...globals.browser, // Or globals.node if it's Node.js TS files
        ...globals.node // Assuming some TS files might be for node scripts (e.g. vite.config.ts)
      }
    },
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': 'warn', // or 'error'
    }
  },

  // Configuration for JavaScript files (e.g., config files like this one)
  {
    files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
    languageOptions: {
      globals: {
        ...globals.node, // For Node.js environment config files
        ...globals.browser // If some JS files are for browser
      },
      ecmaVersion: 'latest',
      sourceType: 'module' // Assuming most JS files are modules
    },
    rules: {
      // JS specific rules
    }
  }
]; 