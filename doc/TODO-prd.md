# 📝 SMART JOB PORTAL - DEVELOPMENT ROADMAP (TODO.prd)

## 📌 Project Overview
A modern MERN stack job portal with AI-based recommendations, real-time chat, and a premium multi-theme UI (2026 Ready).

---

## 🚀 PHASE 1: Project Foundation & Core Auth
**Goal:** Setup the base architecture and secure user entry.

### 📦 Module 1.1: Project Initialization
- [x] Initialize Git repository.
- [x] Setup Backend:
    - [x] `npm init -y` in `/server`.
    - [x] Install: `express mongoose dotenv cors cookie-parser jsonwebtoken bcryptjs multer socket.io`.
    - [x] Create folder structure: `src/{config,controllers,models,routes,middlewares,services,utils,socket}`.
- [x] Setup Frontend:
    - [x] `npm create vite@latest client -- --template react` in root.
    - [x] Install: `tailwindcss postcss autoprefixer lucide-react axios react-router-dom framer-motion @reduxjs/toolkit react-redux`.
    - [x] Create folder structure: `src/{components,pages,redux,services,hooks,utils}`.
- [x] [**GIT**] `git commit -m "Initialize server and client boilerplate with folder structures"`

### 📦 Module 1.2: Database & Auth Backend
- [x] Configure MongoDB connection in `server/src/config/db.js`.
- [x] Create `User` model (`server/src/models/User.js`) with roles: `['job-seeker', 'recruiter', 'admin']`.
- [x] Implement Auth Controllers (`server/src/controllers/authController.js`):
    - [x] Register (Hashing with bcrypt).
    - [x] Login (JWT generation & HTTP-only Cookie).
- [x] Implement `authMiddleware.js` for JWT verification and role checking.
- [x] Define Auth Routes (`server/src/routes/authRoutes.js`).
- [x] [**GIT**] `git commit -m "Implement JWT-based Auth backend with role support"`

### 📦 Module 1.3: Frontend Auth Integration
- [x] Setup React Router with `ProtectedRoute` component.
- [x] Build Login & Register Pages using Tailwind (Dark theme inspired).
- [x] Setup Redux slice for Auth state (`client/src/redux/slices/authSlice.js`).
- [x] Integrate Axios with interceptors for token handling.
- [x] [**GIT**] `git commit -m "Complete frontend auth UI and state management integration"`

---

## 🎨 PHASE 2: Theme Engine & Global UI
**Goal:** Implement the premium design system and multi-theme switcher.

### 📦 Module 2.1: Theme System Implementation
- [x] Define CSS variables in `client/src/index.css` for all 7 themes (Dark, Luxury, Dracula, CMYK, Autumn, Business, Acid).
- [x] Create `ThemeContext` or Redux slice for theme management.
- [x] Build `ThemeSwitcher` component with live preview bars.
- [x] Build `Navbar` with theme toggle and responsive hamburger menu.
- [x] [**GIT**] `git commit -m "Implement multi-theme engine and dynamic styling system"`

---

## 👤 PHASE 3: Profile & Media Management
**Goal:** Enable users and recruiters to build their professional presence.

### 📦 Module 3.1: Profile Backend & Media
- [x] Update `User` model for bio, skills, company details, etc.
- [x] Setup Cloudinary or local storage for Multer uploads.
- [x] Implement `PUT /api/user/profile` for updating details.
- [x] Implement `POST /api/user/upload-resume` for PDF handling.
- [x] [**GIT**] `git commit -m "Implement profile update APIs and media upload logic"`

### 📦 Module 3.2: Profile UI
- [x] Build `ProfilePage` (Conditional rendering for Seeker/Recruiter).
- [x] Build `EditProfile` modal/form.
- [x] Add Resume previewer and Profile Picture crop/upload UI.
- [x] [**GIT**] `git commit -m "Complete user profile management UI"`

---

## 💼 PHASE 4: Job Management (Recruiter Flow)
**Goal:** Empower recruiters to post and manage jobs.

### 📦 Module 4.1: Job CRUD Backend
- [x] Create `Job` model (`server/src/models/Job.js`).
- [x] Implement Job Operations:
    - [x] `POST /api/jobs` (Create)
    - [x] `GET /api/jobs` (List with filters: location, salary, type)
    - [x] `PUT /api/jobs/:id` (Update)
    - [x] `DELETE /api/jobs/:id` (Delete)
- [x] [**GIT**] `git commit -m "Implement job management REST APIs with search filters"`

### 📦 Module 4.2: Recruiter Dashboard UI
- [x] Build "Post a Job" wizard.
- [x] Build "My Jobs" table with status toggles (Active/Closed).
- [x] Build "Applicants List" view per job.
- [x] [**GIT**] `git commit -m "Complete recruiter job posting and management dashboard"`

---

## 📥 PHASE 5: Job Discovery & Application (Seeker Flow)
**Goal:** Streamline the job search and application process.

### 📦 Module 5.1: Job Discovery UI
- [x] Build `JobListing` page with Sidebar filters.
- [x] Build `JobCard` with glassmorphism and hover animations.
- [x] Implement "Search" functionality with debouncing.
- [x] Build `JobDetails` view.
- [x] [**GIT**] `git commit -m "Complete job discovery UI with advanced filtering"`

### 📦 Module 5.2: Application Workflow
- [x] Create `Application` model.
- [x] Implement `POST /api/apply/:jobId`.
- [x] Implement Seeker Dashboard: "Applied Jobs" with status tracking.
- [x] [**GIT**] `git commit -m "Implement application submission and seeker tracking system"`

---

## 👑 PHASE 6: Admin Control Panel
**Goal:** Full platform governance and data visualization.

### 📦 Module 6.1: Admin Backend & Stats
- [ ] Implement Admin-only routes for analytics.
- [ ] Use MongoDB aggregations for dashboard metrics (User growth, Job volume).
- [ ] Implement Moderation APIs (Ban users, Delete jobs).
- [ ] [**GIT**] `git commit -m "Implement admin analytics and moderation APIs"`

### 📦 Module 6.2: Admin Dashboard UI
- [ ] Build Stats Overview with Recharts (Line/Bar charts).
- [ ] Build User Management and Job Moderation tables.
- [ ] [**GIT**] `git commit -m "Complete Admin dashboard UI and data visualization"`

---

## 💬 PHASE 7: Real-time Communication
**Goal:** Enable candidate-recruiter interaction via Socket.io.

### 📦 Module 7.1: Chat Architecture
- [ ] Integrate Socket.io in `server/src/socket/`.
- [ ] Create `Message` model.
- [ ] Implement `GET /api/chats/:receiverId` for history.
- [ ] [**GIT**] `git commit -m "Setup real-time messaging architecture with Socket.io"`

### 📦 Module 7.2: Chat UI
- [ ] Build Floating Chat Window or dedicated Messaging page.
- [ ] Implement real-time status (Online/Typing).
- [ ] Add Bubble animations and scroll-to-bottom logic.
- [ ] [**GIT**] `git commit -m "Complete real-time chat interface"`

---

## 🤖 PHASE 8: AI Features (Advanced)
**Goal:** Implement 2026-level smart features.

### 📦 Module 8.1: Smart AI Services
- [ ] Build AI Recommendation Service (`server/src/services/aiService.js`).
- [ ] Implement Skill-Match algorithm (Vector logic or Keyword grouping).
- [ ] Implement Resume Analyzer feedback system.
- [ ] [**GIT**] `git commit -m "Integrate AI-driven job recommendations and skill matching"`

---

## 🏁 PHASE 9: Final Polish & Deployment
**Goal:** Final optimization and public launch.

### 📦 Module 9.1: Optimization & Launch
- [ ] Implement Skeleton Loaders for all main views.
- [ ] Setup Error Boundaries and Global Error Handling.
- [ ] Optimize Images & API response times.
- [ ] Deployment:
    - [ ] Frontend to Vercel/Netlify.
    - [ ] Backend to Render/AWS.
- [ ] [**GIT**] `git commit -m "Final polish, performance optimization, and deployment prep"`
