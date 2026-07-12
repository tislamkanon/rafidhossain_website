/* ============================================================
   PROJECTS LIST PAGE
   Data-driven project list + featured project + pagination.

   TO ADD A NEW PROJECT:
   Just add a new object to the PROJECTS array below — everything
   else (grid, pagination, page count) updates automatically.
   Set "featured: true" on exactly one project to control which
   one appears in the big Featured Project block up top.
   ============================================================ */

const PROJECTS = [
    {
        id: 'project-1',
        title: 'Looppix Eid Al Adha Teaser',
        image: 'assets/project_img/project_1.png',
        tags: ['Social Media'],
        description: 'Used a humor-led Eid teaser with sunglasses-wearing cattle to promote Looppix\'s Qurbani creative work.',
        link: '#',
        featured: true
    },
    {
        id: 'project-2',
        title: 'EMOIRE x Eid Al Adha',
        image: 'assets/project_img/project_2.jpg',
        tags: ['Branding'],
        description: 'Wrote the hook and festive copy for EMOIRE\'s Eid Al Adha push, tying their Oud De Velours scent to the feeling of the celebration itself.',
        link: '#'
    },
    {
        id: 'project-3',
        title: 'Viral Hair Treatment Campaign',
        image: 'assets/project_img/project_3.jpg',
        tags: ['Trending'],
        description: 'Used a trending Bangla wordplay to call out hair fall and hook attention, then linked straight to the brand\'s treatments.',
        link: '#'
    },
    {
        id: 'project-4',
        title: 'Muyar Product Campaign',
        image: 'assets/project_img/project_4.png',
        tags: ['Branding'],
        description: 'Wrote punchy product copy for Muyar\'s Pickled Young Ginger, spotlighting the crunch and zing it adds to every bite.',
        link: '#'
    },
    {
        id: 'project-5',
        title: 'EPS x Eid',
        image: 'assets/project_img/project_5.jpg',
        tags: ['Strategy'],
        description: 'Wrote the bilingual hook for EPS\'s Eid Mobarok campaign, positioning their payment gateway dashboard as the tool that doubles a merchant\'s festive earnings.',
        link: '#'
    },
];

const PROJECTS_PER_PAGE = 6;

document.addEventListener('DOMContentLoaded', () => {

    const featuredMount = document.getElementById('featuredProject');
    const featured = PROJECTS.find(p => p.featured) || PROJECTS[0];

    /* ---------------------------------------------------------
       ALL PROJECTS GRID + PAGINATION
       --------------------------------------------------------- */
    const gridMount = document.getElementById('projectsGrid');
    const paginationMount = document.getElementById('projectsPagination');
    // The full list of projects (the featured one also stays visible here)
    const listProjects = PROJECTS;

    let currentPage = 1;
    const totalPages = Math.max(1, Math.ceil(listProjects.length / PROJECTS_PER_PAGE));

    const revealObserver = 'IntersectionObserver' in window
        ? new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 })
        : null;

    function viewIcon() {
        return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>`;
    }

    function renderCard(project) {
        return `
            <article class="project-list-card reveal">
                <div class="project-list-card__image">
                    <img src="${project.image}" alt="${escapeHtml(project.title)}" loading="lazy" />
                </div>
                <div class="project-list-card__body">
                    <div class="project-list-card__tags">
                        ${project.tags.map(t => `<span class="project-list-card__tag">${escapeHtml(t)}</span>`).join('')}
                    </div>
                    <h3 class="project-list-card__title">${escapeHtml(project.title)}</h3>
                    <p class="project-list-card__desc">${escapeHtml(project.description)}</p>
                    <button type="button" class="project-list-card__view" data-lightbox-image="${escapeHtml(project.image)}" data-lightbox-title="${escapeHtml(project.title)}">View Project ${viewIcon()}</button>
                </div>
            </article>
        `;
    }

    function renderGrid(page) {
        if (!gridMount) return;

        if (!listProjects.length) {
            gridMount.innerHTML = `<p class="projects-empty">No projects yet — check back soon.</p>`;
            return;
        }

        const start = (page - 1) * PROJECTS_PER_PAGE;
        const pageItems = listProjects.slice(start, start + PROJECTS_PER_PAGE);
        gridMount.innerHTML = pageItems.map(renderCard).join('');

        // Wire up reveal-on-scroll for freshly injected cards
        const newReveals = gridMount.querySelectorAll('.reveal');
        if (revealObserver) {
            newReveals.forEach(el => revealObserver.observe(el));
        } else {
            newReveals.forEach(el => el.classList.add('in-view'));
        }
    }

    function renderPagination(page) {
        if (!paginationMount) return;

        if (totalPages <= 1) {
            paginationMount.innerHTML = '';
            return;
        }

        let buttons = '';

        buttons += `<button type="button" class="pagination__btn" data-page="${page - 1}" ${page === 1 ? 'disabled' : ''} aria-label="Previous page">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>`;

        const pageNumbers = getPageNumbers(page, totalPages);
        pageNumbers.forEach(entry => {
            if (entry === '...') {
                buttons += `<span class="pagination__ellipsis">…</span>`;
            } else {
                buttons += `<button type="button" class="pagination__btn ${entry === page ? 'is-active' : ''}" data-page="${entry}" aria-label="Page ${entry}" ${entry === page ? 'aria-current="page"' : ''}>${entry}</button>`;
            }
        });

        buttons += `<button type="button" class="pagination__btn" data-page="${page + 1}" ${page === totalPages ? 'disabled' : ''} aria-label="Next page">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>`;

        paginationMount.innerHTML = buttons;

        paginationMount.querySelectorAll('[data-page]').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetPage = parseInt(btn.getAttribute('data-page'), 10);
                if (!targetPage || targetPage < 1 || targetPage > totalPages || targetPage === currentPage) return;
                goToPage(targetPage);
            });
        });
    }

    function getPageNumbers(page, total) {
        const delta = 1;
        const range = [];
        const rangeWithDots = [];
        let last;

        for (let i = 1; i <= total; i++) {
            if (i === 1 || i === total || (i >= page - delta && i <= page + delta)) {
                range.push(i);
            }
        }

        range.forEach(i => {
            if (last) {
                if (i - last === 2) {
                    rangeWithDots.push(last + 1);
                } else if (i - last > 2) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            last = i;
        });

        return rangeWithDots;
    }

    function goToPage(page) {
        currentPage = page;
        renderGrid(currentPage);
        renderPagination(currentPage);

        const gridSection = document.getElementById('allProjects');
        if (gridSection) {
            gridSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    /* ---------------------------------------------------------
       FEATURED PROJECT
       --------------------------------------------------------- */
    if (featuredMount && featured) {
        featuredMount.innerHTML = `
            <div class="featured-project__card reveal">
                <div class="featured-project__image">
                    <span class="featured-project__badge">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.26L21.5 9l-4.9 4.36L17.8 21 12 17.27 6.2 21l1.2-7.64L2.5 9l6.6-.74z"/></svg>
                        Featured
                    </span>
                    <img src="${featured.image}" alt="${escapeHtml(featured.title)}" loading="lazy" />
                </div>
                <div class="featured-project__body">
                    <div class="featured-project__tags">
                        ${featured.tags.map(t => `<span class="featured-project__tag">${escapeHtml(t)}</span>`).join('')}
                    </div>
                    <h3 class="featured-project__title">${escapeHtml(featured.title)}</h3>
                    <p class="featured-project__desc">${escapeHtml(featured.description)}</p>
                    <button type="button" class="btn btn--outline" data-lightbox-image="${escapeHtml(featured.image)}" data-lightbox-title="${escapeHtml(featured.title)}">View Project</button>
                </div>
            </div>
        `;
        const featuredReveal = featuredMount.querySelector('.reveal');
        if (featuredReveal) {
            if (revealObserver) revealObserver.observe(featuredReveal);
            else featuredReveal.classList.add('in-view');
        }
    }

    renderGrid(currentPage);
    renderPagination(currentPage);

    /* ---------------------------------------------------------
       IMAGE LIGHTBOX
       Clicking "View Project" opens the full project image right
       on this page (no navigation, no new tab). Closes via the
       close button, an overlay click, or the Escape key.
       --------------------------------------------------------- */
    let lightbox = document.getElementById('projectLightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'projectLightbox';
        lightbox.className = 'project-lightbox';
        lightbox.setAttribute('aria-hidden', 'true');
        lightbox.innerHTML = `
            <div class="project-lightbox__overlay" data-lightbox-close></div>
            <div class="project-lightbox__content" role="dialog" aria-modal="true" aria-label="Project image">
                <button type="button" class="project-lightbox__close" data-lightbox-close aria-label="Close">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>
                </button>
                <img class="project-lightbox__image" src="" alt="" />
            </div>
        `;
        document.body.appendChild(lightbox);
    }

    const lightboxImg = lightbox.querySelector('.project-lightbox__image');
    let lastFocused = null;

    function openLightbox(src, alt) {
        lightboxImg.setAttribute('src', src);
        lightboxImg.setAttribute('alt', alt || '');
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('lightbox-open');
        lastFocused = document.activeElement;
        const closeBtn = lightbox.querySelector('.project-lightbox__close');
        if (closeBtn) closeBtn.focus();
    }

    function closeLightbox() {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('lightbox-open');
        if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }

    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-lightbox-image]');
        if (trigger) {
            e.preventDefault();
            openLightbox(trigger.getAttribute('data-lightbox-image'), trigger.getAttribute('data-lightbox-title'));
            return;
        }
        if (e.target.closest('[data-lightbox-close]')) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
            closeLightbox();
        }
    });

    /* ---------------------------------------------------------
       HELPERS
       --------------------------------------------------------- */
    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
});