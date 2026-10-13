#!/usr/bin/env node

import path from 'path'
import fs from 'fs'
import yargs from 'yargs'

import { upsertProjectGitignore, writeDirGitignore } from './utils'

const args = yargs(process.argv)
  .usage('$0 [--folder <path>] [--entry <glob...>] [--ignore <glob...>] [--ignoreFindings <glob...>] [--health <json>] [--rules <json>]')
  .default('folder', '.')
  .array('entry')
  .array('ignore')
  .array('ignoreFindings')
  .array('ignoreDependencies')
  .string('health')
  .default('health', null)
  .string('rules')
  .default('rules', null)
  .boolean('gitignore')
  .default('gitignore', false).argv as {
  folder: string
  entry?: string[]
  ignore?: string[]
  ignoreFindings?: string[]
  ignoreDependencies?: string[]
  health?: string | null
  rules?: string | null
  gitignore: boolean
}

const configPath = path.resolve(process.cwd(), args.folder, '.fallowrc.json')

function collectJsPaths(value: unknown): string[] {
  if (typeof value === 'string') return value.endsWith('.js') ? [value] : []
  if (typeof value === 'object' && value !== null) return Object.values(value).flatMap(collectJsPaths)
  return []
}

function resolveToSrc(paths: string[]): string[] {
  return [...new Set(paths)].flatMap((p) => {
    const stripped = p.replace(/^\.\//, '').replace(/\.[jt]sx?$/, '')
    const bases = [...new Set([stripped, path.basename(stripped)])]
    for (const base of bases) {
      for (const ext of ['.ts', '.tsx', '.js', '.jsx']) {
        const candidate = path.resolve(process.cwd(), 'src', base + ext)
        // no ./ prefix — fallow misresolves ./src/husky.ts vs the husky npm package
        if (fs.existsSync(candidate)) return [`src/${base}${ext}`]
      }
    }
    return []
  })
}

function pkgEntries(): { all: string[]; bin: string[] } {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf8'))
    const lib = resolveToSrc([
      ...(pkg.main ? [pkg.main as string] : []),
      ...(pkg.module ? [pkg.module as string] : []),
      ...collectJsPaths(pkg.exports),
    ])
    const bin = resolveToSrc(Object.values<string>(pkg.bin ?? {}))
    return { all: [...new Set([...lib, ...bin])], bin }
  } catch {
    return { all: [], bin: [] }
  }
}

const defaultHealth = {
  maxCyclomatic: 100,
  maxCognitive: 100,
  maxCrap: 100,
  maxUnitSize: 300,
}

const defaultRules = {
  'unused-files': 'error',
  'unused-exports': 'warn',
  'unused-types': 'warn',
  'circular-dependencies': 'warn',
  'unlisted-dependencies': 'warn',
  'unused-dependencies': 'warn',
  'dev-dependencies-in-production': 'warn',
}

const defaultConfigGlobs = ['**/*.config.js', '**/*.config.cjs', '**/*.config.mjs']

const ignoreFindingsGlobs = args.ignoreFindings ?? defaultConfigGlobs

const { all: pkgAll } = pkgEntries()

const config: Record<string, unknown> = {
  $schema: './node_modules/fallow/schema.json',
  entry: [...new Set([...pkgAll, ...(args.entry ?? [])])],
  ...(args.ignoreDependencies?.length ? { ignoreDependencies: args.ignoreDependencies } : {}),
  ...(args.ignore?.length ? { ignorePatterns: args.ignore } : {}),
  ignoreFindings: ignoreFindingsGlobs,
  health: {
    ...defaultHealth,
    ignore: ignoreFindingsGlobs,
    ...(args.health ? JSON.parse(args.health) : {}),
  },
  rules: { ...defaultRules, ...(args.rules ? JSON.parse(args.rules) : {}) },
}

fs.writeFileSync(configPath, JSON.stringify(config, null, 2))

if (args.gitignore) {
  upsertProjectGitignore(process.cwd(), '.fallowrc.json', '@enhanced-dom/lint')
  writeDirGitignore(path.resolve(process.cwd(), '.fallow'))
}
