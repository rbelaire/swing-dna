# Swing DNA — React Integration Package

Drop these files into your existing React (Vite/CRA) app.

---

## File Structure

```
your-app/
└── src/
    ├── data/
    │   └── swingDNA.js          ← All DNA content, options, drills, pros
    ├── components/
    │   ├── DNAPage.jsx           ← Renders any single category page
    │   ├── StudentBuilder.jsx    ← 3-step student profile builder
    │   └── StudentReport.jsx     ← Filtered report for a student
    └── SwingDNAApp.jsx           ← Root component — drop in a route
```

---

## 1. Install (no extra dependencies needed)

Everything uses standard React hooks (useState, useRef).
No additional packages required.

---

## 2. Add the Route

**React Router v6:**
```jsx
// App.jsx or your router file
import SwingDNAApp from './SwingDNAApp';

<Route path="/swing-dna" element={<SwingDNAApp />} />
```

**Without routing — render directly:**
```jsx
import SwingDNAApp from './SwingDNAApp';

export default function App() {
  return <SwingDNAApp />;
}
```

---

## 3. Add the Fonts

Add to your `index.html` `<head>`:
```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400;1,600&family=JetBrains+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet">
```

Or in your CSS/Tailwind globals:
```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond...');
```

---

## 4. How It Works

### Three views:

**Master Reference** — sidebar nav, all 18 categories, full content for every option. 
Instructor-facing. Toggle between options interactively.

**Student Builder** — 3-step flow:
1. Enter student name + date
2. Select their option for each of 18 categories
3. Review and generate

**Student Report** — filtered view showing only the student's selected pages,
with their specific option pre-highlighted. Has an Export PDF button (uses window.print()).

---

## 5. Updating Content

All content lives in `src/data/swingDNA.js`.

To add/edit any explanation, drill, pro, or warning:
```js
// Find the category by id, find the option, edit its fields:
{
  id: 'high-track',
  label: 'High Track',
  content: 'Your explanation here...',
  drills: [
    { title: 'Drill Name', body: 'Instructions...' }
  ],
  pros: ['Player Name'],
  warnings: ['Warning text...'],
}
```

To add a new category:
```js
// Add to DNA_CATEGORIES array in swingDNA.js
{
  id: 'new-category',
  section: 'Physical DNA',  // Must match existing section name
  index: '07',
  title: 'Category',
  titleEm: 'Name',
  intro: '...',
  definition: '...',
  options: [...]
}
```

---

## 6. Saving Student Profiles (Optional Enhancement)

Currently profiles are held in React state (lost on refresh).
To persist them, add localStorage in SwingDNAApp.jsx:

```js
// In handleGenerateReport:
const profiles = JSON.parse(localStorage.getItem('swingProfiles') || '[]');
profiles.push({ id: Date.now(), ...data });
localStorage.setItem('swingProfiles', JSON.stringify(profiles));
```

Or connect to your existing backend/database by replacing the
`handleGenerateReport` function in `SwingDNAApp.jsx`.

---

## 7. Deployment Notes

This project now defaults to `base: '/'` in Vite so deployments to Netlify/Vercel/Render work without asset path issues.

If you deploy to a subpath (for example GitHub Pages project sites), set:

```bash
VITE_BASE_PATH=/swing-dna/
```

If the app shows a blank page after deploy, inspect the browser network tab for 404s on `/assets/*` or `/swing-dna/assets/*`; a mismatched base path is the usual cause.

---

## 8. Customization

**Colors** — edit the COLORS object in `DNAPage.jsx`:
```js
const COLORS = {
  green: { accent: '#1db954', ... },
  gold:  { accent: '#d4a843', ... },
  ...
};
```

**Branding** — update the logo in `SwingDNAApp.jsx`:
```jsx
<p style={styles.logoMono}>Your Brand</p>
```

**Section colors** — edit `SECTION_COLORS` in `SwingDNAApp.jsx` and `StudentReport.jsx`.

---

## Questions?

The data file (`swingDNA.js`) is the source of truth.
The components read from it — never hardcode content in components.
