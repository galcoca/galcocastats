#!/usr/bin/env bash
# Check for outdated packages across all workspaces

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'
BOLD='\033[1m'

ROOT_DIR="$(cd "$(dirname "$0")" && cd .. && pwd)"

TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

# Determine if upgrade is safe based on semver
check_safety() {
  local cur=$1
  local new=$2

  # Extract major.minor.patch
  local cur_major=$(echo "$cur" | cut -d. -f1 | grep -o '[0-9]*')
  local cur_minor=$(echo "$cur" | cut -d. -f2 | grep -o '[0-9]*')
  local cur_patch=$(echo "$cur" | cut -d. -f3 | grep -o '[0-9]*')
  local new_major=$(echo "$new" | cut -d. -f1 | grep -o '[0-9]*')
  local new_minor=$(echo "$new" | cut -d. -f2 | grep -o '[0-9]*')
  local new_patch=$(echo "$new" | cut -d. -f3 | grep -o '[0-9]*')

  # Handle empty values
  [ -z "$cur_major" ] && cur_major=0
  [ -z "$cur_minor" ] && cur_minor=0
  [ -z "$cur_patch" ] && cur_patch=0
  [ -z "$new_major" ] && new_major=0
  [ -z "$new_minor" ] && new_minor=0
  [ -z "$new_patch" ] && new_patch=0

  # Major version change
  if [ "$new_major" -gt "$cur_major" ]; then
    echo "❌ Breaking"
  # Minor version change
  elif [ "$new_minor" -gt "$cur_minor" ]; then
    echo "⚠️ Warning"
  # Patch version change
  elif [ "$new_patch" -gt "$cur_patch" ]; then
    echo "✓ Safe"
  else
    echo "✓ Safe"
  fi
}

# Get outdated packages for a workspace
get_outdated_packages() {
  local workspace_path=$1
  local output_file="$TEMP_DIR/$2.txt"

  OUTDATED=$(cd "$workspace_path" && bun outdated 2>&1)

  if ! echo "$OUTDATED" | grep -q "^|.*|.*|.*|$"; then
    touch "$output_file"
    return
  fi

  echo "$OUTDATED" | grep -E "^\| [^-]" | grep -v "^| Package" | while read -r line; do
    PKG=$(echo "$line" | awk -F'|' '{print $2}' | sed 's/^ *//;s/ *$//')
    CUR=$(echo "$line" | awk -F'|' '{print $3}' | sed 's/^ *//;s/ *$//')
    NEW=$(echo "$line" | awk -F'|' '{print $5}' | sed 's/^ *//;s/ *$//')

    [ -z "$PKG" ] && continue

    # Remove (dev) marker from package name
    PKG=$(echo "$PKG" | sed 's/ (dev)//')

    # Skip @types/node for major/minor updates (only allow patches)
    if [[ "$PKG" == "@types/node" ]]; then
      local cur_major=$(echo "$CUR" | cut -d. -f1 | grep -o '[0-9]*')
      local cur_minor=$(echo "$CUR" | cut -d. -f2 | grep -o '[0-9]*')
      local new_major=$(echo "$NEW" | cut -d. -f1 | grep -o '[0-9]*')
      local new_minor=$(echo "$NEW" | cut -d. -f2 | grep -o '[0-9]*')

      # Skip if major or minor version changed
      if [ "$new_major" != "$cur_major" ] || [ "$new_minor" != "$cur_minor" ]; then
        continue
      fi
    fi

    # Determine safety
    SAFETY=$(check_safety "$CUR" "$NEW")

    echo "$PKG|$CUR|$NEW|$SAFETY"
  done > "$output_file"
}

echo ""
echo -e "${BOLD}${CYAN}📦 Checking Outdated Packages${NC}"
echo ""

# Collect outdated package data
get_outdated_packages "$ROOT_DIR" "root"

# Check if any outdated
TOTAL=0
for f in root; do
  TOTAL=$((TOTAL + $(wc -l < "$TEMP_DIR/$f.txt" 2>/dev/null | tr -d ' ')))
done

if [ "$TOTAL" -eq 0 ]; then
  echo -e "${GREEN}✅ All packages up to date!${NC}"
  echo ""
  exit 0
fi

# Function to print individual table for a workspace
print_workspace_table() {
  local workspace_name=$1
  local file=$2

  [ ! -s "$TEMP_DIR/$file" ] && return

  # Table title
  echo -e "${BOLD}${MAGENTA}$(echo $workspace_name | tr '[:lower:]' '[:upper:]')${NC}"

  # Top border
  echo "┌────────────────────────────────────────┬─────────────┬─────────────┬──────────────┐"

  # Header
  printf "│ ${BOLD}%-38s${NC} │ ${BOLD}%-11s${NC} │ ${BOLD}%-11s${NC} │ ${BOLD}%-12s${NC} │\n" "Package" "Current" "Latest" "Safety"

  # Separator
  echo "├────────────────────────────────────────┼─────────────┼─────────────┼──────────────┤"

  # Data rows
  while IFS='|' read -r pkg cur new safety; do
    # Truncate package name if needed
    pkg_display=$(printf "%-38s" "$pkg" | cut -c1-38)
    cur_display=$(printf "%-11s" "$cur" | cut -c1-11)
    new_display=$(printf "%-11s" "$new" | cut -c1-11)

    # Color and pad the safety indicator (emojis take 2 visual spaces)
    if [[ "$safety" == *"Breaking"* ]]; then
      printf "│ %-38s │ ${RED}%-11s${NC} │ ${GREEN}%-11s${NC} │ ${RED}❌ Breaking${NC}  │\n" "$pkg_display" "$cur_display" "$new_display"
    elif [[ "$safety" == *"Warning"* ]]; then
      printf "│ %-38s │ ${RED}%-11s${NC} │ ${GREEN}%-11s${NC} │ ${YELLOW}⚠️ Warning${NC}   │\n" "$pkg_display" "$cur_display" "$new_display"
    else
      printf "│ %-38s │ ${RED}%-11s${NC} │ ${GREEN}%-11s${NC} │ ${GREEN}✓ Safe${NC}       │\n" "$pkg_display" "$cur_display" "$new_display"
    fi
  done < "$TEMP_DIR/$file"

  # Bottom border
  echo "└────────────────────────────────────────┴─────────────┴─────────────┴──────────────┘"
  echo ""
}

# Print one table per workspace
print_workspace_table "Root" "root.txt"

echo -e "${YELLOW}→ Run 'bun update' to update packages${NC}"
echo ""

# LTS Version Info Table
echo -e "${BOLD}${CYAN}📋 Node.js LTS Status${NC}"
echo ""

# Get LTS version from .nvmrc
if [ -f "$ROOT_DIR/.nvmrc" ]; then
  LTS_VERSION=$(cat "$ROOT_DIR/.nvmrc")
else
  LTS_VERSION="Not found"
fi

# Get current @types/node version from package.json
TYPES_NODE_VERSION="Not installed"
if [ -f "$ROOT_DIR/package.json" ]; then
  TYPES_NODE_VERSION=$(grep -o '"@types/node"[[:space:]]*:[[:space:]]*"[^"]*"' "$ROOT_DIR/package.json" | cut -d'"' -f4)
fi

# Get current Node.js runtime version
if command -v node &> /dev/null; then
  NODE_RUNTIME=$(node --version)
else
  NODE_RUNTIME="Not installed"
fi

# Print LTS status table
echo "┌────────────────────────────────────────┬──────────────────────────┐"
printf "│ ${BOLD}%-38s${NC} │ ${BOLD}%-24s${NC} │\n" "Component" "Version"
echo "├────────────────────────────────────────┼──────────────────────────┤"
printf "│ %-38s │ ${GREEN}%-24s${NC} │\n" "Node.js LTS (.nvmrc)" "$LTS_VERSION"
printf "│ %-38s │ ${GREEN}%-24s${NC} │\n" "@types/node (package.json)" "$TYPES_NODE_VERSION"
printf "│ %-38s │ ${GREEN}%-24s${NC} │\n" "Node.js Runtime (current)" "$NODE_RUNTIME"
echo "└────────────────────────────────────────┴──────────────────────────┘"
echo ""
