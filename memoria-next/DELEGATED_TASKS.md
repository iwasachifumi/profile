# Delegated Tasks (Human Runner)

Use this when Codex should continue coding while a human runs slow local commands.

## 1) Runner commands

Run these in `memoria-next/`:

```bash
npm install
npm run build
npm run lint
```

## 2) Report format back to Codex

Paste this template with results:

```text
[runner-report]
timestamp:
machine:
node:
npm:

npm-install: OK | FAIL
build: OK | FAIL
lint: OK | FAIL

first-error-line:
log-snippet:
```

If any step fails, include only the first meaningful error line and a short snippet (5-20 lines).

## 3) Codex behavior while waiting

Codex should keep working on tasks that do not require installed dependencies:

1. Route/component refactors
2. API client wiring
3. Type/schema cleanup
4. UI migration from `js/` to `src/features/`

Codex should not block on `npm install`/`build`/`lint` completion unless the next step depends on it.
