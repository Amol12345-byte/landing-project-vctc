// ===== 1. COUNTDOWN TIMER =====
(function () {
    const el = document.getElementById('countdown');
    if (!el) return;
    // Fixed batch start date: 30 May 2026
    const target = new Date('2026-05-30T09:00:00');
    function update() {
        const diff = target - new Date();
        if (diff <= 0) { el.textContent = 'Batch Started!'; return; }
        const d = Math.floor(diff / 864e5), h = Math.floor((diff % 864e5) / 36e5),
            m = Math.floor((diff % 36e5) / 6e4), s = Math.floor((diff % 6e4) / 1e3);
        el.textContent = `${d}d ${h}h ${m}m ${s}s`;
    }
    update();
    setInterval(update, 1000);
})();

// ===== 2. FAQ ACCORDION =====
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const answer = item.querySelector('.faq-answer');
        const isOpen = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(i => {
            i.classList.remove('active');
            i.querySelector('.faq-answer').style.maxHeight = null;
        });
        if (!isOpen) {
            item.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + 'px';
        }
    });
});

// ===== 3. STICKY CTA =====
const stickyCta = document.getElementById('stickyCta');
if (stickyCta) {
    window.addEventListener('scroll', () => {
        stickyCta.classList.toggle('visible', window.scrollY > 600);
    });
}

// ===== 4. MOBILE HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
    document.querySelectorAll('.nav-links a').forEach(a => {
        a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
}

// ===== 5. SCROLL FADE-UP ANIMATION =====
const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });

document.querySelectorAll(
    '.course-card, .feature-card, .placement-card, .testimonial-card, .learn-item, .faq-item, .pain-card, .audience-card, .module-card, .outcome-card, .tool-tag, .video-card, .offer-card'
).forEach(el => {
    el.classList.add('fade-up');
    fadeObserver.observe(el);
});

// ===== 6. FORM SUBMISSION =====
const SHEET_WEBHOOK = 'https://script.google.com/macros/s/AKfycby5_8V8Jlq0-6vZLCraKmdT7S6NXFEpJBar8VKSdC01icLm2nU3Ll3vX2eMNnaD-Nv58A/exec';
const WHATSAPP_COMMUNITY = 'https://chat.whatsapp.com/LJskefhC0BF1xlN8c5Kc6X';

const form = document.getElementById('leadForm');
if (form) {
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;

        // Collect form data
        const leadData = {
            name: form.querySelector('[name="fullName"]').value.trim(),
            phone: form.querySelector('[name="whatsapp"]').value.trim(),
            email: form.querySelector('[name="email"]').value.trim(),
            experience: form.querySelector('[name="testingExperience"]').value,
            course: form.querySelector('[name="courseInterest"]').value,
            city: form.querySelector('[name="currentCity"]').value.trim()
        };

        // Show loading state on button
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Please wait...';
        btn.disabled = true;

        // Step 1: Send data to Google Sheets (no-cors, silent fail)
        try {
            await fetch(SHEET_WEBHOOK, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(leadData)
            });
        } catch (err) {
            console.warn('Sheet save failed:', err);
        }

        // Step 2: Fire Meta Pixel Lead event AFTER successful form submit + sheet save
        if (typeof fbq === 'function') {
            fbq('track', 'Lead');
        }

        // Step 3: Reset button immediately
        btn.innerHTML = originalText;
        btn.disabled = false;
        form.reset();

        // Step 4: Show Thank You modal
        const overlay = document.getElementById('tyOverlay');
        if (overlay) overlay.classList.add('active');

        // Step 5: When lead clicks "Join Community", also open WhatsApp personal message
        const joinBtn = document.getElementById('joinCommunityBtn');
        if (joinBtn) {
            joinBtn.addEventListener('click', function () {
                const msg = encodeURIComponent(
                    `Hi VCTC! I just registered for the *${leadData.course}* batch (30 May 2026).\n\n` +
                    `Name: ${leadData.name}\n` +
                    `Phone: ${leadData.phone}\n` +
                    `City: ${leadData.city}\n` +
                    `Experience: ${leadData.experience}\n\n` +
                    `Please confirm my registration. 🙏`
                );
                setTimeout(() => {
                    window.open(`https://wa.me/919923478751?text=${msg}`, '_blank');
                }, 800);
            }, { once: true });
        }
    });
}

// Close Thank You modal
const tyClose = document.getElementById('tyClose');
const tyOverlay = document.getElementById('tyOverlay');
if (tyClose && tyOverlay) {
    tyClose.addEventListener('click', () => tyOverlay.classList.remove('active'));
    tyOverlay.addEventListener('click', (e) => {
        if (e.target === tyOverlay) tyOverlay.classList.remove('active');
    });
}

// ===== 7. SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

function activateCourseTab(targetId) {
    document.querySelectorAll('.course-tab, .course-detail-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.target === targetId);
    });
    document.querySelectorAll('.course-detail').forEach(panel => {
        panel.classList.toggle('active', panel.id === targetId);
    });
}

const courseTabs = document.querySelectorAll('.course-tab, .course-detail-tab');
const courseInterestSelect = document.getElementById('courseInterest');
const courseLinks = document.querySelectorAll('.course-link');

courseTabs.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.target;
        if (!target) return;
        activateCourseTab(target);
        const targetSection = document.getElementById(target);
        if (targetSection) targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (courseInterestSelect) courseInterestSelect.value = btn.textContent.trim();
    });
});

courseLinks.forEach(link => {
    link.addEventListener('click', () => {
        const target = link.dataset.target;
        if (!target) return;
        activateCourseTab(target);
        if (courseInterestSelect) courseInterestSelect.value = link.dataset.course;
    });
});

window.addEventListener('load', () => {
    const hash = window.location.hash.slice(1);
    if (hash && document.getElementById(hash)) {
        activateCourseTab(hash);
    } else {
        // Default to ATT as first active course
        activateCourseTab('course-att');
    }
});

// ===== 8. ANIMATED NUMBER COUNTERS =====
(function () {
    const counters = document.querySelectorAll('.stat-num[data-target]');
    if (!counters.length) return;

    const counterObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            if (el.dataset.counted) return;
            el.dataset.counted = 'true';

            const target = parseFloat(el.dataset.target);
            const suffix = el.dataset.suffix || '';
            const isDecimal = el.dataset.decimal === 'true';
            const duration = 2000;
            const startTime = performance.now();

            function animate(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = eased * target;

                if (isDecimal) {
                    el.textContent = current.toFixed(1) + suffix;
                } else {
                    el.textContent = Math.floor(current).toLocaleString() + suffix;
                }

                if (progress < 1) requestAnimationFrame(animate);
            }
            requestAnimationFrame(animate);
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));
})();

// ===== 9. LIVE VIEWER COUNT =====
(function () {
    const el = document.getElementById('viewerCount');
    if (!el) return;
    let count = 280 + Math.floor(Math.random() * 120); // 280-400
    el.textContent = count;

    setInterval(() => {
        const change = Math.floor(Math.random() * 7) - 3; // -3 to +3
        count = Math.max(180, Math.min(500, count + change));
        el.textContent = count;
    }, 3000);
})();

// ===== 10. SOCIAL PROOF NOTIFICATION POPUPS =====
(function () {
    const popup = document.getElementById('socialProofPopup');
    if (!popup) return;

    const nameEl = document.getElementById('proofName');
    const actionEl = document.getElementById('proofAction');
    const timeEl = document.getElementById('proofTime');
    const avatarEl = document.getElementById('proofAvatar');
    const closeBtn = document.getElementById('proofClose');

    const proofs = [
        { name: 'Rahul from Pune', action: 'just enrolled in Software Testing course', initials: 'RP' },
        { name: 'Sneha from Mumbai', action: 'booked a free demo class', initials: 'SM' },
        { name: 'Amit from Nashik', action: 'just enrolled in Playwright course', initials: 'AK' },
        { name: 'Priya from Pune', action: 'downloaded the course syllabus', initials: 'PD' },
        { name: 'Vishal from Kolhapur', action: 'just enrolled in Python + Selenium', initials: 'VK' },
        { name: 'Anjali from Pune', action: 'booked a free career counselling', initials: 'AS' },
        { name: 'Nikhil from Solapur', action: 'just enrolled in ATT + AI course', initials: 'NK' },
        { name: 'Meera from Aurangabad', action: 'just enrolled in Software Testing', initials: 'MJ' },
        { name: 'Rohan from Pune', action: 'booked a free demo class', initials: 'RG' },
        { name: 'Deepak from Nagpur', action: 'just enrolled in Playwright course', initials: 'DT' },
    ];

    const times = ['just now', '1 minute ago', '2 minutes ago', '3 minutes ago', '5 minutes ago'];
    let index = 0;
    let dismissed = false;

    closeBtn.addEventListener('click', () => {
        popup.classList.remove('show');
        dismissed = true;
        // Re-enable after 60 seconds
        setTimeout(() => { dismissed = false; }, 60000);
    });

    function showProof() {
        if (dismissed) return;
        const proof = proofs[index % proofs.length];
        nameEl.textContent = proof.name;
        actionEl.textContent = proof.action;
        timeEl.textContent = times[Math.floor(Math.random() * times.length)];
        avatarEl.textContent = proof.initials;
        popup.classList.add('show');

        // Hide after 4 seconds
        setTimeout(() => {
            popup.classList.remove('show');
        }, 4000);

        index++;
    }

    // First popup after 5 seconds, then every 15 seconds
    setTimeout(() => {
        showProof();
        setInterval(showProof, 15000);
    }, 5000);
})();

// ===== TESTIMONIALS INFINITE SCROLL CLONE =====
(function () {
    const scroll = document.querySelector('.testimonials-scroll');
    if (!scroll) return;
    // Clone all cards and append for seamless loop
    const cards = Array.from(scroll.children);
    cards.forEach(card => {
        const clone = card.cloneNode(true);
        scroll.appendChild(clone);
    });
})();

// ===== REVIEW IMAGES INFINITE SCROLL CLONE =====
(function () {
    // Clone both rows for seamless infinite loop
    document.querySelectorAll('.reviews-row-1, .reviews-row-2').forEach(scroll => {
        const cards = Array.from(scroll.children);
        cards.forEach(card => scroll.appendChild(card.cloneNode(true)));
    });
})();
