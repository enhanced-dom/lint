import { type Config } from 'prettier'

export const prettierConfigFactory = (config: Config = {}): Config => {
  return {
    printWidth: 140,
    singleQuote: true,
    semi: false,
    bracketSameLine: false,
    trailingComma: "all",
    ...config
  }
}
