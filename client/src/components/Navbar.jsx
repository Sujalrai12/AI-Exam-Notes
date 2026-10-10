import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink, useNavigate } from "react-router-dom"
import axios from "axios"
import { HiOutlineLogout, HiOutlineMenu, HiOutlineX } from "react-icons/hi"
import { serverUrl } from "../App"
import { setUserData } from "../redux/userSlice"
import { ThemeToggle } from "./ThemeToggle"
import logo from "../assets/logo.png"

const links = [
  { to: "/", label: "Home" },
  { to: "/notes", label: "Generate" },
  { to: "/history", label: "History" },
  { to: "/pricing", label: "Credits" },
]

export const Navbar = () => {
  const { userData } = useSelector((state) => state.user)
  const credits = userData?.credits || 0
  const [open, setOpen] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleSignOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
      dispatch(setUserData(null))
      setShowProfile(false)
      navigate("/")
    } catch (error) {
      console.log(error)
    }
  }

  const goProtected = (path) => {
    setOpen(false)
    navigate(userData ? path : "/login")
  }

  return (
    <header className="sticky top-0 z-30 border-b border-rule bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:gap-4 sm:px-8 sm:py-3">
        <button type="button" onClick={() => navigate("/")} className="flex shrink-0 items-center gap-2 sm:gap-3">
          <img src={logo} alt="ExamNotes" className="h-8 w-8 rounded-md object-cover ring-1 ring-rule sm:h-10 sm:w-10" />
          <span className="hidden font-serif text-xl font-semibold tracking-tight text-ink min-[360px]:inline">
            ExamNotes
          </span>
        </button>

        <nav className="hidden items-center gap-7 text-sm font-medium text-muted md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              onClick={(event) => {
                if (link.to !== "/" && !userData) {
                  event.preventDefault()
                  navigate("/login")
                }
              }}
              className={({ isActive }) =>
                `transition hover:text-ink ${isActive ? "text-ink underline decoration-highlight decoration-2 underline-offset-8" : ""}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <ThemeToggle className="!h-8 !px-2 sm:!h-9 sm:!px-3" />
          {userData ? (
            <>
              <button
                type="button"
                onClick={() => navigate("/pricing")}
                aria-label={`${credits} credits`}
                title="View credits"
                className="inline-flex min-h-8 items-center gap-1 whitespace-nowrap rounded-full border border-rule px-2 py-1 text-[11px] font-medium text-ink hover:cursor-pointer sm:min-h-9 sm:px-3 sm:py-1.5 sm:text-sm"
              >
                <span className="text-amber-500" aria-hidden="true">✦</span>
                {credits}<span className="hidden sm:inline"> credits</span>
              </button>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowProfile((value) => !value)}
                className="grid h-8 w-8 place-items-center rounded-full bg-navy text-sm font-semibold text-paper hover:cursor-pointer sm:h-9 sm:w-9"
                >
                  {(userData?.name || "U").slice(0, 1).toUpperCase()}
                </button>
                {showProfile && (
                  <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-1.5rem)] rounded-xl border border-rule bg-paper p-2 shadow-lg">
                    <div className="border-b border-rule px-3 py-2.5">
                      <p className="truncate text-sm font-semibold text-ink">{userData?.name || "Your account"}</p>
                      <p className="truncate text-xs text-muted">{userData?.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setShowProfile(false); navigate("/settings/profile") }}
                      className="mt-1 w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-ink transition hover:text-blue-500 hover:cursor-pointer"
                    >
                      Profile settings
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowProfile(false); navigate("/history") }}
                      className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-ink transition hover:text-blue-500 hover:cursor-pointer"
                    >
                      History
                    </button>
                    <div className="my-1 border-t border-rule" />
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-500 transition hover:cursor-pointer hover:text-red-700"
                    >
                      <HiOutlineLogout size={17} aria-hidden="true" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-paper hover:cursor-pointer"
            >
              Log in
            </button>
          )}

          <button type="button" className="grid h-8 w-7 shrink-0 place-items-center md:hidden" onClick={() => setOpen((value) => !value)} aria-label="Menu">
            {open ? <HiOutlineX size={20} /> : <HiOutlineMenu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-rule bg-paper px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3 text-sm font-medium">
            <button type="button" className="text-left" onClick={() => { setOpen(false); navigate("/") }}>Home</button>
            <button type="button" className="text-left" onClick={() => goProtected("/notes")}>Generate</button>
            <button type="button" className="text-left" onClick={() => goProtected("/history")}>History</button>
            <button type="button" className="text-left" onClick={() => goProtected("/pricing")}>Credits</button>
          </div>
        </div>
      )}
    </header>
  )
}
