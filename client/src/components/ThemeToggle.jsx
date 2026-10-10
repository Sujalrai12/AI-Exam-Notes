import { useTheme } from "./ThemeContext"

export const ThemeToggle = ({ className = "" }) => {
  const { darkMode, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={darkMode}
      aria-label={darkMode ? "Switch to light theme" : "Switch to dark theme"}
      title={darkMode ? "Switch to light theme" : "Switch to dark theme"}
      className={`inline-flex h-9 items-center  rounded-full border px-3 text-xs font-semibold transition focus:outline-none focus:ring-4 focus:ring-blue-200 hover:cursor-pointer ${darkMode ? "border-slate-600 bg-slate-800 text-amber-200 hover:bg-slate-700" : "border-rule bg-white text-ink hover:bg-blue-50 hover:cursor-pointer"} ${className}`}
    >
      <span aria-hidden="true" className="text-sm">{darkMode ? "☀" : "☾"}</span>
      <span className="hidden sm:inline">{darkMode ? "" : ""}</span>
    </button>
  )
}
