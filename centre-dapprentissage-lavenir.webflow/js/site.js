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

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){ setBanner(); initScrollBehavior(); });
  } else {
    setBanner(); initScrollBehavior();
  }
})();


