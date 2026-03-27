import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { VideoCard } from './VideoCard'

export function VideoFeed({ videos }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMuted, setIsMuted] = useState(false)

  const containerRef = useRef(undefined)
  const videoRefs = useRef([])
  const sectionRefs = useRef([])
  const activeIndexRef = useRef(0)

  // Clone first video appended at end — enables one-slide smooth scroll into first video
  const displayList = useMemo(
    () => [...videos, { ...videos[0], id: `${videos[0].id}-loop-clone` }],
    [videos],
  )

  const lastRealIndex = videos.length - 1
  const cloneIndex = videos.length

  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])

  useEffect(() => {
    containerRef.current?.focus()
  }, [])

  // Detect active slide — clone counts as its own index temporarily
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const idx = Number(entry.target.getAttribute('data-index'))
          if (!Number.isNaN(idx)) setActiveIndex(idx)
        })
      },
      { root: container, threshold: 0.6 },
    )

    sectionRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [displayList.length])

  // After CSS snap settles on the clone, silently jump to real first video
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let fallbackTimer

    const teleportToFirst = () => {
      if (activeIndexRef.current !== cloneIndex) return
      // Disable snap momentarily so the instant scroll doesn't fight the snapper
      container.style.scrollSnapType = 'none'
      sectionRefs.current[0]?.scrollIntoView({ behavior: 'instant', block: 'start' })
      setActiveIndex(0)
      // Re-enable snap after the position is committed
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          container.style.scrollSnapType = ''
        }),
      )
    }

    const onScrollEnd = () => {
      clearTimeout(fallbackTimer)
      teleportToFirst()
    }

    // Fallback for browsers that don't fire scrollend
    const onScroll = () => {
      clearTimeout(fallbackTimer)
      fallbackTimer = setTimeout(teleportToFirst, 180)
    }

    container.addEventListener('scrollend', onScrollEnd)
    container.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      clearTimeout(fallbackTimer)
      container.removeEventListener('scrollend', onScrollEnd)
      container.removeEventListener('scroll', onScroll)
    }
  }, [cloneIndex])

  // Play active video, pause all others; clone plays just like any other slide
  useEffect(() => {
    videoRefs.current.forEach((el, i) => {
      if (!el) return
      if (i === activeIndex) {
        el.muted = isMuted
        el.play().catch(() => {
          if (!el.muted) {
            el.muted = true
            setIsMuted(true)
            el.play().catch(() => undefined)
          }
        })
      } else {
        el.pause()
      }
    })
  }, [activeIndex, isMuted])

  const scrollToIndex = useCallback((index, behavior = 'smooth') => {
    const el = sectionRefs.current[index]
    if (!el) return
    el.scrollIntoView({ behavior, block: 'start' })
  }, [])

  // When last real video ends, scroll smoothly to clone → scrollend teleports to real first
  const handleVideoEnded = useCallback(
    (index) => {
      if (index !== activeIndexRef.current) return
      if (index === lastRealIndex) {
        scrollToIndex(cloneIndex)
      } else if (index < lastRealIndex) {
        scrollToIndex(index + 1)
      }
    },
    [lastRealIndex, cloneIndex, scrollToIndex],
  )

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (event) => {
      const current = activeIndexRef.current
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        if (current < lastRealIndex) scrollToIndex(current + 1)
        else if (current === lastRealIndex) scrollToIndex(cloneIndex)
        // If on clone, scrollend will already handle the teleport — do nothing
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        if (current > 0 && current <= lastRealIndex) scrollToIndex(current - 1)
      }
      if (event.key === ' ') {
        event.preventDefault()
        const v = videoRefs.current[current]
        if (!v) return
        if (v.paused) v.play().catch(() => undefined)
        else v.pause()
      }
    },
    [lastRealIndex, cloneIndex, scrollToIndex],
  )

  const handleMuteToggle = useCallback(() => setIsMuted((m) => !m), [])

  const registerVideoRef = (i, node) => {
    videoRefs.current[i] = node
  }
  const registerSectionRef = (i, node) => {
    sectionRefs.current[i] = node
    if (node) node.setAttribute('data-index', String(i))
  }

  return (
    <main
      ref={containerRef}
      className="hide-scrollbar h-full w-full snap-y snap-mandatory overflow-y-scroll bg-black outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {displayList.map((video, index) => (
        <VideoCard
          key={video.id}
          index={index}
          video={video}
          activeIndex={activeIndex}
          muted={isMuted}
          shouldLoop={index < lastRealIndex}
          onToggleMute={handleMuteToggle}
          onVideoEnded={handleVideoEnded}
          registerVideoRef={registerVideoRef}
          registerSectionRef={registerSectionRef}
        />
      ))}
    </main>
  )
}
