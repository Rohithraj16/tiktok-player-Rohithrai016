export function MusicDisc({ coverUrl, isPlaying }) {
  return (
    <div className="absolute right-4 bottom-6 z-20">
      <div
        className={`h-12 w-12 overflow-hidden rounded-full border-2 border-white/60 bg-black ${
          isPlaying ? 'animate-spin' : ''
        }`}
        style={{ animationDuration: '4s' }}
      >
        <img
          src={coverUrl}
          alt="Track cover"
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
    </div>
  )
}
