import { useState } from 'react'
import { BsPauseFill, BsPlayFill } from 'react-icons/bs'
import { ActionBar } from './ActionBar'
import { MusicDisc } from './MusicDisc'
import { UserInfoOverlay } from './UserInfoOverlay'

export function VideoCard({
  index,
  video,
  activeIndex,
  muted,
  onToggleMute,
  registerVideoRef,
  registerSectionRef,
}) {
  const [progressPercent, setProgressPercent] = useState(0)
  const [isShowingPlaybackHint, setIsShowingPlaybackHint] = useState(false)
  const [playbackHintIcon, setPlaybackHintIcon] = useState('play')
  const [isPlaying, setIsPlaying] = useState(false)

  const isActive = activeIndex === index

  const handleTimeUpdate = (event) => {
    const { currentTime, duration, paused } = event.currentTarget
    const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 1
    const nextProgress = (currentTime / safeDuration) * 100
    setProgressPercent(nextProgress)
    setIsPlaying(!paused)
  }

  const handleVideoTap = (event) => {
    const videoElement = event.currentTarget
    const shouldPause = !videoElement.paused

    if (shouldPause) {
      videoElement.pause()
      setPlaybackHintIcon('pause')
    } else {
      videoElement
        .play()
        .then(() => {
          setPlaybackHintIcon('play')
        })
        .catch(() => {
          setPlaybackHintIcon('pause')
        })
    }

    setIsShowingPlaybackHint(true)
    window.setTimeout(() => setIsShowingPlaybackHint(false), 900)
  }

  return (
    <section
      ref={(node) => registerSectionRef(index, node)}
      className="relative h-full w-full snap-start snap-always bg-black"
    >
      <video
        ref={(node) => registerVideoRef(index, node)}
        src={video.url}
        className="h-full w-full object-cover"
        autoPlay={isActive}
        muted={muted}
        loop
        playsInline
        preload="metadata"
        onClick={handleVideoTap}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/65" />

      <ActionBar video={video} />
      <UserInfoOverlay video={video} />
      <MusicDisc coverUrl={video.musicCover} isPlaying={isPlaying && isActive} />

      <button
        type="button"
        className="absolute right-3 top-4 z-20 rounded-full bg-black/45 px-3 py-1 text-sm font-medium text-white"
        onClick={onToggleMute}
      >
        {muted ? 'Unmute' : 'Mute'}
      </button>

      {isShowingPlaybackHint ? (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
          <span className="rounded-full bg-black/45 px-4 py-3 text-2xl text-white">
            {playbackHintIcon === 'play' ? <BsPlayFill /> : <BsPauseFill />}
          </span>
        </div>
      ) : undefined}

      <div className="absolute right-0 bottom-0 left-0 z-20 h-1 bg-white/25">
        <div
          className="h-full bg-white transition-[width] duration-100"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </section>
  )
}
