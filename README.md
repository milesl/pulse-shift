# Pulse Shift

**Small shifts. Big change.**

A mobile-first PWA for daily health accountability — tracking diet, weight, body fat %, exercise, and recovery with direct, no-nonsense feedback.

## Features

- **30-second morning check-in** — weight, body fat, feeling, meal ratings, training/rest
- **Diet tracker** — clean eating streaks, weekly overview, treat logger with beer rules
- **Injury management** — log, track severity, and get nudged to rest
- **Dashboard** — weight/BF% trends, diet charts, meal grid, weekly stats
- **Nudge engine** — 14 behavioural rules with blunt cause-and-effect feedback
- **PWA** — installable, works fully offline after first load

## Tech Stack

- Vue 3 (CDN, no build step)
- Vanilla CSS with custom properties
- localStorage for persistence
- Service worker for offline support

## Run Locally

Any static server works:

```bash
npx serve .
```

Then open `http://localhost:3000`.

## Deploy

Upload all files to any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages). No build step required. HTTPS needed for PWA/service worker.

## Live

[milesl.co.uk/pulse-shift](https://milesl.co.uk/pulse-shift/)
