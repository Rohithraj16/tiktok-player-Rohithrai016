import { useRef, useState } from 'react'
import { BsPauseFill, BsPlayFill } from 'react-icons/bs'
import { FaHeart } from 'react-icons/fa'
import { FiVolume2, FiVolumeX } from 'react-icons/fi'
import { ActionBar } from './ActionBar'
import { MusicDisc } from './MusicDisc'
import { UserInfoOverlay } from './UserInfoOverlay'

const clampUnder999 = (value) => Math.min(999, Math.max(0, value))

const DOUBLE_TAP_MS = 280
const LONG_PRESS_MS = 500
const MOVE_CANCEL_PX = 12

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
  const [isBuffering, setIsBuffering] = useState(true)

  // Single-tap playback hint
  const [isShowingPlaybackHint, setIsShowingPlaybackHint] = useState(false)
  const [playbackHintIcon, setPlaybackHintIcon] = useState('play')

  // Long-press pause overlay
  const [isLongPressPaused, setIsLongPressPaused] = useState(false)

  // Like state — lifted here so double-tap syncs with ActionBar
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(clampUnder999(video.likes))

  // Heart burst overlay
  const [isHeartBurst, setIsHeartBurst] = useState(false)

  // Refs
  const localVideoRef = useRef(undefined)
  const lastTapTimeRef = useRef(0)
  const singleTapTimerRef = useRef(undefined)
  const heartBurstTimerRef = useRef(undefined)
  const longPressTimerRef = useRef(undefined)
  const longPressHandledRef = useRef(false)
  const pointerDownPosRef = useRef({ x: 0, y: 0 })

  const isActive = activeIndex === index

  // ── Like helpers ────────────────────────────────────────────────────────────

  const handleLikeToggle = () => {
    setIsLiked((prev) => {
      const next = !prev
      setLikeCount((c) => clampUnder999(next ? c + 1 : c - 1))
      return next
    })
  }

  const triggerDoubleTapLike = () => {
    setIsLiked((prev) => {
      if (!prev) setLikeCount((c) => clampUnder999(c + 1))
      return true
    })
    clearTimeout(heartBurstTimerRef.current)
    setIsHeartBurst(false)
    requestAnimationFrame(() => {
      setIsHeartBurst(true)
      heartBurstTimerRef.current = setTimeout(() => setIsHeartBurst(false), 800)
    })
  }

  // ── Tap handling (single / double) ──────────────────────────────────────────

  const handleVideoTap = (event) => {
    // Long-press already handled this gesture — skip tap logic
    if (longPressHandledRef.current) {
      longPressHandledRef.current = false
      return
    }

    const videoEl = event.currentTarget
    const now = Date.now()
    const gap = now - lastTapTimeRef.current
    lastTapTimeRef.current = now

    if (gap < DOUBLE_TAP_MS) {
      clearTimeout(singleTapTimerRef.current)
      triggerDoubleTapLike()
      return
    }

    clearTimeout(singleTapTimerRef.current)
    singleTapTimerRef.current = setTimeout(() => {
      const shouldPause = !videoEl.paused
      if (shouldPause) {
        videoEl.pause()
        setPlaybackHintIcon('pause')
      } else {
        videoEl
          .play()
          .then(() => setPlaybackHintIcon('play'))
          .catch(() => setPlaybackHintIcon('pause'))
      }
      setIsShowingPlaybackHint(true)
      window.setTimeout(() => setIsShowingPlaybackHint(false), 900)
    }, DOUBLE_TAP_MS)
  }

  // ── Long-press handling ──────────────────────────────────────────────────────

  const cancelLongPress = () => {
    clearTimeout(longPressTimerRef.current)
  }

  const handlePointerDown = (event) => {
    if (event.button !== 0 && event.pointerType !== 'touch') return
    pointerDownPosRef.current = { x: event.clientX, y: event.clientY }

    longPressTimerRef.current = setTimeout(() => {
      const videoEl = localVideoRef.current
      if (!videoEl || videoEl.paused) return
      videoEl.pause()
      longPressHandledRef.current = true
      clearTimeout(singleTapTimerRef.current)
      setIsLongPressPaused(true)
    }, LONG_PRESS_MS)
  }

  const handlePointerMove = (event) => {
    const dx = Math.abs(event.clientX - pointerDownPosRef.current.x)
    const dy = Math.abs(event.clientY - pointerDownPosRef.current.y)
    if (dx > MOVE_CANCEL_PX || dy > MOVE_CANCEL_PX) cancelLongPress()
  }

  const handlePointerUp = () => {
    cancelLongPress()
    if (!isLongPressPaused) return
    localVideoRef.current?.play().catch(() => undefined)
    setIsLongPressPaused(false)
  }

  const handlePointerCancel = () => {
    cancelLongPress()
    if (!isLongPressPaused) return
    localVideoRef.current?.play().catch(() => undefined)
    setIsLongPressPaused(false)
  }

  // ── Video events ────────────────────────────────────────────────────────────

  const handleTimeUpdate = (event) => {
    const { currentTime, duration, paused } = event.currentTarget
    const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 1
    setProgressPercent((currentTime / safeDuration) * 100)
    setIsPlaying(!paused)
  }

  return (
    <section
      ref={(node) => registerSectionRef(index, node)}
      className="relative h-full w-full shrink-0 snap-start snap-always bg-black"
    >
      <video
        ref={(node) => {
          localVideoRef.current = node
          registerVideoRef(index, node)
        }}
        src={video.url}
        className="h-full w-full object-cover"
        autoPlay={isActive}
        muted={muted}
        loop={shouldLoop}
        playsInline
        preload="metadata"
        onClick={handleVideoTap}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onPointerLeave={handlePointerCancel}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => { setIsPlaying(true); setIsBuffering(false) }}
        onPause={() => setIsPlaying(false)}
        onWaiting={() => setIsBuffering(true)}
        onCanPlay={() => setIsBuffering(false)}
        onPlaying={() => setIsBuffering(false)}
        onEnded={() => onVideoEnded?.(index)}
      />

      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/65" />

      {/* Loading skeleton — shown only on active card while buffering */}
      {isActive && isBuffering && (
        <div className="pointer-events-none absolute inset-0 z-20">
          <div className="skeleton-shimmer absolute inset-0" />

          {/* Fake bottom-left text bars */}
          <div className="absolute bottom-28 left-3 space-y-2">
            <div className="h-3 w-24 rounded-full bg-white/10" />
            <div className="h-2.5 w-48 rounded-full bg-white/10" />
            <div className="h-2.5 w-36 rounded-full bg-white/10" />
          </div>

          {/* Fake right-side action icons */}
          <div className="absolute right-3 bottom-40 flex flex-col items-center gap-5">
            {[48, 32, 32, 32].map((size, i) => (
              <div
                key={i}
                className="rounded-full bg-white/10"
                style={{ width: size, height: size }}
              />
            ))}
          </div>

          {/* Spinner in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white/70" />
          </div>
        </div>
      )}

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

      {/* Long-press pause overlay */}
      {isLongPressPaused && (
        <div className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center gap-2 bg-black/30">
          <BsPauseFill className="text-5xl text-white/90 drop-shadow" />
          <span className="text-[11px] font-semibold tracking-widest text-white/60 uppercase">
            Hold
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
