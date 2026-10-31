# cvvd

cvvd is a clean, living profile and publication-grade printable CV engine inspired by the understated editorial elegance of read.cv. It combines an interactive online portfolio with a dedicated print media engine tailored for physical A4 and US Letter resumes.

## Overview

Traditional resume builders produce rigid documents with clunky formatting, while digital portfolios often fail when printed or exported to PDF. cvvd reconciles both worlds by offering a living digital profile that transforms into a typography-driven curriculum vitae when printed.

## Features

### Flexible Layout Archetypes
- **Editorial (read.cv)**: The signature asymmetrical timeline layout featuring a 100px duration gutter set with tabular figures, a 540px centered web canvas, and an indented about narrative. In print, it allocates a 60mm absolute header column and 100mm content blocks at an exact 70mm left offset.
- **Single Column (Classic)**: A full-width chronological layout optimized for technical resumes and automated applicant tracking systems. Section titles are accented with subtle hairline rules, and date ranges align to the right on the same row as job titles.
- **Balanced (Two-Column)**: An evenly weighted split layout that groups identity, contact channels, formal education, and skills in the left column, while dedicating the right column to work experience, side projects, and writing.

### Publication-Grade CSS Print Media Engine
- Engineered specifically for A4 (210mm x 297mm) and US Letter paper dimensions with exact 14mm margins.
- Built without absolute column traps, guaranteeing graceful multi-page flow across long work histories.
- Strips web UI chrome, sidebar offsets, and interactive controls in `@media print`.
- Incorporates dynamic print density modifiers (Comfortable vs Compact) and optional profile avatar rendering.

### Print Profile Dialog & Live Preview
- Authentic modal dialog with helpful browser print tips, granular section visibility switches, density selection, and photo toggles.
- Built-in sheet simulation tab rendering the exact 170mm physical page geometry before printing.
- Direct invocation via keyboard shortcut (Command + P or Control + P).

### Non-Destructive Editing & Local Storage
- Built-in profile editor (Command + E or Control + E) supporting real-time editing across personal basics, experience, projects, writing, education, skills, and layout options.
- Non-destructive text fields preserving raw newlines in bullet highlights and comma-space sequences in technology tags during active typing.
- Automatic persistence to browser local storage with symmetric JSON import and export capabilities.

## Getting Started

### Prerequisites
- [Bun](https://bun.sh/) (recommended) or Node.js 18+

### Development

Install dependencies:
```bash
bun install
```

Start the local development server:
```bash
bun run dev
```

The application runs at `http://localhost:3000`.

### Production Build

Create an optimized production build:
```bash
bun run build
```

Preview the production build locally:
```bash
bun run preview
```

## Tech Stack

- **Framework**: React 19, TypeScript
- **Routing**: TanStack Router
- **Styling**: Tailwind CSS v4, Custom CSS tokens
- **Icons**: Custom SVG geometries matching read.cv, Lucide React
- **Packaging**: Vite
