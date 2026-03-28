import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getInitialComments, makeComment } from '../../data/comments'
import { CommentSheet } from './CommentSheet'
import { VideoCard } from './VideoCard'

export function VideoFeed({ videos, initialIndex = 0 }) {
  const [activeIndex, setActiveIndex] = useState(initialIndex)
  const [isMuted, setIsMuted] = useState(false)

  // Comment state lives here so CommentSheet renders OUTSIDE the scroll container
  const [commentsMap, setCommentsMap] = useState(() => {
    const map = {}
    videos.forEach((_, i) => { map[i] = getInitialComments(i) })
    return map
  })
  const [openCommentIndex, setOpenCommentIndex] = useState(null)

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

  // Scroll to the initial video (from URL) on first mount
  useEffect(() => {
    if (initialIndex === 0) return
    const id = requestAnimationFrame(() => {
      sectionRefs.current[initialIndex]?.scrollIntoView({ behavior: 'instant', block: 'start' })
    })
    return () => cancelAnimationFrame(id)
  }, []) // intentionally runs once on mount only

  // Keep the browser URL in sync with the currently visible video
  useEffect(() => {
    const realIndex = activeIndex >= videos.length ? 0 : activeIndex
    const slug = videos[realIndex]?.slug
    if (!slug) return
    window.history.replaceState(null, '', `/video/${slug}`)
  }, [activeIndex, videos])

  // Auto-close comment sheet when user scrolls to a different video
  useEffect(() => {
    setOpenCommentIndex(null)
  }, [activeIndex])

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
      container.style.scrollSnapType = 'none'
      sectionRefs.current[0]?.scrollIntoView({ behavior: 'instant', block: 'start' })
      setActiveIndex(0)
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

  // Play active video, pause all others
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

  const handleVideoEnded = useCallback(
    (index) => {
      if (index !== activeIndexRef.current) return
      if (index === lastRealIndex) scrollToIndex(cloneIndex)
      else if (index < lastRealIndex) scrollToIndex(index + 1)
    },
    [lastRealIndex, cloneIndex, scrollToIndex],
  )

  const handleKeyDown = useCallback(
    (event) => {
      const current = activeIndexRef.current
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        if (current < lastRealIndex) scrollToIndex(current + 1)
        else if (current === lastRealIndex) scrollToIndex(cloneIndex)
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

  // Add a comment to the currently open video's list
  const handleAddComment = useCallback((text) => {
    setOpenCommentIndex((idx) => {
      if (idx === null) return null
      setCommentsMap((prev) => ({
        ...prev,
        [idx]: [...(prev[idx] ?? []), makeComment(text)],
      }))
      return idx
    })
  }, [])

  const handleMuteToggle = useCallback(() => setIsMuted((m) => !m), [])

  const registerVideoRef = (i, node) => { videoRefs.current[i] = node }
  const registerSectionRef = (i, node) => {
    sectionRefs.current[i] = node
    if (node) node.setAttribute('data-index', String(i))
  }

  const activeComments = openCommentIndex !== null ? (commentsMap[openCommentIndex] ?? []) : []

  return (
    // Wrapper is the positioning root for the CommentSheet — it is NOT the scroll container
    <div className="relative h-full w-full">
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
            commentCount={commentsMap[index]?.length ?? 0}
            onCommentOpen={() => setOpenCommentIndex(index)}
            onToggleMute={handleMuteToggle}
            onVideoEnded={handleVideoEnded}
            registerVideoRef={registerVideoRef}
            registerSectionRef={registerSectionRef}
          />
        ))}
      </main>

      {/* CommentSheet is a sibling to <main>, NOT inside the scroll container.
          This prevents transform/overflow clipping bugs when scrolling between videos. */}
      <CommentSheet
        isOpen={openCommentIndex !== null}
        comments={activeComments}
        onAddComment={handleAddComment}
        onClose={() => setOpenCommentIndex(null)}
      />
    </div>
  )
}
