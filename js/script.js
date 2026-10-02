document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-menu a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    const prevButton = document.getElementById('hero-prev');
    const nextButton = document.getElementById('hero-next');

    if (slides.length) {
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
});

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

// --- EmailJS Integration for Contact Form ---
// Initialize EmailJS once using the provided public key.
if (typeof emailjs !== 'undefined' && typeof emailjs.init === 'function' && !window.__ecwaEmailJsInitialized) {
    emailjs.init("EhAitOgQxK53GnvBh");
    window.__ecwaEmailJsInitialized = true;
}

// handleFormSubmit: sends the contact form through EmailJS without using mailto.
function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('button');
    const originalBtnText = submitBtn ? submitBtn.textContent : 'Send Message';

    if (typeof validateContactForm === 'function' && !validateContactForm(form)) {
        return false;
    }

    if (!form.checkValidity()) {
        form.reportValidity();
        return false;
    }

    const name = form.querySelector('#name') ? form.querySelector('#name').value.trim() : '';
    const email = form.querySelector('#email') ? form.querySelector('#email').value.trim() : '';
    const phone = form.querySelector('#phone') ? form.querySelector('#phone').value.trim() : '';
    const subject = form.querySelector('#subject') ? form.querySelector('#subject').value.trim() : '';
    const message = form.querySelector('#message') ? form.querySelector('#message').value.trim() : '';

    // EmailJS template payload required by the configured template.
    const templateParams = {
        name,
        email,
        phone,
        subject,
        message
    };

    // While the form is being submitted, disable the button and show progress.
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
    }

    if (typeof emailjs === 'undefined' || typeof emailjs.send !== 'function') {
        showToast('Email service is unavailable right now. Please try again later.', 'error');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
        return false;
    }

    // Send the form to the configured EmailJS service and template.
    emailjs.send('service_fk8wvv8', 'template_jippfir', templateParams)
        .then(function() {
            showToast('Your message has been sent successfully. We will get back to you soon.', 'success');
            form.reset();
            if (submitBtn) {
                submitBtn.textContent = 'Send Message';
                submitBtn.disabled = false;
            }
        })
        .catch(function(error) {
            console.error('EmailJS send error:', error);
            showToast('There was a problem sending your message. Please try again.', 'error');
            if (submitBtn) {
                submitBtn.textContent = 'Send Message';
                submitBtn.disabled = false;
            }
        });

    return false;
}

// Notification helper for success and error states without changing the page design.
function showToast(message, type = 'info', timeout = 5000) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.setAttribute('role', 'status');
    toast.style.cssText = 'position: fixed; right: 20px; bottom: 20px; z-index: 9999; min-width: 240px; padding: 12px 16px; border-radius: 10px; color: #fff; font-family: Poppins, Inter, sans-serif; box-shadow: 0 8px 24px rgba(0,0,0,0.12); font-size: 14px;';

    if (type === 'success') {
        toast.style.background = 'linear-gradient(90deg, #1e3c72, #2a5298)';
    } else if (type === 'error') {
        toast.style.background = 'linear-gradient(90deg, #d9534f, #b52a2a)';
    } else {
        toast.style.background = 'rgba(20,67,96,0.95)';
    }

    document.body.appendChild(toast);
    setTimeout(function() {
        toast.style.transition = 'opacity 300ms ease, transform 300ms ease';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(12px)';
        setTimeout(function() {
            toast.remove();
        }, 350);
    }, timeout);
}
