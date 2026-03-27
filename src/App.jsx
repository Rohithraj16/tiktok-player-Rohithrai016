import { useState } from 'react'
import { IoSettingsOutline } from 'react-icons/io5'
import { BottomNav } from './components/BottomNav'
import { SettingsMenu } from './components/SettingsMenu'
import { videos } from './data/videos'
import { VideoFeed } from './features/video-feed/VideoFeed'

function App() {
  const [isDark, setIsDark] = useState(true)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const handleToggleDark = () => setIsDark((d) => !d)
  const handleOpenSettings = () => setIsSettingsOpen(true)
  const handleCloseSettings = () => setIsSettingsOpen(false)

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
        <VideoFeed videos={videos} />

        {/* Persistent settings button — top-left, always visible */}
        <button
          type="button"
          aria-label="Open settings"
          onClick={handleOpenSettings}
          className="absolute left-3 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm"
        >
          <IoSettingsOutline className="text-[20px]" />
        </button>

        <BottomNav isDark={isDark} onOpenSettings={handleOpenSettings} />
        <SettingsMenu
          isOpen={isSettingsOpen}
          isDark={isDark}
          onToggleDark={handleToggleDark}
          onClose={handleCloseSettings}
        />
      </div>
    </div>
  )
}

export default App
