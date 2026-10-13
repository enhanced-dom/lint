#!/usr/bin/env node

import path from 'path'
import fs from 'fs'
import os from 'os'
import yargs from 'yargs'

import { writeDirGitignore } from './utils'

const args = yargs(process.argv)
  .usage('$0 [--folder relative_or_absolute] [--gitignore]')
  .default('folder', '.husky')
  .boolean('gitignore')
  .default('gitignore', false).argv as { folder: string; gitignore: boolean }

const fullHuskyHooksPath = path.isAbsolute(args.folder) ? args.folder : path.resolve(process.cwd(), args.folder)
const fullHuskyPreCommitPath = path.join(fullHuskyHooksPath, 'pre-commit')

if (fs.existsSync(fullHuskyHooksPath)) {
  fs.rmSync(fullHuskyHooksPath, { recursive: true, force: true })
}

fs.mkdirSync(fullHuskyHooksPath)
if (args.gitignore) writeDirGitignore(fullHuskyHooksPath)
fs.writeFileSync(
  fullHuskyPreCommitPath,
  ['#!/bin/sh', 'echo "executing git pre-commit hook via husky"', 'npx lint-staged -r'].join('\n') + '\n',
  { mode: 0o755 },
)

const huskyInitDir = path.join(os.homedir(), '.config', 'husky')
if (!fs.existsSync(huskyInitDir)) fs.mkdirSync(huskyInitDir, { recursive: true })
fs.writeFileSync(path.join(huskyInitDir, 'init.sh'), `export PATH=${process.env.PATH}`)
