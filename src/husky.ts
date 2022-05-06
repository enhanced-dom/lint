#!/usr/bin/env node

import { add, install } from 'husky'
import path from 'path'
import yargs from 'yargs'
import fs from 'fs'
import os from 'os'

const args = yargs(process.argv).usage("$0 --folder relative_or_absolute")
    .default('folder', '.husky').argv as {folder: string}

const fullHuskyHooksPath = path.isAbsolute(args.folder) ? args.folder : path.resolve(process.cwd(), args.folder)
const fullHuskyPreCommitPath = path.join(fullHuskyHooksPath, 'pre-commit')

if (fs.existsSync(fullHuskyHooksPath)) {
  fs.rmSync(fullHuskyHooksPath, { recursive: true, force: true })
}

fs.mkdirSync(fullHuskyHooksPath)
install(fullHuskyHooksPath)
add(fullHuskyPreCommitPath,'echo "executing git pre-commit hook via husky"')
add(fullHuskyPreCommitPath, 'binpath=`npm bin`')
add(fullHuskyPreCommitPath, 'currentpath=`pwd`')
add(fullHuskyPreCommitPath, '.${binpath#"$currentpath"}/lint-staged -r')
const homeDir = os.homedir();
fs.writeFileSync(path.join(homeDir, '.huskyrc'), `export PATH=${process.env.PATH}`)