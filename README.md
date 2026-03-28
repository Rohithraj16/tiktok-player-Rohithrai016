# TikTok-Style Vertical Video Player

A TikTok-inspired vertical video feed built with React 18, Vite, and Tailwind CSS — featuring smooth scroll-snap navigation, auto-play/pause, interactive overlays, double-tap to like, comments, dark mode, and shareable video URLs.

---

## 🔗 Live Demo

[View Live App](https://tiktok-player-rohithrai016.vercel.app)

---

## 🎥 Video Demo

[Watch Demo on Google Drive](https://drive.google.com/file/d/1IoC8GR1jng_nnLjyPg-Yha0UWcUDzdAT/view?usp=sharing)

---

## 🚀 Project Setup

Make sure you have **Node.js v20+** installed (v20 recommended for latest Vite support).

```bash
# 1. Clone the repository
git clone https://github.com/Rohithraj16/tiktok-player-Rohithrai016.git
cd tiktok-player-Rohithrai016

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open your browser and go to: **http://localhost:5173**

---

## ✨ Features

### Core
- Vertical video feed with CSS scroll-snap — one video at a time, full viewport height
- Auto-play when scrolled into view, auto-pause when scrolled away
- Tap to play / pause with icon overlay
- Progress bar showing elapsed time per video
- Sound toggle (mute / unmute)
- Infinite loop — after the last video, smoothly scrolls back to the first

### Interactive Overlays
- Right-side action bar: Like (with count), Comment, Share, Bookmark
- User info overlay: username, expandable caption (`more` / `less`)
- Spinning music disc (bottom-right)
- Follow button on user avatar (toggles Follow / Following)

### Bonus Features
- **Double-tap to like** — large animated heart burst in the centre of the screen
- **Long-press to pause** — hold pauses playback, release resumes
- **Video loading skeleton** — shimmer placeholder while buffering
- **Comment section** — TikTok-style slide-up panel with dummy comments, per-comment likes, and ability to add new comments (state only, no database)
- **Dark mode toggle** — accessible via the ⚙ settings button (top-left) or the Me tab in the bottom nav
- **Shareable video URLs** — each video has a unique route (`/video/:slug`); URL updates as you scroll; Share button copies the direct link or opens the native share sheet on mobile
- **Keyboard navigation** — Arrow Up / Down to scroll, Space to play / pause

---

## 🛠 Tech Choices

| Tool | Reason |
|---|---|
| React 18 + Vite | Fast HMR, modern React features, no CRA overhead |
| Tailwind CSS v4 | Utility-first styling with zero runtime |
| Native `<video>` | No external player library — full control |
| CSS scroll-snap | Smooth single-video snapping without JS animation loops |
| IntersectionObserver | Efficient active-video detection for play/pause |
| react-router-dom | Clean client-side routing for shareable video URLs |
| react-icons | Consistent, tree-shakeable icon set |

---
