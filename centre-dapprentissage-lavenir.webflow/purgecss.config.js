module.exports = {
  // Fichiers HTML à analyser pour trouver les classes utilisées
  content: [
    './*.html',
    './services/*.html',
    './js/*.js'
  ],
  
  // Fichier CSS à purger
  css: ['./css/centre-dapprentissage-lavenir.webflow.css'],
  
  // Fichier de sortie
  output: './css/centre-dapprentissage-lavenir.webflow.purged.css',
  
  // Options de sécurité pour ne rien casser
  safelist: {
    // Classes à TOUJOURS garder (même si non trouvées dans HTML)
    standard: [
      /^w-/,           // Toutes les classes Webflow
      /^w--/,          // États Webflow (w--current, w--open, etc.)
      /^wf-/,          // Classes de fonts Webflow
      'is-active',     // États actifs
      'is-hidden',     // États cachés
      /^hover:/,       // États hover
      /^focus:/,       // États focus
      /^active:/,      // États active
    ],
    
    // Classes dynamiques ajoutées par JavaScript
    deep: [
      /w-slider/,
      /w-dropdown/,
      /w-tab/,
      /w-lightbox/,
      /w-nav/,
      /w-form/,
      /w-commerce/,
      /w-dyn/,
      /w-condition/,
      /w-pagination/,
    ],
    
    // Garder toutes les classes avec ces préfixes
    greedy: [
      /^w-/,
      /^wf-/,
    ]
  },
  
  // Extraire les sélecteurs dynamiques
  defaultExtractor: content => {
    // Extraire toutes les classes possibles
    const classes = content.match(/[A-Za-z0-9-_:\/]+/g) || []
    return classes
  },
  
  // Options de sortie
  fontFace: true,           // Garder @font-face
  keyframes: true,          // Garder @keyframes
  variables: true,          // Garder CSS variables
  rejected: false,          // Ne pas afficher les règles supprimées
  rejectedCss: false        // Ne pas créer de fichier avec les règles supprimées
}

