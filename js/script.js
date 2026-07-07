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
