/**
 * INTERACTIONS MINIMALES - Remplace webflow.js (1.7MB → 3KB!)
 * Fonctionnalités : Menu mobile + Sliders + Animations d'apparition
 */

(function() {
  'use strict';

  // ========== 1. MENU MOBILE ==========
  function initMobileNav() {
    const navButtons = document.querySelectorAll('.w-nav-button');
    const navMenus = document.querySelectorAll('.w-nav-menu');
    
    navButtons.forEach((button, index) => {
      const menu = navMenus[index];
      if (!menu) return;
      
      button.addEventListener('click', function() {
        const isOpen = menu.classList.contains('w--open');
        
        if (isOpen) {
          menu.classList.remove('w--open');
          button.classList.remove('w--open');
        } else {
          menu.classList.add('w--open');
          button.classList.add('w--open');
        }
      });
    });
    
    // Fermer le menu mobile au clic à l'extérieur
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.w-nav')) {
        navMenus.forEach(menu => menu.classList.remove('w--open'));
        navButtons.forEach(btn => btn.classList.remove('w--open'));
      }
    });
  }

  // ========== 2. SLIDERS ==========
  function initSliders() {
    const sliders = document.querySelectorAll('.w-slider');
    
    sliders.forEach(slider => {
      const mask = slider.querySelector('.w-slider-mask');
      const slides = slider.querySelectorAll('.w-slide');
      const leftArrow = slider.querySelector('.w-slider-arrow-left');
      const rightArrow = slider.querySelector('.w-slider-arrow-right');
      const nav = slider.querySelector('.w-slider-nav');
      
      if (slides.length === 0) return;
      
      let currentIndex = 0;
      const slideCount = slides.length;
      
      // Créer les dots de navigation
      if (nav) {
        nav.innerHTML = '';
        for (let i = 0; i < slideCount; i++) {
          const dot = document.createElement('div');
          dot.className = 'w-slider-dot' + (i === 0 ? ' w-active' : '');
          dot.addEventListener('click', () => goToSlide(i));
          nav.appendChild(dot);
        }
      }
      
      function goToSlide(index) {
        currentIndex = index;
        
        // Cacher toutes les slides
        slides.forEach(slide => slide.style.display = 'none');
        
        // Afficher la slide courante
        slides[currentIndex].style.display = 'block';
        
        // Mettre à jour les dots
        if (nav) {
          const dots = nav.querySelectorAll('.w-slider-dot');
          dots.forEach((dot, i) => {
            dot.classList.toggle('w-active', i === currentIndex);
          });
        }
      }
      
      function nextSlide() {
        currentIndex = (currentIndex + 1) % slideCount;
        goToSlide(currentIndex);
      }
      
      function prevSlide() {
        currentIndex = (currentIndex - 1 + slideCount) % slideCount;
        goToSlide(currentIndex);
      }
      
      // Événements des flèches
      if (leftArrow) leftArrow.addEventListener('click', prevSlide);
      if (rightArrow) rightArrow.addEventListener('click', nextSlide);
      
      // Auto-play si configuré
      const autoplay = slider.getAttribute('data-autoplay') === 'true';
      const delay = parseInt(slider.getAttribute('data-delay') || '4000');
      
      if (autoplay) {
        setInterval(nextSlide, delay);
      }
      
      // Initialiser
      goToSlide(0);
    });
  }

  // ========== 3. ANIMATIONS D'APPARITION ==========
  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-w-id]');
    
    if (animatedElements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translate3d(0, 0, 0) scale3d(1, 1, 1)';
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => {
      observer.observe(el);
    });
  }

  // ========== 4. PAGE FADE-IN ==========
  function initPageFadeIn() {
    const pageWrapper = document.querySelector('.page-wrapper');
    if (pageWrapper) {
      // Petite pause pour que le CSS soit chargé
      setTimeout(() => {
        pageWrapper.style.opacity = '1';
      }, 100);
    }
  }

  // ========== INITIALISATION ==========
  function init() {
    initMobileNav();
    initSliders();
    initScrollAnimations();
    initPageFadeIn();
    
    // Ajouter les classes JS pour les styles conditionnels
    document.documentElement.className += ' w-mod-js';
    
    // Détecter touch
    if ('ontouchstart' in window || (window.DocumentTouch && document instanceof DocumentTouch)) {
      document.documentElement.className += ' w-mod-touch';
    }
  }

  // Lancer au chargement
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

