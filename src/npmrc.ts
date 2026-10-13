#!/usr/bin/env node

import path from 'path'
import fs from 'fs'
import yargs from 'yargs'

import { upsertProjectGitignore } from './utils'

const args = yargs(process.argv)
  .usage('$0 [--min-release-age <days>] [--gitignore]')
  .number('min-release-age')
  .default('min-release-age', 7)
  .boolean('gitignore')
  .default('gitignore', false).argv as {
  minReleaseAge: number
  gitignore: boolean
}

const npmrcPath = path.resolve(process.cwd(), '.npmrc')

function upsertLine(content: string, pattern: RegExp, line: string): string {
  return pattern.test(content) ? content.replace(pattern, line) : content.trimEnd() + '\n' + line + '\n'
}

const existing = fs.existsSync(npmrcPath) ? fs.readFileSync(npmrcPath, 'utf8') : ''

let content = existing || ''
content = existing
  ? upsertLine(content, /^min-release-age=.*/m, `min-release-age=${args.minReleaseAge}`)
  : `min-release-age=${args.minReleaseAge}\n`
content = upsertLine(content, /^min-release-age-exclude\[\]=@enhanced-dom\/\*/m, 'min-release-age-exclude[]=@enhanced-dom/*')

fs.writeFileSync(npmrcPath, content)

if (args.gitignore) upsertProjectGitignore(process.cwd(), '.npmrc', '@enhanced-dom/lint')
