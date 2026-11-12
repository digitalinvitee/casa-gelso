# Casa Gelso — Digital Campaign

Campaign site for the Casa Gelso opening in Tbilisi on 12 September 2026.
A digital experience by [INVITÉ](https://invitee.ge/).

Static HTML, CSS and JavaScript. No build step, no framework; it deploys to
GitHub Pages as-is.

## Running it

```
python3 -m http.server 8000
```

then open `http://localhost:8000`. (Opening `index.html` straight from disk
also works, but the RSVP request and font loading behave more like
production through a local server.)

## The experience

1. **Opening film** — monogram title card; *Enter* starts the soundtrack and
   five illustrated campaign frames, a `12.09 / Coming Soon` signal beat,
   then the brand reveal. *Skip intro* (or Esc) jumps straight to the
   reveal. The intro is skipped automatically for visitors who prefer
   reduced motion, and on a reload in the same tab.
2. **Digital Ad** — five editorial chapters pairing campaign photography
   with copy, the house marquee, and a link on to the invitation.
3. **Invitation & RSVP** — the invitation card with date, time, place
   (Google Maps) and calendar links, beside the RSVP form.

## Structure

```
index.html                    markup, structured data, boot failsafe
css/style.css                 design system: tokens, type, every section, responsive, motion
js/app.js                     opener, scroll reveals, navigation, i18n, RSVP, sound
js/vendor/                    GSAP 3.13.0, ScrollTrigger 3.13.0, Lenis 1.3.27 (pinned, self-hosted)
assets/fonts/                 Fraunces, DM Sans, Noto Serif/Sans Georgian (woff2, self-hosted)
assets/img/                   optimised images the page serves (generated — see below)
assets/teaser/ reveal/ logo/  original masters (not served, except teaser JPEG fallbacks)
assets/audio/mp3.mp3          soundtrack (loads only when sound starts)
assets/casa-gelso-opening.ics calendar file for Apple Calendar / Outlook
tools/build-images.py         regenerates assets/img from the masters
```

## Languages

English, Georgian and Italian. The interface (navigation, menu, opener
controls, buttons, footer) and the whole Invitation & RSVP section are
translated. The campaign itself — film captions, brand reveal and the
Digital Ad copy — stays in English in every language by design; those blocks
carry `lang="en"` so screen readers pronounce them correctly.

All strings live in the `translations` object at the top of `js/app.js`.
Elements opt in with `data-i18n` (text), `data-i18n-placeholder`,
`data-i18n-tooltip` and `data-i18n-aria` (aria-label). The chosen language
is remembered in `localStorage` and applied before first paint.

## RSVP

The form posts to the existing Google Apps Script endpoint (`RSVP_ENDPOINT`
in `js/app.js`) as `text/plain` JSON:

```json
{ "name": "…", "attending": "yes" | "no", "designers": "…", "wish": "…" }
```

Name and attendance are required. Validation messages, loading and error
states are translated; a honeypot field silently drops bots; a second submit
while one is in flight is ignored. The request uses `no-cors`, so the page
can detect network failures but cannot read the script's response.

## Event details

The date and time appear in four places. Change them together:

- `EVENT` in `js/app.js` (Google Calendar link; times in UTC — 17:00 in
  Tbilisi is 13:00 UTC)
- the `time` / `date` strings in each language in `translations`
- `assets/casa-gelso-opening.ics`
- the `application/ld+json` block in `index.html`

## Images

Photographs are never served from the masters (some are 60-megapixel camera
files of up to 15 MB). `tools/build-images.py` produces AVIF and WebP at
several widths plus a JPEG fallback, applying EXIF rotation. After replacing
or adding a photo:

```
pip install "pillow>=11.3"
python3 tools/build-images.py
```

If you add a width in the script, add the matching `srcset` entry in
`index.html`. Each Digital Ad photo has its own frame ratio and focal point
(`--ratio` / `--focus` per chapter in `css/style.css`), chosen for that
image; check the crop on desktop and phone when swapping one.

## Resilience

- **No JavaScript**: the brand reveal and all content render, scrollable.
- **Scripts blocked or very slow**: a failsafe in `<head>` unlocks the page
  and resolves the opener after 9 seconds.
- **Slow connections**: the film waits (up to 4 s per frame) for an image
  that has not arrived instead of cutting to an empty frame; below-the-fold
  photos load lazily; the italic display face loads only as the invitation
  approaches.
- **Reduced motion**: no intro, no parallax or marquee; everything visible.

## Licences

GSAP is distributed under its standard licence
(<https://gsap.com/standard-license>); Lenis is MIT. Fraunces, DM Sans and
the Noto Georgian families are under the SIL Open Font License.

## History

The version before the 2026 UI/UX and performance upgrade is commit
`3a66bfd` ("Replace Casa Gelso with updated version").
