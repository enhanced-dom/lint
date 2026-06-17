import { type Configuration } from 'lint-staged'

export const lintStagedConfigFactory = ({ eslintExtensions = ['ts', 'tsx'] as string[], stylelintExtensions = ['pcss'] as string[]} = {}): Configuration => {
  return {
    ...(eslintExtensions.length
      ? {
          [eslintExtensions.length > 1 ? `*.{${eslintExtensions.join(',')}}` : `*.${eslintExtensions[0]}`]: [
            'eslint --fix --config eslint.config.cjs',
            'git update-index --again'
          ]
        }
      : {}),
    ...(stylelintExtensions.length
      ? {
          [stylelintExtensions.length > 1 ? `*.{${stylelintExtensions.join(',')}}` : `*.${stylelintExtensions[0]}`]: [
            'stylelint --fix --config stylelint.config.cjs',
            'git update-index --again'
          ]
        }
      : {})
  }
}
