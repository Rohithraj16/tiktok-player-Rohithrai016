export function TopBar() {
  return (
    <header className="pointer-events-none absolute top-0 right-0 left-0 z-40 flex items-center justify-center pt-4 text-white">
      <div className="flex items-center gap-3 text-sm font-semibold tracking-wide">
        <span className="text-white/80">Following</span>
        <span className="text-white/50">|</span>
        <span className="relative text-white">
          For You
          <span className="absolute -bottom-2 left-1/2 h-[2px] w-8 -translate-x-1/2 rounded-full bg-white" />
        </span>
      </div>
    </header>
  )
}

