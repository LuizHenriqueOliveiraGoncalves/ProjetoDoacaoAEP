
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }

    // Modal functionality
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const registerBtnHero = document.getElementById('registerBtnHero');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const closeLoginModal = document.getElementById('closeLoginModal');
    const closeRegisterModal = document.getElementById('closeRegisterModal');
    const showRegisterModal = document.getElementById('showRegisterModal');
    const showLoginModal = document.getElementById('showLoginModal');

    // Open modals
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.style.display = 'block';
        });
    }

    if (registerBtn) {
        registerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            registerModal.style.display = 'block';
        });
    }

    if (registerBtnHero) {
        registerBtnHero.addEventListener('click', function(e) {
            e.preventDefault();
            registerModal.style.display = 'block';
        });
    }

    // Close modals
    if (closeLoginModal) {
        closeLoginModal.addEventListener('click', function() {
            loginModal.style.display = 'none';
        });
    }

    if (closeRegisterModal) {
        closeRegisterModal.addEventListener('click', function() {
            registerModal.style.display = 'none';
        });
    }

    // Switch between modals
    if (showRegisterModal) {
        showRegisterModal.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.style.display = 'none';
            registerModal.style.display = 'block';
        });
    }

    if (showLoginModal) {
        showLoginModal.addEventListener('click', function(e) {
            e.preventDefault();
            registerModal.style.display = 'none';
            loginModal.style.display = 'block';
        });
    }

    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (e.target === registerModal) {
            registerModal.style.display = 'none';
        }
    });

    // Register type selection logic
    const regType = document.getElementById('regType');
    const businessFields = document.querySelectorAll('.business-field');
    const ngoFields = document.querySelectorAll('.ngo-field');

    if (regType) {
        regType.addEventListener('change', function() {
            if (this.value === 'business') {
                businessFields.forEach(field => field.style.display = 'block');
                ngoFields.forEach(field => field.style.display = 'none');
            } else if (this.value === 'ngo') {
                businessFields.forEach(field => field.style.display = 'none');
                ngoFields.forEach(field => field.style.display = 'block');
            } else {
                businessFields.forEach(field => field.style.display = 'none');
                ngoFields.forEach(field => field.style.display = 'none');
            }
        });
    }

    // Form submissions
    const contactForm = document.getElementById('contactForm');
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showToast('Mensagem enviada com sucesso!');
            this.reset();
        });
    }
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showToast('Inscrição realizada com sucesso!');
            this.reset();
        });
    }

    // Toast notification
    function showToast(message) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        setTimeout(function() {
            toast.classList.remove('show');
        }, 3000);
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href') !== '#' && 
                !this.getAttribute('id')?.includes('show') && 
                this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (!targetId) return;
                
                const targetElement = document.querySelector(targetId);
                if (!targetElement) return;
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header scroll effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.padding = '10px 0';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.padding = '15px 0';
            header.style.boxShadow = '';
        }
    });

    // Initialize any other components
    window.addEventListener('load', function() {
        // Initialization code here if needed
    });
});
