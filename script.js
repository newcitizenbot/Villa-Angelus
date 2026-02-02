// ===== FONCTIONNALITÉS AVANCÉES =====

// 1. Scroll progress bar
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// 2. Back to top button
function initBackToTop() {
    const backToTop = document.createElement('div');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTop.setAttribute('aria-label', 'Til toppen');
    document.body.appendChild(backToTop);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 3. Scroll animations
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    fadeElements.forEach(el => observer.observe(el));
}

// 4. Navigation sticky avec effet
function initStickyNav() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// 5. Gestionnaire de modals
function initModals() {
    // Modal de bienvenue (première visite)
    const firstVisit = !sessionStorage.getItem('villa_visited');
    
    if (firstVisit) {
        setTimeout(() => {
            showModal('welcome-modal', `
                <h3>Velkommen til Villa Angelus!</h3>
                <p>Vi er glade for at du besøker vår nettside. Her finner du all informasjon om vår vakre eiendom i Provence.</p>
                <p>For spørsmål eller bestillinger, kontakt oss gjerne direkte.</p>
                <p><strong>Solveig & Laurent</strong></p>
            `);
            sessionStorage.setItem('villa_visited', 'true');
        }, 2000);
    }
    
    // Système de modal générique
    window.showModal = function(id, content) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = id;
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div class="modal-body">${content}</div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Animation
        setTimeout(() => modal.classList.add('active'), 10);
        
        // Fermeture
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                setTimeout(() => modal.remove(), 300);
            }
        });
    };
}

// 6. Toast notifications
function showToast(message, type = 'success', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, duration);
}

// 7. Sélecteur de langue
function initLanguageSwitcher() {
    const langBtn = document.querySelector('.lang-btn');
    const langDropdown = document.querySelector('.lang-dropdown');
    
    if (langBtn && langDropdown) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('show');
        });
        
        // Fermer en cliquant ailleurs
        document.addEventListener('click', () => {
            langDropdown.classList.remove('show');
        });
    }
}

// 8. Partage sur réseaux sociaux
function initSocialShare() {
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = btn.dataset.platform;
            const url = window.location.href;
            const title = document.title;
            
            let shareUrl = '';
            
            switch(platform) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
                    break;
                case 'email':
                    shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;
                    break;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
}

// 9. Calculatrice de prix
function initPriceCalculator() {
    const calculator = document.getElementById('price-calculator');
    if (!calculator) return;
    
    const seasonSelect = calculator.querySelector('#season');
    const guestsInput = calculator.querySelector('#guests');
    const nightsInput = calculator.querySelector('#nights');
    const linenCheck = calculator.querySelector('#linen');
    const resultElement = calculator.querySelector('#price-result');
    
    function calculatePrice() {
        const season = seasonSelect.value;
        const guests = parseInt(guestsInput.value) || 0;
        const nights = parseInt(nightsInput.value) || 0;
        const linen = linenCheck.checked;
        
        if (guests < 1 || nights < 1) {
            resultElement.textContent = 'Vennligst fyll ut alle feltene';
            return;
        }
        
        // Prix de base
        const weeklyRate = season === 'high' ? 3000 : 2500;
        const dailyRate = weeklyRate / 7;
        
        // Calcul
        let total = dailyRate * nights;
        
        // Frais supplémentaires
        if (linen) {
            total += guests * 25;
        }
        
        // Frais de ménage
        total += 250;
        
        // Caution
        const deposit = 300;
        
        // Affichage
        resultElement.innerHTML = `
            <strong>Estimert pris: ${total.toFixed(0)} €</strong><br>
            <small>+ Depositum: ${deposit} € (returneres)</small><br>
            <small>Ankomst/avreise: Lørdag</small>
        `;
    }
    
    // Écouteurs d'événements
    [seasonSelect, guestsInput, nightsInput, linenCheck].forEach(input => {
        input.addEventListener('change', calculatePrice);
        input.addEventListener('input', calculatePrice);
    });
    
    // Calcul initial
    calculatePrice();
}

// 10. Galerie améliorée avec navigation
function initEnhancedGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length === 0) return;
    
    let currentIndex = 0;
    const images = Array.from(galleryItems).map(item => item.querySelector('img').src);
    
    // Navigation clavier
    document.addEventListener('keydown', (e) => {
        const lightbox = document.querySelector('.lightbox-overlay');
        if (!lightbox) return;
        
        if (e.key === 'ArrowRight') {
            navigateGallery(1);
        } else if (e.key === 'ArrowLeft') {
            navigateGallery(-1);
        } else if (e.key === 'Escape') {
            document.querySelector('.lightbox-close').click();
        }
    });
    
    function navigateGallery(direction) {
        currentIndex = (currentIndex + direction + images.length) % images.length;
        document.querySelector('.lightbox-image').src = images[currentIndex];
    }
    
    // Ajouter des boutons de navigation à la lightbox
    const originalOpenLightbox = window.openLightbox;
    window.openLightbox = function(src) {
        originalOpenLightbox(src);
        currentIndex = images.indexOf(src);
        
        setTimeout(() => {
            const lightbox = document.querySelector('.lightbox-overlay');
            if (lightbox && images.length > 1) {
                // Bouton suivant
                const nextBtn = document.createElement('button');
                nextBtn.className = 'gallery-nav gallery-next';
                nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
                nextBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    navigateGallery(1);
                });
                
                // Bouton précédent
                const prevBtn = document.createElement('button');
                prevBtn.className = 'gallery-nav gallery-prev';
                prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
                prevBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    navigateGallery(-1);
                });
                
                lightbox.appendChild(nextBtn);
                lightbox.appendChild(prevBtn);
            }
        }, 100);
    };
}

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Chargement initial
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = '<div class="loader-spinner"></div>';
    document.body.appendChild(loader);
    
    // Masquer le loader après chargement
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            setTimeout(() => loader.remove(), 500);
        }, 500);
    });
    
    // Initialiser toutes les fonctionnalités
    initScrollProgress();
    initBackToTop();
    initScrollAnimations();
    initStickyNav();
    initLazyLoading();
    preloadPages();
    initModals();
    initLanguageSwitcher();
    initSocialShare();
    initPriceCalculator();
    initEnhancedGallery();
    

});


// Menu mobile
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }
    
    // Fermer le menu en cliquant sur un lien
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (menuToggle) {
                    const icon = menuToggle.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            }
            
            // Mettre à jour la classe active
            navLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Gallery lightbox
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img) {
                const imgSrc = img.src;
                openLightbox(imgSrc);
            }
        });
    });
    
    // Fonction lightbox
    function openLightbox(src) {
        const overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';
        
        const img = document.createElement('img');
        img.src = src;
        img.className = 'lightbox-image';
        
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.className = 'lightbox-close';
        
        overlay.appendChild(img);
        overlay.appendChild(closeBtn);
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';
        
        // Fermer en cliquant
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay || e.target === closeBtn) {
                document.body.removeChild(overlay);
                document.body.style.overflow = 'auto';
            }
        });
        
        // Fermer avec ESC
        document.addEventListener('keydown', function closeOnEsc(e) {
            if (e.key === 'Escape') {
                if (document.body.contains(overlay)) {
                    document.body.removeChild(overlay);
                    document.body.style.overflow = 'auto';
                }
                document.removeEventListener('keydown', closeOnEsc);
            }
        });
    }
    
    // Filtrage des photos
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                const galleryItems = document.querySelectorAll('.gallery-item');
                
                galleryItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    if (filterValue === 'alle' || filterValue === 'all' || category === filterValue) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Smooth scroll pour les ancres
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Formulaire de contact
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalContent = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sender...';
            submitBtn.disabled = true;
            
            // Simuler l'envoi
            setTimeout(() => {
                // Récupérer les données du formulaire
                const formData = new FormData(this);
                const name = formData.get('name') || '';
                const email = formData.get('email') || '';
                const subject = formData.get('subject') || '';
                const message = formData.get('message') || '';
                const arrival = formData.get('arrival') || '';
                const departure = formData.get('departure') || '';
                const guests = formData.get('guests') || '';
                
                // Créer le corps de l'email
                const emailBody = `
Forespørsel fra Villa Angelus nettside:

Navn: ${name}
E-post: ${email}
Emne: ${subject}
Ankomstdato: ${arrival}
Avreisedato: ${departure}
Antall gjester: ${guests}

Melding:
${message}
                `.trim();
                
                // Créer le lien mailto
                const subjectLine = subject ? `Forespørsel: ${subject}` : 'Forespørsel fra nettsiden';
                const mailtoLink = `mailto:VillaAngelus83@gmail.com?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(emailBody)}`;
                
                // Afficher confirmation
                if (confirm('Takk for din melding! Vi åpner e-postklienten din for å sende meldingen. Klikk OK for å fortsette.')) {
                    window.open(mailtoLink, '_blank');
                }
                
                // Réinitialiser le formulaire
                this.reset();
                submitBtn.innerHTML = originalContent;
                submitBtn.disabled = false;
                
            }, 1500);
        });
    }
    
    // Gestion des inputs date
    const dateInputs = document.querySelectorAll('input[placeholder*="dato"], input[placeholder*="date"]');
    dateInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.type = 'date';
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.type = 'text';
            }
        });
    });
    
    // Ajuster la hauteur des images de galerie pour mobile
    function adjustGalleryForMobile() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        if (galleryItems.length > 0 && window.innerWidth < 768) {
            galleryItems.forEach(item => {
                item.style.height = '200px';
            });
        }
    }
    
    window.addEventListener('resize', adjustGalleryForMobile);
    adjustGalleryForMobile();
});

// ===== OPTIMISATIONS PERFORMANCE =====

// 1. Lazy loading pour images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// 2. Préchargement des pages
function preloadPages() {
    const links = document.querySelectorAll('a[href^="pages/"]');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            const href = link.getAttribute('href');
            if (href && !document.querySelector(`link[href="${href}"]`)) {
                const preloadLink = document.createElement('link');
                preloadLink.rel = 'prefetch';
                preloadLink.href = href;
                document.head.appendChild(preloadLink);
            }
        });
    });
}

// 3. Cache des données
const villaCache = {
    set: function(key, data) {
        try {
            localStorage.setItem(`villa_${key}`, JSON.stringify({
                data: data,
                timestamp: Date.now()
            }));
        } catch (e) {
            console.log('LocalStorage non disponible');
        }
    },
    
    get: function(key, maxAge = 3600000) { // 1 heure par défaut
        try {
            const item = localStorage.getItem(`villa_${key}`);
            if (!item) return null;
            
            const parsed = JSON.parse(item);
            if (Date.now() - parsed.timestamp > maxAge) {
                localStorage.removeItem(`villa_${key}`);
                return null;
            }
            
            return parsed.data;
        } catch (e) {
            return null;
        }
    }
};