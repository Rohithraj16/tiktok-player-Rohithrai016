import { useEffect, useRef, useState } from 'react'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { IoCloseOutline } from 'react-icons/io5'
import { RiSendPlaneFill } from 'react-icons/ri'

function CommentItem({ comment }) {
  const [isLiked, setIsLiked] = useState(comment.isLiked)
  const [likeCount, setLikeCount] = useState(comment.likes)

  const handleLike = () => {
    setIsLiked((prev) => {
      const next = !prev
      setLikeCount((c) => next ? c + 1 : c - 1)
      return next
    })
  }

  return (
    <div className="flex gap-3 py-3">
      <img
        src={comment.avatar}
        alt={comment.user}
        className="h-9 w-9 shrink-0 rounded-full object-cover"
        loading="lazy"
      />
      <div className="flex flex-1 items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-white">{comment.user}</p>
          <p className="mt-0.5 text-[13px] leading-snug text-white/85">{comment.text}</p>
          <div className="mt-1.5 flex items-center gap-4">
            <span className="text-[11px] text-white/40">{comment.time}</span>
            <button type="button" className="text-[11px] font-semibold text-white/40">
              Reply
            </button>
          </div>
        </div>
        <button
          type="button"
          aria-label="Like comment"
          onClick={handleLike}
          className="flex shrink-0 flex-col items-center gap-0.5 pt-0.5"
        >
          {isLiked ? (
            <FaHeart className="text-[14px] text-pink-500" />
          ) : (
            <FaRegHeart className="text-[14px] text-white/45" />
          )}
          <span className="text-[10px] text-white/45">{likeCount > 0 ? likeCount : ''}</span>
        </button>
      </div>
    </div>
  )
}

export function CommentSheet({ isOpen, comments, onAddComment, onClose }) {
  const [inputText, setInputText] = useState('')
  const listRef = useRef(undefined)
  const inputRef = useRef(undefined)

  // Scroll to bottom when new comment is added
  useEffect(() => {
    if (!isOpen) return
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [comments.length, isOpen])

  // Focus input when sheet opens
  useEffect(() => {
    if (isOpen) {
      const id = setTimeout(() => inputRef.current?.focus(), 320)
      return () => clearTimeout(id)
    }
  }, [isOpen])

  const handleSubmit = (event) => {
    event.preventDefault()
    const text = inputText.trim()
    if (!text) return
    onAddComment(text)
    setInputText('')
  }

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 z-50 bg-black/55 transition-opacity duration-300 ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Sheet panel — 72 % height, slides up */}
      <div
        className={`absolute right-0 bottom-0 left-0 z-50 flex flex-col rounded-t-2xl bg-[#1a1a1a] transition-transform duration-300 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ height: '72%' }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-2.5 pb-1">
          <div className="h-1 w-10 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 pb-3 pt-1">
          <div className="w-8" />
          <h3 className="text-[15px] font-semibold text-white">
            {comments.length} comment{comments.length !== 1 ? 's' : ''}
          </h3>
          <button
            type="button"
            aria-label="Close comments"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xl text-white/70"
          >
            <IoCloseOutline />
          </button>
        </div>

        {/* Comment list */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto px-4 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}
        >
          {comments.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-white/30">
              <span className="text-4xl">💬</span>
              <p className="text-sm">Be the first to comment</p>
            </div>
          ) : (
            <div className="divide-y divide-white/6">
              {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="border-t border-white/10 px-3 py-2.5">
          <form onSubmit={handleSubmit} className="flex items-center gap-2.5">
            <img
              src="https://i.pravatar.cc/40?img=68"
              alt="You"
              className="h-8 w-8 shrink-0 rounded-full object-cover"
            />
            <div className="flex flex-1 items-center gap-2 rounded-full bg-white/10 px-4 py-2">
              <input
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Add a comment…"
                className="flex-1 bg-transparent text-[13px] text-white placeholder:text-white/35 outline-none"
                maxLength={200}
              />
              <button
                type="submit"
                aria-label="Post comment"
                disabled={!inputText.trim()}
                className="shrink-0 text-[18px] text-[#FE2C55] transition-opacity disabled:opacity-25"
              >
                <RiSendPlaneFill />
              </button>
            </div>
          </form>
        </div>

        {/* Safe area spacer */}
        <div className="h-3" />
      </div>
    </>
  )
}
