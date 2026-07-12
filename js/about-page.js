/* ============================================================
   ABOUT / STORY PAGE
   ============================================================ */

/* ============================================================
   ★ EDIT YOUR IMAGES HERE ★
   This is the only place you need to touch to change which photo
   shows in the sticky card for each section. Just swap the `src`
   (and `alt`, for accessibility) — everything else updates itself.

   The key on the left (e.g. "block-about") must match the id on
   the matching <div class="journey-block"> in about.html.
   ============================================================ */
const CARD_IMAGES = {
    'block-about':    { src: 'assets/images/rafid_2.jpg',          alt: 'Portrait of Rafid Hossain' },
    'block-services': { src: 'assets/images/rafid_what_can.jpg',   alt: "Designer's workspace with monitor, plants and books" },
    'block-journey':  { src: 'assets/images/rafid_hossain.jpeg',   alt: 'Portrait of Rafid Hossain' },
    'block-tools':    { src: 'assets/images/ready_to_grow.jpg',    alt: 'Workspace and tools' },
};

document.addEventListener('DOMContentLoaded', () => {

    // Apply CARD_IMAGES above onto each matching block as data-image /
    // data-image-alt, so the rest of the script below works unchanged.
    Object.keys(CARD_IMAGES).forEach(id => {
        const block = document.getElementById(id);
        if (!block) return;
        block.setAttribute('data-image', CARD_IMAGES[id].src);
        block.setAttribute('data-image-alt', CARD_IMAGES[id].alt);
    });

    const blocks = document.querySelectorAll('.journey-block[data-image]');
    const layerA = document.getElementById('stickyImageA');
    const layerB = document.getElementById('stickyImageB');

    if (!blocks.length || !layerA || !layerB) return;

    // Set the initial image (the very first block's photo) before any
    // scrolling happens.
    const firstBlock = blocks[0];
    layerA.setAttribute('src', firstBlock.getAttribute('data-image'));
    layerA.setAttribute('alt', firstBlock.getAttribute('data-image-alt') || '');

    let currentSrc = layerA.getAttribute('src');
    const TRANSITION_MS = 600;
    let exitTimer = null;
    let rafId = null;

    // Track scroll direction so the animation always matches the
    // direction the user is actually scrolling in.
    let lastScrollY = window.scrollY;
    let scrollDir = 'down';
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (y > lastScrollY) scrollDir = 'down';
        else if (y < lastScrollY) scrollDir = 'up';
        lastScrollY = y;
    }, { passive: true });

    const ALL_STATE_CLASSES = ['is-active', 'is-exit-up', 'is-exit-down', 'is-enter-top', 'is-enter-bottom', 'no-transition'];

    
    // updated synchronously the moment swapTo() was called, even though
 
    function getActiveLayer() {
        return layerA.classList.contains('is-active') ? layerA : layerB;
    }

    function swapTo(src, alt) {
        if (!src || src === currentSrc) return;

        const outgoing = getActiveLayer();
        const incoming = outgoing === layerA ? layerB : layerA;

        // Cancel any previous in-flight transition so it can't apply its
        // classes after this newer call has already taken over the layers.
        if (rafId) cancelAnimationFrame(rafId);
        clearTimeout(exitTimer);

        const goingDown = scrollDir !== 'up';
        const enterClass = goingDown ? 'is-enter-bottom' : 'is-enter-top';
        const exitClass = goingDown ? 'is-exit-up' : 'is-exit-down';

        // Place the incoming layer off-frame on the correct side, with
        // transitions disabled so this jump itself isn't animated.
        incoming.classList.remove(...ALL_STATE_CLASSES);
        incoming.classList.add(enterClass, 'no-transition');
        incoming.setAttribute('src', src);
        incoming.setAttribute('alt', alt || '');

        // Force a reflow so the off-frame position is committed before
        // we animate away from it.
        void incoming.offsetWidth;

        rafId = requestAnimationFrame(() => {
            incoming.classList.remove('no-transition', enterClass);
            incoming.classList.add('is-active');

            outgoing.classList.remove('is-active');
            outgoing.classList.add(exitClass);
            rafId = null;
        });

        exitTimer = setTimeout(() => {
            outgoing.classList.remove('is-exit-up', 'is-exit-down');
        }, TRANSITION_MS + 60);

        currentSrc = src;
    }

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const src = entry.target.getAttribute('data-image');
                    const alt = entry.target.getAttribute('data-image-alt');
                    swapTo(src, alt);
                }
            });
        }, {
            root: null,
            rootMargin: '-45% 0px -45% 0px',
            threshold: 0
        });

        blocks.forEach(block => observer.observe(block));
    }

    /* -----------------------------------------------------------
       INSTANT PIN for the sticky image column.
       Pure CSS `position: sticky` only locks once the element's
       ----------------------------------------------------------- */
    const wrap = document.querySelector('.journey-page__sticky');
    const card = document.querySelector('.sticky-image-card');
    const grid = document.querySelector('.journey-page__grid');

    if (wrap && card && grid) {
        const MIN_TOP = 70;    // never go above this (clears the navbar)
        const DOWN_NUDGE = 10; // "a little bit down" from dead-center

        let ticking = false;

        function layoutPin() {
            const wrapRect = wrap.getBoundingClientRect();
            const gridRect = grid.getBoundingClientRect();

            const cardWidth = Math.min(380, wrapRect.width);
            const cardHeight = cardWidth * (476 / 340);

            // Vertically center the card in the viewport, nudged down a
            // little, but never let it creep above MIN_TOP.
            const centeredTop = (window.innerHeight - cardHeight) / 2 + DOWN_NUDGE;
            const pinnedTop = Math.max(MIN_TOP, centeredTop);

            const spaceBelowGridTop = gridRect.bottom - pinnedTop;

            if (spaceBelowGridTop <= cardHeight) {
                const wrapDocTop = wrapRect.top + window.scrollY;
                const gridDocBottom = gridRect.bottom + window.scrollY;
                const parkedTop = (gridDocBottom - cardHeight) - wrapDocTop;
                const parkedLeft = (wrapRect.width - cardWidth) / 2;

                card.classList.remove('is-pinned');
                card.classList.add('is-parked');
                card.style.left = parkedLeft + 'px';
                card.style.width = cardWidth + 'px';
                card.style.top = parkedTop + 'px';
            } else if (gridRect.top <= window.innerHeight) {
                // Section is in view (or already scrolled past) — pin now,
                // don't wait for the natural scroll position to catch up.
                const pinnedLeft = wrapRect.left + (wrapRect.width - cardWidth) / 2;

                card.classList.add('is-pinned');
                card.classList.remove('is-parked');
                card.style.left = pinnedLeft + 'px';
                card.style.width = cardWidth + 'px';
                card.style.top = pinnedTop + 'px';
            } else {
                card.classList.remove('is-pinned', 'is-parked');
                card.style.left = '';
                card.style.width = '';
                card.style.top = '';
            }
        }

        function onScrollOrResize() {
            if (!ticking) {
                requestAnimationFrame(() => {
                    layoutPin();
                    ticking = false;
                });
                ticking = true;
            }
        }

        window.addEventListener('scroll', onScrollOrResize, { passive: true });
        window.addEventListener('resize', onScrollOrResize);
        layoutPin();
    }
});