// Firestore Helper Functions
// Make sure to include firebase-config.js before this file

// =========================
// BANNER MESSAGES
// =========================

/**
 * Get active banner message (single document approach)
 * There's only one active banner at a time, stored with a known ID
 */
async function getActiveBannerMessage() {
  try {
    // Get the single banner document with ID 'current'
    const doc = await db.collection('bannerMessages').doc('current').get();
    
    if (!doc.exists) {
      return null;
    }
    
    const data = doc.data();
    
    // Check if banner is active and within date range
    const now = firebase.firestore.Timestamp.now();
    if (data.active && 
        (!data.startDate || data.startDate <= now) && 
        (!data.endDate || data.endDate >= now)) {
      return {
        id: doc.id,
        ...data
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching banner message:', error);
    return null;
  }
}

/**
 * Display banner message on page with "En savoir plus" button
 */
async function displayBannerMessage() {
  const message = await getActiveBannerMessage();
  
  if (message) {
    const bannerContainer = document.getElementById('banner-message');
    if (bannerContainer) {
      bannerContainer.innerHTML = `
        <div class="banner-${message.type || 'info'}">
          <div class="banner-content">
            <p>${message.shortMessage}</p>
            ${message.fullTitle ? `<button class="banner-learn-more" onclick="showBannerPopup()">En savoir plus</button>` : ''}
          </div>
        </div>
      `;
      bannerContainer.style.display = 'block';
      
      // Store message data for popup
      window.currentBannerMessage = message;
    }
  }
}

/**
 * Show banner popup with full details
 */
function showBannerPopup() {
  if (!window.currentBannerMessage) return;
  
  const message = window.currentBannerMessage;
  
  // Create popup overlay
  const popup = document.createElement('div');
  popup.id = 'banner-popup';
  popup.className = 'banner-popup-overlay';
  popup.innerHTML = `
    <div class="banner-popup-content">
      <button class="banner-popup-close" onclick="closeBannerPopup()">&times;</button>
      ${message.image ? `<img src="${message.image}" alt="${message.fullTitle}" class="banner-popup-image">` : ''}
      <h2 class="banner-popup-title">${message.fullTitle}</h2>
      <div class="banner-popup-text">${message.fullText || ''}</div>
    </div>
  `;
  
  document.body.appendChild(popup);
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
  
  // Close on overlay click
  popup.addEventListener('click', (e) => {
    if (e.target === popup) {
      closeBannerPopup();
    }
  });
}

/**
 * Close banner popup
 */
function closeBannerPopup() {
  const popup = document.getElementById('banner-popup');
  if (popup) {
    popup.remove();
    document.body.style.overflow = ''; // Restore scrolling
  }
}

// =========================
// BLOG ARTICLES
// =========================

/**
 * Get all published blog articles
 */
async function getBlogArticles(limit = 10) {
  try {
    const snapshot = await db.collection('blogArticles')
      .where('published', '==', true)
      .orderBy('publishDate', 'desc')
      .limit(limit)
      .get();
    
    const articles = [];
    snapshot.forEach(doc => {
      articles.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return articles;
  } catch (error) {
    console.error('Error fetching blog articles:', error);
    return [];
  }
}

/**
 * Get single blog article by slug
 */
async function getBlogArticleBySlug(slug) {
  try {
    const snapshot = await db.collection('blogArticles')
      .where('slug', '==', slug)
      .where('published', '==', true)
      .limit(1)
      .get();
    
    if (snapshot.empty) {
      return null;
    }
    
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    };
  } catch (error) {
    console.error('Error fetching blog article:', error);
    return null;
  }
}

/**
 * Get blog articles by category
 */
async function getBlogArticlesByCategory(category, limit = 10) {
  try {
    const snapshot = await db.collection('blogArticles')
      .where('category', '==', category)
      .where('published', '==', true)
      .orderBy('publishDate', 'desc')
      .limit(limit)
      .get();
    
    const articles = [];
    snapshot.forEach(doc => {
      articles.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return articles;
  } catch (error) {
    console.error('Error fetching blog articles by category:', error);
    return [];
  }
}

// =========================
// RESOURCES
// =========================

/**
 * Get resources by category
 */
async function getResourcesByCategory(category, limit = 20) {
  try {
    const snapshot = await db.collection('resources')
      .where('category', '==', category)
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();
    
    const resources = [];
    snapshot.forEach(doc => {
      resources.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return resources;
  } catch (error) {
    console.error('Error fetching resources:', error);
    return [];
  }
}

/**
 * Get all published resources
 */
async function getAllResources(limit = 50) {
  try {
    const snapshot = await db.collection('resources')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();
    
    const resources = [];
    snapshot.forEach(doc => {
      resources.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return resources;
  } catch (error) {
    console.error('Error fetching all resources:', error);
    return [];
  }
}

/**
 * Display resources on page
 */
async function displayResources(category, containerId) {
  const resources = await getResourcesByCategory(category);
  const container = document.getElementById(containerId);
  
  if (!container) return;
  
  if (resources.length === 0) {
    container.innerHTML = '<p>Aucune ressource disponible pour le moment.</p>';
    return;
  }
  
  let html = '<div class="resources-grid">';
  
  resources.forEach(resource => {
    html += `
      <div class="resource-card">
        ${resource.thumbnailUrl ? `<img src="${resource.thumbnailUrl}" alt="${resource.title}">` : ''}
        <h3>${resource.title}</h3>
        <p>${resource.description}</p>
        <a href="${resource.fileUrl}" target="_blank" class="btn-primary">Télécharger</a>
      </div>
    `;
  });
  
  html += '</div>';
  container.innerHTML = html;
}

/**
 * Display blog articles on page
 */
async function displayBlogArticles(limit = 6, containerId = 'blog-container') {
  const articles = await getBlogArticles(limit);
  const container = document.getElementById(containerId);
  
  if (!container) return;
  
  if (articles.length === 0) {
    container.innerHTML = '<p>Aucun article disponible pour le moment.</p>';
    return;
  }
  
  let html = '<div class="blog-grid">';
  
  articles.forEach(article => {
    const date = article.publishDate?.toDate().toLocaleDateString('fr-FR') || '';
    html += `
      <div class="blog-card">
        ${article.featuredImage ? `<img src="${article.featuredImage}" alt="${article.title}">` : ''}
        <div class="blog-content">
          <span class="blog-category">${article.category}</span>
          <h3>${article.title}</h3>
          <p>${article.excerpt}</p>
          <div class="blog-meta">
            <span>${article.author}</span>
            <span>${date}</span>
          </div>
          <a href="detail_blog.html?slug=${article.slug}" class="read-more">Lire la suite →</a>
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  container.innerHTML = html;
}

