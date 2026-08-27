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

    function finishOpener() {
      unlock("is-locked");

      if (skipBtn) {
        skipBtn.classList.remove("is-visible");
      }

      document.body.classList.add("opener-revealed");

      /* Lets the SOUND block (below) know the teaser is done, so
         music only ever starts once the opener has finished —
         never during the teaser itself. */
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

    const tl = gsap.timeline({
      defaults: {
        ease: "power3.out"
      },
      onComplete: finishOpener
    });

    if (skipBtn) {
      skipBtn.addEventListener("click", () => {
        if (skipped) return;

        skipped = true;

        tl.kill();

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

    /* Beat 0 */

    tl.to(titleMark, {
      autoAlpha: 1,
      scale: 1,
      filter: "blur(0px)",
      duration: 1.3,
      ease: "power2.out"
    })
      .to({}, {
        duration: 0.6
      })
      .to(titleMark, {
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

    gsap.utils
      .toArray("[data-parallax]")
      .forEach((fig, i) => {
        const img = fig.querySelector("img");
        const curtain = fig.querySelector(".ad-curtain");

        if (!img || !curtain) return;

        if (reduceMotion || !hasScrollTrigger) {
          gsap.set(curtain, {
            scaleX: 0
          });
          return;
        }

        gsap.to(curtain, {
          scaleX: 0,
          duration: 1.1,
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: fig,
            start: "top 80%",
            once: true
          }
        });

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
    location: "Tbilisi, Georgia",
    startUTC: "2026-09-13T15:00:00Z",
    endUTC: "2026-09-13T18:00:00Z"
  };

  /* ============================================================
     COUNTDOWN
  ============================================================ */

  const countdownEl =
    document.querySelector("[data-countdown]");

  if (countdownEl) {
    const target =
      new Date(EVENT.startUTC).getTime();

    const fields = {
      d: countdownEl.querySelector('[data-cd="d"]'),
      h: countdownEl.querySelector('[data-cd="h"]'),
      m: countdownEl.querySelector('[data-cd="m"]'),
      s: countdownEl.querySelector('[data-cd="s"]')
    };

    function tick() {
      const diff =
        Math.max(0, target - Date.now());

      fields.d.textContent = String(
        Math.floor(diff / 86400000)
      ).padStart(2, "0");

      fields.h.textContent = String(
        Math.floor(
          (diff % 86400000) / 3600000
        )
      ).padStart(2, "0");

      fields.m.textContent = String(
        Math.floor(
          (diff % 3600000) / 60000
        )
      ).padStart(2, "0");

      fields.s.textContent = String(
        Math.floor(
          (diff % 60000) / 1000
        )
      ).padStart(2, "0");
    }

    tick();
    setInterval(tick, 1000);
  }

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

  function icsBlobUrl() {
    const dt = (iso) =>
      iso
        .replace(/[-:]/g, "")
        .replace(".000Z", "Z");

    const content = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Casa Gelso//Opening//EN",
      "BEGIN:VEVENT",
      `DTSTART:${dt(EVENT.startUTC)}`,
      `DTEND:${dt(EVENT.endUTC)}`,
      `SUMMARY:${EVENT.title}`,
      `LOCATION:${EVENT.location}`,
      `DESCRIPTION:${EVENT.details}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    return URL.createObjectURL(
      new Blob([content], {
        type: "text/calendar"
      })
    );
  }

  const googleURL = googleCalUrl();
  const icsURL = icsBlobUrl();

  document
    .querySelectorAll(
      "[data-cal-google], [data-cal-google-success]"
    )
    .forEach((a) => {
      a.href = googleURL;
    });

  document
    .querySelectorAll(
      "[data-cal-ics], [data-cal-ics-success]"
    )
    .forEach((a) => {
      a.href = icsURL;
    });

  /* ============================================================
     INVITATION OPEN / CLOSE
  ============================================================ */

  const openInviteBtn =
    document.querySelector("[data-open-invite]");

  const inviteMore =
    document.querySelector("[data-invite-more]");

  if (openInviteBtn && inviteMore) {
    openInviteBtn.addEventListener("click", () => {
      const open =
        inviteMore.classList.toggle("is-open");

      openInviteBtn.setAttribute(
        "aria-expanded",
        String(open)
      );

      const lang =
        localStorage.getItem(
          "casa-gelso-language"
        ) || "en";

      const labels = {
        en: {
          open: "Open the invitation",
          close: "Close the invitation"
        },
        ka: {
          open: "მოსაწვევის გახსნა",
          close: "მოსაწვევის დახურვა"
        },
        it: {
          open: "Apri l'invito",
          close: "Chiudi l'invito"
        }
      };

      openInviteBtn.textContent =
        open
          ? labels[lang].close
          : labels[lang].open;
    });
  }

  /* ============================================================
     RSVP
  ============================================================ */

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

      const wrap = input
        ? input.closest(
            ".field, .field--fieldset"
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

    ["name", "email", "attending"].forEach(
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

    function validate(data) {
      let firstInvalid = null;

      setError("name", "");
      setError("email", "");
      setError("attending", "");

      if (!data.name.trim()) {
        setError(
          "name",
          "Please tell us your name."
        );

        firstInvalid =
          fieldEl("name");
      }

      const emailOK =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          data.email.trim()
        );

      if (!emailOK) {
        setError(
          "email",
          "Please enter a valid email address."
        );

        firstInvalid =
          firstInvalid ||
          fieldEl("email");
      }

      if (!data.attending) {
        setError(
          "attending",
          "Please let us know if you'll attend."
        );

        firstInvalid =
          firstInvalid ||
          rsvpForm.querySelector(
            ".pill-group"
          );
      }

      return firstInvalid;
    }

    function readForm() {
      const fd =
        new FormData(rsvpForm);

      return {
        name: fd.get("name") || "",
        email: fd.get("email") || "",
        attending:
          fd.get("attending") || "",
        guests:
          fd.get("guests") || "1",
        guestNames:
          fd.get("guestNames") || "",
        dietary:
          fd.get("dietary") || "",
        designers:
          fd.get("designers") || "",
        message:
          fd.get("message") || ""
      };
    }

    function submitRSVP(data) {
      return new Promise((resolve) => {
        setTimeout(
          () => resolve({ ok: true }),
          900
        );
      });
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

        const firstInvalid =
          validate(data);

        if (firstInvalid) {
          showFormMessage(
            "Please check the highlighted fields below."
          );

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
            showFormMessage(
              "Something went wrong sending your RSVP. Please try again."
            );
          })
          .finally(() => {
            submitBtn.classList.remove(
              "is-loading"
            );

            submitBtn.disabled = false;
          });
      }
    );

    function renderSuccess(data) {
      const attending =
        data.attending === "yes";

      successEl.querySelector(
        "[data-success-eyebrow]"
      ).textContent = attending
        ? "Your place is reserved"
        : "Thank you for letting us know";

      successEl.querySelector(
        "[data-success-note]"
      ).textContent = attending
        ? `We look forward to welcoming you on the evening, ${
            data.name.split(" ")[0] || "there"
          }.`
        : "We'll miss you at the opening — we hope to see you at Casa Gelso soon.";

      const calendar =
        successEl.querySelector(
          ".rsvp-success-calendar"
        );

      if (calendar) {
        calendar.hidden = !attending;
      }

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

          ["name", "email", "attending"]
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

  const translations = {
    en: {
      invite: {
        eyebrow: "Private opening · Tbilisi",
        title: "You are invited.",
        lede:
          "Join us for the opening of Casa Gelso — an evening dedicated to the pieces, and the people, that make style personal.",
        date: "13 September 2026",
        time: "19:00",
        place: "Tbilisi, Georgia",
        days: "Days",
        hrs: "Hrs",
        min: "Min",
        sec: "Sec",
        open: "Open the invitation",
        close: "Close the invitation",
        quote:
          "Come discover a new luxury destination, curated with the spirit of Italy — accessible refinement, curated individuality, quiet confidence.",
        calendar: "Add to calendar",
        rsvp: "RSVP to the opening"
      },

      rsvp: {
        title1: "Reserve",
        title2: "your place.",
        name: "Full name",
        email: "Email",
        yes: "Yes, I'll be there",
        no: "Can't make it",
        guests:
          "Guests, including yourself",
        guestNames: "Guest name(s)",
        dietary:
          "Dietary requirements",
        designers:
          "Which house are you most excited to see? Name your top three.",
        message:
          "Anything else we should know?",
        optional: "Optional",
        confirm: "Confirm RSVP",
        success:
          "Your place is reserved",
        note:
          "We look forward to welcoming you on the evening.",
        again:
          "Submit another response"
      },

      footer: {
        tag:
          "Accessible refinement. Curated individuality. Quiet confidence.",
        back:
          "Back to top ↑"
      }
    },

    ka: {
      invite: {
        eyebrow:
          "კერძო გახსნა · თბილისი",

        title:
          "თქვენ მოწვეული ხართ.",

        lede:
          "შემოგვიერთდით Casa Gelso-ს გახსნაზე — საღამო, რომელიც ეძღვნება ნივთებსა და ადამიანებს, რომლებიც სტილს პირად ისტორიად აქცევენ.",

        date:
          "13 სექტემბერი 2026",

        time:
          "19:00",

        place:
          "თბილისი, საქართველო",

        days:
          "დღე",

        hrs:
          "სთ",

        min:
          "წთ",

        sec:
          "წმ",

        open:
          "მოსაწვევის გახსნა",

        close:
          "მოსაწვევის დახურვა",

        quote:
          "აღმოაჩინეთ ახალი ლუქს-დანიშნულება, იტალიის სულისკვეთებით — ხელმისაწვდომი დახვეწილობა, შერჩეული ინდივიდუალობა, მშვიდი თავდაჯერება.",

        calendar:
          "კალენდარში დამატება",

        rsvp:
          "RSVP გახსნაზე"
      },

      rsvp: {
        title1:
          "დაიჯავშნე",

        title2:
          "შენი ადგილი.",

        name:
          "სახელი და გვარი",

        email:
          "ელფოსტა",

        yes:
          "დიახ, მოვალ",

        no:
          "ვერ მოვალ",

        guests:
          "სტუმრები, საკუთარი თავის ჩათვლით",

        guestNames:
          "სტუმრის/სტუმრების სახელი",

        dietary:
          "კვების მოთხოვნები",

        designers:
          "რომელი მოდის სახლის ნახვას ელოდები ყველაზე მეტად? დაასახელე შენი ტოპ 3.",

        message:
          "კიდევ რამე უნდა ვიცოდეთ?",

        optional:
          "არასავალდებულო",

        confirm:
          "RSVP-ის დადასტურება",

        success:
          "შენი ადგილი დაჯავშნილია",

        note:
          "მოუთმენლად ველით შენს სტუმრობას.",

        again:
          "სხვა პასუხის გაგზავნა"
      },

      footer: {
        tag:
          "ხელმისაწვდომი დახვეწილობა. შერჩეული ინდივიდუალობა. მშვიდი თავდაჯერება.",

        back:
          "თავში დაბრუნება ↑"
      }
    },

    it: {
      invite: {
        eyebrow:
          "Apertura privata · Tbilisi",

        title:
          "Sei invitato.",

        lede:
          "Unisciti a noi per l'apertura di Casa Gelso — una serata dedicata ai pezzi e alle persone che rendono lo stile personale.",

        date:
          "13 settembre 2026",

        time:
          "19:00",

        place:
          "Tbilisi, Georgia",

        days:
          "Giorni",

        hrs:
          "Ore",

        min:
          "Min",

        sec:
          "Sec",

        open:
          "Apri l'invito",

        close:
          "Chiudi l'invito",

        quote:
          "Scopri una nuova destinazione del lusso, curata nello spirito dell'Italia — raffinatezza accessibile, individualità curata, quiet confidence.",

        calendar:
          "Aggiungi al calendario",

        rsvp:
          "RSVP all'apertura"
      },

      rsvp: {
        title1:
          "Riserva",

        title2:
          "il tuo posto.",

        name:
          "Nome e cognome",

        email:
          "Email",

        yes:
          "Sì, ci sarò",

        no:
          "Non posso venire",

        guests:
          "Ospiti, incluso te",

        guestNames:
          "Nome degli ospiti",

        dietary:
          "Esigenze alimentari",

        designers:
          "Quale maison non vedi l'ora di scoprire? Indica le tue tre preferite.",

        message:
          "C'è altro che dovremmo sapere?",

        optional:
          "Facoltativo",

        confirm:
          "Conferma RSVP",

        success:
          "Il tuo posto è riservato",

        note:
          "Non vediamo l'ora di accoglierti.",

        again:
          "Invia un'altra risposta"
      },

      footer: {
        tag:
          "Raffinatezza accessibile. Individualità curata. Quiet confidence.",

        back:
          "Torna in cima ↑"
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

  function setText(selector, value) {
    const element = $(selector);

    if (element) {
      element.textContent = value;
    }
  }

  /* ============================================================
     APPLY LANGUAGE

     ONLY INVITATION + RSVP ARE MODIFIED.

     NOTHING ABOVE THIS POINT IS TOUCHED.
  ============================================================ */

  function applyLanguage(lang) {
    const t =
      translations[lang] ||
      translations.en;

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

    /* ========================================================
       DO NOT TOUCH:
       teaser
       coming soon
       digital ad
       reveal

       They stay in their original English HTML.
    ======================================================== */


    /* ========================================================
       INVITATION ONLY
    ======================================================== */

    setText(
      ".invite-card .eyebrow",
      t.invite.eyebrow
    );

    setText(
      "#invite-heading .mask-in",
      t.invite.title
    );

    setText(
      ".invite-lede",
      t.invite.lede
    );

    const meta =
      $$(".invite-meta dd");

    if (meta[0])
      meta[0].textContent =
        t.invite.date;

    if (meta[1])
      meta[1].textContent =
        t.invite.time;

    if (meta[2])
      meta[2].textContent =
        t.invite.place;

    const countdownLabels =
      $$(".invite-countdown span");

    if (countdownLabels[0])
      countdownLabels[0].textContent =
        t.invite.days;

    if (countdownLabels[1])
      countdownLabels[1].textContent =
        t.invite.hrs;

    if (countdownLabels[2])
      countdownLabels[2].textContent =
        t.invite.min;

    if (countdownLabels[3])
      countdownLabels[3].textContent =
        t.invite.sec;

    const inviteOpenButton =
      $("[data-open-invite]");

    if (inviteOpenButton) {
      const isOpen =
        inviteMore &&
        inviteMore.classList.contains(
          "is-open"
        );

      inviteOpenButton.textContent =
        isOpen
          ? t.invite.close
          : t.invite.open;
    }

    setText(
      ".invite-quote",
      t.invite.quote
    );

    setText(
      ".invite-calendar span",
      t.invite.calendar
    );

    setText(
      ".invite-rsvp-cta",
      t.invite.rsvp
    );


    /* ========================================================
       RSVP ONLY
    ======================================================== */

    setText(
      "#rsvp-heading .mask-in",
      t.rsvp.title1
    );

    setText(
      "#rsvp-heading .mask-in--italic",
      t.rsvp.title2
    );

    const labels = {
      rsvpName: t.rsvp.name,
      rsvpEmail: t.rsvp.email,
      rsvpGuests: t.rsvp.guests,
      rsvpGuestNames:
        t.rsvp.guestNames,
      rsvpDietary:
        t.rsvp.dietary,
      rsvpDesigners:
        t.rsvp.designers,
      rsvpMessage:
        t.rsvp.message
    };

    Object.entries(labels).forEach(
      ([id, value]) => {
        const label =
          document.querySelector(
            `label[for="${id}"]`
          );

        if (label) {
          label.textContent = value;
        }
      }
    );

    const pills =
      $$(".pill span");

    if (pills[0])
      pills[0].textContent =
        t.rsvp.yes;

    if (pills[1])
      pills[1].textContent =
        t.rsvp.no;

    const messageField =
      $("#rsvpMessage");

    if (messageField) {
      messageField.placeholder =
        t.rsvp.optional;
    }

    setText(
      ".rsvp-submit .btn-label",
      t.rsvp.confirm
    );

    setText(
      "[data-success-eyebrow]",
      t.rsvp.success
    );

    setText(
      "[data-success-note]",
      t.rsvp.note
    );

    setText(
      "[data-rsvp-again]",
      t.rsvp.again
    );


    /* ========================================================
       FOOTER

       Footer is kept in English conceptually, but the existing
       footer translation is retained here because it is outside
       the teaser / digital-ad copy.
    ======================================================== */

    setText(
      ".site-footer-tag",
      t.footer.tag
    );

    setText(
      ".site-footer-meta a",
      t.footer.back
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

  /* Music should only start once the teaser has finished — but
     mobile browsers (iOS Safari especially, and Chrome on Android)
     only allow audio.play() to succeed when it's called
     SYNCHRONOUSLY inside a real user-gesture event handler. If we
     wait for the gesture to happen, then wait AGAIN for the opener
     to finish before calling play(), that second call happens
     outside the gesture's call stack and mobile browsers silently
     refuse it — which is why this worked in quick desktop testing
     (Chrome desktop is more lenient) but not on a phone.

     The fix: call play() synchronously on the very first gesture,
     no matter when it happens — this "unlocks" the audio element.
     If the teaser isn't done yet, immediately pause it again in
     the same tick, before any sound is audible. Once unlocked, a
     later play() call (e.g. once the teaser actually finishes)
     is allowed to succeed without needing a fresh gesture. */
  let openerHasFinished = document.body.classList.contains(
    "opener-revealed"
  );
  let audioUnlocked = false;

  function primeAudio() {
    if (!audio || audioUnlocked) return;

    audioUnlocked = true;
    audio.muted = false;

    const playPromise = audio.play();

    if (!openerHasFinished) {
      audio.pause();
    }

    if (playPromise && playPromise.catch) {
      playPromise
        .then(() => {
          if (openerHasFinished) syncSoundUI();
        })
        .catch(() => {
          /* Autoplay refused even with a gesture (rare) — leave
             muted; the manual sound-toggle buttons still work. */
          audio.muted = true;
        });
    }
  }

  document.addEventListener(
    "casa:opener-finished",
    () => {
      openerHasFinished = true;

      if (audioUnlocked && audio && audio.paused) {
        audio
          .play()
          .then(syncSoundUI)
          .catch(() => {});
      }
    },
    { once: true }
  );

  [
    "pointerdown",
    "keydown",
    "touchstart"
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