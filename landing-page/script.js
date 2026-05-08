document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.add('scrolled');
            navbar.classList.remove('scrolled');
            if (window.scrollY <= 50) {
                // strict check
                navbar.classList.remove('scrolled');
            }
        }
    });

    // --- Scroll Intersection Observer for Fade-in effects ---
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(
        entries, 
        observer
    ) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    fadeElements.forEach(el => {
        appearOnScroll.observe(el);
    });

    // --- Mockup Search Typing Effect ---
    const typingText = document.querySelector('.typing-text');
    const textToType = "Tìm kiếm: Lên kế hoạch marketing tuần tới...";
    let charIndex = 0;
    
    // reset text
    if (typingText) {
        typingText.textContent = "";
        
        function type() {
            if (charIndex < textToType.length) {
                typingText.textContent += textToType.charAt(charIndex);
                charIndex++;
                setTimeout(type, 100);
            } else {
                // loop after a pause
                setTimeout(() => {
                    typingText.textContent = "";
                    charIndex = 0;
                    type();
                }, 3000);
            }
        }
        
        // Start typing effect slightly after load
        setTimeout(type, 1000);
    }

    // --- Form Submit ---
    const ctaForm = document.getElementById('signup-form');
    if (ctaForm) {
        ctaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = ctaForm.querySelector('.cta-submit');
            const originalText = btn.innerHTML;
            
            // show loading
            btn.innerHTML = "Đang xử lý...";
            btn.style.opacity = '0.8';
            
            // simulate API call
            setTimeout(() => {
                btn.innerHTML = "🎉 Tuyệt vời! Hãy kiểm tra email nhé.";
                btn.style.background = "#27c93f";
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = "";
                    btn.style.opacity = '1';
                    ctaForm.reset();
                }, 3000);
            }, 1500);
        });
    }

    // --- Smooth Scrolling for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

});
