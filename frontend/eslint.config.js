import globals from 'globals'

import pluginJs from '@eslint/js'
import pluginReact from 'eslint-plugin-react'

import babelParser from '@babel/eslint-parser'
import babelPresetReact from '@babel/preset-react'

import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],

    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          babelrc: false,
          configFile: false,
          presets: [babelPresetReact]
        }
      },
      globals: globals.browser
    },

    rules: {
      'no-unused-expressions': 'error',
      'no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          caughtErrors: 'all',
          ignoreRestSiblings: false,
          reportUsedIgnorePattern: false
        }
      ],
      'react/react-in-jsx-scope': 'off'
    }
  },
  eslintConfigPrettier
]
