import { Linter } from 'eslint'
import globals from 'globals'
import * as typescriptParser from '@typescript-eslint/parser'
import typescriptPlugin from '@typescript-eslint/eslint-plugin'
import * as importPlugin from 'eslint-plugin-import'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'
import eslintDefault from '@eslint/js'

// seems in one of the versions of globals, the keys have some spaces, which causes eslint's config parser to complain
const sanitizeGlobals = <T extends Record<string, any>>(globalsObj: T) => {
  return Object.keys(globalsObj).reduce((acc, k) => ({...acc, [k.trim()]: globalsObj[k]}), {} as T)
}

export const eslintConfigFactory = ({ include = ['**/*.js', '**/*.ts', '**/*.tsx'], plugins = {}, configs = [], resolver, rules = {}, ignore, env = ["browser"] }: {plugins?: Record<string, any>; configs?: Linter.Config[]; resolver?: Record<string, any>; rules?: Linter.RulesRecord; ignore?: string[]; include?: string[]; env?: string[]} = {} ) => {
  return [
      {
        files: include,
        ignores: ignore,
        rules: {
          ...eslintDefault.configs.recommended.rules,
          camelcase: 'off',
          "no-unused-vars": "off",
          "no-unused-expressions": "off",
          "no-duplicate-imports": "off",
          "no-use-before-define": "off",
          "no-shadow": "off",
          "no-empty": ["error", {"allowEmptyCatch": true}],
        }
      },
      {
        files: include,
        ignores: ignore,
        plugins: { '@typescript-eslint': typescriptPlugin },
        rules: {
          ...typescriptPlugin.configs.recommended.rules,
          '@typescript-eslint/naming-convention': [
            "error",
            {
              "selector": "default",
              "format": ["camelCase"]
            },
            {
              "selector": "function",
              "format": ["PascalCase", "camelCase"]
            },
            {
              "selector": "variable",
              "format": ["camelCase", "UPPER_CASE", "PascalCase"]
            },
            // for named imports to work with the variable rule above
            {
              "selector": "objectLiteralProperty",
              "format": ["camelCase", "UPPER_CASE", "PascalCase"]
            },
            {
              "selector": "parameter",
              "format": ["camelCase", "PascalCase"],
              "leadingUnderscore": "allow"
            },
            {
              "selector": "memberLike",
              "modifiers": ["#private"],
              "format": ["camelCase"],
              "leadingUnderscore": "forbid"
            },
            {
              "selector": "memberLike",
              "modifiers": ["private"],
              "format": ["camelCase"],
              "prefix": ["_", "$"]
            },
            {
                "selector": "memberLike",
                "modifiers": ["protected"],
                "format": ["camelCase"],
                "prefix": ["_", "$"]
            },
            {
              "selector": "memberLike",
              "modifiers": ["static"],
              "format": ["camelCase", "PascalCase"]
            },
            {
              "selector": "typeAlias",
              "format": ["PascalCase"],
              "custom": {
                  "regex": "(^I)|(Type|Props|Attributes)$",
                  "match": true
                }
            },
            {
              "selector": "typeParameter",
              "format": ["PascalCase"],
            },
            {
              "selector": "enum",
              "format": ["PascalCase"]
            },
            {
              "selector": "class",
              "format": ["PascalCase"]
            },
            {
              "selector": "enumMember",
              "format": ["UPPER_CASE"]
            },
            {
              "selector": "interface",
              "format": ["PascalCase"],
              "custom": {
                "regex": "(^I)|(Props|Attributes)$",
                "match": true
              }
            },
            {
              "selector": "import",
              "format": ["camelCase", "PascalCase"],
            }
          ],
          "@typescript-eslint/no-explicit-any": "off",
          "@typescript-eslint/explicit-module-boundary-types": "off",
          "@typescript-eslint/ban-ts-comment": "off",
          "@typescript-eslint/no-unused-vars": ["error"],
          "@typescript-eslint/no-unused-expressions": ["error"],
          "@typescript-eslint/no-use-before-define": ["error"],
          "@typescript-eslint/no-shadow": ["error"]  
        },
        languageOptions: {
          parser: typescriptParser,
          sourceType: "module"
        }
      },
      {
        files: include,
        ignores: ignore,
        plugins: { 
          'react': reactPlugin, 
          'react-hooks': reactHooksPlugin
        },
        rules: { 
          ...reactPlugin.configs.recommended.rules, 
          ...reactHooksPlugin.configs.recommended.rules,
          "react/prop-types" : "off",
          "react/jsx-filename-extension": [ "warn", {"extensions": [".tsx"]} ],
          "react/react-in-jsx-scope": "off" // either tsc or babel plugin will take care of this
        },
        languageOptions: {
          parserOptions: {
            ecmaFeatures: {
               jsx: true
            }
         }
        },
        settings: {
          react: {
            version: "detect"
          }
        }
      },
      {
        files: include,
        ignores: ignore,
        plugins: {
          'jsx-a11y': jsxA11yPlugin
        },
        rules: jsxA11yPlugin.configs.recommended.rules,
        languageOptions: {
          parserOptions: {
            ecmaFeatures: {
               jsx: true
            }
         }
        }
      },
      {
        files: include,
        ignores: ignore,
        plugins: {
          'prettier': prettierPlugin
        },
        rules: {
          ...prettierConfig.rules,
          'prettier/prettier': ['error']
        }
      },
      {
        files: include,
        ignores: ignore,
        plugins: {
          'import': importPlugin
        },
        settings: {
          "import/resolver": resolver ?? "typescript",
          "import/parsers": {
            "@typescript-eslint/parser": [".ts", ".tsx"],
            "@babel/eslint-parser": [".js", ".jsx"]
          },
        },
        rules: {
          ...importPlugin.configs.recommended.rules,
          'import/prefer-default-export': [0],
          'import/order': ['error', {
            'newlines-between': 'always',
            groups: [
              ['builtin', 'external'],
              'internal',
              ['parent', 'sibling', 'index']
            ]
          }]
        },
        languageOptions: {
          sourceType: "module",
          ecmaVersion: 2018,
          parserOptions: {
            requireConfigFile: false
          }
        }
      },
      ...configs,
      {
        files: include,
        ignores: ignore,
        languageOptions: {
          globals: env.reduce((acc, envName) => ({...acc, ...sanitizeGlobals(globals[envName] ?? {})}), {}),
        },
        plugins,
        rules
      }
  ]
}
