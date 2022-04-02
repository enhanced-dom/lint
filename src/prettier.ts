export const prettierConfigFactory = (config = {} as Record<string, any>) => {
  return {
    printWidth: 140,
    singleQuote: true,
    semi: false,
    bracketSameLine: false,
    trailingComma: "all",
    ...config
  }
}
