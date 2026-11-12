# Casa Gelso

Campaign site for the Casa Gelso opening in Tbilisi on 12 September 2026,
made by [INVITÉ](https://invitee.ge/).

Plain HTML, CSS and JavaScript. There is no build step, so the folder
deploys to GitHub Pages as it is.

## Run it locally

```
python3 -m http.server 8000
```

Then open http://localhost:8000.

## How the page works

1. **Opening film.** The monogram appears with an Enter button. Enter starts
   the music and the film: five illustrated frames, the 12.09 Coming Soon
   card, then the brand reveal. Skip intro (or Esc) goes straight to the
   brand reveal. Visitors who ask their device for reduced motion get the
   brand reveal without the film.
2. **Digital Ad.** Five chapters of campaign photography and copy, the
   brand marquee and a link to the invitation.
3. **Invitation and RSVP.** Date, time, place (Google Maps), calendar links
   and the RSVP form.

## Music

Browsers only play sound after the visitor taps, clicks or presses a key.
The soundtrack starts with the first of these: Enter, Skip intro, or any
interaction on the page when the film was not shown. It pauses when the tab
or app goes to the background and resumes on return. If the visitor turns
the sound off, it stays off until they turn it on again.

## Files

```
index.html                    page markup and event data for search engines
css/style.css                 all styles
js/app.js                     film, scrolling, menu, music, languages, RSVP
js/vendor/                    GSAP 3.13.0, ScrollTrigger 3.13.0, Lenis 1.3.27
assets/fonts/                 Fraunces, DM Sans, Noto Serif and Noto Sans Georgian
assets/img/                   the images the page uses (made by the tool below)
assets/teaser, reveal, logo   original files, kept as masters
assets/audio/mp3.mp3          soundtrack
assets/casa-gelso-opening.ics calendar file for Apple Calendar and Outlook
tools/build-images.py         rebuilds assets/img from the masters
```

## Languages

English, Georgian and Italian. Navigation, menus, buttons, the footer and
the whole Invitation and RSVP section change with the language. The
campaign text (film captions, brand reveal, Digital Ad) stays in English,
as in the original project.

All texts are in the `translations` object at the top of `js/app.js`. The
chosen language is remembered for the next visit.

## RSVP

The form sends this to the Google Apps Script address in `RSVP_ENDPOINT`
(`js/app.js`):

```json
{ "name": "...", "attending": "yes", "designers": "...", "wish": "..." }
```

`attending` is `yes` or `no`. Name and attendance are required. A hidden
field catches spam bots, and a second click while sending is ignored.

## Changing the date or time

The date and time are written in four places:

- `EVENT` in `js/app.js`, in UTC (17:00 in Tbilisi is 13:00 UTC)
- the `date` and `time` texts for each language in `translations`
- `assets/casa-gelso-opening.ics`
- the event data block (`application/ld+json`) in `index.html`

## Changing photos

The page never loads the original camera files, some of which are 15 MB.
After replacing or adding a photo, rebuild the web versions:

```
pip install "pillow>=11.3"
python3 tools/build-images.py
```

Each Digital Ad photo has its own frame shape and focal point (`--ratio`
and `--focus` in `css/style.css`). Check the crop on a laptop and a phone
after swapping one.

## If something fails to load

- Without JavaScript, the page shows the brand reveal and all content.
- If the scripts never arrive, the page unlocks itself after 9 seconds.
- On a slow connection the film waits up to 4 seconds for a frame that has
  not loaded yet.

## Licences

GSAP: https://gsap.com/standard-license. Lenis: MIT. Fraunces, DM Sans and
Noto Georgian: SIL Open Font License.

## Earlier version

The site before this update is commit `3a66bfd`.
