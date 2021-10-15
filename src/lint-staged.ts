export const lintStagedConfigFactory = ({ eslintExtensions = ['ts', 'tsx'] as string[], stylelintExtensions = ['pcss'] as string[]} = {}) => {
  return {
    ...(eslintExtensions.length
      ? {
          [eslintExtensions.length > 1 ? `*.{${eslintExtensions.join(',')}}` : `*.${eslintExtensions[0]}`]: [
            'eslint --fix --config eslint.config.js',
            'git update-index --again'
          ]
        }
      : {}),
    ...(stylelintExtensions.length
      ? {
          [stylelintExtensions.length > 1 ? `*.{${stylelintExtensions.join(',')}}` : `*.${stylelintExtensions[0]}`]: [
            'stylelint --fix --config stylelint.config.js',
            'git update-index --again'
          ]
        }
      : {})
  }
}
