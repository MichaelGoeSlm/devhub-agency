/**
 * DevHub Agency - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    initMobileMenu();
    
    // Language Selector
    initLangSelector();
    
    // FAQ Accordion
    initFAQ();
    
    // Smooth Scroll
    initSmoothScroll();
    
    // Navbar Scroll Effect
    initNavbarScroll();
});

/**
 * Mobile Menu
 */
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const navLinks = document.querySelector('.nav-links'); // For backward compatibility
    
    if (!menuBtn) return;
    
    menuBtn.addEventListener('click', function() {
        menuBtn.classList.toggle('active');
        
        // Support both old and new mobile nav structures
        if (mobileNav) {
            mobileNav.classList.toggle('active');
        }
        if (navLinks) {
            navLinks.classList.toggle('active');
        }
    });
    
    // Close menu when clicking a link
    const allLinks = document.querySelectorAll('.mobile-nav a, .nav-links a');
    allLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            if (mobileNav) mobileNav.classList.remove('active');
            if (navLinks) navLinks.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuBtn.contains(e.target) && 
            (!mobileNav || !mobileNav.contains(e.target)) &&
            (!navLinks || !navLinks.contains(e.target))) {
            menuBtn.classList.remove('active');
            if (mobileNav) mobileNav.classList.remove('active');
            if (navLinks) navLinks.classList.remove('active');
        }
    });
}

/**
 * Language Selector
 */
function initLangSelector() {
    // Update all lang buttons active state
    function updateLangDisplay(lang) {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });
    }
    
    // Set initial display
    const currentLang = localStorage.getItem('devhub-lang') || 'fr';
    updateLangDisplay(currentLang);
    
    // Handle language button clicks (use event delegation for reliability)
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.lang-btn');
        if (btn) {
            e.preventDefault();
            const lang = btn.getAttribute('data-lang');
            
            // Call setLanguage from i18n.js
            if (typeof setLanguage === 'function') {
                setLanguage(lang);
            } else {
                // Fallback: save to localStorage and reload
                localStorage.setItem('devhub-lang', lang);
                location.reload();
            }
            
            updateLangDisplay(lang);
        }
    });
}

/**
 * FAQ Accordion
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (!question) return;
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(other => {
                if (other !== item) {
                    other.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

/**
 * Smooth Scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (!target) return;
            
            e.preventDefault();
            
            const navbar = document.querySelector('.navbar');
            const navHeight = navbar ? navbar.offsetHeight : 70;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/**
 * Navbar scroll effect
 */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });
}
