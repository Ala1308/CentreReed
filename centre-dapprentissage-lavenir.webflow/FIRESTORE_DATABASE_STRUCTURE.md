# 📊 Firestore Database Structure

## Collections Overview

### 1. 📢 `bannerMessages` Collection

**Single Document ID:** `current` (only one banner active at a time)

#### Fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `shortMessage` | string | ✅ | Short message displayed on the banner (max 150 chars) |
| `fullTitle` | string | ✅ | Full title shown in the popup |
| `fullText` | string (HTML) | ✅ | Rich text content for the popup (max 400 words) |
| `image` | string (URL) | ❌ | Optional image URL for the popup |
| `type` | string | ✅ | Banner style: `"info"`, `"warning"`, or `"success"` |
| `active` | boolean | ✅ | Whether the banner is currently active |
| `startDate` | timestamp | ❌ | Optional start date |
| `endDate` | timestamp | ❌ | Optional end date |
| `updatedAt` | timestamp | ✅ | Last update timestamp |

#### Example:
```javascript
{
  shortMessage: "🎉 Inscriptions ouvertes - Places limitées!",
  fullTitle: "Inscriptions ouvertes pour la session d'automne 2025",
  fullText: "<p>Nous sommes ravis d'annoncer...</p><ul><li>Service 1</li></ul>",
  image: "https://example.com/banner-image.jpg",
  type: "success",
  active: true,
  startDate: Timestamp,
  endDate: Timestamp,
  updatedAt: Timestamp
}
```

#### Rich Text Support:
The `fullText` field supports HTML formatting:
- **Bold**: `<strong>` or `<b>`
- **Italic**: `<em>` or `<i>`
- **Underline**: `<u>`
- **Lists**: `<ul><li>` and `<ol><li>`
- **Links**: `<a href="url">text</a>`
- **Paragraphs**: `<p>`

---

### 2. 📰 `blogArticles` Collection

**Multiple Documents** (auto-generated IDs)

#### Fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ | Article title |
| `slug` | string | ✅ | URL-friendly identifier (e.g., "5-conseils-devoirs") |
| `excerpt` | string | ✅ | Short preview/description |
| `content` | string (HTML) | ✅ | Full article content |
| `author` | string | ✅ | Author name |
| `category` | string | ✅ | Category (e.g., "Conseils", "Nouvelles") |
| `featuredImage` | string (URL) | ❌ | Featured image URL |
| `published` | boolean | ✅ | Publication status |
| `publishDate` | timestamp | ✅ | Publication date |
| `createdAt` | timestamp | ✅ | Creation timestamp |
| `updatedAt` | timestamp | ✅ | Last update timestamp |

#### Example:
```javascript
{
  title: "5 Conseils pour Réussir les Devoirs",
  slug: "5-conseils-reussir-devoirs",
  excerpt: "Découvrez nos meilleurs conseils...",
  content: "<h3>1. Créer un espace...</h3><p>Un environnement...</p>",
  author: "L'équipe du Centre",
  category: "Conseils",
  featuredImage: "https://example.com/article-image.jpg",
  published: true,
  publishDate: Timestamp,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

### 3. 📚 `resources` Collection

**Multiple Documents** (auto-generated IDs)

#### Fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ | Resource title |
| `description` | string | ✅ | Resource description |
| `category` | string | ✅ | `"students"` or `"parents"` |
| `type` | string | ✅ | `"pdf"`, `"link"`, `"video"`, or `"document"` |
| `fileUrl` | string (URL) | ✅ | URL to the resource file |
| `thumbnailUrl` | string (URL) | ❌ | Thumbnail image URL |
| `subject` | string | ✅ | Subject area (e.g., "mathématiques", "français") |
| `gradeLevel` | array | ✅ | Array of grade levels |
| `published` | boolean | ✅ | Publication status |
| `createdAt` | timestamp | ✅ | Creation timestamp |

#### Grade Level Options:
- `"primaire-1-3"` - Primary grades 1-3
- `"primaire-4-6"` - Primary grades 4-6
- `"secondaire"` - Secondary/High school
- `"tous"` - All levels

#### Example:
```javascript
{
  title: "Guide de Mathématiques - Primaire",
  description: "Guide complet couvrant les concepts mathématiques...",
  category: "students",
  type: "pdf",
  fileUrl: "https://example.com/math-guide.pdf",
  thumbnailUrl: "https://example.com/thumbnail.jpg",
  subject: "mathématiques",
  gradeLevel: ["primaire-1-3", "primaire-4-6"],
  published: true,
  createdAt: Timestamp
}
```

---

## 🔧 How Collections Are Created

**Firestore creates collections automatically when you add the first document.**

### Method 1: Use the Initialization Script (Recommended for First Setup)
1. Open `admin/initialize-firestore.html` in your browser
2. Click "Initialiser Firestore"
3. Collections will be created with sample data

### Method 2: Use the Admin Panel
1. Open `admin/add-data.html`
2. Add your first document to each collection
3. Collections are created automatically

### Method 3: Via Firebase Console
1. Go to Firestore in Firebase Console
2. Click "Start collection"
3. Enter collection name
4. Add first document

---

## 🎯 Data Flow

### Banner Message Flow:
1. Admin updates banner via `admin/add-data.html`
2. Document stored with ID `current` in `bannerMessages` collection
3. Website fetches via `getActiveBannerMessage()`
4. User sees short message on banner
5. User clicks "En savoir plus" → Popup shows full details

### Blog Articles Flow:
1. Admin adds article via `admin/add-data.html`
2. Document added to `blogArticles` collection
3. Website fetches via `getBlogArticles()` or `getBlogArticleBySlug()`
4. Articles displayed on blog page

### Resources Flow:
1. Admin adds resource via `admin/add-data.html`
2. Document added to `resources` collection
3. Website fetches via `getResourcesByCategory()`
4. Resources displayed on appropriate page (students/parents)

---

## 🔒 Security Rules

### Development (Test Mode):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

### Production (Recommended):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Banner Messages
    match /bannerMessages/{messageId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Blog Articles
    match /blogArticles/{articleId} {
      allow read: if resource.data.published == true;
      allow write: if request.auth != null;
    }
    
    // Resources
    match /resources/{resourceId} {
      allow read: if resource.data.published == true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 📝 Query Examples

### Get Active Banner:
```javascript
const doc = await db.collection('bannerMessages').doc('current').get();
```

### Get Published Blog Articles:
```javascript
const snapshot = await db.collection('blogArticles')
  .where('published', '==', true)
  .orderBy('publishDate', 'desc')
  .limit(10)
  .get();
```

### Get Resources by Category:
```javascript
const snapshot = await db.collection('resources')
  .where('category', '==', 'students')
  .where('published', '==', true)
  .get();
```

---

## 🚀 Next Steps

1. ✅ Initialize collections using `admin/initialize-firestore.html`
2. ✅ Update sample data via `admin/add-data.html`
3. ✅ Set up security rules in Firebase Console
4. ✅ Test on your website
5. ✅ Replace sample data with real content

