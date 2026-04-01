# 🎨 DESIGN PRD (FINAL – FULL UI + THEME SYSTEM)

## Project: Smart Job Portal (MERN Stack – 2026 Ready UI)

---

# 1. 🎯 Vision

Ek **premium, modern, fully customizable job portal UI** jo:

* LinkedIn se better feel de 😎
* SaaS dashboard jaisa clean ho
* Fully theme customizable ho 🎨
* Fast + responsive + interactive ho ⚡

---

# 2. 🌈 COMPLETE DESIGN SYSTEM

## 🔹 Core Design Style

* Dark-first UI 🌙
* Glassmorphism + Soft shadows
* Rounded UI (12px–16px radius)
* Minimal + clean layout

---

# 3. 🎨 GLOBAL COLOR SYSTEM

## Default Dark Theme

```css
:root {
  --bg-main: #0B1220;
  --bg-secondary: #0F172A;
  --bg-card: #111827;

  --text-primary: #FFFFFF;
  --text-secondary: #9CA3AF;

  --accent: #3B82F6;
  --accent-hover: #60A5FA;

  --border: rgba(255,255,255,0.08);
  --shadow: 0 4px 20px rgba(0,0,0,0.4);
}
```

---

# 4. 🔥 ADVANCED THEME SWITCHER SYSTEM

## 🎛️ UI Placement

* Navbar (Top Right)
* Icon: 🎨 Palette
* Dropdown with live preview bars

---

## 🎨 ALL THEMES (Production Ready)

### 🌙 Dark (Default)

```css
[data-theme="dark"] {
  --bg-main: #0B1220;
  --bg-card: #111827;
  --text-primary: #ffffff;
  --accent: #3B82F6;
}
```

---

### 👑 Luxury Theme

```css
[data-theme="luxury"] {
  --bg-main: #0a0a0a;
  --bg-card: #1a1a1a;
  --text-primary: #f5d27a;
  --accent: #d4af37;
}
```

---

### 🧛 Dracula Theme

```css
[data-theme="dracula"] {
  --bg-main: #1e1f29;
  --bg-card: #282a36;
  --text-primary: #f8f8f2;
  --accent: #bd93f9;
}
```

---

### 🌈 CMYK Theme

```css
[data-theme="cmyk"] {
  --bg-main: #ffffff;
  --bg-card: #f5f5f5;
  --text-primary: #000000;
  --accent: #ff0066;
}
```

---

### 🍂 Autumn Theme

```css
[data-theme="autumn"] {
  --bg-main: #2c1b0c;
  --bg-card: #3b2a1a;
  --text-primary: #f5deb3;
  --accent: #ff8c00;
}
```

---

### ⚫ Business Theme

```css
[data-theme="business"] {
  --bg-main: #f9fafb;
  --bg-card: #ffffff;
  --text-primary: #111827;
  --accent: #374151;
}
```

---

### ⚡ Acid Theme

```css
[data-theme="acid"] {
  --bg-main: #0f0f0f;
  --bg-card: #1a1a1a;
  --text-primary: #39ff14;
  --accent: #00ffcc;
}
```

---

# 5. ⚙️ THEME ENGINE (LOGIC)

## Theme Apply

```js
const setTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
};
```

## Load Theme

```js
useEffect(() => {
  const saved = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", saved);
}, []);
```

---

# 6. 🎛️ THEME DROPDOWN UI (IMPORTANT)

## Features:

* Dropdown open on click
* Each theme ke saath:

  * Color preview bars 🎨
  * Theme name
* Active theme → ✔ tick
* Smooth hover highlight

---

## UI Structure

```
🎨 Theme
 ├── Luxury    ▮▮▮▮
 ├── Dracula   ▮▮▮▮
 ├── CMYK      ▮▮▮▮
 ├── Autumn    ▮▮▮▮
 ├── Business  ▮▮▮▮
 └── Acid      ▮▮▮▮
```

---

# 7. 🧱 FULL UI LAYOUT

## 🔝 Navbar

* Logo: Job Board
* Menu:

  * Home
  * About
  * Find Jobs
  * Subscribe
* CTA: Post a Job
* Theme Switcher 🎨

👉 Effects:

* Sticky
* Blur background
* Shadow on scroll

---

## 📌 Main Layout

### Left Sidebar

* Job Filters:

  * Full Time
  * Part Time
  * Remote
  * Internship

👉 Design:

* Soft hover glow
* Checkbox animations

---

### 🧾 Center Content (Main)

## 🔥 Job Cards

Each card contains:

* Company logo
* Job title
* Salary
* Time (e.g., 12 hours ago)
* Description
* CTA: View Job →

👉 Style:

* Rounded (12px)
* Shadow + border
* Hover:

  * Lift (translateY)
  * Glow border

---

### 📢 Right Sidebar

* Ads block
* Recommended jobs (future)
* Trending skills

---

# 8. 🧩 UI COMPONENTS

## 🔘 Buttons

* Gradient accent
* Hover lift + glow

## 📦 Cards

* Glass effect (optional)
* Border + blur

## 🧾 Inputs

* Dark fields
* Focus glow border

---

# 9. ✨ ANIMATIONS

* Page fade-in
* Card hover animation
* Theme switch smooth transition
* Skeleton loading (jobs)

---

# 10. 📱 RESPONSIVENESS

## Mobile

* Sidebar collapsible
* Navbar → hamburger
* Cards full width

## Tablet

* 2-column layout

## Desktop

* 3-column layout

---

# 11. 🧠 UX FEATURES

* Instant filtering (no reload)
* Save job ❤️
* Recently viewed jobs
* Infinite scroll

---

# 12. 🔐 ACCESSIBILITY

* High contrast colors
* Keyboard navigation
* Focus states visible

---

# 13. ⚙️ DESIGN TECH STACK

* Tailwind CSS
* CSS Variables (theme system)
* Framer Motion (animations)
* Lucide Icons

---

# 14. 🚀 FUTURE UI FEATURES

* AI theme suggestion 🤖
* Custom theme builder 🎨
* Light/Dark auto switch
* Micro interactions

---

# 15. ✅ FINAL RESULT

Tumhara UI hoga:
✔ Screenshot jaisa exact look
✔ Multi-theme system
✔ Premium feel
✔ Fully responsive
✔ Modern SaaS + LinkedIn level design

---

🔥 NEXT STEP:
Agar chaho to mai iska:
👉 **React + Tailwind complete UI code**
👉 **Theme Switcher component (ready-made)**
👉 **Figma design structure**

bhi bana deta hoon (direct project me use karne layak) 🚀
