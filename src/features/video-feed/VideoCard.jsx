import { useRef, useState } from 'react'
import { BsPauseFill, BsPlayFill } from 'react-icons/bs'
import { FaHeart } from 'react-icons/fa'
import { FiVolume2, FiVolumeX } from 'react-icons/fi'
import { ActionBar } from './ActionBar'
import { MusicDisc } from './MusicDisc'
import { UserInfoOverlay } from './UserInfoOverlay'

const clampUnder999 = (value) => Math.min(999, Math.max(0, value))

const DOUBLE_TAP_MS = 280

export function VideoCard({
  index,
  video,
  activeIndex,
  muted,
  shouldLoop,
  onToggleMute,
  onVideoEnded,
  registerVideoRef,
  registerSectionRef,
}) {
  const [progressPercent, setProgressPercent] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  // Playback hint (single-tap play/pause icon)
  const [isShowingPlaybackHint, setIsShowingPlaybackHint] = useState(false)
  const [playbackHintIcon, setPlaybackHintIcon] = useState('play')

  // Like state — owned here so double-tap can sync with ActionBar
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(clampUnder999(video.likes))

  // Heart burst overlay (double-tap animation)
  const [isHeartBurst, setIsHeartBurst] = useState(false)
  const heartBurstTimerRef = useRef(undefined)

  // Double-tap detection
  const lastTapTimeRef = useRef(0)
  const singleTapTimerRef = useRef(undefined)

  const isActive = activeIndex === index

  const handleLikeToggle = () => {
    setIsLiked((prev) => {
      const next = !prev
      setLikeCount((c) => clampUnder999(next ? c + 1 : c - 1))
      return next
    })
  }

  const triggerDoubleTapLike = () => {
    // Always force like on double-tap (never un-like via double-tap)
    setIsLiked((prev) => {
      if (!prev) setLikeCount((c) => clampUnder999(c + 1))
      return true
    })

    // Show heart burst — restart animation if already showing
    clearTimeout(heartBurstTimerRef.current)
    setIsHeartBurst(false)
    requestAnimationFrame(() => {
      setIsHeartBurst(true)
      heartBurstTimerRef.current = setTimeout(() => setIsHeartBurst(false), 800)
    })
  }

  const handleTimeUpdate = (event) => {
    const { currentTime, duration, paused } = event.currentTarget
    const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 1
    setProgressPercent((currentTime / safeDuration) * 100)
    setIsPlaying(!paused)
  }

  const handleVideoTap = (event) => {
    const videoElement = event.currentTarget
    const now = Date.now()
    const gap = now - lastTapTimeRef.current
    lastTapTimeRef.current = now

    if (gap < DOUBLE_TAP_MS) {
      // Double-tap: cancel the pending single-tap and trigger like
      clearTimeout(singleTapTimerRef.current)
      triggerDoubleTapLike()
      return
    }

    // Delay single-tap action to allow a second tap to cancel it
    clearTimeout(singleTapTimerRef.current)
    singleTapTimerRef.current = setTimeout(() => {
      const shouldPause = !videoElement.paused
      if (shouldPause) {
        videoElement.pause()
        setPlaybackHintIcon('pause')
      } else {
        videoElement
          .play()
          .then(() => setPlaybackHintIcon('play'))
          .catch(() => setPlaybackHintIcon('pause'))
      }
      setIsShowingPlaybackHint(true)
      window.setTimeout(() => setIsShowingPlaybackHint(false), 900)
    }, DOUBLE_TAP_MS)
  }

  return (
    <section
      ref={(node) => registerSectionRef(index, node)}
      className="relative h-full w-full shrink-0 snap-start snap-always bg-black"
    >
      <video
        ref={(node) => registerVideoRef(index, node)}
        src={video.url}
        className="h-full w-full object-cover"
        autoPlay={isActive}
        muted={muted}
        loop={shouldLoop}
        playsInline
        preload="metadata"
        onClick={handleVideoTap}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => onVideoEnded?.(index)}
      />

      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/65" />

      <ActionBar
        video={video}
        isLiked={isLiked}
        likeCount={likeCount}
        onLikeToggle={handleLikeToggle}
      />
      <UserInfoOverlay video={video} />
      <MusicDisc coverUrl={video.musicCover} isPlaying={isPlaying && isActive} />

      {/* Mute toggle */}
      <button
        type="button"
        className="absolute right-3 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white"
        onClick={onToggleMute}
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? <FiVolumeX /> : <FiVolume2 />}
      </button>

      {/* Single-tap playback hint */}
      {isShowingPlaybackHint && (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
          <span className="rounded-full bg-black/45 px-4 py-3 text-2xl text-white">
            {playbackHintIcon === 'play' ? <BsPlayFill /> : <BsPauseFill />}
          </span>
        </div>
      )}

      {/* Double-tap heart burst */}
      {isHeartBurst && (
        <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center">
          <FaHeart className="animate-heart-burst text-[110px] text-pink-500 drop-shadow-[0_0_24px_rgba(236,72,153,0.7)]" />
        </div>
      )}

      {/* Progress bar */}
      <div className="absolute right-0 bottom-0 left-0 z-20 h-1 bg-white/25">
        <div
          className="h-full bg-white transition-[width] duration-100"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </section>
  )
}
