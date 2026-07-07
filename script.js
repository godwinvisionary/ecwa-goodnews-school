// Hamburger Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when a link is clicked
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Set active link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-menu a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Hero slider
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    const prevButton = document.getElementById('hero-prev');
    const nextButton = document.getElementById('hero-next');

    if (!slides.length) return;

    let currentSlide = 0;
    let intervalId;

    function showSlide(index) {
        currentSlide = (index + slides.length) % slides.length;
        slides.forEach((slide, slideIndex) => {
            slide.classList.toggle('active', slideIndex === currentSlide);
        });
        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle('active', dotIndex === currentSlide);
        });
    }

    function startAutoPlay() {
        clearInterval(intervalId);
        intervalId = setInterval(() => showSlide(currentSlide + 1), 6000);
    }

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            showSlide(currentSlide - 1);
            startAutoPlay();
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            showSlide(currentSlide + 1);
            startAutoPlay();
        });
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const targetIndex = Number(dot.getAttribute('data-slide'));
            showSlide(targetIndex);
            startAutoPlay();
        });
    });

    showSlide(0);
    startAutoPlay();
}

// Form submission handler
function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const recipient = 'godwinvisionary@gamil.com';
    const name = (formData.get('name') || formData.get('full_name') || 'Unknown').toString().trim();
    const email = (formData.get('email') || '').toString().trim();
    const phone = (formData.get('phone') || formData.get('guardian_phone') || '').toString().trim();
    const subject = (formData.get('subject') || 'Online Registration Request').toString().trim();
    const message = (formData.get('message') || '').toString().trim();

    const bodyLines = [
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        '',
        'Message:',
        message || 'No additional message provided.'
    ];

    const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;

    window.location.href = mailtoLink;
    alert(`Your email app should open with a message ready to send to ${recipient}.`);
    form.reset();

    return false;
}

// Gallery lightbox effect (optional enhancement)
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            if (this.querySelector('img')) {
                const img = this.querySelector('img');
                const modal = document.createElement('div');
                modal.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.9);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                    cursor: pointer;
                `;
                
                const fullImg = document.createElement('img');
                fullImg.src = img.src;
                fullImg.style.cssText = `
                    max-width: 90%;
                    max-height: 90%;
                    border-radius: 8px;
                `;
                
                modal.appendChild(fullImg);
                modal.addEventListener('click', () => modal.remove());
                document.body.appendChild(modal);
            }
        });
    });
}

// Initialize gallery on page load
document.addEventListener('DOMContentLoaded', initGallery);
document.addEventListener('DOMContentLoaded', initHeroSlider);

// Intersection Observer for fade-in animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                if (entry.target.classList.contains('stat-item')) {
                    animateCounter(entry.target.querySelector('h3'));
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function animateCounter(element) {
    if (!element) return;

    const target = Number(element.getAttribute('data-count')) || 0;
    const suffix = element.textContent.includes('+') ? '+' : element.textContent.includes('%') ? '%' : '';
    const numericTarget = Number(String(target).replace(/\D/g, ''));

    if (!numericTarget) return;

    let current = 0;
    const step = Math.max(1, Math.ceil(numericTarget / 40));
    const timer = setInterval(() => {
        current += step;
        if (current >= numericTarget) {
            current = numericTarget;
            clearInterval(timer);
        }
        element.textContent = `${current}${suffix}`;
    }, 30);
}

document.addEventListener('DOMContentLoaded', initScrollAnimations);

// Add scroll effect to navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
        } else {
            navbar.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
        }
    }
});

// Contact form validation
function validateContactForm(form) {
    const email = form.querySelector('input[name="email"]');
    const message = form.querySelector('textarea[name="message"]');
    
    if (!email.value.includes('@')) {
        alert('Please enter a valid email address');
        return false;
    }
    
    if (message.value.trim().length < 10) {
        alert('Please enter a message with at least 10 characters');
        return false;
    }
    
    return true;
}
