# Casa Gelso — Digital Campaign

A single-page, production-ready campaign site for the Casa Gelso opening in
Tbilisi (13 September 2026), built from the Casa Gelso Brand Book.

## Running it

No build step. Open `index.html` directly, or serve the folder locally:

```
python3 -m http.server 8000
```

then visit `http://localhost:8000`.

## Structure

```
index.html
css/style.css      — full design system (tokens, type, every section, responsive, motion-safety)
js/app.js          — opener timeline, scroll reveals, nav, invitation, calendar, RSVP
assets/logo/       — monogram extracted from the brand book (wine + ivory, transparent PNG)
assets/teaser/     — the five campaign photographs
```

## Wiring the RSVP to a real backend

The RSVP form is fully functional client-side (validation, loading, success
and error states) but has no server yet. In `js/app.js`, find `submitRSVP()`
and replace the simulated delay with a real request, for example:

```js
function submitRSVP(data) {
  return fetch('/api/rsvp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then((r) => ({ ok: r.ok }));
}
```

Works as-is with Formspree, Netlify Forms, a Google Sheet webhook, or a
custom endpoint — nothing else in the form needs to change.

## Event details

Date, time and location live in one place — the `EVENT` object near the top
of the RSVP/calendar section in `js/app.js` — so they only need updating
once if anything changes.

## Fonts & libraries (loaded from CDN)

- Cormorant Garamond + Manrope — Google Fonts
- GSAP + ScrollTrigger — jsdelivr
- Lenis (smooth scroll) — jsdelivr

If any of these fail to load (offline, blocked CDN), the site degrades
gracefully: all content remains visible and readable, just without the
scroll animation and the cinematic opener (see the `no-gsap` fallback in
`app.js` / `style.css`).


FINAL POLISH: EN / KA / IT localization, Georgian typography, continuous audio architecture, refined editorial typography, and sound/language persistence added without changing the site information architecture.
