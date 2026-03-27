import { useMemo, useState } from 'react'
import { AiFillHeart, AiOutlineComment, AiOutlineShareAlt } from 'react-icons/ai'
import { BiBookmark, BiSolidBookmark } from 'react-icons/bi'

const formatCount = (value) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  }

  return `${value}`
}

function ActionButton({ label, icon, count, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col items-center gap-1 text-white"
      aria-label={label}
    >
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-xl transition-transform duration-200 group-active:scale-90 ${
          active ? 'text-pink-500' : 'text-white'
        }`}
      >
        {icon}
      </span>
      <span className="text-xs font-semibold">{count}</span>
    </button>
  )
}

export function ActionBar({ video }) {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(video.likes)

  const displayLikes = useMemo(() => formatCount(likeCount), [likeCount])

  const handleLikeToggle = () => {
    setIsLiked((currentLiked) => {
      const nextLiked = !currentLiked
      setLikeCount((currentCount) =>
        nextLiked ? currentCount + 1 : Math.max(0, currentCount - 1),
      )
      return nextLiked
    })
  }

  const handleBookmarkToggle = () => {
    setIsBookmarked((currentBookmarked) => !currentBookmarked)
  }

  return (
    <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center gap-4">
      <ActionButton
        label="Like video"
        icon={<AiFillHeart />}
        count={displayLikes}
        active={isLiked}
        onClick={handleLikeToggle}
      />
      <ActionButton
        label="Comments"
        icon={<AiOutlineComment />}
        count={formatCount(video.comments)}
        active={false}
      />
      <ActionButton
        label="Share"
        icon={<AiOutlineShareAlt />}
        count={formatCount(video.shares)}
        active={false}
      />
      <ActionButton
        label="Save video"
        icon={isBookmarked ? <BiSolidBookmark /> : <BiBookmark />}
        count=""
        active={isBookmarked}
        onClick={handleBookmarkToggle}
      />
    </div>
  )
}
