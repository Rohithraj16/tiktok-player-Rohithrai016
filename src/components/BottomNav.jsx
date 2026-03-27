import { IoHomeOutline, IoPersonOutline, IoSearchOutline } from 'react-icons/io5'
import { FiPlus } from 'react-icons/fi'
import { TbMessageCircle } from 'react-icons/tb'

function NavItem({ icon, label, active }) {
  return (
    <button
      type="button"
      className="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-white"
      aria-label={label}
    >
      <span className={`text-[22px] ${active ? 'text-white' : 'text-white/85'}`}>
        {icon}
      </span>
      <span className={`text-[10px] ${active ? 'text-white' : 'text-white/75'}`}>
        {label}
      </span>
    </button>
  )
}

export function BottomNav() {
  return (
    <nav className="absolute right-0 bottom-0 left-0 z-40 border-t border-white/10 bg-black/75 backdrop-blur">
      <div className="mx-auto flex max-w-[430px] items-stretch">
        <NavItem icon={<IoHomeOutline />} label="Home" active />
        <NavItem icon={<IoSearchOutline />} label="Discover" />

        <button
          type="button"
          aria-label="Create"
          className="flex flex-1 items-center justify-center py-2"
        >
          <span className="relative flex h-10 w-14 items-center justify-center rounded-xl bg-white text-black">
            <FiPlus className="text-2xl" />
          </span>
        </button>

        <NavItem icon={<TbMessageCircle />} label="Inbox" />
        <NavItem icon={<IoPersonOutline />} label="Me" />
      </div>
    </nav>
  )
}

