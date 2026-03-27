import { useMemo, useState } from 'react'
import { FaBookmark, FaHeart, FaRegBookmark, FaRegHeart } from 'react-icons/fa'
import { RiShareForwardLine } from 'react-icons/ri'
import { TbMessageDots } from 'react-icons/tb'

const clampUnder999 = (value) => Math.min(999, Math.max(0, value))

const formatCount = (value) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
  return `${value}`
}

function ActionButton({ label, icon, count, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="group flex flex-col items-center gap-[3px]"
    >
      <span
        className={`flex items-center justify-center text-[32px] drop-shadow-md transition-transform duration-150 group-active:scale-90 ${
          active ? 'text-pink-500' : 'text-white'
        }`}
      >
        {icon}
      </span>
      {count !== '' && (
        <span className="text-[12px] font-semibold text-white drop-shadow">{count}</span>
      )}
    </button>
  )
}

function FollowButton({ isFollowing, onToggle }) {
  return (
    <button
      type="button"
      aria-label={isFollowing ? 'Following' : 'Follow'}
      onClick={onToggle}
      className={`absolute -bottom-2.5 left-1/2 flex h-[18px] w-[18px] -translate-x-1/2 items-center justify-center rounded-full text-white transition-colors ${
        isFollowing ? 'bg-white text-black' : 'bg-[#FE2C55]'
      }`}
    >
      <span className="text-[12px] font-black leading-none">{isFollowing ? '✓' : '+'}</span>
    </button>
  )
}

export function ActionBar({ video, isLiked, likeCount, onLikeToggle }) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [commentCount, setCommentCount] = useState(clampUnder999(video.comments))

  const displayLikes = useMemo(() => formatCount(likeCount), [likeCount])
  const displayComments = useMemo(() => formatCount(commentCount), [commentCount])

  const handleCommentClick = () => {
    setCommentCount((c) => clampUnder999(c + 1))
  }

  return (
    <div className="absolute right-3 bottom-40 z-30 flex flex-col items-center gap-5">
      {/* Avatar + Follow */}
      <div className="relative mb-1">
        <img
          src={video.user.avatar}
          alt={`${video.user.name} avatar`}
          className="h-12 w-12 rounded-full border-2 border-white object-cover"
          loading="lazy"
        />
        <FollowButton isFollowing={isFollowing} onToggle={() => setIsFollowing((f) => !f)} />
      </div>

      {/* Like — state owned by VideoCard so double-tap syncs */}
      <ActionButton
        label="Like video"
        icon={isLiked ? <FaHeart /> : <FaRegHeart />}
        count={displayLikes}
        active={isLiked}
        onClick={onLikeToggle}
      />

      {/* Comment */}
      <ActionButton
        label="Comments"
        icon={<TbMessageDots />}
        count={displayComments}
        active={false}
        onClick={handleCommentClick}
      />

      {/* Share */}
      <ActionButton
        label="Share"
        icon={<RiShareForwardLine />}
        count="Share"
        active={false}
      />

      {/* Bookmark */}
      <ActionButton
        label="Save video"
        icon={isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
        count=""
        active={isBookmarked}
        onClick={() => setIsBookmarked((b) => !b)}
      />
    </div>
  )
}
