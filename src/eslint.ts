import {Linter} from 'eslint'

export const eslintConfigFactory = ({ plugins = [], configs = [], resolver, rules = {}, ignore }: {plugins?: string[]; configs?: string[]; resolver?: Record<string, any>; rules?: Linter.RulesRecord; ignore?: string[]} = {}) => {
  return {
    ignorePatterns: ignore,
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended',
      'plugin:jsx-a11y/recommended',
      'plugin:react-hooks/recommended',
      'prettier',
      ...configs
    ],
    plugins: [
      '@typescript-eslint',
      'import',
      'react',
      'react-hooks',
      'jsx-a11y',
      'prettier',
      ...plugins
    ],
    parser: '@typescript-eslint/parser',
    settings: {
      "import/resolver": resolver,
      react: {
        version: "detect"
      },
    },
    rules: {
      /* ====== prettier ===== */
      'prettier/prettier': ['error'],
      // 'max-line-length': [true, 140],
      // align: [false],
      // semicolon: [true, 'never'],
      // 'trailing-comma': [
      //   true,
      //   {
      //     multiline: false,
      //     singleline: false
      //   }
      // ],
      /* ====== import ===== */      
      'import/prefer-default-export': [0],
      'import/order': ['error', {
        'newlines-between': 'always',
        groups: [
          ['builtin', 'external'],
          'internal',
          ['parent', 'sibling', 'index']
        ]
      }],
      /* ====== naming ===== */   
      camelcase: 'off',
      '@typescript-eslint/naming-convention': [
        "error",
        {
          "selector": "default",
          "format": ["camelCase"]
        },
        {
          "selector": "variable",
          "format": ["camelCase", "UPPER_CASE"]
        },
        {
          "selector": "parameter",
          "format": ["camelCase", "PascalCase"],
          "leadingUnderscore": "allow"
        },
        {
          "selector": "memberLike",
          "modifiers": ["private"],
          "format": ["camelCase"],
          "leadingUnderscore": "require"
        },
        {
          "selector": "typeLike",
          "format": ["PascalCase"]
        }
      ],
      /* ====== typing ===== */
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      /* ====== unused & declared symbols ===== */  
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error"],
      "no-unused-expressions": "off",
      "@typescript-eslint/no-unused-expressions": ["error"],
      "no-duplicate-imports": "off",
      "@typescript-eslint/no-duplicate-imports": ["error"],
      "no-use-before-define": "off",
      "@typescript-eslint/no-use-before-define": ["error"],
      "no-shadow": "off",
      "@typescript-eslint/no-shadow": ["error"],
      "no-empty": ["error", {"allowEmptyCatch": true}],
      /* ====== react ===== */ 
      "react/prop-types" : "off",
      "react/jsx-filename-extension": [ "warn", {"extensions": [".tsx"]} ],
      ...rules
    }
  }
}
