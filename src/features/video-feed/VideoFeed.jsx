import { useEffect, useRef, useState } from 'react'
import { VideoCard } from './VideoCard'

const IN_VIEW_THRESHOLD = 0.7

export function VideoFeed({ videos }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const containerRef = useRef(undefined)
  const sectionRefs = useRef([])
  const videoRefs = useRef([])

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus()
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return
          }

          const sectionIndex = Number(entry.target.getAttribute('data-index'))
          if (!Number.isNaN(sectionIndex)) {
            setActiveIndex(sectionIndex)
          }
        })
      },
      { threshold: IN_VIEW_THRESHOLD },
    )

    sectionRefs.current.forEach((sectionElement) => {
      if (sectionElement) {
        observer.observe(sectionElement)
      }
    })

    return () => observer.disconnect()
  }, [videos.length])

  useEffect(() => {
    videoRefs.current.forEach((videoElement, index) => {
      if (!videoElement) {
        return
      }

      if (index === activeIndex) {
        videoElement.muted = isMuted
        videoElement
          .play()
          .catch(() => {
            // Browser may block first autoplay with sound; retry muted.
            if (!videoElement.muted) {
              videoElement.muted = true
              setIsMuted(true)
              videoElement.play().catch(() => undefined)
            }
          })
      } else {
        videoElement.pause()
      }
    })
  }, [activeIndex, isMuted])

  const registerSectionRef = (index, node) => {
    sectionRefs.current[index] = node
    if (node) {
      node.setAttribute('data-index', `${index}`)
    }
  }

  const registerVideoRef = (index, node) => {
    videoRefs.current[index] = node
  }

  const scrollToIndex = (nextIndex, behavior = 'smooth') => {
    const sectionElement = sectionRefs.current[nextIndex]
    if (!sectionElement) {
      return
    }
    sectionElement.scrollIntoView({ behavior, block: 'start' })
  }

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      const nextIndex = activeIndex === videos.length - 1 ? 0 : activeIndex + 1
      scrollToIndex(nextIndex)
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      const previousIndex = activeIndex === 0 ? videos.length - 1 : activeIndex - 1
      scrollToIndex(previousIndex)
    }

    if (event.key === ' ') {
      event.preventDefault()
      const activeVideo = videoRefs.current[activeIndex]
      if (!activeVideo) {
        return
      }
      if (activeVideo.paused) {
        activeVideo.play().catch(() => undefined)
      } else {
        activeVideo.pause()
      }
    }
  }

  const handleWheel = (event) => {
    if (event.deltaY > 0 && activeIndex === videos.length - 1) {
      event.preventDefault()
      scrollToIndex(0, 'auto')
    }

    if (event.deltaY < 0 && activeIndex === 0) {
      event.preventDefault()
      scrollToIndex(videos.length - 1, 'auto')
    }
  }

  const handleMuteToggle = () => {
    setIsMuted((currentMuted) => !currentMuted)
  }

  return (
    <main
      ref={containerRef}
      className="hide-scrollbar h-full w-full snap-y snap-mandatory overflow-y-scroll bg-black scroll-smooth"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onWheel={handleWheel}
    >
      {videos.map((video, index) => (
        <VideoCard
          key={video.id}
          index={index}
          video={video}
          activeIndex={activeIndex}
          muted={isMuted}
          onToggleMute={handleMuteToggle}
          registerVideoRef={registerVideoRef}
          registerSectionRef={registerSectionRef}
        />
      ))}
    </main>
  )
}
