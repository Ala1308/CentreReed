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

  function initTriangleCarousel(){
    var container = document.querySelector('.triangle-carousel');
    if(!container) return;
    var cards = Array.prototype.slice.call(container.querySelectorAll('.tc-card'));
    if(cards.length !== 3) return;
    var idx = 0;
    function applyPositions(){
      cards.forEach(function(card){ card.classList.remove('tc-pos-left','tc-pos-center','tc-pos-right'); });
      cards[(idx+0)%3].classList.add('tc-pos-center');
      cards[(idx+1)%3].classList.add('tc-pos-right');
      cards[(idx+2)%3].classList.add('tc-pos-left');
    }
    function next(){ idx = (idx+1)%3; applyPositions(); }
    function prev(){ idx = (idx+2)%3; applyPositions(); }
    var nextBtn = container.querySelector('.tc-next');
    var prevBtn = container.querySelector('.tc-prev');
    if(nextBtn) nextBtn.addEventListener('click', next);
    if(prevBtn) prevBtn.addEventListener('click', prev);
    applyPositions();
    var auto = setInterval(next, 4500);
    container.addEventListener('mouseenter', function(){ clearInterval(auto); });
    container.addEventListener('mouseleave', function(){ auto = setInterval(next, 4500); });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){ setBanner(); initScrollBehavior(); initTriangleCarousel(); });
  } else {
    setBanner(); initScrollBehavior(); initTriangleCarousel();
  }
})();


