---
name: code-quality
description: Run PHP linter (Laravel Pint), JS/TS linter (ESLint), formatter (Prettier), and TypeScript type check. Use when asked to format, lint, check types, or fix code style.
---

# Code Quality — Sistema de Seguimiento

## Available commands

### PHP — Laravel Pint (formatter)

```bash
./vendor/bin/pint                    # Check + fix all
./vendor/bin/pint --test             # Dry run (only show issues)
./vendor/bin/pint app/Models         # Specific directory
./vendor/bin/pint app/Services/TramiteService.php  # Specific file
```

### JavaScript/TypeScript — ESLint

```bash
npx eslint .                         # Check all
npx eslint . --fix                   # Auto-fix
npx eslint resources/js/Pages        # Specific directory
```

### Prettier (formatting)

```bash
npx prettier --check .               # Check formatting
npx prettier --write .               # Auto-format
npx prettier --check "resources/js/**/*.{ts,tsx}"  # Specific files
```

### TypeScript type check

```bash
npx tsc --noEmit                     # Full check
```

### Full quality check (all in one)

```bash
./vendor/bin/pint --test && npx eslint . && npx prettier --check . && npx tsc --noEmit
```

### Auto-fix everything

```bash
./vendor/bin/pint && npx eslint . --fix && npx prettier --write .
```

## Config files

| Tool | Config file |
|------|-------------|
| Laravel Pint | `pint.json` (root) |
| ESLint | `eslint.config.js` (root) |
| Prettier | `.prettierrc` (root) |
| TypeScript | `tsconfig.json` (root) |
