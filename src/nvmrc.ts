#!/usr/bin/env node

import path from 'path'
import fs from 'fs'
import * as semver from 'semver'
import yargs from 'yargs'

import { upsertProjectGitignore } from './utils'

const args = yargs(process.argv).usage('$0 [--gitignore]').boolean('gitignore').default('gitignore', false).argv as { gitignore: boolean }

const nodeModulesPath = path.resolve(process.cwd(), 'node_modules')

function readNodeRange(pkgPath: string): string | null {
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
    return pkg?.engines?.node ?? null
  } catch {
    return null
  }
}

function collectPkgJsons(nodeModulesDir: string, out: string[]): void {
  let entries: string[]
  try {
    entries = fs.readdirSync(nodeModulesDir)
  } catch {
    return
  }
  for (const entry of entries) {
    if (entry.startsWith('.')) continue
    if (entry.startsWith('@')) {
      let scoped: string[]
      try {
        scoped = fs.readdirSync(path.join(nodeModulesDir, entry))
      } catch {
        continue
      }
      for (const pkg of scoped) {
        const pkgDir = path.join(nodeModulesDir, entry, pkg)
        out.push(path.join(pkgDir, 'package.json'))
        collectPkgJsons(path.join(pkgDir, 'node_modules'), out)
      }
    } else {
      const pkgDir = path.join(nodeModulesDir, entry)
      out.push(path.join(pkgDir, 'package.json'))
      collectPkgJsons(path.join(pkgDir, 'node_modules'), out)
    }
  }
}

const pkgPaths: string[] = [path.resolve(process.cwd(), 'package.json')]
collectPkgJsons(nodeModulesPath, pkgPaths)

let maxMin: semver.SemVer | null = null
for (const pkgPath of pkgPaths) {
  const range = readNodeRange(pkgPath)
  if (!range) continue
  const min = semver.minVersion(range)
  if (min && (!maxMin || semver.gt(min, maxMin))) maxMin = min
}

if (!maxMin) {
  console.error('No node engine constraints found in node_modules')
  process.exit(1)
}

const nvmrcPath = path.resolve(process.cwd(), '.nvmrc')
fs.writeFileSync(nvmrcPath, `${maxMin.major}.${maxMin.minor}.${maxMin.patch}\n`)

if (args.gitignore) upsertProjectGitignore(process.cwd(), '.nvmrc', '@enhanced-dom/lint')
