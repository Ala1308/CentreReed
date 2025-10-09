// Shared site behaviors: banner content + header/top-banner scroll behavior
(function(){
  // Banner is now handled by Firebase (see firebase-banner.js)
  // Keeping this function for backwards compatibility but it does nothing
  function setBanner(){
    // Firebase handles banner population
  }

  function openBannerModal(){
    var modal = document.getElementById('banner-modal');
    if(modal){
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
  }

  function closeBannerModal(){
    var modal = document.getElementById('banner-modal');
    if(modal){
      modal.style.display = 'none';
      document.body.style.overflow = ''; // Restore scrolling
    }
  }

  function initBannerModal(){
    var modal = document.getElementById('banner-modal');
    if(!modal) return;

    // Close button
    var closeBtn = modal.querySelector('.modal-close');
    if(closeBtn){
      closeBtn.addEventListener('click', closeBannerModal);
    }

    // Close when clicking outside the modal content
    modal.addEventListener('click', function(e){
      if(e.target === modal){
        closeBannerModal();
      }
    });

    // Close with ESC key
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape'){
        closeBannerModal();
      }
    });
  }

  function initScrollBehavior(){
    var lastY = window.pageYOffset || document.documentElement.scrollTop;
    var header = document.querySelector('.header');
    var banner = document.querySelector('.top-banner');
    var ticking = false;
    
    function onScroll(){
      var y = window.pageYOffset || document.documentElement.scrollTop;
      
      if(header){
        // At the very top - header below banner, transparent background
        if(y <= 10){
          header.classList.remove('header--hidden');
          header.classList.remove('header--fixed');
        }
        // Scrolling down - hide header content
        else if(y > lastY){
          header.classList.add('header--hidden');
          header.classList.remove('header--fixed');
        } 
        // Scrolling up - show header at viewport top with white background
        else if(y < lastY){
          header.classList.remove('header--hidden');
          header.classList.add('header--fixed');
        }
      }
      
      // Banner should only appear at the very top
      if(banner){
        if(y <= 10){
          banner.classList.remove('is-hidden');
        } else {
          banner.classList.add('is-hidden');
        }
      }
      
      lastY = y; 
      ticking = false;
    }
    
    window.addEventListener('scroll', function(){ 
      if(!ticking){ 
        window.requestAnimationFrame(onScroll); 
        ticking = true; 
      } 
    }, { passive: true });
  }

  function initVerticalCarousel(){
    var container = document.querySelector('.v-carousel');
    if(!container) return;
    var cards = Array.prototype.slice.call(container.querySelectorAll('.vc-card'));
    if(cards.length === 0) return;
    var idx = 0;
    function apply(){
      cards.forEach(function(c, i){ c.classList.toggle('is-active', i === idx); });
    }
    function next(){ idx = (idx+1) % cards.length; apply(); }
    function prev(){ idx = (idx-1+cards.length) % cards.length; apply(); }
    var nextBtn = container.querySelector('.vc-next');
    var prevBtn = container.querySelector('.vc-prev');
    if(nextBtn) nextBtn.addEventListener('click', next);
    if(prevBtn) prevBtn.addEventListener('click', prev);
    apply();
    var auto = setInterval(next, 3000);
    container.addEventListener('mouseenter', function(){ clearInterval(auto); });
    container.addEventListener('mouseleave', function(){ auto = setInterval(next, 5000); });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){ setBanner(); initScrollBehavior(); initVerticalCarousel(); initBannerModal(); });
  } else {
    setBanner(); initScrollBehavior(); initVerticalCarousel(); initBannerModal();
  }
})();


