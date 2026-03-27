const POOL = [
  {
    user: 'rohit_builds',
    avatar: 'https://i.pravatar.cc/40?img=1',
    text: 'This is exactly what I needed to understand. Saving this forever 🔥',
    time: '3h',
    likes: 412,
  },
  {
    user: 'ai_curious_dev',
    avatar: 'https://i.pravatar.cc/40?img=2',
    text: 'Honestly the best explanation I have seen on this topic. No fluff, straight to the point.',
    time: '2h',
    likes: 287,
  },
  {
    user: 'priya.codes',
    avatar: 'https://i.pravatar.cc/40?img=5',
    text: 'Can you do a follow-up on the implementation side? Would love to see actual code.',
    time: '2h',
    likes: 194,
  },
  {
    user: 'techbro_404',
    avatar: 'https://i.pravatar.cc/40?img=8',
    text: 'Shared this with my entire team. We\'ve been debating this for weeks 😂',
    time: '1h',
    likes: 153,
  },
  {
    user: 'curious_kartik',
    avatar: 'https://i.pravatar.cc/40?img=11',
    text: 'Wait the part at 0:42 actually broke my brain a little. Rewatched 5 times.',
    time: '1h',
    likes: 98,
  },
  {
    user: 'shreyalearns',
    avatar: 'https://i.pravatar.cc/40?img=16',
    text: 'Every time I think I understand this stuff you add another layer 😭 love it though',
    time: '58m',
    likes: 76,
  },
  {
    user: 'devops_dinesh',
    avatar: 'https://i.pravatar.cc/40?img=18',
    text: 'The animation here is chef\'s kiss. Who made this??',
    time: '45m',
    likes: 61,
  },
  {
    user: 'neha.devs',
    avatar: 'https://i.pravatar.cc/40?img=20',
    text: 'Following for more content like this. Keep going! 🚀',
    time: '38m',
    likes: 49,
  },
  {
    user: 'learning_everyday99',
    avatar: 'https://i.pravatar.cc/40?img=25',
    text: 'I have a CS degree and this taught me something new. Says a lot.',
    time: '30m',
    likes: 38,
  },
  {
    user: 'arvind.js',
    avatar: 'https://i.pravatar.cc/40?img=30',
    text: 'Please never stop posting. The internet needs more creators like you.',
    time: '22m',
    likes: 27,
  },
  {
    user: 'tanvi_ui',
    avatar: 'https://i.pravatar.cc/40?img=33',
    text: 'Bookmarked. Shared. Liked. What else can I do 😭',
    time: '15m',
    likes: 21,
  },
  {
    user: 'buildfast.io',
    avatar: 'https://i.pravatar.cc/40?img=36',
    text: 'This is the kind of content that actually grows your career. Not just tutorials.',
    time: '8m',
    likes: 14,
  },
  {
    user: 'meghna_coder',
    avatar: 'https://i.pravatar.cc/40?img=42',
    text: 'lol my manager sent me this video. Time to pretend I already knew all this 😂',
    time: '5m',
    likes: 9,
  },
  {
    user: 'vikram_learns',
    avatar: 'https://i.pravatar.cc/40?img=47',
    text: 'The way you explain complex things simply is a superpower fr.',
    time: '2m',
    likes: 4,
  },
  {
    user: 'simran.tech',
    avatar: 'https://i.pravatar.cc/40?img=49',
    text: 'Just started following and already obsessed with this channel ✨',
    time: '1m',
    likes: 2,
  },
]

let nextId = POOL.length + 1

/**
 * Returns a unique slice of comments seeded by videoIndex so each video
 * gets a different (but deterministic) starting set.
 */
export function getInitialComments(videoIndex) {
  const offset = (videoIndex * 4) % POOL.length
  const slice = [...POOL.slice(offset), ...POOL.slice(0, offset)]
  return slice.slice(0, 8).map((c, i) => ({
    ...c,
    id: videoIndex * 100 + i,
    isLiked: false,
  }))
}

export function makeComment(text) {
  return {
    id: nextId++,
    user: 'you',
    avatar: 'https://i.pravatar.cc/40?img=68',
    text,
    time: 'now',
    likes: 0,
    isLiked: false,
  }
}
