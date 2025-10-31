// Firebase Banner and Modal Functions
// This script handles the dynamic banner and modal popup from Firebase

function showBannerModal() {
  const modal = document.getElementById('banner-modal');
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closeBannerModal() {
  const modal = document.getElementById('banner-modal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

// Initialize modal close handlers
function initModalHandlers() {
  const modal = document.getElementById('banner-modal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeBannerModal();
      }
    });
  }
}

async function loadFirebaseBanner() {
  try {
    const bannerData = await getActiveBannerMessage();
    
    if (bannerData) {
      const bannerDiv = document.getElementById('firebase-banner');
      if (!bannerDiv) return;
      
      bannerDiv.innerHTML = `⚠️ ${bannerData.shortMessage} : <a href="#" class="banner-learn-more" onclick="event.preventDefault(); showBannerModal();">En savoir plus</a>`;
      bannerDiv.style.display = 'block';
      
      document.getElementById('modal-title').textContent = bannerData.fullTitle || '';
      const imageContainer = document.getElementById('modal-image-container');
      if (bannerData.image) {
        imageContainer.innerHTML = `<img src="${bannerData.image}" alt="${bannerData.fullTitle}" class="modal-image">`;
      } else {
        imageContainer.innerHTML = '';
      }
      document.getElementById('modal-text').innerHTML = bannerData.fullText || '';
      window.currentBanner = bannerData;
    }
  } catch (error) {
    console.error('Error loading banner:', error);
  }
}

// Auto-initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
  initModalHandlers();
  loadFirebaseBanner();
});

