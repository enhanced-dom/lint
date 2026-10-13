import path from 'path'
import fs from 'fs'

export function upsertProjectGitignore(cwd: string, filename: string, section?: string): void {
  const gitignorePath = path.resolve(cwd, '.gitignore')
  const content = fs.existsSync(gitignorePath) ? fs.readFileSync(gitignorePath, 'utf8') : ''
  const linePattern = new RegExp('^' + filename.replace(/\./g, '\\.') + '$', 'm')

  if (!section) {
    if (!linePattern.test(content)) fs.writeFileSync(gitignorePath, content.trimEnd() + '\n' + filename + '\n')
    return
  }

  const start = `# ${section}`
  const end = `# end ${section}`
  const startIdx = content.indexOf(start)
  const endIdx = content.indexOf(end)

  if (startIdx !== -1 && endIdx !== -1) {
    if (!linePattern.test(content.slice(startIdx, endIdx))) {
      fs.writeFileSync(gitignorePath, content.slice(0, endIdx) + filename + '\n' + content.slice(endIdx))
    }
  } else {
    fs.writeFileSync(gitignorePath, content.trimEnd() + '\n' + start + '\n' + filename + '\n' + end + '\n')
  }
}

export function writeDirGitignore(dirPath: string): void {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true })
  fs.writeFileSync(path.join(dirPath, '.gitignore'), '*\n')
}
