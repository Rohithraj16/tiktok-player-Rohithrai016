import { FiPlus } from 'react-icons/fi'
import { IoHomeOutline, IoPersonOutline, IoSearchOutline } from 'react-icons/io5'
import { TbMessageCircle } from 'react-icons/tb'

function NavItem({ icon, label, active, isDark, onClick }) {
  const activeColor = isDark ? 'text-white' : 'text-black'
  const inactiveColor = isDark ? 'text-white/55' : 'text-black/50'

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-1 flex-col items-center justify-center gap-1 py-2"
      aria-label={label}
    >
      <span className={`text-[22px] transition-colors ${active ? activeColor : inactiveColor}`}>
        {icon}
      </span>
      <span
        className={`text-[10px] font-medium transition-colors ${
          active ? activeColor : inactiveColor
        }`}
      >
        {label}
      </span>
    </button>
  )
}

export function BottomNav({ isDark, onOpenSettings }) {
  const borderColor = isDark ? 'border-white/10' : 'border-black/10'
  const bgColor = isDark ? 'bg-black/80' : 'bg-white/90'
  const plusBg = isDark ? 'bg-white text-black' : 'bg-black text-white'

  return (
    <nav
      className={`absolute right-0 bottom-0 left-0 z-40 border-t backdrop-blur-md transition-colors duration-300 ${borderColor} ${bgColor}`}
    >
      <div className="mx-auto flex max-w-[430px] items-stretch">
        <NavItem icon={<IoHomeOutline />} label="Home" active isDark={isDark} />
        <NavItem icon={<IoSearchOutline />} label="Discover" isDark={isDark} />

        <button
          type="button"
          aria-label="Create"
          className="flex flex-1 items-center justify-center py-2"
        >
          <span
            className={`relative flex h-10 w-14 items-center justify-center rounded-xl transition-colors ${plusBg}`}
          >
            <FiPlus className="text-2xl" />
          </span>
        </button>

        <NavItem icon={<TbMessageCircle />} label="Inbox" isDark={isDark} />

        {/* Me tab opens Settings */}
        <NavItem
          icon={<IoPersonOutline />}
          label="Me"
          isDark={isDark}
          onClick={onOpenSettings}
        />
      </div>
    </nav>
  )
}
