# cvvd

cvvd is a local CV studio. You run it on your own machine, fill in your details through the UI, and it stores everything in a YAML file in the codebase. The main output is a publication-grade PDF generated with a headless browser, so the exported file does not depend on whatever your browser or OS happens to print.

## What it does

The app gives you a profile editor for your basics, work experience, projects, writing, education, skills, and layout settings. Your data is saved in `data/profile.yaml`, and you can preview the CV in the browser before exporting it.

PDF export uses Playwright to open the print view in a headless Chromium browser and render the PDF from the same print styles used by the app. That gives you a consistent result across machines.

## Getting started

Install dependencies:

```bash
pnpm install
```

If you want cvvd to use Playwright's bundled browser for PDF generation, install Chromium:

```bash
pnpm exec playwright install chromium
```

If you already have Chrome, Chromium, Edge, or Brave installed, cvvd can use that browser instead. You can also point it at a specific Chromium-based browser with `BROWSER_PATH` (Playwright PDF generation requires Chromium).

Start the app:

```bash
pnpm dev
```

The studio runs at `http://localhost:3000`.

## Editing the profile YAML directly

Your profile is stored in `data/profile.yaml`. The app creates this file the first time it reads or saves your profile. You can edit it directly if you prefer working in your editor.

For editor validation and autocomplete, cvvd writes a JSON Schema to `data/profile.schema.json` and adds this comment to the top of `data/profile.yaml`:

```yaml
# yaml-language-server: $schema=./profile.schema.json
```

If your editor uses `yaml-language-server` (for example VS Code with the Red Hat YAML extension), it will pick up the schema from that comment and show you which fields are valid, which types are expected, and which values are allowed. If the schema file is missing, saving from the app or running the schema script will recreate it:

```bash
bun run scripts/generate-profile-schema.ts
```

Keep the data shape aligned with the app’s profile schema. The safest workflow is to make small edits, save, and reload the studio to confirm the UI reflects the change.

## Generating a PDF

The latest generated CV is committed at [`public/cv.pdf`](./public/cv.pdf). The raw GitHub URL is [https://raw.githubusercontent.com/mikelneonedwin/cvvd/main/public/cv.pdf](https://raw.githubusercontent.com/mikelneonedwin/cvvd/main/public/cv.pdf), which you can use anywhere you need a direct download link.

You can generate a PDF in two ways.

From the UI, use the "Generate PDF" button in the sidebar or the "Generate PDF" button in the print settings modal. The app saves your current profile to `data/profile.yaml`, then generates and downloads the PDF.

From the command line, with the dev server running:

```bash
pnpm pdf
```

By default this saves `cvvd.pdf` in the current directory. You can pass an output path:

```bash
pnpm pdf ./exports/my-cv.pdf
```

The command calls the local `/api/pdf` endpoint, so the app must be running. On pre-push, if `data/profile.yaml` changed, the hook generates `public/cv.pdf` from the YAML data. If the generated PDF changes, the push is blocked so you can commit the updated PDF.

## Configuration

The app works with defaults. You can optionally set environment variables in `.env.local`:

```bash
BASE_URL=http://localhost:3000
BROWSER_PATH=/usr/bin/google-chrome
```

`BASE_URL` is used as the base URL when generating PDFs. `BROWSER_PATH` lets you supply a specific Chromium-based browser executable.

When generating a PDF, cvvd tries `BROWSER_PATH` first if configured. Otherwise it uses Playwright's bundled Chromium when installed, or falls back to a non-snap Chromium-based browser on your system.

## Tech stack

- Next.js (App Router), React 19, TypeScript
- tRPC and TanStack Query
- YAML file storage in `data/profile.yaml`
- Tailwind CSS v4
- Playwright for headless PDF generation
