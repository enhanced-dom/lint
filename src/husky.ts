export const huskyConfigFactory = (extraHooks = {} as Record<string, string>) => {
  return {
    hooks: {
      'pre-commit': 'lint-staged -r',
      ...extraHooks
    }
  }
}
