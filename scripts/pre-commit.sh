#!/usr/bin/env bash
# Pre-commit checks: runs lint and type-checking before allowing a commit.
# Install as a git hook automatically via `npm install` (see prepare script).
# Run manually: bash scripts/pre-commit.sh

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

pass() { echo -e "${GREEN}✔${NC} $1"; }
fail() { echo -e "${RED}✖${NC} $1"; }
info() { echo -e "${YELLOW}▶${NC} $1"; }

echo ""
info "Running pre-commit checks..."
echo ""

FAILED=0

# 1. Prettier formatting check
info "Checking code formatting (Prettier)..."
if npx prettier --check . --log-level warn; then
  pass "Formatting OK"
else
  fail "Formatting issues found. Run: npm run format"
  FAILED=1
fi
echo ""

# 2. ESLint
info "Running ESLint..."
if npx eslint --ignore-pattern .svelte-kit/output .; then
  pass "ESLint OK"
else
  fail "ESLint errors found."
  FAILED=1
fi
echo ""

# 3. TypeScript + Svelte type checking
info "Running TypeScript / Svelte checks..."
if npm run check --silent; then
  pass "Type checks OK"
else
  fail "Type errors found. Fix them before committing."
  FAILED=1
fi
echo ""

# Summary
if [ "$FAILED" -eq 0 ]; then
  echo -e "${GREEN}All pre-commit checks passed.${NC}"
  echo ""
  exit 0
else
  echo -e "${RED}One or more pre-commit checks failed. Commit aborted.${NC}"
  echo ""
  exit 1
fi
