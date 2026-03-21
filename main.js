/* =============================================================
   SCREEN VR STUDIOS — main.js
   ============================================================= */

'use strict';

/* ---- Footer: auto-update copyright year ---- */
document.querySelectorAll('#footer-year').forEach(el => {
    el.textContent = new Date().getFullYear();
});


/* ---- Header: shrink / shadow on scroll ---- */
const header = document.getElementById('site-header');
if (header) {
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
}


/* ---- Hamburger menu ---- */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

function closeMobileNav() {
    if (!mobileNav || !hamburger) return;
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
}

if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
        const isOpen = mobileNav.classList.toggle('open');
        mobileNav.setAttribute('aria-hidden', String(!isOpen));
        hamburger.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close when a mobile nav link is clicked
    mobileNav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMobileNav);
    });

    // Close when clicking outside the header
    document.addEventListener('click', e => {
        if (header && !header.contains(e.target)) closeMobileNav();
    });
}


/* ---- Active nav link (based on current page filename) ---- */
(function highlightActiveNav() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href') || '';
        const isActive = href === page || (page === '' && href === 'index.html');
        link.classList.toggle('active', isActive);
    });
})();


/* ---- Scroll-reveal animation ---- */
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ---- Stat counter animation ---- */
function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    if (!target || target === 0) return;

    const suffix = el.dataset.suffix || '';

    if (el.dataset.instant === 'true') {
        el.textContent = target.toLocaleString() + suffix;
        return;
    }

    const duration = 1800;
    const step     = target / (duration / 16);
    let current    = 0;

    const tick = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current).toLocaleString();
        if (current >= target) {
            el.textContent = target.toLocaleString() + suffix;
            clearInterval(tick);
        }
    }, 16);
}

const statObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => statObserver.observe(el));


/* ---- Games filter (games.html) ---- */
const filterBtns  = document.querySelectorAll('.filter-btn');
const gamesGrid   = document.getElementById('games-grid');

if (filterBtns.length && gamesGrid) {
    const allCards = Array.from(gamesGrid.querySelectorAll('.game-card'));

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            allCards.forEach(card => {
                const match = filter === 'all' || card.dataset.genre === filter;

                if (match) {
                    card.style.display = '';
                    // Re-trigger the reveal animation
                    card.classList.remove('visible');
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => card.classList.add('visible'));
                    });
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}


/* ---- Contact form (contact.html) ---- */
const contactForm  = document.getElementById('contact-form');
const formSuccess  = document.getElementById('form-success');

if (contactForm) {
    contactForm.addEventListener('submit', e => {
        e.preventDefault();

        // Clear previous error states
        contactForm.querySelectorAll('input, textarea').forEach(f => f.classList.remove('error'));

        // Validate required fields
        let valid = true;
        contactForm.querySelectorAll('[required]').forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                valid = false;
            }
        });

        if (!valid) return;

        const submitBtn  = contactForm.querySelector('button[type="submit"]');
        const origText   = submitBtn.textContent;

        submitBtn.textContent = 'Sending…';
        submitBtn.disabled    = true;

        /*
         * TODO: Replace this timeout with a real form submission.
         * e.g., fetch('/api/contact', { method: 'POST', body: new FormData(contactForm) })
         */
        setTimeout(() => {
            submitBtn.textContent = origText;
            submitBtn.disabled    = false;
            contactForm.reset();
            if (formSuccess) {
                formSuccess.classList.add('visible');
                setTimeout(() => formSuccess.classList.remove('visible'), 6000);
            }
        }, 1200);
    });

    // Remove error highlight when user starts typing
    contactForm.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('input', () => field.classList.remove('error'));
    });
}
