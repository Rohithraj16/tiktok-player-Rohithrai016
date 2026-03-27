import { videos } from './data/videos'
import { VideoFeed } from './features/video-feed/VideoFeed'

function App() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-neutral-950 px-0 sm:px-6">
      <div className="h-screen w-full max-w-[430px] overflow-hidden bg-black sm:h-[96vh] sm:rounded-2xl sm:border sm:border-white/10 sm:shadow-2xl">
        <VideoFeed videos={videos} />
      </div>
    </div>
  )
}

export default App
