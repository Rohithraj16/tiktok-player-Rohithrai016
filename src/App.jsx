import { useState } from 'react'
import { IoSettingsOutline } from 'react-icons/io5'
import { Route, Routes, useParams } from 'react-router-dom'
import { BottomNav } from './components/BottomNav'
import { SettingsMenu } from './components/SettingsMenu'
import { videos } from './data/videos'
import { VideoFeed } from './features/video-feed/VideoFeed'

function AppShell({ initialIndex }) {
  const [isDark, setIsDark] = useState(true)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
    <div
      className={`flex h-screen w-full items-center justify-center px-0 transition-colors duration-300 sm:px-6 ${
        isDark ? 'bg-neutral-950' : 'bg-slate-100'
      }`}
    >
      <div
        className={`relative h-screen w-full max-w-[430px] overflow-hidden transition-colors duration-300 sm:h-[96vh] sm:rounded-2xl sm:shadow-2xl ${
          isDark
            ? 'bg-black sm:border sm:border-white/10'
            : 'bg-neutral-50 sm:border sm:border-black/10'
        }`}
      >
        <VideoFeed videos={videos} initialIndex={initialIndex} />

        {/* Persistent settings button */}
        <button
          type="button"
          aria-label="Open settings"
          onClick={() => setIsSettingsOpen(true)}
          className="absolute left-3 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm"
        >
          <IoSettingsOutline className="text-[20px]" />
        </button>

        <BottomNav isDark={isDark} onOpenSettings={() => setIsSettingsOpen(true)} />
        <SettingsMenu
          isOpen={isSettingsOpen}
          isDark={isDark}
          onToggleDark={() => setIsDark((d) => !d)}
          onClose={() => setIsSettingsOpen(false)}
        />
      </div>
    </div>
  )
}

function VideoRoute() {
  const { slug } = useParams()
  const initialIndex = slug
    ? Math.max(0, videos.findIndex((v) => v.slug === slug))
    : 0
  return <AppShell initialIndex={initialIndex} />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<VideoRoute />} />
      <Route path="/video/:slug" element={<VideoRoute />} />
    </Routes>
  )
}
