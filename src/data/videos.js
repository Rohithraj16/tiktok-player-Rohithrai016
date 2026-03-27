const localVideoModules = import.meta.glob('../videos/*.{mp4,webm,mov,m4v}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const localVideoUrls = Object.values(localVideoModules)

const baseMetadata = [
  {
    user: {
      name: 'ai_learner',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    },
    description: 'How transformers actually work #AI #DeepLearning',
    likes: 1240,
    comments: 89,
    shares: 45,
    music: 'Original Audio - ai_learner',
    musicCover:
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=200&q=80',
  },
  {
    user: {
      name: 'frontendflow',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    },
    description: 'CSS tricks for smooth micro-interactions in React UIs',
    likes: 820,
    comments: 42,
    shares: 19,
    music: 'UI Beats - frontendflow',
    musicCover:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&q=80',
  },
  {
    user: {
      name: 'codewithroh',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    },
    description: '3 debugging habits that save hours every week',
    likes: 1465,
    comments: 120,
    shares: 58,
    music: 'Debug Mode - codewithroh',
    musicCover:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&q=80',
  },
  {
    user: {
      name: 'productmind',
      avatar:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80',
    },
    description: 'Ship faster by splitting features into tiny testable parts',
    likes: 975,
    comments: 67,
    shares: 31,
    music: 'Sprint Session - productmind',
    musicCover:
      'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=200&q=80',
  },
  {
    user: {
      name: 'learnbuildrepeat',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    },
    description: 'Consistency beats intensity when learning to build products',
    likes: 2012,
    comments: 144,
    shares: 76,
    music: 'Focus Loop - learnbuildrepeat',
    musicCover:
      'https://images.unsplash.com/photo-1461784180009-21121b2f204c?w=200&q=80',
  },
]

export const videos = localVideoUrls.map((url, index) => ({
  id: index + 1,
  url,
  ...baseMetadata[index % baseMetadata.length],
}))
