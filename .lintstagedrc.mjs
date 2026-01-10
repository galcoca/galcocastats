const IGNORED_PATTERNS = ['.d.ts', '.config.mjs', '.config.js', '.config.ts']

function shouldLint(filepath) {
  return !IGNORED_PATTERNS.some(pattern => filepath.endsWith(pattern))
}

export default {
  '*.{ts,tsx}': files => {
    const targets = files.filter(shouldLint)
    return targets.length ? [`./scripts/pre-commit-format-lint.sh ${targets.join(' ')}`] : []
  },
  '*.{json,md,yml,yaml}': 'prettier --write',
}
