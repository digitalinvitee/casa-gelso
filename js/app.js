/* ============================================================
   CASA GELSO — DIGITAL CAMPAIGN · app.js

   Language scope
   - Campaign content (opening film, brand reveal, Digital Ad copy)
     is English in every language, by design.
   - Interface (navigation, menus, buttons, opener controls, footer)
     and the Invitation / RSVP are translated: EN / KA / IT.

   Every block below is isolated in its own try/catch so one failure
   can never leave the page locked or the RSVP unusable.
============================================================ */

(function () {
  "use strict";

  /* Tells the boot failsafe in <head> that the app is running. */
  window.__casaAppReady = true;

  const root = document.documentElement;
  const body = document.body;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGSAP = typeof window.gsap !== "undefined";
  const hasScrollTrigger = hasGSAP && typeof window.ScrollTrigger !== "undefined";

  if (hasScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  if (!hasGSAP) root.classList.add("no-gsap");

  function logError(where, err) {
    if (window.console) console.error("[Casa Gelso] " + where + ":", err);
  }

  function storageGet(store, key) {
    try { return window[store].getItem(key); } catch (_) { return null; }
  }

  function storageSet(store, key, value) {
    try { window[store].setItem(key, value); } catch (_) { /* non-critical */ }
  }

  const $ = (sel, scope = document) => scope.querySelector(sel);
  const $$ = (sel, scope = document) => Array.from(scope.querySelectorAll(sel));

  /* ============================================================
     TRANSLATIONS
  ============================================================ */

  const translations = {
    en: {
      ui: {
        skipToContent: "Skip to content",
        newTab: "(opens in a new tab)"
      },
      nav: {
        digital: "Digital Ad",
        invitation: "Invitation",
        rsvp: "RSVP",
        homeLabel: "Casa Gelso — back to top",
        primaryLabel: "Primary",
        mobileLabel: "Main menu",
        languageLabel: "Language",
        menuOpen: "Open menu",
        menuClose: "Close menu",
        menuLabel: "Menu"
      },
      opener: {
        enter: "Enter",
        skip: "Skip intro",
        discover: "Discover"
      },
      sound: { on: "Sound on", off: "Sound off" },
      ad: { continue: "Continue to the invitation" },
      invite: {
        chapter: "Chapter Two · Invitation & RSVP",
        aside: "Thank you. We look forward to welcoming you.",
        eyebrow: "Private opening · Tbilisi",
        title: "You are invited.",
        /* Two paragraphs: the \n\n is a real break (white-space: pre-line). */
        lede: "Join us for the opening evening of Casa Gelso — an evening that brings together distinctive pieces, considered details, and the people for whom style is part of who they are.\n\nDiscover Casa Gelso — a space where every piece is chosen with taste, and every detail is made to give your everyday a character of its own.",
        dateLabel: "Date",
        date: "12 September 2026",
        timeLabel: "Time",
        time: "17:00",
        placeLabel: "Place",
        place: "Kostava St 67, Tbilisi",
        placeTooltip: "Open in Google Maps",
        calendar: "Add to calendar",
        calendarTooltip: "Save to Google Calendar",
        calendarIcs: "Apple / Outlook"
      },
      response: {
        kicker: "RSVP",
        subtitle: "Kindly confirm your attendance.",
        name: "Name & surname",
        attending: "Will you be joining us?",
        yes: "Yes, I'll be there",
        no: "I won't be able to make it",
        designers: "Top 3 designers / fashion houses",
        optional: "Optional"
      },
      wish: {
        kicker: "One last thing",
        title: "What do you wish for Casa Gelso?",
        placeholder: "",
        send: "Send RSVP",
        sending: "Sending…"
      },
      success: {
        title: "See you at Casa Gelso.",
        again: "Submit another response",
        reservedEyebrow: "Your place is reserved",
        reservedNote: "We look forward to welcoming you, {name}.",
        reservedNoteNoName: "We look forward to welcoming you.",
        declinedEyebrow: "Thank you for letting us know",
        declinedNote: "We'll miss you at the opening — we hope to see you at Casa Gelso soon."
      },
      errors: {
        name: "Please tell us your name and surname.",
        attending: "Please let us know whether you'll attend.",
        checkFields: "Please check the highlighted fields.",
        network: "We couldn't send your RSVP. Please check your connection and try again."
      },
      footer: {
        city: "Tbilisi",
        location: "Tbilisi, Georgia",
        back: "Back to top ↑",
        rights: "© 2026 Casa Gelso. All rights reserved.",
        createdBy: "Created by"
      }
    },

    ka: {
      ui: {
        skipToContent: "მთავარ შინაარსზე გადასვლა",
        newTab: "(იხსნება ახალ ჩანართში)"
      },
      nav: {
        digital: "ციფრული რეკლამა",
        invitation: "მოწვევა",
        rsvp: "RSVP",
        homeLabel: "Casa Gelso — თავში დაბრუნება",
        primaryLabel: "მთავარი ნავიგაცია",
        mobileLabel: "მთავარი მენიუ",
        languageLabel: "ენა",
        menuOpen: "მენიუს გახსნა",
        menuClose: "მენიუს დახურვა",
        menuLabel: "მენიუ"
      },
      opener: {
        enter: "შესვლა",
        skip: "შესავლის გამოტოვება",
        discover: "აღმოაჩინეთ"
      },
      sound: { on: "ხმა ჩართულია", off: "ხმა გამორთულია" },
      ad: { continue: "მოწვევაზე გადასვლა" },
      invite: {
        chapter: "თავი მეორე · მოწვევა და RSVP",
        aside: "გმადლობთ. მოუთმენლად გელით.",
        eyebrow: "კერძო გახსნა · თბილისი",
        title: "თქვენ მოწვეული ხართ.",
        lede: "გელოდებით Casa Gelso-\u2060ს გახსნის საღამოზე — საღამოზე, რომელიც აერთიანებს გამორჩეულ ნივთებს, დახვეწილ დეტალებს და ადამიანებს, ვისთვისაც სტილი ინდივიდუალობის ნაწილია.\n\nაღმოაჩინეთ Casa Gelso — სივრცე, სადაც თითოეული ნივთი გემოვნებით არის შერჩეული და თითოეული დეტალი იმისთვისაა შექმნილი, რომ თქვენს ყოველდღიურობას საკუთარი ხასიათი შესძინოს.",
        dateLabel: "თარიღი",
        date: "12 სექტემბერი 2026",
        timeLabel: "დრო",
        time: "17:00",
        placeLabel: "ადგილი",
        place: "კოსტავას ქ. 67, თბილისი",
        placeTooltip: "გახსნა Google Maps-ში",
        calendar: "კალენდარში დამატება",
        calendarTooltip: "Google Calendar-ში შენახვა",
        calendarIcs: "Apple / Outlook"
      },
      response: {
        kicker: "RSVP",
        subtitle: "გთხოვთ, დაადასტუროთ დასწრება.",
        name: "სახელი და გვარი",
        attending: "შემოგვიერთდებით?",
        yes: "დიახ, მოვალ",
        no: "სამწუხაროდ, ვერ მოვალ",
        designers: "თქვენი 3 რჩეული დიზაინერი / მოდის სახლი",
        optional: "არასავალდებულო"
      },
      wish: {
        kicker: "და ბოლოს",
        title: "რას უსურვებდით Casa Gelso-\u2060ს?",
        placeholder: "",
        send: "პასუხის გაგზავნა",
        sending: "იგზავნება…"
      },
      success: {
        title: "გელით Casa Gelso-\u2060ში.",
        again: "სხვა პასუხის გაგზავნა",
        reservedEyebrow: "თქვენი ადგილი დაჯავშნილია",
        reservedNote: "{name}, მოუთმენლად ველით თქვენს სტუმრობას.",
        reservedNoteNoName: "მოუთმენლად ველით თქვენს სტუმრობას.",
        declinedEyebrow: "გმადლობთ, რომ შეგვატყობინეთ",
        declinedNote: "სამწუხაროა, რომ გახსნაზე ვერ გნახავთ — იმედი გვაქვს, მალე გესტუმრებით Casa Gelso-\u2060ში."
      },
      errors: {
        name: "გთხოვთ, მიუთითოთ სახელი და გვარი.",
        attending: "გთხოვთ, გვაცნობოთ, შეძლებთ თუ არა მობრძანებას.",
        checkFields: "გთხოვთ, გადაამოწმოთ მონიშნული ველები.",
        network: "პასუხის გაგზავნა ვერ მოხერხდა. შეამოწმეთ ინტერნეტთან კავშირი და სცადეთ ხელახლა."
      },
      footer: {
        city: "თბილისი",
        location: "თბილისი, საქართველო",
        back: "თავში დაბრუნება ↑",
        rights: "© 2026 Casa Gelso. ყველა უფლება დაცულია.",
        createdBy: "შემქმნელი:"
      }
    },

    it: {
      ui: {
        skipToContent: "Vai al contenuto",
        newTab: "(si apre in una nuova scheda)"
      },
      nav: {
        digital: "Digital Ad",
        invitation: "Invito",
        rsvp: "RSVP",
        homeLabel: "Casa Gelso — torna all'inizio",
        primaryLabel: "Navigazione principale",
        mobileLabel: "Menu principale",
        languageLabel: "Lingua",
        menuOpen: "Apri il menu",
        menuClose: "Chiudi il menu",
        menuLabel: "Menu"
      },
      opener: {
        enter: "Entra",
        skip: "Salta l'intro",
        discover: "Scopri"
      },
      sound: { on: "Audio on", off: "Audio off" },
      ad: { continue: "Prosegui verso l'invito" },
      invite: {
        chapter: "Capitolo due · Invito & RSVP",
        aside: "Grazie. Saremo lieti di accoglierti.",
        eyebrow: "Inaugurazione privata · Tbilisi",
        title: "Un invito per te.",
        lede: "Ti aspettiamo alla serata inaugurale di Casa Gelso — una serata che riunisce pezzi distintivi, dettagli ricercati e persone per cui lo stile è parte di ciò che sono.\n\nScopri Casa Gelso — uno spazio in cui ogni pezzo è scelto con gusto e ogni dettaglio è pensato per dare alla tua quotidianità un carattere tutto suo.",
        dateLabel: "Data",
        date: "12 settembre 2026",
        timeLabel: "Ora",
        time: "17:00",
        placeLabel: "Luogo",
        place: "Via Kostava 67, Tbilisi",
        placeTooltip: "Apri in Google Maps",
        calendar: "Aggiungi al calendario",
        calendarTooltip: "Salva in Google Calendar",
        calendarIcs: "Apple / Outlook"
      },
      response: {
        kicker: "RSVP",
        subtitle: "Ti chiediamo gentilmente di confermare la tua presenza.",
        name: "Nome e cognome",
        attending: "Sarai dei nostri?",
        yes: "Sì, ci sarò",
        no: "Purtroppo non potrò esserci",
        designers: "I tuoi 3 designer / maison preferiti",
        optional: "Facoltativo"
      },
      wish: {
        kicker: "E infine",
        title: "Cosa auguri a Casa Gelso?",
        placeholder: "",
        send: "Invia la risposta",
        sending: "Invio in corso…"
      },
      success: {
        title: "Ti aspettiamo da Casa Gelso.",
        again: "Invia un'altra risposta",
        reservedEyebrow: "Il tuo posto è riservato",
        reservedNote: "Non vediamo l'ora di accoglierti, {name}.",
        reservedNoteNoName: "Non vediamo l'ora di accoglierti.",
        declinedEyebrow: "Grazie per avercelo fatto sapere",
        declinedNote: "Ci mancherai all'inaugurazione — speriamo di vederti presto da Casa Gelso."
      },
      errors: {
        name: "Inserisci il tuo nome e cognome.",
        attending: "Facci sapere se potrai partecipare.",
        checkFields: "Controlla i campi evidenziati.",
        network: "Non è stato possibile inviare la risposta. Controlla la connessione e riprova."
      },
      footer: {
        city: "Tbilisi",
        location: "Tbilisi, Georgia",
        back: "Torna all'inizio ↑",
        rights: "© 2026 Casa Gelso. Tutti i diritti riservati.",
        createdBy: "Realizzato da"
      }
    }
  };

  const SUPPORTED = ["en", "ka", "it"];
  let currentLang = SUPPORTED.indexOf(storageGet("localStorage", "casa-gelso-language")) > -1
    ? storageGet("localStorage", "casa-gelso-language")
    : "en";

  function t(path) {
    const pick = (lang) => path.split(".").reduce(
      (node, key) => (node && node[key] !== undefined ? node[key] : undefined),
      translations[lang]
    );
    const value = pick(currentLang);
    return value !== undefined ? value : pick("en");
  }

  /* ============================================================
     SCROLL ENGINE (Lenis) + LOCKING
  ============================================================ */

  let lenis = null;

  try {
    if (!reduceMotion && hasGSAP && typeof window.Lenis !== "undefined") {
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 0.95 });
      if (hasScrollTrigger) lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  } catch (err) {
    lenis = null;
    logError("Smooth scroll unavailable", err);
  }

  function navOffset() {
    const nav = $("[data-nav]");
    return nav ? nav.getBoundingClientRect().height : 0;
  }

  /* Layout position, unaffected by reveal transforms. */
  function pageTop(el) {
    let y = 0;
    for (let node = el; node; node = node.offsetParent) y += node.offsetTop;
    return y;
  }

  function scrollToTarget(target) {
    if (!target) return;
    const y = target.id === "top" ? 0 : Math.max(0, pageTop(target) - navOffset() - 8);
    if (lenis) {
      lenis.resize();
      lenis.scrollTo(y, { duration: 1.4 });
    } else {
      window.scrollTo({ top: y, behavior: reduceMotion ? "auto" : "smooth" });
    }
  }

  /* ============================================================
     OPENING SEQUENCE
  ============================================================ */

  const opener = $("[data-opener]");
  let openerDone = false;
  let skipIntro = null;      /* set by runOpener; callable from nav links */

  function finishOpener() {
    if (openerDone) return;
    openerDone = true;

    body.classList.remove("is-locked");
    body.classList.add("opener-revealed");
    if (lenis) {
      lenis.resize();   /* limits were measured while the page was locked */
      lenis.start();
    }

    const skipBtn = $("[data-skip-intro]");
    if (skipBtn) {
      skipBtn.classList.remove("is-visible");
      skipBtn.hidden = true;
    }

    storageSet("sessionStorage", "casa-gelso-intro-seen", "1");
    document.dispatchEvent(new CustomEvent("casa:opener-finished"));
    if (hasScrollTrigger) ScrollTrigger.refresh();
  }

  function runOpener() {
    if (!opener) { finishOpener(); return; }

    /* The head failsafe already resolved the page — leave it alone. */
    if (body.classList.contains("opener-revealed")) { finishOpener(); return; }

    const titleCard = $("[data-title-card]", opener);
    const titleMark = titleCard ? $("img", titleCard) : null;
    const openBtn = titleCard ? $("[data-open-intro]", titleCard) : null;
    const skipBtn = $("[data-skip-intro]", opener);
    const film = $("[data-film]", opener);
    const frames = $$("[data-frame]", opener);
    const progress = $("[data-film-progress]", opener);
    const progressBars = progress ? $$("i", progress) : [];
    const comingSoon = $("[data-coming-soon]", opener);
    const comingSoonContent = comingSoon ? $(".coming-soon-content", comingSoon) : null;
    const hero = $("[data-reveal-hero]", opener);
    const heroArt = hero ? $(".reveal-art", hero) : null;
    const heroLockup = hero ? $(".reveal-lockup", hero) : null;
    const heroRule = hero ? $(".reveal-brand-rule", hero) : null;
    const heroText = hero ? $$(".reveal-season, .reveal-manifesto, .reveal-year", hero) : [];
    const heroScroll = hero ? $(".reveal-hero-scroll", hero) : null;
    const heroParts = [heroArt, heroLockup, heroRule, heroScroll].concat(heroText).filter(Boolean);

    function hideBeats() {
      [titleCard, film, progress, comingSoon].forEach((el) => { if (el) el.style.display = "none"; });
    }

    function showHeroFinal() {
      if (!hero) return;
      if (hasGSAP) {
        gsap.set(hero, { autoAlpha: 1 });
        gsap.set(heroParts, { autoAlpha: 1, y: 0, scale: 1 });
        if (heroRule) gsap.set(heroRule, { scaleX: 1 });
      } else {
        hero.style.opacity = "1";
        hero.style.visibility = "visible";
      }
    }

    const seenThisSession = storageGet("sessionStorage", "casa-gelso-intro-seen") === "1";

    /* Reduced motion, no GSAP, missing beats, or a repeat visit in the
       same session: go straight to the brand reveal. */
    if (reduceMotion || !hasGSAP || !titleCard || !hero || !comingSoon || seenThisSession) {
      hideBeats();
      showHeroFinal();
      finishOpener();
      return;
    }

    /* The intro plays from the top, with the page locked behind it. */
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    if (lenis) lenis.stop();
    body.classList.add("is-locked");

    /* Initial states */
    gsap.set(titleMark, { autoAlpha: 0, scale: 1.08, filter: "blur(12px)" });
    gsap.set(frames, { autoAlpha: 0 });
    frames.forEach((frame) => {
      gsap.set($(".frame-media", frame), { scale: 1.06, transformOrigin: "50% 60%" });
      gsap.set($(".frame-title-rule", frame), { scaleX: 0 });
      gsap.set($(".frame-title-line", frame), { autoAlpha: 0, y: 26 });
    });
    gsap.set(progress, { autoAlpha: 0 });
    gsap.set(comingSoon, { autoAlpha: 0 });
    if (comingSoonContent) gsap.set(comingSoonContent, { autoAlpha: 0 });
    gsap.set(hero, { autoAlpha: 0 });
    if (heroArt) gsap.set(heroArt, { autoAlpha: 0, y: 24 });
    gsap.set(heroLockup, { autoAlpha: 0, y: 22 });
    gsap.set(heroRule, { scaleX: 0 });
    gsap.set(heroText, { autoAlpha: 0, y: 14 });
    if (heroScroll) gsap.set(heroScroll, { autoAlpha: 0 });

    let skipped = false;

    /* Monogram appears, then the Enter control. */
    const tlIntro = gsap.timeline()
      .to(titleMark, { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 1.4, ease: "power2.out" })
      .call(() => {
        if (openBtn && !skipped) openBtn.classList.add("is-visible");
      });

    gsap.delayedCall(1, () => {
      if (!skipped && skipBtn) skipBtn.classList.add("is-visible");
    });

    /* Main film — paused until Enter (the user gesture that also
       allows the soundtrack to start). */
    const tl = gsap.timeline({ paused: true, onComplete: finishOpener });

    tl.to(titleMark, { autoAlpha: 0, scale: .96, filter: "blur(6px)", duration: .6, ease: "power2.in" })
      .to(openBtn, { autoAlpha: 0, duration: .3 }, "<")
      .call(() => opener.setAttribute("data-tone", "light"))
      .to(progress, { autoAlpha: 1, duration: .6 }, "+=0.1");

    const FRAME_STEP = 3.3;   /* seconds each frame owns */
    const CROSSFADE = 1.1;
    const frameStart = tl.duration() - .5;

    frames.forEach((frame, i) => {
      const at = frameStart + i * FRAME_STEP;
      const media = $(".frame-media", frame);
      const rule = $(".frame-title-rule", frame);
      const line = $(".frame-title-line", frame);
      const previous = frames[i - 1];

      tl.to(frame, { autoAlpha: 1, duration: CROSSFADE, ease: "power2.inOut" }, at)
        .to(media, { scale: 1, duration: FRAME_STEP + CROSSFADE, ease: "sine.out" }, at)
        .to(rule, { scaleX: 1, duration: .8, ease: "power3.out" }, at + .5)
        .to(line, { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out" }, at + .6)
        .to(line, { autoAlpha: 0, y: -10, duration: .5, ease: "power2.in" }, at + FRAME_STEP - .45)
        .to(rule, { scaleX: 0, duration: .5, ease: "power2.in" }, at + FRAME_STEP - .45);

      if (progressBars[i]) {
        tl.to(progressBars[i], { scaleX: 1, duration: FRAME_STEP, ease: "none" }, at);
      }
      if (previous) tl.set(previous, { autoAlpha: 0 }, at + CROSSFADE);
    });

    /* The title card sits above the film: dissolve it as frame 1 arrives. */
    tl.to(titleCard, { autoAlpha: 0, duration: CROSSFADE, ease: "power2.inOut" }, frameStart);

    const filmEnd = frameStart + frames.length * FRAME_STEP;

    /* 12.09 — analog signal cut, then a clean hold */
    tl.to(progress, { autoAlpha: 0, duration: .3 }, filmEnd - .3)
      .set(comingSoon, { autoAlpha: 1, className: "coming-soon is-signal" }, filmEnd)
      .set(frames, { autoAlpha: 0 }, filmEnd + .05)
      .to(comingSoonContent || {}, { autoAlpha: 1, duration: .3, ease: "power2.out" }, filmEnd)
      .set(comingSoon, { className: "coming-soon is-clean" }, filmEnd + 1.15)
      .to(comingSoon, { autoAlpha: 0, duration: .8, ease: "power2.inOut" }, filmEnd + 2.9);

    /* Brand reveal */
    const heroAt = filmEnd + 3.3;
    tl.to(hero, { autoAlpha: 1, duration: .9, ease: "power2.out" }, heroAt)
      .to(heroArt || {}, { autoAlpha: 1, y: 0, duration: 1.6, ease: "power3.out" }, heroAt + .1)
      .to(heroLockup, { autoAlpha: 1, y: 0, duration: 1.3, ease: "power4.out" }, heroAt + .45)
      .to(heroRule, { scaleX: 1, duration: .9, ease: "power3.inOut" }, heroAt + .8)
      .to(heroText, { autoAlpha: 1, y: 0, duration: .8, stagger: .1, ease: "power3.out" }, heroAt + 1.05)
      .to(heroScroll || {}, { autoAlpha: 1, duration: .6 }, heroAt + 1.5);

    /* Slow connections: never cut to an empty sheet. Before each frame
       (and the brand reveal) the film holds — up to a few seconds —
       until that image has actually arrived. */
    function whenLoaded(img, maxWait) {
      if (!img || (img.complete && img.naturalWidth > 0)) return Promise.resolve();
      return new Promise((resolve) => {
        const done = () => { clearTimeout(timer); resolve(); };
        const timer = setTimeout(done, maxWait);
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", done, { once: true });
      });
    }

    function holdFor(img, at) {
      tl.call(() => {
        if (!img || (img.complete && img.naturalWidth > 0)) return;
        tl.pause();
        whenLoaded(img, 4000).then(() => { if (!skipped) tl.resume(); });
      }, null, Math.max(0, at - .02));
    }

    frames.forEach((frame, i) => holdFor($("img", frame), frameStart + i * FRAME_STEP));
    if (heroArt) holdFor($("img", heroArt), heroAt);

    let introOpened = false;

    function openIntro() {
      if (introOpened || skipped) return;
      introOpened = true;
      primeAudio();   /* synchronous: this click is the audio gesture */
      tl.play();
    }

    skipIntro = function () {
      if (skipped || openerDone) return;
      skipped = true;
      tlIntro.kill();
      tl.kill();
      hideBeats();
      opener.setAttribute("data-tone", "light");
      showHeroFinal();
      finishOpener();
    };

    if (openBtn) {
      openBtn.addEventListener("click", openIntro);
      /* Focus Enter as soon as it exists for keyboard users. */
      tlIntro.call(() => { if (!skipped && document.activeElement === body) openBtn.focus({ preventScroll: true }); });
    }

    if (skipBtn) {
      skipBtn.addEventListener("click", () => {
        primeAudio();
        skipIntro();
        const main = $("#main");
        if (main && document.activeElement === skipBtn) {
          const heroLink = $(".reveal-hero-scroll");
          if (heroLink) heroLink.focus({ preventScroll: true });
        }
      });
    }

    /* Esc also skips the intro. */
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !openerDone && skipIntro && !$("[data-mobile-menu].is-open")) skipIntro();
    });
  }

  try {
    runOpener();
  } catch (err) {
    logError("Opener failed — recovering", err);
    if (opener) {
      ["[data-title-card]", "[data-film]", "[data-film-progress]", "[data-coming-soon]"].forEach((sel) => {
        const el = $(sel, opener);
        if (el) el.style.display = "none";
      });
      const hero = $("[data-reveal-hero]", opener);
      if (hero) { hero.style.opacity = "1"; hero.style.visibility = "visible"; }
    }
    root.classList.add("no-gsap");
    finishOpener();
  }

  /* ============================================================
     SCROLL REVEALS · DIGITAL AD · NAV STATE
  ============================================================ */

  const revealTweens = new Map();   /* element → its scroll reveal tween */

  try {
    if (hasGSAP) {
      if (reduceMotion || !hasScrollTrigger) {
        gsap.set(".reveal-up", { autoAlpha: 1, y: 0 });
        gsap.set(".mask-in", { y: 0 });
        gsap.set(".ad-curtain", { display: "none" });
      } else {
        gsap.utils.toArray(".reveal-up").forEach((el) => {
          revealTweens.set(el, gsap.to(el, {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true }
          }));
        });

        gsap.utils.toArray(".mask-lines").forEach((heading) => {
          gsap.to($$(".mask-in", heading), {
            y: 0,
            duration: 1.15,
            stagger: .08,
            ease: "power4.out",
            scrollTrigger: { trigger: heading, start: "top 88%", once: true }
          });
        });

        /* Photograph reveal: curtain wipes away, image settles. */
        gsap.utils.toArray("[data-parallax]").forEach((fig, i) => {
          const picture = $("picture", fig);
          const img = $(".ad-photo", fig);
          const curtain = $(".ad-curtain", fig);
          const fill = curtain ? $(".ad-curtain-fill", curtain) : null;
          const mark = curtain ? $(".ad-curtain-mark", curtain) : null;
          if (!img || !fill) return;

          const vertical = curtain.classList.contains("ad-curtain--vertical");
          const reveal = gsap.timeline({
            scrollTrigger: { trigger: fig, start: "top 82%", once: true },
            onComplete: () => { curtain.style.display = "none"; }
          });

          reveal
            .to(mark || {}, { autoAlpha: 0, duration: .35, ease: "power2.in" })
            .to(fill, Object.assign({ duration: 1.25, ease: "power4.inOut" }, vertical ? { scaleY: 0 } : { scaleX: 0 }), "-=0.1")
            .fromTo(picture, { scale: 1.14 }, { scale: 1, duration: 1.8, ease: "power3.out" }, "<");

          gsap.set(img, { scale: 1.08 });
          gsap.fromTo(img,
            { yPercent: i % 2 ? -3.5 : 3.5 },
            {
              yPercent: i % 2 ? 3.5 : -3.5,
              ease: "none",
              scrollTrigger: { trigger: fig, start: "top bottom", end: "bottom top", scrub: .6 }
            });
        });

        /* Scroll spy */
        const navLinks = $$(".nav-links a:not(.nav-cta)");
        $$("main section[id]").forEach((section) => {
          ScrollTrigger.create({
            trigger: section,
            start: "top 45%",
            end: "bottom 45%",
            onToggle: (self) => {
              navLinks.forEach((a) => {
                const match = a.getAttribute("href") === "#" + section.id;
                if (self.isActive) a.classList.toggle("active", match);
                else if (match) a.classList.remove("active");
              });
            }
          });
        });

        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => ScrollTrigger.refresh());
        }
      }
    }
  } catch (err) {
    logError("Scroll reveals failed", err);
    root.classList.add("no-gsap");
  }

  /* Request the italic display face only as the invitation approaches. */
  try {
    const invite = document.getElementById("invitation");
    if (invite && "IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          root.classList.add("italic-ready");
          io.disconnect();
        }
      }, { rootMargin: "0px 0px 150% 0px" });
      io.observe(invite);
    } else {
      root.classList.add("italic-ready");
    }
  } catch (err) {
    root.classList.add("italic-ready");
  }

  /* Solid nav once the hero is behind us. */
  try {
    const nav = $("[data-nav]");
    if (nav && opener) {
      let ticking = false;
      const update = () => {
        ticking = false;
        const threshold = opener.offsetHeight - nav.offsetHeight;
        nav.classList.toggle("is-solid", window.scrollY > threshold - 1);
      };
      window.addEventListener("scroll", () => {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
      }, { passive: true });
      window.addEventListener("resize", update, { passive: true });
      update();
    }
  } catch (err) {
    logError("Nav state failed", err);
  }

  /* ============================================================
     MOBILE MENU
  ============================================================ */

  const menuToggle = $("[data-menu-toggle]");
  const mobileMenu = $("[data-mobile-menu]");
  let closeMobileMenu = function () {};

  try {
    if (menuToggle && mobileMenu) {
      const menuClose = $("[data-menu-close]", mobileMenu);
      let hideTimer = null;

      const focusables = () => $$("a[href], button:not([disabled])", mobileMenu)
        .filter((el) => el.offsetParent !== null);

      const openMenu = () => {
        clearTimeout(hideTimer);
        mobileMenu.hidden = false;
        void mobileMenu.offsetWidth;   /* commit before transitioning */
        mobileMenu.classList.add("is-open");
        menuToggle.setAttribute("aria-expanded", "true");
        root.classList.add("menu-open");
        if (lenis) lenis.stop();
        const first = focusables()[0];
        if (first) first.focus({ preventScroll: true });
      };

      closeMobileMenu = (restoreFocus = true) => {
        if (!mobileMenu.classList.contains("is-open")) return;
        mobileMenu.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        root.classList.remove("menu-open");
        if (lenis && openerDone) lenis.start();
        hideTimer = setTimeout(() => { mobileMenu.hidden = true; }, reduceMotion ? 0 : 450);
        if (restoreFocus) menuToggle.focus({ preventScroll: true });
      };

      menuToggle.addEventListener("click", () => {
        if (mobileMenu.classList.contains("is-open")) closeMobileMenu();
        else openMenu();
      });

      if (menuClose) menuClose.addEventListener("click", () => closeMobileMenu());

      document.addEventListener("keydown", (event) => {
        if (!mobileMenu.classList.contains("is-open")) return;
        if (event.key === "Escape") {
          event.preventDefault();
          closeMobileMenu();
          return;
        }
        if (event.key === "Tab") {
          const items = focusables();
          if (!items.length) return;
          const first = items[0];
          const last = items[items.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      });

      /* Back to a desktop layout with the menu open: close it. */
      window.matchMedia("(min-width: 901px)").addEventListener("change", (mq) => {
        if (mq.matches) closeMobileMenu(false);
      });
    }
  } catch (err) {
    logError("Mobile menu failed", err);
  }

  /* ============================================================
     IN-PAGE LINKS — smooth, offset for the nav, intro-aware
  ============================================================ */

  try {
    document.addEventListener("click", (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link || event.defaultPrevented) return;
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const hash = link.getAttribute("href");
      if (hash.length < 2) return;
      const target = document.getElementById(hash.slice(1));
      if (!target) return;

      event.preventDefault();

      const fromMenu = mobileMenu && mobileMenu.contains(link);
      if (fromMenu) closeMobileMenu(false);

      const go = () => {
        scrollToTarget(target);
        if (target.id !== "top") {
          /* Move keyboard/screen-reader focus with the scroll. A target
             still waiting for its reveal can't take focus, so reveal it. */
          const reveal = revealTweens.get(target);
          if (reveal && reveal.progress() === 0) {
            if (reveal.scrollTrigger) reveal.scrollTrigger.kill(false, true);   /* keep the tween */
            reveal.progress(1);
            if (!reduceMotion) gsap.fromTo(target, { opacity: .001, y: 16 }, { opacity: 1, y: 0, duration: .8, ease: "power2.out" });
          }
          if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
        }
      };

      if (!openerDone && skipIntro && target.id !== "top") {
        skipIntro();
        requestAnimationFrame(() => requestAnimationFrame(go));
      } else {
        go();
      }
    });
  } catch (err) {
    logError("Anchor navigation failed", err);
  }

  /* ============================================================
     EVENT DATA & CALENDAR
     Single source of truth for the event time: 17:00 Tbilisi
     (UTC+4) = 13:00 UTC. Matches the invitation copy, the .ics file
     and the structured data in index.html.
  ============================================================ */

  const EVENT = {
    title: "Casa Gelso — Opening",
    details: "Casa Gelso opening in Tbilisi — accessible refinement, curated individuality, quiet confidence.",
    location: "Kostava St 67, Tbilisi, Georgia",
    startUTC: "20260912T130000Z",
    endUTC: "20260912T160000Z"
  };

  try {
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: EVENT.title,
      dates: EVENT.startUTC + "/" + EVENT.endUTC,
      details: EVENT.details,
      location: EVENT.location
    });
    const googleURL = "https://calendar.google.com/calendar/render?" + params.toString();
    $$("[data-cal-google]").forEach((a) => { a.href = googleURL; });
  } catch (err) {
    logError("Calendar setup failed", err);
  }

  /* ============================================================
     RSVP — Google Apps Script endpoint (unchanged).
     Payload: { name, attending, designers, wish } as text/plain JSON.
  ============================================================ */

  const RSVP_ENDPOINT =
    "https://script.google.com/macros/s/AKfycbxXpXlditvFs1H1dWB1iJyb_zy-y68-buSaxUceW5ZCiA-fp6GSuvZhTYiLFviBcEh_/exec";

  const rsvpForm = document.getElementById("rsvpForm");

  try {
    if (rsvpForm) {
      const statusEl = document.getElementById("rsvpFormStatus");
      const successEl = document.getElementById("rsvpSuccess");
      const submitBtn = $(".response-submit", rsvpForm);
      const submitLabel = submitBtn ? $(".btn-label", submitBtn) : null;
      const VALIDATED = ["name", "attending"];
      let isSubmitting = false;
      let showErrors = false;

      const fieldWrap = (name) => $('[data-field="' + name + '"]', rsvpForm);
      const errorEl = (name) => $('[data-error-for="' + name + '"]', rsvpForm);

      function setError(name, message) {
        const err = errorEl(name);
        const wrap = fieldWrap(name);
        if (err) {
          err.textContent = message;
          err.classList.toggle("is-visible", !!message);
        }
        if (wrap) wrap.classList.toggle("has-error", !!message);
        $$('[name="' + name + '"]', rsvpForm).forEach((input) => {
          if (message) input.setAttribute("aria-invalid", "true");
          else input.removeAttribute("aria-invalid");
        });
      }

      function showFormMessage(message) {
        if (!statusEl) return;
        statusEl.textContent = message;
        statusEl.classList.toggle("is-visible", !!message);
      }

      function readForm() {
        const fd = new FormData(rsvpForm);
        const get = (key) => String(fd.get(key) || "");
        return {
          name: get("name").trim(),
          attending: get("attending"),
          designers: get("designers").trim(),
          wish: get("wish").trim(),
          website: get("website")
        };
      }

      /* Returns the first invalid control, or null. */
      function validate(data) {
        let firstInvalid = null;
        setError("name", "");
        setError("attending", "");

        if (!data.name) {
          setError("name", t("errors.name"));
          firstInvalid = document.getElementById("rsvpName");
        }
        if (!data.attending) {
          setError("attending", t("errors.attending"));
          firstInvalid = firstInvalid || $('input[name="attending"]', rsvpForm);
        }
        return firstInvalid;
      }

      /* Errors clear as soon as the guest fixes a field; after a failed
         submit, they re-validate live so feedback stays accurate. */
      VALIDATED.forEach((name) => {
        $$('[name="' + name + '"]', rsvpForm).forEach((el) => {
          const handler = () => {
            if (!showErrors) return;
            const data = readForm();
            if (name === "name") setError("name", data.name ? "" : t("errors.name"));
            if (name === "attending") setError("attending", data.attending ? "" : t("errors.attending"));
            if (data.name && data.attending) showFormMessage("");
          };
          el.addEventListener("input", handler);
          el.addEventListener("change", handler);
        });
      });

      function submitRSVP(data) {
        const payload = {
          name: data.name,
          attending: data.attending,
          designers: data.designers,
          wish: data.wish
        };

        const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
        const timeoutId = controller ? setTimeout(() => controller.abort(), 12000) : null;

        return fetch(RSVP_ENDPOINT, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload),
          signal: controller ? controller.signal : undefined
        })
          .then(() => ({ ok: true }))
          .catch(() => ({ ok: false }))
          .finally(() => { if (timeoutId) clearTimeout(timeoutId); });
      }

      function renderSuccess(data) {
        if (!successEl) return;
        const attending = data.attending === "yes";
        const firstName = (data.name || "").trim().split(/\s+/)[0] || "";
        const eyebrow = $("[data-success-eyebrow]", successEl);
        const note = $("[data-success-note]", successEl);

        successEl.dataset.attending = attending ? "yes" : "no";
        successEl.dataset.firstName = firstName;

        if (eyebrow) eyebrow.textContent = attending ? t("success.reservedEyebrow") : t("success.declinedEyebrow");
        if (note) {
          note.textContent = attending
            ? (firstName ? t("success.reservedNote").replace("{name}", firstName) : t("success.reservedNoteNoName"))
            : t("success.declinedNote");
        }
        rsvpForm.hidden = true;
        successEl.hidden = false;
        successEl.focus({ preventScroll: true });
        const box = $("[data-response-experience]");
        if (box && box.getBoundingClientRect().top < 0) scrollToTarget(box);
      }

      function setLoading(loading) {
        isSubmitting = loading;
        if (!submitBtn) return;
        submitBtn.classList.toggle("is-loading", loading);
        submitBtn.disabled = loading;
        submitBtn.setAttribute("aria-busy", String(loading));
        if (submitLabel) submitLabel.textContent = loading ? t("wish.sending") : t("wish.send");
      }

      rsvpForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (isSubmitting) return;   /* Enter in a field while sending */

        const data = readForm();

        if (data.website) {          /* honeypot: drop silently */
          renderSuccess({ name: data.name, attending: "yes" });
          return;
        }

        const firstInvalid = validate(data);
        if (firstInvalid) {
          showErrors = true;
          showFormMessage(t("errors.checkFields"));
          firstInvalid.focus({ preventScroll: true });
          firstInvalid.scrollIntoView({ block: "center", behavior: reduceMotion ? "auto" : "smooth" });
          return;
        }

        showFormMessage("");
        setLoading(true);

        submitRSVP(data)
          .then((response) => {
            if (!response.ok) throw new Error("network");
            showErrors = false;
            renderSuccess(data);
          })
          .catch(() => showFormMessage(t("errors.network")))
          .finally(() => setLoading(false));
      });

      const againBtn = $("[data-rsvp-again]");
      if (againBtn) {
        againBtn.addEventListener("click", () => {
          rsvpForm.reset();
          showErrors = false;
          VALIDATED.forEach((name) => setError(name, ""));
          showFormMessage("");
          if (successEl) successEl.hidden = true;
          rsvpForm.hidden = false;
          const nameField = document.getElementById("rsvpName");
          if (nameField) nameField.focus();
        });
      }

      /* Re-translate visible feedback when the language changes. */
      document.addEventListener("casa:language-changed", () => {
        if (showErrors) validate(readForm());
        if (statusEl && statusEl.classList.contains("is-visible")) {
          showFormMessage(validate(readForm()) ? t("errors.checkFields") : t("errors.network"));
        }
        if (submitLabel && !isSubmitting) submitLabel.textContent = t("wish.send");
        if (successEl && !successEl.hidden) {
          renderSuccess({
            name: successEl.dataset.firstName || "",
            attending: successEl.dataset.attending
          });
        }
      });
    }
  } catch (err) {
    logError("RSVP failed to initialize", err);
  }

  /* ============================================================
     SOUND
  ============================================================ */

  const audio = document.getElementById("casaGelsoAudio");
  const soundButtons = $$("[data-sound-toggle]");
  let audioUnlocked = false;
  let pausedByVisibility = false;

  function syncSoundUI() {
    const on = !!audio && !audio.paused && !audio.muted;
    const label = on ? t("sound.on") : t("sound.off");
    soundButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(on));
      const text = $(".sound-label", button);
      if (text) text.textContent = label;
    });
  }

  function markAudioUnavailable() {
    soundButtons.forEach((button) => { button.hidden = true; });
  }

  function primeAudio() {
    if (!audio || audioUnlocked) return;
    audioUnlocked = true;
    audio.muted = false;
    try {
      const playing = audio.play();
      if (playing && typeof playing.then === "function") {
        playing.then(syncSoundUI).catch(() => {
          audioUnlocked = false;
          syncSoundUI();
        });
      }
    } catch (_) {
      audioUnlocked = false;
    }
    syncSoundUI();
  }

  try {
    if (audio) {
      try { audio.volume = 0.42; } catch (_) { /* read-only on iOS */ }
      audio.addEventListener("error", markAudioUnavailable);
      ["play", "pause", "volumechange"].forEach((name) => audio.addEventListener(name, syncSoundUI));

      soundButtons.forEach((button) => {
        button.addEventListener("click", () => {
          if (audio.paused || audio.muted) {
            audio.muted = false;
            audioUnlocked = true;
            const playing = audio.play();
            if (playing && typeof playing.catch === "function") {
              playing.catch(() => { if (audio.error) markAudioUnavailable(); syncSoundUI(); });
            }
          } else {
            audio.pause();
          }
          pausedByVisibility = false;
          syncSoundUI();
        });
      });

      document.addEventListener("visibilitychange", () => {
        if (document.hidden && !audio.paused) {
          audio.pause();
          pausedByVisibility = true;
        } else if (!document.hidden && pausedByVisibility) {
          pausedByVisibility = false;
          audio.play().catch(() => syncSoundUI());
        }
      });
    } else {
      markAudioUnavailable();
    }
  } catch (err) {
    logError("Sound setup failed", err);
  }

  /* ============================================================
     LANGUAGE
  ============================================================ */

  function applyLanguage(lang) {
    currentLang = SUPPORTED.indexOf(lang) > -1 ? lang : "en";
    root.lang = currentLang;
    storageSet("localStorage", "casa-gelso-language", currentLang);

    $$("[data-lang]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.lang === currentLang));
    });

    $$("[data-i18n]").forEach((el) => {
      const value = t(el.dataset.i18n);
      if (typeof value === "string") el.textContent = value;
    });
    $$("[data-i18n-placeholder]").forEach((el) => {
      const value = t(el.dataset.i18nPlaceholder);
      if (typeof value === "string") el.placeholder = value;
    });
    $$("[data-i18n-tooltip]").forEach((el) => {
      const value = t(el.dataset.i18nTooltip);
      if (typeof value === "string") el.dataset.tooltip = value;
    });
    $$("[data-i18n-aria]").forEach((el) => {
      const value = t(el.dataset.i18nAria);
      if (typeof value === "string") el.setAttribute("aria-label", value);
    });
    $$("[data-i18n-lang]").forEach((el) => el.setAttribute("lang", currentLang));

    syncSoundUI();
    document.dispatchEvent(new CustomEvent("casa:language-changed", { detail: { lang: currentLang } }));
    if (hasScrollTrigger) ScrollTrigger.refresh();
  }

  try {
    $$("[data-lang]").forEach((button) => {
      button.addEventListener("click", () => {
        if (button.dataset.lang !== currentLang) applyLanguage(button.dataset.lang);
      });
    });
    applyLanguage(currentLang);
  } catch (err) {
    logError("Language setup failed", err);
  }
})();
