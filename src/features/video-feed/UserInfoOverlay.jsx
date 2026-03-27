import { useEffect, useRef, useState } from 'react'
import { IoMusicalNotesOutline } from 'react-icons/io5'

export function UserInfoOverlay({ video }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isTruncated, setIsTruncated] = useState(false)
  const descRef = useRef(undefined)

  // Detect whether the description actually overflows 2 lines
  useEffect(() => {
    const el = descRef.current
    if (!el) return
    // scrollHeight = full content height; clientHeight = visible 2-line height
    setIsTruncated(el.scrollHeight > el.clientHeight + 1)
  }, [video.description])

  return (
    <div className="pointer-events-none absolute right-20 bottom-24 left-3 z-20 select-none text-white drop-shadow-md">
      {/* Username */}
      <p className="mb-1.5 text-[15px] font-bold tracking-wide">@{video.user.name}</p>

      {/* Description */}
      <div className="text-[13px] leading-[1.45] text-white/95">
        <p
          ref={descRef}
          style={
            isExpanded
              ? undefined
              : {
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }
          }
        >
          {video.description}
        </p>

        {(isTruncated || isExpanded) && (
          <button
            type="button"
            className="pointer-events-auto mt-0.5 text-[12px] font-semibold text-white/70 active:opacity-60"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {isExpanded ? 'less' : 'more'}
          </button>
        )}
      </div>

      {/* Music */}
      <p className="mt-2 flex items-center gap-1 text-[12px] text-white/75">
        <IoMusicalNotesOutline className="shrink-0 text-sm" />
        <span className="truncate">{video.music}</span>
      </p>
    </div>
  )
}
