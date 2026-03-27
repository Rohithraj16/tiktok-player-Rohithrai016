import { useState } from 'react'
import { IoMusicalNotesOutline } from 'react-icons/io5'

const DESCRIPTION_LIMIT = 90

export function UserInfoOverlay({ video }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const isLongDescription = video.description.length > DESCRIPTION_LIMIT
  const collapsedDescription = `${video.description.slice(0, DESCRIPTION_LIMIT)}...`
  const descriptionToRender =
    isLongDescription && !isExpanded ? collapsedDescription : video.description

  const handleExpandToggle = () => {
    setIsExpanded((currentExpanded) => !currentExpanded)
  }

  return (
    <div className="pointer-events-none absolute right-20 bottom-8 left-3 z-20 text-white">
      <p className="mb-2 text-sm font-semibold">@{video.user.name}</p>
      <p
        className="text-sm leading-5 text-white/95"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: isExpanded ? 'unset' : 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {descriptionToRender}{' '}
        {isLongDescription ? (
          <button
            type="button"
            className="pointer-events-auto text-xs font-semibold text-white"
            onClick={handleExpandToggle}
          >
            {isExpanded ? 'less' : 'more'}
          </button>
        ) : undefined}
      </p>
      <p className="mt-2 flex items-center gap-1 text-xs text-white/80">
        <IoMusicalNotesOutline className="text-sm" />
        <span>{video.music}</span>
      </p>
    </div>
  )
}
