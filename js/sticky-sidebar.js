// Sticky Sidebar avec position: fixed
(function() {
  'use strict';

  // Attendre que le DOM soit chargé
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStickySidebar);
  } else {
    initStickySidebar();
  }

  function initStickySidebar() {
    const sidebar = document.querySelector('.split-content.course-sidebar');
    if (!sidebar) return;

    const sidebarCard = sidebar.querySelector('.card.get-course');
    if (!sidebarCard) return;

    // Variables pour stocker les positions
    let sidebarOriginalOffset = 0;
    let sidebarWidth = 0;
    let sidebarRight = 0;
    let isFixed = false;

    // Calculer les positions initiales
    function calculatePositions() {
      const sidebarRect = sidebar.getBoundingClientRect();
      sidebarOriginalOffset = window.pageYOffset + sidebarRect.top;
      sidebarWidth = sidebarRect.width;
      
      // Calculer la position right en fonction du viewport
      sidebarRight = window.innerWidth - (sidebarRect.left + sidebarRect.width);
    }

    // Initialiser les positions
    calculatePositions();

    // Recalculer lors du resize
    window.addEventListener('resize', function() {
      if (!isFixed) {
        calculatePositions();
      }
    });

    // Gérer le scroll
    function handleScroll() {
      const scrollTop = window.pageYOffset;
      const header = document.querySelector('.header');
      const headerHeight = header ? header.offsetHeight : 80;
      
      // Position de déclenchement : juste en dessous du header
      const triggerPoint = sidebarOriginalOffset - headerHeight - 20; // 20px de marge

      if (scrollTop >= triggerPoint) {
        if (!isFixed) {
          // Appliquer le style fixed
          sidebar.style.position = 'fixed';
          sidebar.style.top = (headerHeight + 20) + 'px';
          sidebar.style.width = sidebarWidth + 'px';
          sidebar.style.right = sidebarRight + 'px';
          sidebar.style.zIndex = '40';
          isFixed = true;
        }
      } else {
        if (isFixed) {
          // Retirer le style fixed
          sidebar.style.position = '';
          sidebar.style.top = '';
          sidebar.style.width = '';
          sidebar.style.right = '';
          sidebar.style.zIndex = '';
          isFixed = false;
        }
      }
    }

    // Écouter le scroll avec throttle pour performance
    let ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Premier check au chargement
    handleScroll();
  }
})();

