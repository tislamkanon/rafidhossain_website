/* ============================================================
   Made By MD Touhidul Islam Kanon
   main.js — all site interactivity
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     THEME TOGGLE (desktop navbar + mobile menu)
     --------------------------------------------------------- */
  const htmlEl = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const mobileThemeToggle = document.getElementById('mobileThemeToggle');

  function getCurrentTheme() {
    return htmlEl.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function setThemeUI(theme) {
    const isDark = theme === 'dark';
    [themeToggle, mobileThemeToggle].forEach(btn => {
      if (btn) btn.setAttribute('aria-checked', String(isDark));
    });
  }

  function toggleTheme() {
    const next = getCurrentTheme() === 'dark' ? 'light' : 'dark';
    htmlEl.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) { /* no-op */ }
    setThemeUI(next);
  }

  // Sync toggle UI with whatever theme the inline head-script already applied
  setThemeUI(getCurrentTheme());

  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  if (mobileThemeToggle) mobileThemeToggle.addEventListener('click', toggleTheme);

  /* ---------------------------------------------------------
     NAVBAR SCROLL COLLAPSE (State A <-> State B)
     --------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const heroSection = document.getElementById('home');
  let lastScrollY = window.scrollY;

  function updateNavbarState() {
    if (!navbar) return;
    // On pages with a hero (#home), collapse once we're just past it.
    // On pages without one (about.html, projects_list.html, etc.),
    // fall back to a small fixed scroll distance so the navbar still
    // collapses/retracts normally.
    const threshold = heroSection ? heroSection.offsetHeight * 0.55 : 120;
    const currentY = window.scrollY;
    const scrollingDown = currentY > lastScrollY;

    if (currentY > threshold) {
      if (scrollingDown) {
        navbar.classList.add('navbar--collapsed');
      } else {
        navbar.classList.remove('navbar--collapsed');
      }
    } else {
      navbar.classList.remove('navbar--collapsed');
    }

    lastScrollY = currentY <= 0 ? 0 : currentY;
  }

  window.addEventListener('scroll', updateNavbarState, { passive: true });
  updateNavbarState();

  /* ---------------------------------------------------------
     MOBILE MENU
     --------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuLinks = document.querySelectorAll('.navbar__mobile-links .mobile-menu__link, .navbar__mobile-bottom .mobile-menu__link--cta');

  function openMobileMenu() {
    if (!mobileMenu || !navbar) return;
    navbar.classList.add('navbar--mobile-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburger?.setAttribute('aria-expanded', 'true');
    hamburger?.setAttribute('aria-label', 'Close menu');
  }

  function closeMobileMenu() {
    if (!mobileMenu || !navbar) return;
    navbar.classList.remove('navbar--mobile-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger?.setAttribute('aria-expanded', 'false');
    hamburger?.setAttribute('aria-label', 'Open menu');
  }

  hamburger?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (navbar?.classList.contains('navbar--mobile-open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close when tapping outside the expanded pill
  document.addEventListener('click', (e) => {
    if (!navbar?.classList.contains('navbar--mobile-open')) return;
    if (!navbar.contains(e.target)) {
      closeMobileMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navbar?.classList.contains('navbar--mobile-open')) {
      closeMobileMenu();
    }
  });

  /* ---------------------------------------------------------
     HERO IMAGE 3D SCROLL TRAVEL (desktop/tablet only)
     The card starts docked in the hero. On scroll it detaches,
     flips to its dark back face while travelling down into the
     "What I Can Do" image slot, dwells there, then continues
     down and flips back to the front face as it settles into
     the "About Me" image slot. Fully reversible on scroll up.
     Disabled on mobile (<=768px) and prefers-reduced-motion,
     where the card just stays put (no flip, no travel).
     --------------------------------------------------------- */
  const heroImageWrap = document.getElementById('heroImageWrap');
  const heroImage = document.getElementById('heroImage');
  const heroFrontFaceImg = document.getElementById('heroFrontFaceImg');
  const servicesSection = document.getElementById('services');
  const aboutSection = document.getElementById('about');
  const servicesSlot = document.getElementById('servicesImageSlot');
  const aboutSlot = document.getElementById('aboutImageSlot');
  const heroTravelQuery = window.matchMedia('(min-width: 769px)');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const HERO_FRONT_SRC = 'assets/images/rafid_hossain.jpeg';
  const HERO_FRONT_ALT = 'Portrait of Rafid Hossain wearing a beige suit';
  const ABOUT_FRONT_SRC = 'assets/images/rafid_2.jpg';
  const ABOUT_FRONT_ALT = 'Portrait of Rafid Hossain';
  let currentFrontLeg = 0; // 0 = showing hero photo, 1 = showing about photo

  let travelActive = false;

  function clamp01(n) { return Math.max(0, Math.min(1, n)); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  function setFrontFaceLeg(leg) {
    if (!heroFrontFaceImg || currentFrontLeg === leg) return;
    if (leg === 1) {
      heroFrontFaceImg.setAttribute('src', ABOUT_FRONT_SRC);
      heroFrontFaceImg.setAttribute('alt', ABOUT_FRONT_ALT);
    } else {
      heroFrontFaceImg.setAttribute('src', HERO_FRONT_SRC);
      heroFrontFaceImg.setAttribute('alt', HERO_FRONT_ALT);
    }
    currentFrontLeg = leg;
  }

  function activateTravel() {
    if (travelActive) return;
    document.body.appendChild(heroImage);
    document.documentElement.classList.add('hero-travel-active');
    travelActive = true;
  }

  function deactivateTravel() {
    if (!travelActive) {
      // Even if never activated, make sure the node lives in its slot
      if (heroImage.parentElement !== heroImageWrap) heroImageWrap.appendChild(heroImage);
      return;
    }
    heroImageWrap.appendChild(heroImage);
    heroImage.style.position = '';
    heroImage.style.top = '';
    heroImage.style.left = '';
    heroImage.style.width = '';
    heroImage.style.height = '';
    heroImage.style.setProperty('--p', 0);
    setFrontFaceLeg(0);
    document.documentElement.classList.remove('hero-travel-active');
    travelActive = false;
  }

  function updateHeroTravel() {
    if (!travelActive) return;

    const scrollY = window.scrollY;

    // Anchor rects, read live every tick so accordion toggles / resizes
    // self-correct without needing extra listeners.
    const heroRect = heroImageWrap.getBoundingClientRect();
    const servicesRect = servicesSlot.getBoundingClientRect();
    const aboutRect = aboutSlot.getBoundingClientRect();

    const heroDoc = { top: heroRect.top + scrollY, left: heroRect.left, width: heroRect.width, height: heroRect.height };
    const servicesDoc = { top: servicesRect.top + scrollY, left: servicesRect.left, width: servicesRect.width, height: servicesRect.height };
    const aboutDoc = { top: aboutRect.top + scrollY, left: aboutRect.left, width: aboutRect.width, height: aboutRect.height };

    // Scroll thresholds — mirrors the original hero-flip timing pattern
    const leg1Start = heroSection.offsetTop + heroSection.offsetHeight * 0.5;
    const leg1End = servicesSection.offsetTop;
    const leg2Start = servicesSection.offsetTop + servicesSection.offsetHeight * 0.5;
    const leg2End = aboutSection.offsetTop;

    const p1 = clamp01((scrollY - leg1Start) / Math.max(leg1End - leg1Start, 1));
    const p2 = clamp01((scrollY - leg2Start) / Math.max(leg2End - leg2Start, 1));

    let fromDoc, toDoc, legProgress, rotationBase;
    if (scrollY <= leg2Start) {
      fromDoc = heroDoc; toDoc = servicesDoc; legProgress = p1; rotationBase = 0;
    } else {
      fromDoc = servicesDoc; toDoc = aboutDoc; legProgress = p2; rotationBase = 1;
    }

    // Swap the front face's photo only while it's turned away from the
    // viewer (mid-flip / during the services dwell), so the change is
    // never visible mid-scroll.
    setFrontFaceLeg(rotationBase);

    const currentDocTop = lerp(fromDoc.top, toDoc.top, legProgress);
    const currentLeft = lerp(fromDoc.left, toDoc.left, legProgress);
    const currentWidth = lerp(fromDoc.width, toDoc.width, legProgress);
    const currentHeight = lerp(fromDoc.height, toDoc.height, legProgress);

    heroImage.style.top = (currentDocTop - scrollY) + 'px';
    heroImage.style.left = currentLeft + 'px';
    heroImage.style.width = currentWidth + 'px';
    heroImage.style.height = currentHeight + 'px';

    const p = rotationBase + legProgress; // 0 -> 2 across the whole journey
    heroImage.style.setProperty('--p', p.toFixed(4));
  }

  function refreshHeroTravelMode() {
    if (heroTravelQuery.matches && !prefersReducedMotion) {
      activateTravel();
      updateHeroTravel();
    } else {
      deactivateTravel();
    }
  }

  const heroTravelReady = heroImageWrap && heroImage && servicesSection && aboutSection && servicesSlot && aboutSlot;

  if (heroTravelReady) {
    refreshHeroTravelMode();
    window.addEventListener('scroll', updateHeroTravel, { passive: true });
    window.addEventListener('resize', debounce(() => {
      refreshHeroTravelMode();
      updateHeroTravel();
    }, 100));

    if (heroTravelQuery.addEventListener) {
      heroTravelQuery.addEventListener('change', refreshHeroTravelMode);
    } else if (heroTravelQuery.addListener) {
      // Safari < 14 fallback
      heroTravelQuery.addListener(refreshHeroTravelMode);
    }
  }

  /* ---------------------------------------------------------
     ACTIVE NAV LINK (desktop navbar links only)
     --------------------------------------------------------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (sections.length && navLinks.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => link.classList.remove('active'));
          const match = document.querySelector(`.nav-link[data-target="${entry.target.id}"]`);
          match?.classList.add('active');
        }
      });
    }, { threshold: 0.4, rootMargin: '-20% 0px -40% 0px' });

    sections.forEach(section => navObserver.observe(section));
  }

  /* ---------------------------------------------------------
     ACCORDION (Services list) — one open at a time
     --------------------------------------------------------- */
  const accordionItems = document.querySelectorAll('.accordion__item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion__header');
    const panel = item.querySelector('.accordion__panel');
    if (!header || !panel) return;

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      accordionItems.forEach(other => {
        other.classList.remove('is-open');
        other.querySelector('.accordion__header')?.setAttribute('aria-expanded', 'false');
        const otherPanel = other.querySelector('.accordion__panel');
        if (otherPanel) otherPanel.style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('is-open');
        header.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  /* ---------------------------------------------------------
     STAT COUNTERS (About section + Testimonials cards)
     Animate 0 -> target every time the element scrolls into view
     --------------------------------------------------------- */
  const statEls = document.querySelectorAll('.stat__num[data-count], .card__stat-num[data-count]');
  const statFrameIds = new WeakMap();

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1200;
    const startTime = performance.now();

    // Cancel any in-progress animation on this element first
    const existingId = statFrameIds.get(el);
    if (existingId) cancelAnimationFrame(existingId);

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress); // easeOutQuad
      const current = Math.floor(target * eased);
      el.textContent = current + suffix;

      if (progress < 1) {
        statFrameIds.set(el, requestAnimationFrame(tick));
      } else {
        el.textContent = target + suffix;
        statFrameIds.delete(el);
      }
    }

    statFrameIds.set(el, requestAnimationFrame(tick));
  }

  if (statEls.length) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
        } else {
          // Reset so it plays again next time it scrolls into view
          const existingId = statFrameIds.get(entry.target);
          if (existingId) cancelAnimationFrame(existingId);
          statFrameIds.delete(entry.target);
          const suffix = entry.target.getAttribute('data-suffix') || '';
          entry.target.textContent = '0' + suffix;
        }
      });
    }, { threshold: 0.5 });

    statEls.forEach(el => statObserver.observe(el));
  }

  /* ---------------------------------------------------------
     PROJECTS CAROUSEL — auto-clone cards for a seamless,
     endless right-to-left scroll. Works with any number of
     project cards: just edit the HTML inside .projects__track,
     no manual duplication needed.
     --------------------------------------------------------- */
  const projectsTrack = document.querySelector('.projects__track');

  if (projectsTrack) {
    const originalCards = Array.from(projectsTrack.children);

    if (originalCards.length) {
      // Clone the real set once and mark the clones as decorative,
      // so the track always contains exactly two identical halves.
      originalCards.forEach(card => {
        const clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.querySelectorAll('a').forEach(a => a.setAttribute('tabindex', '-1'));
        projectsTrack.appendChild(clone);
      });

      // Measure the exact distance from the start of the track to the
      // start of the cloned (repeated) set. With flex `gap`, two
      // concatenated sets of N cards only have (2N-1) gaps total, so
      // assuming the repeat point is exactly 50% of the track width is
      // off by half a gap — which is what caused the visible jump/reset
      // each loop. Measuring the real boundary makes it exact no matter
      // how many cards are added later.
      function measureProjectsShift() {
        const firstClone = projectsTrack.children[originalCards.length];
        if (!firstClone) return;
        const trackRect = projectsTrack.getBoundingClientRect();
        const cloneRect = firstClone.getBoundingClientRect();
        const shiftPx = cloneRect.left - trackRect.left;

        projectsTrack.style.setProperty('--projects-shift', `-${shiftPx}px`);

        // Keep scroll speed constant no matter how many cards are added.
        const pixelsPerSecond = 55;
        const duration = Math.max(shiftPx / pixelsPerSecond, 8);
        projectsTrack.style.animationDuration = duration + 's';
      }

      measureProjectsShift();

      // Card width is viewport-relative (min(320px, 62vw)), so re-measure
      // after resize to keep the loop seamless at any screen size.
      let projectsResizeTimer = null;
      window.addEventListener('resize', () => {
        clearTimeout(projectsResizeTimer);
        projectsResizeTimer = setTimeout(measureProjectsShift, 200);
      }, { passive: true });
    }
  }

  /* ---------------------------------------------------------
     REVEAL ON SCROLL (.reveal -> .in-view)
     --------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ---------------------------------------------------------
     SMOOTH SCROLL for in-page anchor links
     --------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ---------------------------------------------------------
     CONTACT FORM — validation + EmailJS submit

     ★ EDIT YOUR EMAILJS KEYS HERE ★
     Fill these in with the values from your EmailJS dashboard
     (see the setup steps in the chat for exactly where to find
     each one). Nothing else in this file needs to change.
     --------------------------------------------------------- */
  const EMAILJS_PUBLIC_KEY = 'Zt08FqYtF8zhOMw-p';   // Account -> General -> Public Key
  const EMAILJS_SERVICE_ID = 'service_99ymq9y';   // Email Services -> your service's ID
  const EMAILJS_TEMPLATE_ID = 'template_u97vs1p'; // Email Templates -> your template's ID

  if (window.emailjs && EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    const fields = ['name', 'email', 'service', 'message'];
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const submitBtnDefaultText = submitBtn ? submitBtn.textContent : '';

    function showError(fieldName, message) {
      const input = contactForm.querySelector(`#${fieldName}`);
      const errorEl = contactForm.querySelector(`[data-error-for="${fieldName}"]`);
      input?.classList.add('is-invalid');
      if (errorEl) errorEl.textContent = message;
    }

    function clearErrors() {
      fields.forEach(name => {
        const input = contactForm.querySelector(`#${name}`);
        const errorEl = contactForm.querySelector(`[data-error-for="${name}"]`);
        input?.classList.remove('is-invalid');
        if (errorEl) errorEl.textContent = '';
      });
    }

    function isValidEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function showFormError(message) {
      let banner = contactForm.querySelector('.form__banner-error');
      if (!banner) {
        banner = document.createElement('p');
        banner.className = 'form__banner-error';
        contactForm.insertBefore(banner, submitBtn);
      }
      banner.textContent = message;
    }

    function clearFormError() {
      const banner = contactForm.querySelector('.form__banner-error');
      if (banner) banner.remove();
    }

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();
      clearFormError();

      let valid = true;
      const nameVal = contactForm.querySelector('#name')?.value.trim() || '';
      const emailVal = contactForm.querySelector('#email')?.value.trim() || '';
      const serviceVal = contactForm.querySelector('#service')?.value || '';
      const messageVal = contactForm.querySelector('#message')?.value.trim() || '';

      if (!nameVal) { showError('name', 'Please enter your name.'); valid = false; }
      if (!emailVal || !isValidEmail(emailVal)) { showError('email', 'Please enter a valid email.'); valid = false; }
      if (!serviceVal) { showError('service', 'Please select a service.'); valid = false; }
      if (!messageVal) { showError('message', 'Please tell me a bit about your project.'); valid = false; }

      if (!valid) return;

      if (!window.emailjs || EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
        showFormError('Email sending isn\'t set up yet. Add your EmailJS keys in js/script.js.');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        name: nameVal,
        email: emailVal,
        service: serviceVal,
        message: messageVal,
        title: `New enquiry from ${nameVal}`
      }).then(() => {
        contactForm.hidden = true;
        if (formSuccess) formSuccess.hidden = false;

        setTimeout(() => {
          contactForm.reset();
          contactForm.hidden = false;
          if (formSuccess) formSuccess.hidden = true;
        }, 4000);
      }).catch((err) => {
        console.error('EmailJS send failed:', err);
        showFormError('Something went wrong sending your message — please try again or email me directly.');
      }).finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtnDefaultText;
        }
      });
    });
  }

  /* ---------------------------------------------------------
     FOOTER YEAR
     --------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});

/* ---------------------------------------------------------
   DEBOUNCE HELPER
   --------------------------------------------------------- */
function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}