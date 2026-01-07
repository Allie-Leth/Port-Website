#!/bin/bash

# Pre-commit validation script
# Mirrors CI/CD pipeline checks: lint:code, lint:format, test:unit
# Run this before committing to ensure code quality

set -e  # Exit on any error

echo "Running pre-commit validation..."
echo ""

# 1. Lint check (mirrors lint:code job)
echo "[1/3] Running ESLint..."
npm run lint
echo "Lint passed"
echo ""

# 2. Type check (mirrors lint:code job)
echo "[2/3] Running TypeScript type check..."
npm run typecheck
echo "Type check passed"
echo ""

# 3. Prettier format check (mirrors lint:format job)
echo "[3/3] Checking code formatting..."
npx prettier --check .
echo "Format check passed"
echo ""

# 4. Test coverage (mirrors test:unit job)
echo "[4/4] Running tests with coverage..."
npm run test:coverage -- --coverage-threshold='{"global":{"branches":80,"functions":80,"lines":80,"statements":80}}'
echo "Coverage requirements met"
echo ""

# 5. Optional E2E tests (mirrors test:e2e job)
if [ "$RUN_E2E" = "true" ]; then
  echo "[E2E] Running Playwright E2E tests..."
  npm run test:e2e -- --project=chromium
  echo "E2E tests passed"
  echo ""
fi

echo "All pre-commit checks passed. Safe to commit."
echo ""
echo "Tip: Run with RUN_E2E=true to include E2E tests"
