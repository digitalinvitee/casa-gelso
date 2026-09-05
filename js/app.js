/* ============================================================
   CASA GELSO — DIGITAL CAMPAIGN
   app.js

   LANGUAGE:
   - Teaser / Opening / Digital Ad = ALWAYS ENGLISH
   - Invitation / RSVP = EN / KA / IT
============================================================ */

(function () {
  "use strict";

  /* Tells the boot failsafe in index.html's <head> that app.js made
     it here, so the failsafe stands down. Set on the very first line
     — everything below can fail and the page still won't be left
     scroll-locked. */
  window.__casaAppReady = true;

  /* ============================================================
     MOTION / GSAP
  ============================================================ */

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const hasGSAP = typeof gsap !== "undefined";

  /* ============================================================
     SAFE STORAGE
  ============================================================ */

  function safeStorageGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (_) {
      return null;
    }
  }

  function safeStorageSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (_) {
      /* Storage is non-critical. */
    }
  }

  let currentLang =
    safeStorageGet("casa-gelso-language") || "en";

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

    if (typeof ScrollTrigger !== "undefined") {
      lenis.on("scroll", ScrollTrigger.update);
    }

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }

  /* ============================================================
     OPENING SEQUENCE
     ALWAYS ENGLISH
  ============================================================ */

  const opener = document.querySelector("[data-opener]");

  function runOpener() {
    if (!opener) return;

    /* If app.js arrived so late that the boot failsafe in index.html
       already gave up and resolved the page to the brand reveal, don't
       re-lock the body and replay the intro underneath the visitor —
       leave the resolved state alone. (Only the failsafe can have set
       this class before runOpener has ever run.) */
    if (
      document.body.classList.contains(
        "opener-revealed"
      )
    ) {
      return;
    }

    lock("is-locked");

    const titleCard =
      opener.querySelector("[data-title-card]");

    const titleMark =
      titleCard?.querySelector("img");

    const frames = Array.from(
      opener.querySelectorAll("[data-frame]")
    );

    const comingSoon =
      opener.querySelector("[data-coming-soon]");

    const comingSoonContent =
      comingSoon?.querySelector(".coming-soon-content");

    const hero =
      opener.querySelector("[data-reveal-hero]");

    const heroLockup =
      hero?.querySelector(".reveal-lockup");

    const heroRule =
      hero?.querySelector(".reveal-brand-rule");

    const heroText = hero
      ? hero.querySelectorAll(
          ".reveal-season, .reveal-manifesto, .reveal-year"
        )
      : [];

    const heroChrome = hero
      ? hero.querySelectorAll(
          ".reveal-languages"
        )
      : [];

    const heroScroll =
      hero?.querySelector(".reveal-hero-scroll");

    /* .reveal-hero-scroll isn't in the current markup, and
       .coming-soon-content is only there if the coming-soon block is.
       gsap.set(null, ...) doesn't throw, but it does log a "target not
       found" warning on every load — and a null inside a target array
       makes GSAP warn per tween. Filtered once, here. */
    function targets() {
      return Array.prototype.slice
        .call(arguments)
        .reduce(function (list, item) {
          if (!item) return list;

          if (typeof item.length === "number" && !item.nodeType) {
            return list.concat(Array.prototype.slice.call(item));
          }

          return list.concat(item);
        }, []);
    }

    const skipBtn =
      opener.querySelector("[data-skip-intro]");

    const openBtn =
      titleCard?.querySelector("[data-open-intro]");

    function finishOpener() {
      unlock("is-locked");

      if (skipBtn) {
        skipBtn.classList.remove("is-visible");
      }

      document.body.classList.add("opener-revealed");

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

    /* Reduced motion / fallback */

    if (
      reduceMotion ||
      !hasGSAP ||
      !titleCard ||
      !hero ||
      !comingSoon
    ) {
      if (titleCard) {
        titleCard.style.display = "none";
      }

      const film =
        opener.querySelector("[data-film]");

      if (film) {
        film.style.display = "none";
      }

      if (comingSoon) {
        comingSoon.style.display = "none";
      }

      if (hero) {
        hero.style.opacity = "1";
        hero.style.visibility = "visible";
      }

      if (hero) {
        hero
          .querySelectorAll(
            ".reveal-lockup, .reveal-brand-rule, .reveal-season, .reveal-manifesto, .reveal-year, .reveal-languages, .reveal-hero-scroll"
          )
          .forEach((el) => {
            el.style.opacity = "1";
            el.style.transform = "none";
            el.style.visibility = "visible";
          });
      }

      if (skipBtn) {
        skipBtn.style.display = "none";
      }

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

    if (comingSoonContent) {
      gsap.set(comingSoonContent, {
        autoAlpha: 0,
        y: 10
      });
    }

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

    if (heroScroll) {
      gsap.set(heroScroll, {
        autoAlpha: 0,
        y: 10
      });
    }

    let skipped = false;

    gsap.delayedCall(1, () => {
      if (!skipped && skipBtn) {
        skipBtn.classList.add("is-visible");
      }
    });

    /* ============================================================
       OPEN GATE
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

      primeAudio();

      if (openBtn) {
        openBtn.classList.remove("is-visible");
      }

      tl.play();
    }

    if (openBtn) {
      openBtn.addEventListener(
        "click",
        openIntro
      );
    }

    if (skipBtn) {
      skipBtn.addEventListener(
        "click",
        () => {
          if (skipped) return;

          skipped = true;

          primeAudio();

          tlIntro.kill();
          tl.kill();

          if (openBtn) {
            openBtn.classList.remove(
              "is-visible"
            );
          }

          titleCard.style.display = "none";

          const film =
            opener.querySelector("[data-film]");

          if (film) {
            film.style.display = "none";
          }

          comingSoon.style.display = "none";

          gsap.set(hero, {
            autoAlpha: 1
          });

          gsap.set(
            targets(
              heroLockup,
              heroRule,
              heroText,
              heroChrome,
              heroScroll
            ),
            {
              autoAlpha: 1,
              y: 0
            }
          );

          gsap.set(heroRule, {
            scaleX: 1
          });

          finishOpener();
        }
      );
    }

    /* ============================================================
       TITLE CARD
    ============================================================ */

    tl
      .to(titleMark, {
        autoAlpha: 0,
        scale: 0.96,
        filter: "blur(6px)",
        duration: 0.55,
        ease: "power2.in"
      })
      .to(
        titleCard,
        {
          autoAlpha: 0,
          duration: 0.4
        },
        "<"
      );

    /* ============================================================
       FRAMES
    ============================================================ */

    frames.forEach((frame) => {
      const title =
        frame.querySelector(".frame-title");

      const img =
        frame.querySelector("img");

      tl
        .to(
          frame,
          {
            autoAlpha: 1,
            scale: 1,
            duration: 1,
            ease: "power2.out"
          },
          "+=0.05"
        )
        .to(
          img,
          {
            scale: 1.045,
            duration: 3,
            ease: "none"
          },
          "<"
        )
        .to(
          title,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out"
          },
          "<+0.35"
        )
        .to(
          {},
          {
            duration: 1.35
          }
        )
        .to(
          title,
          {
            autoAlpha: 0,
            y: -8,
            duration: 0.4,
            ease: "power2.in"
          }
        )
        .to(
          frame,
          {
            autoAlpha: 0,
            duration: 0.65,
            ease: "power2.in"
          },
          "<"
        );
    });

    /* ============================================================
       COMING SOON
       ALWAYS ENGLISH
    ============================================================ */

    tl
      .set(comingSoon, {
        autoAlpha: 1
      })
      .set(comingSoon, {
        className: "coming-soon is-signal"
      })
      .to(
        comingSoonContent || {},
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.28,
          ease: "power2.out"
        }
      )
      .to(
        {},
        {
          duration: 1.15
        }
      )
      .set(comingSoon, {
        className: "coming-soon is-clean"
      })
      .to(
        {},
        {
          duration: 1.8
        }
      )
      .to(
        comingSoon,
        {
          autoAlpha: 0,
          duration: 0.7,
          ease: "power2.inOut"
        }
      );

    /* ============================================================
       BRAND REVEAL
    ============================================================ */

    tl
      .to(
        hero,
        {
          autoAlpha: 1,
          duration: 0.85,
          ease: "power2.out"
        }
      )
      .to(
        heroLockup,
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 1.25,
          ease: "power4.out"
        },
        "<+0.15"
      )
      .to(
        heroRule,
        {
          scaleX: 1,
          duration: 0.65,
          ease: "power3.out"
        },
        "-=0.65"
      )
      .to(
        heroText,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: "power3.out"
        },
        "-=0.35"
      )
      .to(
        heroChrome,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.06,
          ease: "power3.out"
        },
        "-=0.55"
      )
      .to(
        heroScroll || {},
        {
          autoAlpha: 0.65,
          y: 0,
          duration: 0.45
        },
        "-=0.25"
      );
  }

  /* ============================================================
     OPENER SAFETY NET
  ============================================================ */

  try {
    runOpener();
  } catch (err) {
    if (window.console) {
      console.error(
        "[Casa Gelso] Opener failed — recovering:",
        err
      );
    }

    unlock("is-locked");

    document.body.classList.add(
      "opener-revealed"
    );

    if (opener) {
      opener.style.display = "none";
    }
  }

  /* ============================================================
     SCROLL REVEALS
  ============================================================ */

  const hasScrollTrigger =
    hasGSAP &&
    typeof ScrollTrigger !== "undefined";

  try {
    if (hasGSAP) {
      if (
        reduceMotion ||
        !hasScrollTrigger
      ) {
        gsap.set(".reveal-up", {
          autoAlpha: 1,
          y: 0
        });

        gsap.set(".mask-in", {
          y: 0
        });

        gsap.set(
          "[data-rule-draw]",
          {
            scaleX: 1
          }
        );
      } else {
        gsap.utils
          .toArray(".reveal-up")
          .forEach((el) => {
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

        gsap.utils
          .toArray(".mask-in")
          .forEach((el, i) => {
            gsap.to(el, {
              scrollTrigger: {
                trigger:
                  el.closest(".mask-lines"),
                start: "top 85%",
                once: true
              },
              y: 0,
              duration: 1.05,
              delay: i * 0.08,
              ease: "power4.out"
            });
          });

        gsap.utils
          .toArray("[data-rule-draw]")
          .forEach((el) => {
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

      /* ============================================================
         DIGITAL AD
         ALWAYS ENGLISH
      ============================================================ */

      gsap.utils
        .toArray("[data-parallax]")
        .forEach((fig, i) => {
          const img =
            fig.querySelector(":scope > img");

          const curtain =
            fig.querySelector(".ad-curtain");

          const fill =
            fig.querySelector(
              ".ad-curtain-fill"
            );

          const mark =
            fig.querySelector(
              ".ad-curtain-mark, .ad-curtain-word"
            );

          if (
            !img ||
            !curtain ||
            !fill
          ) {
            return;
          }

          const vertical =
            curtain.classList.contains(
              "ad-curtain--vertical"
            );

          const fillTarget = vertical
            ? { scaleY: 0 }
            : { scaleX: 0 };

          if (
            reduceMotion ||
            !hasScrollTrigger
          ) {
            gsap.set(
              fill,
              fillTarget
            );

            if (mark) {
              gsap.set(mark, {
                autoAlpha: 0
              });
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
            scrollTrigger:
              revealTrigger
          });

          if (mark) {
            gsap.to(mark, {
              autoAlpha: 0,
              duration: 0.4,
              ease: "power2.in",
              scrollTrigger:
                revealTrigger
            });
          }

          gsap.to(img, {
            yPercent: i % 2
              ? 7
              : -7,
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
            y: i % 2
              ? 14
              : -14,
            ease: "none",
            scrollTrigger: {
              trigger: fig,
              start: "top bottom",
              end: "bottom top",
              scrub: 1
            }
          });
        });

      /* REMOVED (dead code + wasted work): a scrub tween used to set
         xPercent on .ad-marquee-track here. That element is driven by
         the CSS "marquee" @keyframes animation, and animation-origin
         declarations outrank inline styles in the cascade — so the
         tween never had any visible effect, while ScrollTrigger still
         recomputed and applied it on every scroll frame. The marquee
         itself is unchanged: it is, and always was, the CSS animation. */

      /* ============================================================
         NAV SCROLL SPY
      ============================================================ */

      if (hasScrollTrigger) {
        const navLinks =
          gsap.utils.toArray(
            ".nav-links a"
          );

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

        if (
          document.fonts &&
          document.fonts.ready &&
          typeof document.fonts.ready.then ===
            "function"
        ) {
          document.fonts.ready
            .then(() => {
              ScrollTrigger.refresh();
            })
            .catch(() => {
              /* A webfont that never arrives shouldn't produce an
                 unhandled rejection — refresh anyway so the measured
                 trigger positions aren't left stale. */
              ScrollTrigger.refresh();
            });
        }
      }
    }
  } catch (err) {
    if (window.console) {
      console.error(
        "[Casa Gelso] Scroll reveals failed:",
        err
      );
    }
  }

  /* ============================================================
     MOBILE MENU
  ============================================================ */

  const menuToggle =
    document.querySelector(
      "[data-menu-toggle]"
    );

  const mobileMenu =
    document.querySelector(
      "[data-mobile-menu]"
    );

  const menuCloseBtn =
    document.querySelector(
      "[data-menu-close]"
    );

  try {
    if (
      menuToggle &&
      mobileMenu
    ) {
      function closeMobileMenu() {
        mobileMenu.classList.remove(
          "is-open"
        );

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

      menuToggle.addEventListener(
        "click",
        () => {
          const open =
            mobileMenu.classList.toggle(
              "is-open"
            );

          menuToggle.setAttribute(
            "aria-expanded",
            String(open)
          );

          mobileMenu.setAttribute(
            "aria-hidden",
            String(!open)
          );

          if (open) {
            lock("menu-open");
          } else {
            unlock("menu-open");
          }
        }
      );

      if (menuCloseBtn) {
        menuCloseBtn.addEventListener(
          "click",
          closeMobileMenu
        );
      }

      document.addEventListener(
        "keydown",
        (event) => {
          if (
            event.key === "Escape" &&
            mobileMenu.classList.contains(
              "is-open"
            )
          ) {
            closeMobileMenu();
          }
        }
      );

      mobileMenu
        .querySelectorAll("a")
        .forEach((a) => {
          a.addEventListener(
            "click",
            closeMobileMenu
          );
        });
    }
  } catch (err) {
    if (window.console) {
      console.error(
        "[Casa Gelso] Mobile menu failed:",
        err
      );
    }
  }

  /* ============================================================
     EVENT DATA
  ============================================================ */

  try {
    const EVENT = {
      title: "Casa Gelso — Opening",

      details:
        "Casa Gelso opening in Tbilisi — accessible refinement, curated individuality, quiet confidence.",

      location:
        "Kostava St 67, Tbilisi, Georgia",

      startUTC:
        "2026-09-12T15:00:00Z",

      endUTC:
        "2026-09-12T18:00:00Z"
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
      const params =
        new URLSearchParams({
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

    const googleURL =
      googleCalUrl();

    document
      .querySelectorAll(
        "[data-cal-google], [data-cal-google-success]"
      )
      .forEach((a) => {
        a.href = googleURL;
      });
  } catch (err) {
    if (window.console) {
      console.error(
        "[Casa Gelso] Calendar setup failed:",
        err
      );
    }
  }

  /* ============================================================
     RSVP
  ============================================================ */

  const RSVP_ENDPOINT =
    "https://script.google.com/macros/s/AKfycbxXpXlditvFs1H1dWB1iJyb_zy-y68-buSaxUceW5ZCiA-fp6GSuvZhTYiLFviBcEh_/exec";

  const rsvpForm =
    document.getElementById(
      "rsvpForm"
    );

  try {
    if (rsvpForm) {
      const statusEl =
        document.getElementById(
          "rsvpFormStatus"
        );

      const successEl =
        document.getElementById(
          "rsvpSuccess"
        );

      const submitBtn =
        rsvpForm.querySelector(
          ".response-submit"
        );

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

        attendingOnlyFields.forEach(
          (field) => {
            field.hidden =
              !attending;
          }
        );
      }

      attendingRadios.forEach(
        (radio) => {
          radio.addEventListener(
            "change",
            setAttendingVisibility
          );
        }
      );

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

      function setError(
        name,
        message
      ) {
        const err =
          errorEl(name);

        const input =
          fieldEl(name);

        const wrap = input
          ? input.closest(
              ".editorial-field, .editorial-choice"
            )
          : null;

        if (err) {
          err.textContent =
            message;

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

      ["name", "attending"].forEach(
        (name) => {
          rsvpForm
            .querySelectorAll(
              `[name="${name}"]`
            )
            .forEach((el) => {
              el.addEventListener(
                "input",
                () => {
                  setError(
                    name,
                    ""
                  );
                }
              );

              el.addEventListener(
                "change",
                () => {
                  setError(
                    name,
                    ""
                  );
                }
              );
            });
        }
      );

      function validate(data) {
        let firstInvalid = null;

        const t =
          (
            translations[
              currentLang
            ] ||
            translations.en
          ).errors;

        setError("name", "");
        setError(
          "attending",
          ""
        );

        if (!data.name.trim()) {
          setError(
            "name",
            t.name
          );

          firstInvalid =
            fieldEl("name");
        }

        if (!data.attending) {
          setError(
            "attending",
            t.attending
          );

          firstInvalid =
            firstInvalid ||
            rsvpForm.querySelector(
              ".editorial-choice"
            );
        }

        return firstInvalid;
      }

      function readForm() {
        const fd =
          new FormData(
            rsvpForm
          );

        return {
          name:
            fd.get("name") ||
            "",

          attending:
            fd.get("attending") ||
            "",

          designers:
            fd.get("designers") ||
            "",

          wish:
            fd.get("wish") ||
            "",

          website:
            fd.get("website") ||
            ""
        };
      }

      function submitRSVP(data) {
        const payload = {
          name: data.name,
          attending: data.attending,
          designers: data.designers,
          wish: data.wish
        };

        if (!RSVP_ENDPOINT) {
          console.warn(
            "[Casa Gelso] RSVP endpoint is not set.",
            payload
          );

          return new Promise(
            (resolve) => {
              setTimeout(
                () =>
                  resolve({
                    ok: true
                  }),
                600
              );
            }
          );
        }

        const controller =
          typeof AbortController !==
          "undefined"
            ? new AbortController()
            : null;

        const timeoutId =
          controller
            ? setTimeout(
                () =>
                  controller.abort(),
                12000
              )
            : null;

        return fetch(
          RSVP_ENDPOINT,
          {
            method: "POST",

            mode: "no-cors",

            headers: {
              "Content-Type":
                "text/plain;charset=utf-8"
            },

            body:
              JSON.stringify(
                payload
              ),

            signal:
              controller
                ? controller.signal
                : undefined
          }
        )
          .then(() => ({
            ok: true
          }))
          .catch(() => ({
            ok: false
          }))
          .finally(() => {
            if (timeoutId) {
              clearTimeout(
                timeoutId
              );
            }
          });
      }

      function showFormMessage(
        message
      ) {
        if (!statusEl) return;

        statusEl.textContent =
          message;

        statusEl.classList.toggle(
          "is-visible",
          !!message
        );
      }

      function renderSuccess(data) {
        if (!successEl) return;

        const attending =
          data.attending === "yes";

        const t =
          (
            translations[
              currentLang
            ] ||
            translations.en
          ).success;

        const firstName =
          data.name
            .trim()
            .split(/\s+/)[0] ||
          "";

        const eyebrow =
          successEl.querySelector(
            "[data-success-eyebrow]"
          );

        const note =
          successEl.querySelector(
            "[data-success-note]"
          );

        if (eyebrow) {
          eyebrow.textContent =
            attending
              ? t.reservedEyebrow
              : t.declinedEyebrow;
        }

        if (note) {
          note.textContent =
            attending
              ? t.reservedNote.replace(
                  "{name}",
                  firstName ||
                    t.reservedNoteFallback
                )
              : t.declinedNote;
        }

        rsvpForm.hidden = true;
        successEl.hidden = false;

        if (
          typeof successEl.focus ===
          "function"
        ) {
          successEl.focus();
        }
      }

      /* FIX: this listener used to be nested inside `if (submitBtn)`.
         If .response-submit were ever missing or renamed, no submit
         handler was attached at all and the form fell back to a native
         GET navigation — losing the RSVP and reloading the page. The
         handler now belongs to the form; the button is used defensively
         inside it. */

      let isSubmitting = false;

      rsvpForm.addEventListener(
        "submit",
        (event) => {
          event.preventDefault();

          /* Pressing Enter in a text field submits the form even while
             the button is disabled — on a slow connection that fired a
             second (duplicate) request while the first was still in
             flight. */
          if (isSubmitting) return;

          const data =
            readForm();

          /* Honeypot */

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
              (
                translations[
                  currentLang
                ] ||
                translations.en
              ).errors;

            showFormMessage(
              t.checkFields
            );

            if (
              typeof firstInvalid.focus ===
              "function"
            ) {
              firstInvalid.focus({
                preventScroll:
                  false
              });
            }

            return;
          }

          showFormMessage("");

          isSubmitting = true;

          if (submitBtn) {
            submitBtn.classList.add(
              "is-loading"
            );

            submitBtn.disabled =
              true;
          }

          submitRSVP(data)
            .then(
              (response) => {
                if (
                  !response.ok
                ) {
                  throw new Error(
                    "network"
                  );
                }

                renderSuccess(
                  data
                );
              }
            )
            .catch(() => {
              const t =
                (
                  translations[
                    currentLang
                  ] ||
                  translations.en
                ).errors;

              showFormMessage(
                t.network
              );
            })
            .finally(() => {
              isSubmitting = false;

              if (submitBtn) {
                submitBtn.classList.remove(
                  "is-loading"
                );

                submitBtn.disabled =
                  false;
              }
            });
        }
      );

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

            ["name", "attending"].forEach(
              (name) => {
                setError(
                  name,
                  ""
                );
              }
            );

            showFormMessage("");

            if (successEl) {
              successEl.hidden =
                true;
            }

            rsvpForm.hidden =
              false;

            const nameField =
              fieldEl("name");

            if (nameField) {
              nameField.focus();
            }
          }
        );
      }
    }
  } catch (err) {
    if (window.console) {
      console.error(
        "[Casa Gelso] RSVP failed to initialize:",
        err
      );
    }
  }

  /* ============================================================
     LANGUAGE SYSTEM
  ============================================================ */

  const translations = {
    /* ==========================================================
       ENGLISH
    ========================================================== */

    en: {
      invite: {
        eyebrow:
          "Private opening · Tbilisi",

        title:
          "You are invited.",

        /* Two paragraphs — the \n\n is a real paragraph break on
           screen (see white-space: pre-line on .invite-lede). Keep the
           KA / IT versions below split at the same point. */
        lede:
          "Join us for the opening evening of Casa Gelso — an evening that brings together distinctive pieces, considered details, and the people for whom style is part of who they are.\n\nDiscover Casa Gelso — a space where every piece is chosen with taste, and every detail is made to give your everyday a character of its own.",

        dateLabel:
          "Date",

        date:
          "12 September 2026",

        timeLabel:
          "Time",

        time:
          "17:00",

        placeLabel:
          "Place",

        place:
          "Kostava St 67, Tbilisi",

        placeTooltip:
          "Click to see location in Google Maps",

        calendar:
          "Add to calendar",

        calendarTooltip:
          "Click to save in calendar"
      },

      response: {
        subtitle:
          "Kindly confirm your attendance.",

        name:
          "Name & surname",

        attending:
          "Will you be joining us?",

        yes:
          "Yes, I'll be there",

        no:
          "I won't be able to make it",

        designers:
          "Top 3 designer / fashion house"
      },

      wish: {
        kicker:
          "One last thing",

        title:
          "What do you wish for Casa Gelso?",

        label:
          "Your wish for Casa Gelso",

        placeholder:
          "",

        send:
          "Submit"
      },

      success: {
        title:
          "See you at Casa Gelso.",

        again:
          "Submit another response",

        reservedEyebrow:
          "Your place is reserved",

        reservedNote:
          "We look forward to welcoming you, {name}.",

        reservedNoteFallback:
          "you",

        declinedEyebrow:
          "Thank you for letting us know",

        declinedNote:
          "We'll miss you at the opening — we hope to see you at Casa Gelso soon."
      },

      errors: {
        name:
          "Please tell us your name and surname.",

        attending:
          "Please let us know if you'll attend.",

        checkFields:
          "Please check the highlighted fields below.",

        network:
          "Something went wrong sending your RSVP. Please try again."
      },

      footer: {
        credit:
          "Designed & built with care.",

        back:
          "Back to top ↑"
      }
    },

    /* ==========================================================
       GEORGIAN
    ========================================================== */

    ka: {
      invite: {
        eyebrow:
          "კერძო გახსნა · თბილისი",

        title:
          "თქვენ მოწვეული ხართ.",

        lede:
          "გელოდებით Casa Gelso-ს გახსნის საღამოზე. საღამოზე, რომელიც აერთიანებს გამორჩეულ ნივთებს, განსაკუთრებულ დეტალებს და ადამიანებს, ვისთვისაც სტილი ინდივიდუალობის ნაწილია.\n\nაღმოაჩინეთ Casa Gelso — სივრცე, სადაც თითოეული ნივთი შერჩეულია გემოვნებით და თითოეული დეტალი შექმნილია იმისთვის, რომ თქვენს ყოველდღიურობას განსაკუთრებული ხასიათი შესძინოს.",

        dateLabel:
          "თარიღი",

        date:
          "12 სექტემბერი 2026",

        timeLabel:
          "დრო",

        time:
          "17:00",

        placeLabel:
          "ადგილი",

        place:
          "კოსტავას ქუჩა 67, თბილისი",

        placeTooltip:
          "Google Maps-ზე სანახავად დააჭირეთ აქ",

        calendar:
          "კალენდარში დამატება",

        calendarTooltip:
          "ღონისძიების კალენდარში დასამატებლად დააჭირეთ აქ"
      },

      response: {
        subtitle:
          "გთხოვთ, დაადასტუროთ თქვენი დასწრება.",

        name:
          "სახელი და გვარი",

        attending:
          "დაესწრებით ღონისძიებას?",

        yes:
          "დიახ, ვიქნები",

        no:
          "ვერ დავესწრები",

        designers:
          "თქვენი 3 რჩეული დიზაინერი / მოდის სახლი"
      },

      wish: {
        kicker:
          "და ბოლოს",

        title:
          "რას უსურვებდით Casa Gelso-ს?",

        label:
          "თქვენი სურვილი Casa Gelso-სთვის",

        placeholder:
          "",

        send:
          "გაგზავნა"
      },

      success: {
        title:
          "გელოდებით Casa Gelso-ში.",

        again:
          "სხვა პასუხის გაგზავნა",

        reservedEyebrow:
          "თქვენი ადგილი დაჯავშნილია",

        reservedNote:
          "მოუთმენლად ველით თქვენს სტუმრობას, {name}.",

        reservedNoteFallback:
          "თქვენს სტუმრობას",

        declinedEyebrow:
          "მადლობა პასუხისთვის",

        declinedNote:
          "სამწუხაროა, რომ ვერ გიხილავთ გახსნაზე."
      },

      errors: {
        name:
          "გთხოვთ, მიუთითოთ თქვენი სახელი და გვარი.",

        attending:
          "გთხოვთ, გვაცნობოთ, შეძლებთ თუ არა დასწრებას.",

        checkFields:
          "გთხოვთ, შეამოწმოთ მონიშნული ველები.",

        network:
          "RSVP-ის გაგზავნისას დაფიქსირდა შეცდომა. გთხოვთ, სცადოთ ხელახლა."
      },

      footer: {
        credit:
          "შექმნილია სიყვარულით.",

        back:
          "თავში დაბრუნება ↑"
      }
    },

    /* ==========================================================
       ITALIAN
    ========================================================== */

    it: {
      invite: {
        eyebrow:
          "Apertura privata · Tbilisi",

        title:
          "Sei invitato.",

        lede:
          "Ti aspettiamo per la serata inaugurale di Casa Gelso. Una serata che riunisce pezzi distintivi, dettagli ricercati e persone per cui lo stile è parte della propria individualità.\n\nScopri Casa Gelso — uno spazio in cui ogni pezzo è scelto con cura e ogni dettaglio è pensato per dare un carattere speciale alla tua quotidianità.",

        dateLabel:
          "Data",

        date:
          "12 settembre 2026",

        timeLabel:
          "Ora",

        time:
          "17:00",

        placeLabel:
          "Luogo",

        place:
          "Via Kostava 67, Tbilisi",

        placeTooltip:
          "Clicca qui per vedere la posizione su Google Maps",

        calendar:
          "Aggiungi al calendario",

        calendarTooltip:
          "Clicca qui per aggiungere l'evento al calendario"
      },

      response: {
        subtitle:
          "Ti chiediamo gentilmente di confermare la tua presenza.",

        name:
          "Nome e cognome",

        attending:
          "Sarai dei nostri?",

        yes:
          "Sì, ci sarò",

        no:
          "Non potrò esserci",

        designers:
          "I tuoi 3 designer / maison preferiti"
      },

      wish: {
        kicker:
          "E infine",

        title:
          "Cosa auguri a Casa Gelso?",

        label:
          "Il tuo augurio per Casa Gelso",

        placeholder:
          "",

        send:
          "Invia"
      },

      success: {
        title:
          "Ti aspettiamo da Casa Gelso.",

        again:
          "Invia un'altra risposta",

        reservedEyebrow:
          "Il tuo posto è riservato",

        reservedNote:
          "Non vediamo l'ora di accoglierti, {name}.",

        reservedNoteFallback:
          "te",

        declinedEyebrow:
          "Grazie per avercelo fatto sapere",

        declinedNote:
          "Ci dispiace non poterti vedere all'apertura."
      },

      errors: {
        name:
          "Inserisci il tuo nome e cognome, per favore.",

        attending:
          "Facci sapere se potrai partecipare.",

        checkFields:
          "Controlla i campi evidenziati.",

        network:
          "Si è verificato un errore durante l'invio della tua RSVP. Riprova."
      },

      footer: {
        credit:
          "Creato con cura.",

        back:
          "Torna in cima ↑"
      }
    }
  };

  /* ============================================================
     LANGUAGE HELPERS
  ============================================================ */

  function $(selector, root = document) {
    return root.querySelector(
      selector
    );
  }

  function $$(selector, root = document) {
    return Array.from(
      root.querySelectorAll(
        selector
      )
    );
  }

  function lookup(
    translation,
    path
  ) {
    return path
      .split(".")
      .reduce(
        (node, key) => {
          if (
            node &&
            node[key] !==
              undefined
          ) {
            return node[key];
          }

          return undefined;
        },
        translation
      );
  }

  /* ============================================================
     APPLY LANGUAGE
  ============================================================ */

  function applyLanguage(lang) {
    const t =
      translations[lang] ||
      translations.en;

    currentLang =
      translations[lang]
        ? lang
        : "en";

    const htmlLang =
      currentLang === "ka"
        ? "ka"
        : currentLang === "it"
        ? "it"
        : "en";

    document.documentElement.lang =
      htmlLang;

    document.body.classList.toggle(
      "lang-ka",
      currentLang === "ka"
    );

    safeStorageSet(
      "casa-gelso-language",
      currentLang
    );

    /* Language buttons */

    $$("[data-lang]").forEach(
      (button) => {
        button.setAttribute(
          "aria-pressed",
          String(
            button.dataset.lang ===
              currentLang
          )
        );
      }
    );

    /* Text */

    $$("[data-i18n]").forEach(
      (el) => {
        const value =
          lookup(
            t,
            el.dataset.i18n
          );

        if (
          value !==
          undefined
        ) {
          el.textContent =
            value;
        }
      }
    );

    /* Placeholder */

    $$(
      "[data-i18n-placeholder]"
    ).forEach((el) => {
      const value =
        lookup(
          t,
          el.dataset
            .i18nPlaceholder
        );

      if (
        value !==
        undefined
      ) {
        el.placeholder =
          value;
      }
    });

    /* Tooltips */

    $$(
      "[data-i18n-tooltip]"
    ).forEach((el) => {
      const value =
        lookup(
          t,
          el.dataset
            .i18nTooltip
        );

      if (
        value !==
        undefined
      ) {
        el.dataset.tooltip =
          value;
      }
    });

    /* Update sound labels after language change */

    syncSoundUI();
  }

  /* ============================================================
     LANGUAGE BUTTONS
  ============================================================ */

  try {
    $$("[data-lang]").forEach(
      (button) => {
        button.addEventListener(
          "click",
          () => {
            applyLanguage(
              button.dataset.lang
            );
          }
        );
      }
    );

    /* FIX: applyLanguage() used to be called right here, on load. Its
       last line is syncSoundUI(), which reads the `audio` const
       declared further down this file — so every page load threw
       "Cannot access 'audio' before initialization" (a temporal dead
       zone error) into this catch, aborting the rest of the language
       bootstrap. The listeners above are unaffected by the move; the
       initial call now runs at the very bottom of this file, once
       every const it depends on exists. */
  } catch (err) {
    if (window.console) {
      console.error(
        "[Casa Gelso] Language switcher failed:",
        err
      );
    }
  }

  /* ============================================================
     SOUND
  ============================================================ */

  const audio =
    $("#casaGelsoAudio");

  const soundButtons =
    $$("[data-sound-toggle]");

  /* FIX: this used to start as `false` and only flip to `true` on the
     audio element's "canplay" event. With preload="metadata" that event
     is not guaranteed — and on iOS/mobile Safari, which ignores preload
     entirely and loads nothing until a user gesture, it never fired at
     all. Result: the SOUND toggle in the header and in the mobile menu
     did nothing whatsoever on iPhone/iPad, silently, forever.

     The element is now assumed playable until the browser actually
     tells us otherwise (an "error" event or a populated audio.error),
     which is the only signal that genuinely means "this file can't
     play". The .is-unavailable styling still appears in exactly that
     case, and nowhere else. */
  let audioAvailable =
    true;

  let audioUnlocked =
    false;

  /* Declared at this scope, not inside the `if (audio)` block below:
     in strict mode a function declaration inside a block is scoped to
     that block, and startSound() further down needs to reach
     markAudioUnavailable(). */
  function markAudioAvailable() {
    audioAvailable =
      true;

    soundButtons.forEach(
      (button) => {
        button.classList.remove(
          "is-unavailable"
        );
      }
    );
  }

  function markAudioUnavailable() {
    audioAvailable =
      false;

    soundButtons.forEach(
      (button) => {
        button.classList.add(
          "is-unavailable"
        );
      }
    );
  }

  if (audio) {
    /* Any of these means the file is reachable — clears a stale
       unavailable state (e.g. a connection that dropped and recovered). */
    [
      "loadedmetadata",
      "loadeddata",
      "canplay",
      "playing"
    ].forEach((eventName) => {
      audio.addEventListener(
        eventName,
        markAudioAvailable
      );
    });

    audio.addEventListener(
      "error",
      markAudioUnavailable
    );

    /* Some browsers (notably iOS) treat volume as read-only on media
       elements and throw in strict mode rather than ignoring it. */
    try {
      audio.volume = 0.42;
    } catch (_) {
      /* Non-critical — the track plays at system volume. */
    }

    if (audio.error) {
      markAudioUnavailable();
    }
  }

  /* ============================================================
     SOUND UI
  ============================================================ */

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

    soundButtons.forEach(
      (button) => {
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
      }
    );
  }

  /* ============================================================
     PRIME AUDIO
  ============================================================ */

  function primeAudio() {
    if (
      !audio ||
      audioUnlocked
    ) {
      return;
    }

    audioUnlocked =
      true;

    audio.muted =
      false;

    const playPromise =
      audio.play();

    if (
      playPromise &&
      typeof playPromise.then ===
        "function"
    ) {
      playPromise
        .then(() => {
          syncSoundUI();
        })
        .catch(() => {
          audio.muted =
            true;

          audioUnlocked =
            false;

          syncSoundUI();
        });
    } else {
      syncSoundUI();
    }
  }

  /* ============================================================
     SOUND TOGGLE
  ============================================================ */

  async function startSound() {
    if (
      !audio ||
      !audioAvailable
    ) {
      return;
    }

    if (!audioUnlocked) {
      primeAudio();
      syncSoundUI();
      return;
    }

    audio.muted =
      false;

    try {
      await audio.play();
    } catch (_) {
      audio.muted =
        true;

      /* If the file itself is the problem (rather than a blocked
         autoplay gesture), reflect that in the UI instead of leaving
         a button that appears to work but never does. */
      if (audio.error) {
        markAudioUnavailable();
      }
    }

    syncSoundUI();
  }

  soundButtons.forEach(
    (button) => {
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
    }
  );

  /* ============================================================
     FALLBACK AUDIO UNLOCK
  ============================================================ */

  [
    "click",
    "keydown"
  ].forEach(
    (eventName) => {
      window.addEventListener(
        eventName,
        primeAudio,
        {
          once: true,
          passive: true
        }
      );
    }
  );

  /* ============================================================
     VISIBILITY
  ============================================================ */

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

    audio.addEventListener(
      "volumechange",
      syncSoundUI
    );
  }

  syncSoundUI();

  /* ============================================================
     INITIAL LANGUAGE PASS
     Deferred to here on purpose — see the note in the LANGUAGE
     BUTTONS block above. applyLanguage() finishes by calling
     syncSoundUI(), which touches the audio element and buttons
     declared above, so it cannot safely run any earlier than this.
  ============================================================ */

  try {
    applyLanguage(
      safeStorageGet(
        "casa-gelso-language"
      ) || "en"
    );
  } catch (err) {
    if (window.console) {
      console.error(
        "[Casa Gelso] Initial language pass failed:",
        err
      );
    }
  }

})();