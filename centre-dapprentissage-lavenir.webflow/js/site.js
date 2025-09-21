// Shared site behaviors: banner content + header/top-banner scroll behavior
(function(){
  var BANNER_HTML = '⚠️ Examens d’admission du secondaire 2025 : <a href="#">En savoir plus</a>';

  function setBanner(){
    var banner = document.querySelector('.top-banner');
    if(banner){ banner.innerHTML = BANNER_HTML; }
  }

  function initScrollBehavior(){
    var lastY = window.pageYOffset || document.documentElement.scrollTop;
    var header = document.querySelector('.header');
    var banner = document.querySelector('.top-banner');
    var ticking = false;
    function onScroll(){
      var y = window.pageYOffset || document.documentElement.scrollTop;
      if(header){
        if(y > lastY + 5){ header.classList.add('header--hidden'); }
        else if(y < lastY - 5){ header.classList.remove('header--hidden'); }
      }
      if(banner){
        if(y > 10){ banner.classList.add('is-hidden'); }
        else { banner.classList.remove('is-hidden'); }
      }
      lastY = y; ticking = false;
    }
    window.addEventListener('scroll', function(){ if(!ticking){ window.requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
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
    var auto = setInterval(next, 5000);
    container.addEventListener('mouseenter', function(){ clearInterval(auto); });
    container.addEventListener('mouseleave', function(){ auto = setInterval(next, 5000); });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){ setBanner(); initScrollBehavior(); initVerticalCarousel(); });
  } else {
    setBanner(); initScrollBehavior(); initVerticalCarousel();
  }
})();


