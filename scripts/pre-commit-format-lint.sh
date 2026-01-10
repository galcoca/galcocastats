#!/bin/sh

# Format and lint staged files sequentially
# Prettier must complete before ESLint to avoid conflicts

# Step 1: Format with Prettier
echo "→ Formatting..."
npx prettier --write "$@"

# Brief pause to ensure file writes complete
sleep 1

# Step 2: Auto-fix lint issues
echo "→ Fixing lint issues..."
npx eslint --fix "$@"

# Step 3: Strict verification (no warnings allowed)
echo "→ Verifying..."
if ! npx eslint --max-warnings 0 "$@"; then
  echo "✗ Lint errors remain. Please fix manually."
  exit 1
fi

echo "✓ Done"
