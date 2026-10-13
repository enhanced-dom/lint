import { type Configuration } from 'lint-staged'

export const lintStagedConfigFactory = ({
  eslintExtensions = ['ts', 'tsx'] as string[],
  stylelintExtensions = ['pcss'] as string[],
  fallow = false,
} = {}): Configuration => {
  return {
    // fallow audit checks the whole project, not individual files; a function form
    // skips lint-staged's default behaviour of appending the matched filenames as args
    ...(fallow ? { '**/*': () => 'fallow audit' } : {}),
    ...(eslintExtensions.length
      ? {
          [eslintExtensions.length > 1 ? `*.{${eslintExtensions.join(',')}}` : `*.${eslintExtensions[0]}`]: [
            'eslint --fix --config eslint.config.mjs',
            'git update-index --again',
          ],
        }
      : {}),
    ...(stylelintExtensions.length
      ? {
          [stylelintExtensions.length > 1 ? `*.{${stylelintExtensions.join(',')}}` : `*.${stylelintExtensions[0]}`]: [
            'stylelint --fix --config stylelint.config.mjs',
            'git update-index --again',
          ],
        }
      : {}),
  }
}
