import { useEffect } from 'react'
import { BsMoon, BsSun } from 'react-icons/bs'
import { IoCloseOutline } from 'react-icons/io5'

function Toggle({ checked, onToggle }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onToggle}
      className={`relative h-7 w-[52px] rounded-full transition-colors duration-300 focus:outline-none ${
        checked ? 'bg-neutral-700' : 'bg-[#FE2C55]'
      }`}
    >
      <span
        className={`absolute top-[4px] h-[19px] w-[19px] rounded-full bg-white shadow-md transition-all duration-300 ${
          checked ? 'left-[28px]' : 'left-[5px]'
        }`}
      />
    </button>
  )
}

function SettingRow({ icon, label, description, control, isDark }) {
  return (
    <div
      className={`flex items-center justify-between rounded-2xl px-4 py-3.5 ${
        isDark ? 'bg-white/5' : 'bg-black/5'
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-xl text-lg ${
            isDark ? 'bg-white/10 text-white' : 'bg-black/10 text-black'
          }`}
        >
          {icon}
        </span>
        <div>
          <p className={`text-[14px] font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
            {label}
          </p>
          {description && (
            <p className={`text-[11px] ${isDark ? 'text-white/45' : 'text-black/45'}`}>
              {description}
            </p>
          )}
        </div>
      </div>
      {control}
    </div>
  )
}

export function SettingsMenu({ isOpen, isDark, onToggleDark, onClose }) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  return (
    <>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 z-50 bg-black/50 transition-opacity duration-300 ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-up panel */}
      <div
        className={`absolute right-0 bottom-0 left-0 z-50 rounded-t-3xl transition-transform duration-300 ease-out ${
          isDark ? 'bg-neutral-900' : 'bg-white'
        } ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className={`h-1 w-10 rounded-full ${isDark ? 'bg-white/20' : 'bg-black/15'}`} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-1 pt-2">
          <h2 className={`text-[17px] font-bold ${isDark ? 'text-white' : 'text-black'}`}>
            Settings
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xl transition-colors ${
              isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-black/8 text-black hover:bg-black/15'
            }`}
          >
            <IoCloseOutline />
          </button>
        </div>

        {/* Rows */}
        <div className="space-y-2.5 px-5 py-4">
          <SettingRow
            isDark={isDark}
            icon={isDark ? <BsMoon /> : <BsSun />}
            label="Dark mode"
            description={isDark ? 'Currently on' : 'Currently off'}
            control={<Toggle checked={isDark} onToggle={onToggleDark} />}
          />
        </div>

        {/* Bottom safe area */}
        <div className="h-8" />
      </div>
    </>
  )
}
