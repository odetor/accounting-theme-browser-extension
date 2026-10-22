# Accounting Theme Browser Extension

A browser extension built with [WXT](https://wxt.dev/) that applies an accounting ledger theme to web pages.

## Features

- **Ledger overlay** – injects an accounting-themed stylesheet into web pages (per-tab toggle)
- **Theme** – applies a ledger-style UI with dark backgrounds, green phosphor text, and monospace accounting font
- **Storage** – saves ledger enabled state per browser via Chrome storage sync

## Tech Stack

- WXT 0.21 (Manifest V3)
- TypeScript
- Chrome Storage API

## Scripts

| Script | Action |
|--------|--------|
| `npm run dev` | Start WXT dev server (hot reload) |
| `npm run build` | Production build for Chrome MV3 → `.output/chrome-mv3/` |
| `npm run zip` | Package `.zip` for Chrome Web Store → `.output/` |
| `npm run compile` | TypeScript typecheck |
| `npm run test` | Run Playwright tests |

## Build & Load

```bash
npm install
npm run build
```

Load unpacked from `.output/chrome-mv3/` in Chrome/Edge via `chrome://extensions` (Developer mode → Load unpacked).

## Project Structure

```
src/
  manifest.json             # extension manifest
  ledger.content.ts         # content script: applies/removes ledger CSS
  assets/icons/             # accounting-themed icons (SVG)
```

## Notes

- The content script runs on `<all_urls>` at `document_idle`.
- `chrome://` and extension pages cannot be themed (browser restriction).
