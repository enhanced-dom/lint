import { type Config } from 'stylelint'

export const stylelintConfigFactory = ({ rules = {} as Config['rules'], configs = [] as string[], plugins = [] as string[] } = {}): Config => {
  return {
    extends: ['stylelint-config-standard', 'stylelint-config-recommended-scss', ...configs],
    plugins: ['stylelint-scss', 'stylelint-prettier', ...plugins],
    rules: {
      'prettier/prettier': true,
      'block-no-empty': null,
      'comment-empty-line-before': [
        'always',
        {
          ignore: ['stylelint-commands', 'after-comment']
        }
      ],
      "selector-pseudo-class-no-unknown": [true, { "ignorePseudoClasses": ["local", "global", "export"] }],
      "at-rule-no-unknown": [true, { "ignoreAtRules": ["extend", "inherit:", "mixin", "define-mixin", "if", "else"] }],
      'selector-class-pattern': '^[a-z0-9]+(-[a-z0-9]+)*$',
      "declaration-block-no-redundant-longhand-properties": null,
      'unit-allowed-list': ['vh', 'vw', 'fr', 'rem', '%', 's', 'deg', 'ms'],
      'property-no-unknown': [true, { "ignoreProperties": [/^variables_/] }],
      ...rules
    }
  }
}
