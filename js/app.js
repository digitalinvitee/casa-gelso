/* ============================================================
   CASA GELSO — DIGITAL CAMPAIGN
   app.js
   LANGUAGE:
   - Teaser / Opening / Digital Ad = ALWAYS ENGLISH
   - Invitation / RSVP = EN / KA / IT
============================================================ */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const hasGSAP = typeof gsap !== "undefined";

  /* Tracked here (rather than re-reading localStorage on every call)
     so renderSuccess() and any other non-language code can format
     text in whichever language is currently active. applyLanguage()
     below keeps this in sync. */
  let currentLang =
    localStorage.getItem("casa-gelso-language") || "en";

  if (hasGSAP && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  if (!hasGSAP) {
    document.documentElement.classList.add("no-gsap");
  }

  /* ============================================================
     BODY LOCK
  ============================================================ */

  const body = document.body;

  function lock(name) {
    body.classList.add(name);
  }

  function unlock(name) {
    body.classList.remove(name);
  }

  /* ============================================================
     LENIS
  ============================================================ */

  let lenis = null;

  if (
    !reduceMotion &&
    typeof Lenis !== "undefined" &&
    hasGSAP
  ) {
    lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 0.9
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }

  /* ============================================================
     OPENING SEQUENCE
     IMPORTANT:
     ALL OF THIS REMAINS ENGLISH.
  ============================================================ */

  const opener = document.querySelector("[data-opener]");

  function runOpener() {
    if (!opener) return;

    lock("is-locked");

    const titleCard = opener.querySelector("[data-title-card]");
    const titleMark = titleCard?.querySelector("img");
    const frames = Array.from(
      opener.querySelectorAll("[data-frame]")
    );
    const comingSoon = opener.querySelector("[data-coming-soon]");
    const comingSoonContent =
      comingSoon?.querySelector(".coming-soon-content");

    const hero = opener.querySelector("[data-reveal-hero]");
    const heroLockup = hero?.querySelector(".reveal-lockup");
    const heroRule = hero?.querySelector(".reveal-brand-rule");

    const heroText = hero
      ? hero.querySelectorAll(
          ".reveal-season, .reveal-manifesto, .reveal-year"
        )
      : [];

    const heroChrome = hero
      ? hero.querySelectorAll(
          ".reveal-chrome, .reveal-languages"
        )
      : [];

    const heroScroll = hero?.querySelector(".reveal-hero-scroll");
    const skipBtn = opener.querySelector("[data-skip-intro]");
    const openBtn = titleCard?.querySelector("[data-open-intro]");

    function finishOpener() {
      unlock("is-locked");

      if (skipBtn) {
        skipBtn.classList.remove("is-visible");
      }

      document.body.classList.add("opener-revealed");

      /* Not used to gate music anymore (see the FIX note by
         primeAudio() in the SOUND block for why) — kept in case
         something else on the page wants to know the teaser ended. */
      document.dispatchEvent(
        new CustomEvent("casa:opener-finished")
      );

      if (
        hasGSAP &&
        typeof ScrollTrigger !== "undefined"
      ) {
        ScrollTrigger.refresh();
      }
    }

    if (
      reduceMotion ||
      !hasGSAP ||
      !titleCard ||
      !hero ||
      !comingSoon
    ) {
      if (titleCard) titleCard.style.display = "none";

      const film = opener.querySelector("[data-film]");
      if (film) film.style.display = "none";

      comingSoon.style.display = "none";

      hero.style.opacity = "1";
      hero.style.visibility = "visible";

      hero
        .querySelectorAll(
          ".reveal-lockup, .reveal-brand-rule, .reveal-season, .reveal-manifesto, .reveal-year, .reveal-chrome, .reveal-languages, .reveal-hero-scroll"
        )
        .forEach((el) => {
          el.style.opacity = "1";
          el.style.transform = "none";
          el.style.visibility = "visible";
        });

      if (skipBtn) skipBtn.style.display = "none";

      finishOpener();
      return;
    }

    gsap.set(titleMark, {
      autoAlpha: 0,
      scale: 1.16,
      filter: "blur(16px)"
    });

    gsap.set(frames, {
      autoAlpha: 0,
      scale: 1.05
    });

    gsap.utils
      .toArray(".frame-title", opener)
      .forEach((title) => {
        gsap.set(title, {
          autoAlpha: 0,
          y: 14
        });
      });

    gsap.set(comingSoon, {
      autoAlpha: 0
    });

    gsap.set(comingSoonContent, {
      autoAlpha: 0,
      y: 10
    });

    gsap.set(hero, {
      autoAlpha: 0
    });

    gsap.set(heroLockup, {
      autoAlpha: 0,
      y: 28,
      scale: 0.96
    });

    gsap.set(heroRule, {
      scaleX: 0,
      transformOrigin: "left center"
    });

    gsap.set(heroText, {
      autoAlpha: 0,
      y: 16
    });

    gsap.set(heroChrome, {
      autoAlpha: 0,
      y: -6
    });

    gsap.set(heroScroll, {
      autoAlpha: 0,
      y: 10
    });

    let skipped = false;

    gsap.delayedCall(1, () => {
      if (!skipped && skipBtn) {
        skipBtn.classList.add("is-visible");
      }
    });

    /* ============================================================
       OPEN GATE

       Browsers refuse to play audio with sound unless playback is
       started by a real user gesture — no JS trick talks them out
       of that. Autoplaying the whole teaser (as this used to do)
       meant a visitor who never touched the page before the reveal
       never gave the music a gesture to hang off, so it silently
       stayed muted for the rest of the visit.

       Fix: the monogram fades in on its own (tlIntro, below, plays
       immediately), then an "Enter" prompt appears. The main
       timeline (tl) is created paused and stays that way until
       "Enter" — or "Skip intro" — is actually pressed, so pressing
       either one is itself the gesture — both handlers call
       primeAudio() (defined in the SOUND block further down)
       directly and synchronously, so the music starts playing for
       real right on that click (see the FIX note by primeAudio()
       for why it can't wait any longer than that).
    ============================================================ */

    const tl = gsap.timeline({
      defaults: {
        ease: "power3.out"
      },
      paused: true,
      onComplete: finishOpener
    });

    const tlIntro = gsap.timeline({
      defaults: {
        ease: "power3.out"
      }
    });

    tlIntro
      .to(titleMark, {
        autoAlpha: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.3,
        ease: "power2.out"
      })
      .call(() => {
        if (openBtn && !skipped) {
          openBtn.classList.add("is-visible");
        }
      });

    let introOpened = false;

    function openIntro() {
      if (introOpened || skipped) return;

      introOpened = true;

      /* Explicit + synchronous, right inside this click handler — see
         the FIX note above primeAudio()'s listeners in the SOUND
         block for why a generic pointerdown/touchstart listener
         alone isn't reliable here (it silently fails on touch). */
      primeAudio();

      if (openBtn) {
        openBtn.classList.remove("is-visible");
      }

      tl.play();
    }

    if (openBtn) {
      openBtn.addEventListener("click", openIntro);
    }

    if (skipBtn) {
      skipBtn.addEventListener("click", () => {
        if (skipped) return;

        skipped = true;

        primeAudio();

        tlIntro.kill();
        tl.kill();

        if (openBtn) {
          openBtn.classList.remove("is-visible");
        }

        titleCard.style.display = "none";

        const film = opener.querySelector("[data-film]");
        if (film) film.style.display = "none";

        comingSoon.style.display = "none";

        gsap.set(hero, {
          autoAlpha: 1
        });

        gsap.set(
          [
            heroLockup,
            heroRule,
            ...heroText,
            ...heroChrome,
            heroScroll
          ],
          {
            autoAlpha: 1,
            y: 0
          }
        );

        gsap.set(heroRule, {
          scaleX: 1
        });

        finishOpener();
      });
    }

    /* Beat 0 — the fade-IN happens above in tlIntro, before anyone
       has interacted with anything; this is only the fade-OUT, which
       plays once "Enter" (or "Skip intro") has actually been
       pressed. */

    tl.to(titleMark, {
      autoAlpha: 0,
      scale: 0.96,
      filter: "blur(6px)",
      duration: 0.55,
      ease: "power2.in"
    })
      .to(titleCard, {
        autoAlpha: 0,
        duration: 0.4
      }, "<");

    /* Beats 1–5 */

    frames.forEach((frame) => {
      const title = frame.querySelector(".frame-title");
      const img = frame.querySelector("img");

      tl.to(frame, {
        autoAlpha: 1,
        scale: 1,
        duration: 1,
        ease: "power2.out"
      }, "+=0.05")
        .to(img, {
          scale: 1.045,
          duration: 3,
          ease: "none"
        }, "<")
        .to(title, {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out"
        }, "<+0.35")
        .to({}, {
          duration: 1.35
        })
        .to(title, {
          autoAlpha: 0,
          y: -8,
          duration: 0.4,
          ease: "power2.in"
        })
        .to(frame, {
          autoAlpha: 0,
          duration: 0.65,
          ease: "power2.in"
        }, "<");
    });

    /* Coming Soon — ALWAYS ENGLISH */

    tl.set(comingSoon, {
      autoAlpha: 1
    })
      .set(comingSoon, {
        className: "coming-soon is-signal"
      })
      .to(comingSoonContent, {
        autoAlpha: 1,
        y: 0,
        duration: 0.28,
        ease: "power2.out"
      })
      .to({}, {
        duration: 1.15
      })
      .set(comingSoon, {
        className: "coming-soon is-clean"
      })
      .to({}, {
        duration: 1.8
      })
      .to(comingSoon, {
        autoAlpha: 0,
        duration: 0.7,
        ease: "power2.inOut"
      });

    /* Brand reveal */

    tl.to(hero, {
      autoAlpha: 1,
      duration: 0.85,
      ease: "power2.out"
    })
      .to(heroLockup, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 1.25,
        ease: "power4.out"
      }, "<+0.15")
      .to(heroRule, {
        scaleX: 1,
        duration: 0.65,
        ease: "power3.out"
      }, "-=0.65")
      .to(heroText, {
        autoAlpha: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: "power3.out"
      }, "-=0.35")
      .to(heroChrome, {
        autoAlpha: 1,
        y: 0,
        duration: 0.55,
        stagger: 0.06,
        ease: "power3.out"
      }, "-=0.55")
      .to(heroScroll, {
        autoAlpha: 0.65,
        y: 0,
        duration: 0.45
      }, "-=0.25");
  }

  runOpener();

  /* ============================================================
     SCROLL REVEALS
  ============================================================ */

  const hasScrollTrigger =
    hasGSAP &&
    typeof ScrollTrigger !== "undefined";

  if (hasGSAP) {
    if (reduceMotion || !hasScrollTrigger) {
      gsap.set(".reveal-up", {
        autoAlpha: 1,
        y: 0
      });

      gsap.set(".mask-in", {
        y: 0
      });

      gsap.set("[data-rule-draw]", {
        scaleX: 1
      });
    } else {
      gsap.utils.toArray(".reveal-up").forEach((el) => {
        gsap.to(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true
          },
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power4.out"
        });
      });

      gsap.utils.toArray(".mask-in").forEach((el, i) => {
        gsap.to(el, {
          scrollTrigger: {
            trigger: el.closest(".mask-lines"),
            start: "top 85%",
            once: true
          },
          y: 0,
          duration: 1.05,
          delay: i * 0.08,
          ease: "power4.out"
        });
      });

      gsap.utils.toArray("[data-rule-draw]").forEach((el) => {
        gsap.to(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            once: true
          },
          scaleX: 1,
          duration: 0.7,
          ease: "power3.out"
        });
      });
    }

    /* Digital Ad animation stays English */

    /* Three of the five curtains (a/c/e) wipe left→right and carry
       the monogram; the other two (b/d, marked .ad-curtain--vertical
       in the HTML) wipe bottom→top and carry the wordmark instead —
       see the .ad-curtain comment in style.css for why it's split
       across two elements (fill + mark). */
    gsap.utils
      .toArray("[data-parallax]")
      .forEach((fig, i) => {
        const img = fig.querySelector(":scope > img");
        const curtain = fig.querySelector(".ad-curtain");
        const fill = fig.querySelector(".ad-curtain-fill");
        const mark = fig.querySelector(
          ".ad-curtain-mark, .ad-curtain-word"
        );

        if (!img || !curtain || !fill) return;

        const vertical = curtain.classList.contains(
          "ad-curtain--vertical"
        );

        const fillTarget = vertical
          ? { scaleY: 0 }
          : { scaleX: 0 };

        if (reduceMotion || !hasScrollTrigger) {
          gsap.set(fill, fillTarget);

          if (mark) {
            gsap.set(mark, { autoAlpha: 0 });
          }

          return;
        }

        const revealTrigger = {
          trigger: fig,
          start: "top 80%",
          once: true
        };

        gsap.to(fill, {
          ...fillTarget,
          duration: 1.1,
          ease: "power4.inOut",
          scrollTrigger: revealTrigger
        });

        if (mark) {
          gsap.to(mark, {
            autoAlpha: 0,
            duration: 0.4,
            ease: "power2.in",
            scrollTrigger: revealTrigger
          });
        }

        gsap.to(img, {
          yPercent: i % 2 ? 7 : -7,
          scale: 1.02,
          ease: "none",
          scrollTrigger: {
            trigger: fig,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        });

        gsap.to(fig, {
          y: i % 2 ? 14 : -14,
          ease: "none",
          scrollTrigger: {
            trigger: fig,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        });
      });

    if (!reduceMotion && hasScrollTrigger) {
      gsap.to(".ad-marquee-track", {
        xPercent: -18,
        ease: "none",
        scrollTrigger: {
          trigger: ".ad-marquee",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2
        }
      });
    }

    /* NAV SCROLL SPY */

    if (hasScrollTrigger) {
      const navLinks =
        gsap.utils.toArray(".nav-links a");

      gsap.utils
        .toArray("main section[id]")
        .forEach((section) => {
          ScrollTrigger.create({
            trigger: section,
            start: "top 45%",
            end: "bottom 45%",

            onToggle: (self) => {
              if (self.isActive) {
                navLinks.forEach((a) => {
                  a.classList.toggle(
                    "active",
                    a.getAttribute("href") ===
                      "#" + section.id
                  );
                });
              }
            }
          });
        });

      if (document.fonts) {
        document.fonts.ready.then(() => {
          ScrollTrigger.refresh();
        });
      }
    }
  }

  /* ============================================================
     MOBILE MENU
  ============================================================ */

  const menuToggle =
    document.querySelector("[data-menu-toggle]");

  const mobileMenu =
    document.querySelector("[data-mobile-menu]");

  /* FIX: the mobile menu is a full-screen overlay stacked above
     the header (z-index), so the header's own "Menu" button is
     covered once it's open and can't be used to close it — there
     was previously no way out except tapping a nav link (which
     navigates away). Added a dedicated close (×) button rendered
     inside the overlay itself, plus Escape as a keyboard route. */
  const menuCloseBtn =
    document.querySelector("[data-menu-close]");

  if (menuToggle && mobileMenu) {
    function closeMobileMenu() {
      mobileMenu.classList.remove("is-open");

      menuToggle.setAttribute(
        "aria-expanded",
        "false"
      );

      mobileMenu.setAttribute(
        "aria-hidden",
        "true"
      );

      unlock("menu-open");
    }

    menuToggle.addEventListener("click", () => {
      const open =
        mobileMenu.classList.toggle("is-open");

      menuToggle.setAttribute(
        "aria-expanded",
        String(open)
      );

      mobileMenu.setAttribute(
        "aria-hidden",
        String(!open)
      );

      open
        ? lock("menu-open")
        : unlock("menu-open");
    });

    if (menuCloseBtn) {
      menuCloseBtn.addEventListener(
        "click",
        closeMobileMenu
      );
    }

    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        mobileMenu.classList.contains("is-open")
      ) {
        closeMobileMenu();
      }
    });

    mobileMenu
      .querySelectorAll("a")
      .forEach((a) => {
        a.addEventListener("click", closeMobileMenu);
      });
  }

  /* ============================================================
     EVENT DATA
  ============================================================ */

  const EVENT = {
    title: "Casa Gelso — Opening",
    details:
      "Casa Gelso opening in Tbilisi — accessible refinement, curated individuality, quiet confidence.",
    location: "Kostava St 67, Tbilisi, Georgia",
    startUTC: "2026-09-12T15:00:00Z",
    endUTC: "2026-09-12T18:00:00Z"
  };

  /* ============================================================
     CALENDAR
  ============================================================ */

  function fmtGCal(iso) {
    return iso
      .replace(/[-:]/g, "")
      .replace(".000Z", "Z");
  }

  function googleCalUrl() {
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: EVENT.title,
      dates:
        `${fmtGCal(EVENT.startUTC)}/` +
        `${fmtGCal(EVENT.endUTC)}`,
      details: EVENT.details,
      location: EVENT.location
    });

    return (
      "https://calendar.google.com/calendar/render?" +
      params.toString()
    );
  }

  const googleURL = googleCalUrl();

  document
    .querySelectorAll(
      "[data-cal-google], [data-cal-google-success]"
    )
    .forEach((a) => {
      a.href = googleURL;
    });

  /* ============================================================
     RSVP

     NOTE ON SUBMISSION: set RSVP_ENDPOINT below to a real
     form-handling URL before launch (a serverless function, a
     Formspree-style endpoint, whatever the backend ends up being).
     Until it's set, submissions are validated and shown a success
     state in the UI, but are only logged to the console — nothing
     is actually saved anywhere. That was already true before this
     rewrite (the old submitRSVP was a bare setTimeout); the
     difference now is it's explicit instead of silently pretending
     to work.
  ============================================================ */

  const RSVP_ENDPOINT = "https://script.google.com/macros/s/AKfycbxXpXlditvFs1H1dWB1iJyb_zy-y68-buSaxUceW5ZCiA-fp6GSuvZhTYiLFviBcEh_/exec";

  const rsvpForm =
    document.getElementById("rsvpForm");

  if (rsvpForm) {
    const statusEl =
      document.getElementById("rsvpFormStatus");

    const successEl =
      document.getElementById("rsvpSuccess");

    /* FIX: the live markup's submit button is .response-submit —
       .rsvp-submit belonged to an earlier RSVP layout that is no
       longer in the DOM. With the old selector this returned null
       and every submit crashed on submitBtn.classList.add(...),
       so the RSVP could never actually complete. */
    const submitBtn =
      rsvpForm.querySelector(".response-submit");

    const attendingOnlyFields =
      rsvpForm.querySelectorAll(
        "[data-attending-only]"
      );

    const attendingRadios =
      rsvpForm.querySelectorAll(
        'input[name="attending"]'
      );

    function setAttendingVisibility() {
      const selected =
        rsvpForm.querySelector(
          'input[name="attending"]:checked'
        );

      const attending =
        selected &&
        selected.value === "yes";

      attendingOnlyFields.forEach((field) => {
        field.hidden = !attending;
      });
    }

    attendingRadios.forEach((radio) => {
      radio.addEventListener(
        "change",
        setAttendingVisibility
      );
    });

    setAttendingVisibility();

    function fieldEl(name) {
      return rsvpForm.querySelector(
        `[name="${name}"]`
      );
    }

    function errorEl(name) {
      return rsvpForm.querySelector(
        `[data-error-for="${name}"]`
      );
    }

    function setError(name, message) {
      const err = errorEl(name);
      const input = fieldEl(name);

      /* FIX: the previous selector (".field, .field--fieldset")
         doesn't match anything in this markup — the real wrapper
         classes are .editorial-field / .editorial-choice — so
         has-error was silently never applied. */
      const wrap = input
        ? input.closest(
            ".editorial-field, .editorial-choice"
          )
        : null;

      if (err) {
        err.textContent = message;
        err.classList.toggle(
          "is-visible",
          !!message
        );
      }

      if (wrap) {
        wrap.classList.toggle(
          "has-error",
          !!message
        );
      }
    }

    /* FIX: this used to include "email" — there is no email field in
       this form. Scoped to the fields that actually exist. */
    ["name", "attending"].forEach(
      (name) => {
        rsvpForm
          .querySelectorAll(
            `[name="${name}"]`
          )
          .forEach((el) => {
            el.addEventListener(
              "input",
              () => setError(name, "")
            );

            el.addEventListener(
              "change",
              () => setError(name, "")
            );
          });
      }
    );

    /* FIX: this previously also validated a non-existent "email"
       field (always failing, since fieldEl("email") is null) and
       fell back to focusing ".pill-group" for a missing "attending"
       answer — a class that doesn't exist anywhere in this build.
       Net effect: whenever "attending" was the only missing field,
       firstInvalid stayed null/falsy, the submit handler's `if
       (firstInvalid)` guard never fired, and the form submitted
       successfully without the guest ever answering Yes/No. Fixed
       to validate only the fields that exist and to fall back to
       the real fieldset (.editorial-choice). */
    function validate(data) {
      let firstInvalid = null;

      const t =
        (translations[currentLang] ||
          translations.en).errors;

      setError("name", "");
      setError("attending", "");

      if (!data.name.trim()) {
        setError("name", t.name);

        firstInvalid =
          fieldEl("name");
      }

      if (!data.attending) {
        setError("attending", t.attending);

        firstInvalid =
          firstInvalid ||
          rsvpForm.querySelector(
            ".editorial-choice"
          );
      }

      return firstInvalid;
    }

    /* FIX: previously read guests/guestNames/dietary/email/message —
       none of which exist in this form — and never read "wish" at
       all, so the one field the "One last thing" step exists to
       collect was silently dropped on every submission. Also reads
       the honeypot field (see the hp-field markup) so the submit
       handler can silently drop bot submissions. */
    function readForm() {
      const fd =
        new FormData(rsvpForm);

      return {
        name: fd.get("name") || "",
        attending:
          fd.get("attending") || "",
        designers:
          fd.get("designers") || "",
        wish:
          fd.get("wish") || "",
        website:
          fd.get("website") || ""
      };
    }

    /* FIX: RSVP_ENDPOINT is now a Google Apps Script Web App /exec
       URL, and those don't behave like a normal JSON API endpoint:

       1. A Content-Type of "application/json" makes this a
          "non-simple" request, so the browser sends a CORS
          preflight (OPTIONS) first. Apps Script web apps don't
          implement doOptions(), so the preflight fails and the
          real POST is never even sent — the guest sees "Something
          went wrong" every time, with nothing reaching the Sheet.
          Sending as "text/plain" keeps this a simple request (no
          preflight); the Apps Script side reads the JSON back out
          of e.postData.contents.

       2. Even without a preflight, Apps Script's response doesn't
          carry an Access-Control-Allow-Origin header, so the
          browser still won't let this page read the response body
          or its status — res.ok would be false (or the promise
          would reject) even on a submission that saved correctly.
          mode: "no-cors" tells the browser we don't need to read
          the response, only that the request went out; the trade
          -off is we can no longer distinguish success from failure
          here, so a request that didn't throw is treated as sent. */
    function submitRSVP(data) {
      const payload = {
        name: data.name,
        attending: data.attending,
        designers: data.designers,
        wish: data.wish
      };

      if (!RSVP_ENDPOINT) {
        console.warn(
          "[Casa Gelso] RSVP_ENDPOINT is not set — this submission " +
            "was not sent anywhere. Set RSVP_ENDPOINT in app.js to a " +
            "real form-handling URL before launch.",
          payload
        );

        return new Promise((resolve) => {
          setTimeout(
            () => resolve({ ok: true }),
            600
          );
        });
      }

      return fetch(RSVP_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
      })
        .then(() => ({ ok: true }))
        .catch(() => ({ ok: false }));
    }

    function showFormMessage(message) {
      statusEl.textContent = message;

      statusEl.classList.toggle(
        "is-visible",
        !!message
      );
    }

    rsvpForm.addEventListener(
      "submit",
      (event) => {
        event.preventDefault();

        const data = readForm();

        /* Honeypot: a real visitor never sees or reaches this field
           (see .hp-field in the CSS), so a filled-in value means a
           bot filled the form. Show the normal success state — so
           the bot doesn't learn the submission was rejected and try
           to adapt — but never actually send it. */
        if (data.website) {
          renderSuccess({
            name: data.name,
            attending: "yes"
          });

          return;
        }

        const firstInvalid =
          validate(data);

        if (firstInvalid) {
          const t =
            (translations[currentLang] ||
              translations.en).errors;

          showFormMessage(t.checkFields);

          firstInvalid.focus({
            preventScroll: false
          });

          return;
        }

        showFormMessage("");

        submitBtn.classList.add(
          "is-loading"
        );

        submitBtn.disabled = true;

        submitRSVP(data)
          .then((response) => {
            if (!response.ok) {
              throw new Error("network");
            }

            renderSuccess(data);
          })
          .catch(() => {
            const t =
              (translations[currentLang] ||
                translations.en).errors;

            showFormMessage(t.network);
          })
          .finally(() => {
            submitBtn.classList.remove(
              "is-loading"
            );

            submitBtn.disabled = false;
          });
      }
    );

    /* FIX: these two strings were hardcoded English, so switching
       to KA/IT translated everything else in this success state
       except the two lines that actually confirm what happened.
       Now pulled from `translations` via the same `currentLang`
       the language switcher maintains (see the LANGUAGE SYSTEM
       block below). */
    function renderSuccess(data) {
      const attending =
        data.attending === "yes";

      const t =
        (translations[currentLang] ||
          translations.en).success;

      const firstName =
        data.name.split(" ")[0] || "";

      successEl.querySelector(
        "[data-success-eyebrow]"
      ).textContent = attending
        ? t.reservedEyebrow
        : t.declinedEyebrow;

      successEl.querySelector(
        "[data-success-note]"
      ).textContent = attending
        ? t.reservedNote.replace(
            "{name}",
            firstName || t.reservedNoteFallback
          )
        : t.declinedNote;

      rsvpForm.hidden = true;
      successEl.hidden = false;
      successEl.focus();
    }

    const againBtn =
      document.querySelector(
        "[data-rsvp-again]"
      );

    if (againBtn) {
      againBtn.addEventListener(
        "click",
        () => {
          rsvpForm.reset();

          setAttendingVisibility();

          ["name", "attending"]
            .forEach((name) =>
              setError(name, "")
            );

          showFormMessage("");

          successEl.hidden = true;
          rsvpForm.hidden = false;

          fieldEl("name").focus();
        }
      );
    }
  }

  /* ============================================================
     LANGUAGE SYSTEM

     IMPORTANT:
     We DO NOT translate:
     - teaser
     - frame titles
     - coming soon
     - digital ad
     - reveal hero

     We ONLY translate:
     - Invitation
     - RSVP
  ============================================================ */

  /* FIX: this object's keys used to be invite/rsvp/footer, but the
     markup's data-i18n attributes (added when the RSVP/wish/success
     markup was last reworked) expect invite/response/wish/success/
     footer. applyLanguage() below now walks [data-i18n] generically
     and looks values up by that dotted key path, so the two have to
     agree — restructured to match what the HTML actually asks for,
     and extended with the response/wish/success copy that never had
     a translated home before. */
  const translations = {
    en: {
      invite: {
        eyebrow: "Private opening · Tbilisi",
        title: "You are invited.",
        lede:
          "Join us for the opening of Casa Gelso — an evening dedicated to the pieces, and the people, that make style personal.",
        dateLabel: "Date",
        date: "12 September 2026",
        timeLabel: "Time",
        time: "19:00",
        placeLabel: "Place",
        place: "Kostava St 67, Tbilisi",
        placeTooltip: "Click to see location in Google Maps",
        calendar: "Add to calendar",
        calendarTooltip: "Click to save in calendar"
      },

      response: {
        subtitle: "Kindly confirm your attendance.",
        name: "Name & surname",
        attending: "Will you be joining us?",
        yes: "Yes, I'll be there",
        no: "I won't be able to make it",
        designers: "Top 3 designer / fashion house"
      },

      wish: {
        kicker: "One last thing",
        title: "What do you wish for Casa Gelso?",
        label: "Your wish for Casa Gelso",
        placeholder: "",
        send: "Submit"
      },

      success: {
        title: "See you at Casa Gelso.",
        again: "Submit another response",
        reservedEyebrow: "Your place is reserved",
        reservedNote:
          "We look forward to welcoming you on the evening, {name}.",
        reservedNoteFallback: "there",
        declinedEyebrow: "Thank you for letting us know",
        declinedNote:
          "We'll miss you at the opening — we hope to see you at Casa Gelso soon."
      },

      errors: {
        name: "Please tell us your name.",
        attending: "Please let us know if you'll attend.",
        checkFields: "Please check the highlighted fields below.",
        network:
          "Something went wrong sending your RSVP. Please try again."
      },

      footer: {
        credit: "Designed & built with care.",
        back: "Back to top ↑"
      }
    },

    ka: {
      invite: {
        eyebrow: "კერძო გახსნა · თბილისი",
        title: "თქვენ მოწვეული ხართ.",
        lede:
          "შემოგვიერთდით Casa Gelso-ს გახსნაზე — საღამო, რომელიც ეძღვნება ნივთებსა და ადამიანებს, რომლებიც სტილს პირად ისტორიად აქცევენ.",
        dateLabel: "თარიღი",
        date: "12 სექტემბერი 2026",
        timeLabel: "დრო",
        time: "19:00",
        placeLabel: "ადგილი",
        place: "კოსტავას ქუჩა 67, თბილისი",
        placeTooltip: "დააჭირეთ Google Maps-ზე სანახავად",
        calendar: "კალენდარში დამატება",
        calendarTooltip: "დააჭირეთ კალენდარში დასამატებლად"
      },

      response: {
        subtitle: "გთხოვთ, დაადასტუროთ თქვენი დასწრება.",
        name: "სახელი და გვარი",
        attending: "დაესწრებით ღონისძიებას?",
        yes: "დიახ, მოვალ",
        no: "ვერ მოვალ",
        designers: "საყვარელი 3 დიზაინერი / მოდის სახლი"
      },

      wish: {
        kicker: "ბოლო რამ",
        title: "რას უსურვებდით Casa Gelso-ს?",
        label: "თქვენი სურვილი Casa Gelso-სთვის",
        placeholder: "",
        send: "გაგზავნა"
      },

      success: {
        title: "გელოდებით Casa Gelso-ში.",
        again: "სხვა პასუხის გაგზავნა",
        reservedEyebrow: "თქვენი ადგილი დაჯავშნილია",
        reservedNote:
          "მოუთმენლად ველით თქვენს სტუმრობას საღამოს, {name}.",
        reservedNoteFallback: "თქვენ",
        declinedEyebrow: "მადლობა შეტყობინებისთვის",
        declinedNote:
          "დაგვენატრებით გახსნაზე — იმედი გვაქვს, მალე ვნახავთ Casa Gelso-ში."
      },

      errors: {
        name: "გთხოვთ, მიუთითოთ თქვენი სახელი.",
        attending: "გთხოვთ, გვაცნობოთ დაესწრებით თუ არა.",
        checkFields: "გთხოვთ, შეამოწმოთ მონიშნული ველები.",
        network:
          "დაფიქსირდა შეცდომა RSVP-ის გაგზავნისას. გთხოვთ, სცადოთ ხელახლა."
      },

      footer: {
        credit: "შექმნილია სიყვარულით.",
        back: "თავში დაბრუნება ↑"
      }
    },

    it: {
      invite: {
        eyebrow: "Apertura privata · Tbilisi",
        title: "Sei invitato.",
        lede:
          "Unisciti a noi per l'apertura di Casa Gelso — una serata dedicata ai pezzi e alle persone che rendono lo stile personale.",
        dateLabel: "Data",
        date: "12 settembre 2026",
        timeLabel: "Ora",
        time: "19:00",
        placeLabel: "Luogo",
        place: "Via Kostava 67, Tbilisi",
        placeTooltip: "Clicca per vedere la posizione su Google Maps",
        calendar: "Aggiungi al calendario",
        calendarTooltip: "Clicca per salvare nel calendario"
      },

      response: {
        subtitle: "Vi preghiamo di confermare la vostra presenza.",
        name: "Nome e cognome",
        attending: "Sarai con noi?",
        yes: "Sì, ci sarò",
        no: "Non posso venire",
        designers: "Le tue 3 maison preferite"
      },

      wish: {
        kicker: "Un'ultima cosa",
        title: "Cosa auguri a Casa Gelso?",
        label: "Il tuo augurio per Casa Gelso",
        placeholder: "",
        send: "Invia"
      },

      success: {
        title: "Ti aspettiamo da Casa Gelso.",
        again: "Invia un'altra risposta",
        reservedEyebrow: "Il tuo posto è riservato",
        reservedNote:
          "Non vediamo l'ora di accoglierti la sera dell'evento, {name}.",
        reservedNoteFallback: "tu",
        declinedEyebrow: "Grazie per avercelo fatto sapere",
        declinedNote:
          "Ci mancherai all'apertura — speriamo di vederti presto da Casa Gelso."
      },

      errors: {
        name: "Indicaci il tuo nome, per favore.",
        attending: "Facci sapere se parteciperai, per favore.",
        checkFields: "Controlla i campi evidenziati qui sotto.",
        network:
          "Si è verificato un problema nell'invio dell'RSVP. Riprova."
      },

      footer: {
        credit: "Realizzato con cura.",
        back: "Torna in cima ↑"
      }
    }
  };

  /* ============================================================
     LANGUAGE HELPERS
  ============================================================ */

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

  /* Reads a dotted path ("response.attending") out of a translation
     object — the same shape as the data-i18n attribute values in
     the HTML, so a key always means exactly one thing in both
     places. */
  function lookup(t, path) {
    return path
      .split(".")
      .reduce(
        (node, key) =>
          node && node[key] !== undefined
            ? node[key]
            : undefined,
        t
      );
  }

  /* ============================================================
     APPLY LANGUAGE

     ONLY INVITATION + RSVP ARE MODIFIED — teaser, opening sequence
     and digital ad carry no data-i18n attributes at all, so this
     walker never touches them; that's what keeps them English by
     construction rather than by convention.

     FIX: this function used to hand-wire ~25 individual selectors
     (#rsvp-heading, .pill span, .rsvp-submit, #rsvpEmail,
     .invite-quote, .invite-calendar span, [data-open-invite]...) —
     none of which exist in the current markup, which was reworked
     to use a generic data-i18n="response.attending"-style contract
     instead. The old function silently updated nothing for most of
     the RSVP form because every selector it queried returned null.
     Replaced with a generic walker over [data-i18n] /
     [data-i18n-placeholder] so every translatable element in the
     HTML is covered automatically, and adding a new one later never
     needs a matching line here.
  ============================================================ */

  function applyLanguage(lang) {
    const t =
      translations[lang] ||
      translations.en;

    currentLang = translations[lang]
      ? lang
      : "en";

    document.documentElement.lang =
      lang === "ka"
        ? "ka"
        : lang === "it"
        ? "it"
        : "en";

    document.body.classList.toggle(
      "lang-ka",
      lang === "ka"
    );

    localStorage.setItem(
      "casa-gelso-language",
      lang
    );

    /* language buttons */

    $$("[data-lang]").forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(
          button.dataset.lang === lang
        )
      );
    });

    $$("[data-i18n]").forEach((el) => {
      const value = lookup(
        t,
        el.dataset.i18n
      );

      if (value !== undefined) {
        el.textContent = value;
      }
    });

    $$("[data-i18n-placeholder]").forEach(
      (el) => {
        const value = lookup(
          t,
          el.dataset.i18nPlaceholder
        );

        if (value !== undefined) {
          el.placeholder = value;
        }
      }
    );

    /* Same pattern as data-i18n-placeholder above, but for the
       CSS tooltip on the invite CTAs (see [data-tooltip] in
       style.css) — data-tooltip is what the tooltip actually
       reads from, so it's what gets updated on language switch. */
    $$("[data-i18n-tooltip]").forEach(
      (el) => {
        const value = lookup(
          t,
          el.dataset.i18nTooltip
        );

        if (value !== undefined) {
          el.dataset.tooltip = value;
        }
      }
    );
  }

  /* ============================================================
     LANGUAGE BUTTONS
  ============================================================ */

  $$("[data-lang]").forEach((button) => {
    button.addEventListener(
      "click",
      () => {
        applyLanguage(
          button.dataset.lang
        );
      }
    );
  });

  applyLanguage(
    localStorage.getItem(
      "casa-gelso-language"
    ) || "en"
  );

  /* ============================================================
     SOUND
  ============================================================ */

  const audio =
    $("#casaGelsoAudio");

  const soundButtons =
    $$("[data-sound-toggle]");

  let audioAvailable = false;

  if (audio) {
    audio.addEventListener(
      "canplay",
      () => {
        audioAvailable = true;

        soundButtons.forEach((button) =>
          button.classList.remove(
            "is-unavailable"
          )
        );
      }
    );

    audio.addEventListener(
      "error",
      () => {
        audioAvailable = false;

        soundButtons.forEach((button) =>
          button.classList.add(
            "is-unavailable"
          )
        );
      }
    );

    audio.volume = 0.42;
  }

  function syncSoundUI() {
    const on =
      !!audio &&
      !audio.paused &&
      !audio.muted;

    const lang =
      document.documentElement.lang;

    const soundText =
      lang === "ka"
        ? {
            on: "ხმა ჩართულია",
            off: "ხმა გამორთულია"
          }
        : lang === "it"
        ? {
            on: "AUDIO ON",
            off: "AUDIO OFF"
          }
        : {
            on: "SOUND ON",
            off: "SOUND OFF"
          };

    soundButtons.forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(on)
      );

      button.setAttribute(
        "aria-label",
        on
          ? soundText.on
          : soundText.off
      );

      const label =
        $(".sound-label", button);

      if (label) {
        label.textContent =
          on
            ? soundText.on
            : soundText.off;
      }
    });
  }

  async function startSound() {
    if (!audio || !audioAvailable)
      return;

    audio.muted = false;

    try {
      await audio.play();
    } catch (_) {
      audio.muted = true;
    }
  }

  soundButtons.forEach((button) => {
    button.addEventListener(
      "click",
      async () => {
        if (
          !audio ||
          !audioAvailable
        ) {
          return;
        }

        if (
          audio.paused ||
          audio.muted
        ) {
          await startSound();
        } else {
          audio.pause();
        }

        syncSoundUI();
      }
    );
  });

  /* FIX: an earlier version of this tried to have music wait for the
     teaser to finish while still only needing one early gesture: it
     called play()-then-immediately-pause() on the very first click
     to "unlock" the element, then, many seconds later once the
     teaser's animation actually completed, called play() again for
     real via the casa:opener-finished event. That second call is no
     longer a direct, synchronous consequence of the original
     gesture — a GSAP timeline runs across dozens of animation-frame
     callbacks in between — and real-world testing on a phone showed
     the browser silently refusing it every time, even though the
     exact same click DID successfully start the music when it
     skipped straight to the end ("Skip intro"; that handler calls
     finishOpener() synchronously, so its play() call never left the
     gesture's call stack).

     Fix: don't defer the real play() at all. "Enter" and "Skip
     intro" (see the OPEN GATE block in runOpener()) both call
     primeAudio() directly and synchronously from their own click
     handlers, and this now starts playback for real, immediately —
     no cosmetic wait for the brand reveal, because that wait is
     exactly what broke it. */
  let audioUnlocked = false;

  function primeAudio() {
    if (!audio || audioUnlocked) return;

    audioUnlocked = true;
    audio.muted = false;

    audio
      .play()
      .then(syncSoundUI)
      .catch(() => {
        /* Autoplay refused even with a gesture (rare) — leave
           muted; the manual sound-toggle buttons still work. */
        audio.muted = true;
      });
  }

  /* FIX: per the WHATWG spec's "activation triggering input event"
     list, pointerdown only counts as a real user gesture when
     pointerType is "mouse", and touchstart doesn't count at all. So
     on a phone, the very first tap on "Enter" fired touchstart (and
     a non-"mouse" pointerdown) here, primeAudio()'s audio.play() ran
     without a gesture the browser actually recognised, the promise
     was rejected, and the .catch below permanently muted the
     element — audioUnlocked was already true, so nothing ever
     retried. "Enter" and "Skip intro" now call primeAudio() directly
     from their own click handlers (see runOpener() above), which is
     always valid; these listeners are just a fallback for any other
     first interaction. click/keydown are both valid on every input
     type, unlike pointerdown/touchstart. */
  [
    "click",
    "keydown"
  ].forEach((eventName) => {
    window.addEventListener(
      eventName,
      primeAudio,
      {
        once: true,
        passive: true
      }
    );
  });

  document.addEventListener(
    "visibilitychange",
    () => {
      if (
        document.hidden &&
        audio &&
        !audio.paused
      ) {
        audio.pause();
      }
    }
  );

  if (audio) {
    audio.addEventListener(
      "play",
      syncSoundUI
    );

    audio.addEventListener(
      "pause",
      syncSoundUI
    );
  }

})();