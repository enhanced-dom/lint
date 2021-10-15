export const stylelintConfigFactory = ({ rules = {} as Record<string, any>, configs = [] as string[], plugins = [] as string[] } = {}) => {
  return {
    extends: ['stylelint-config-standard', 'stylelint-config-recommended-scss', 'stylelint-a11y', ...configs],
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
      "selector-pseudo-class-no-unknown": [true, { "ignorePseudoClasses": ["local", "global"] }],
      "at-rule-no-unknown": [true, { "ignoreAtRules": ["extend", "inherit:", "mixin", "define-mixin", "if", "else"] }],
      'selector-class-pattern': '^[a-z0-9]+(-[a-z0-9]+)*$',
      'max-empty-lines': 1,
      'unit-whitelist': ['vh', 'vw', 'fr', 'rem', '%', 's', 'deg', 'ms'],
      ...rules
    }
  }
}
