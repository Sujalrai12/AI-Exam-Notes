import { useState } from "react"
import { motion } from "motion/react"
import { FcGoogle } from "react-icons/fc"
import { HiOutlineArrowDownTray, HiOutlineBolt, HiOutlineClock } from "react-icons/hi2"
import { signInWithPopup } from "firebase/auth"
import { auth, provider } from "../utils/firebase"
import axios from "axios"
import { serverUrl } from "../App"
import { useDispatch } from "react-redux"
import { useLocation } from "react-router-dom"
import { setUserData } from "../redux/userSlice"
import { ThemeToggle } from "../components/ThemeToggle"
import logo from "../assets/logo.png"

const Auth = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const [mode, setMode] = useState("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [notice, setNotice] = useState(location.state?.message || "")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")
    setNotice("")
    setIsLoading(true)

    try {
      if (mode === "register") {
        const result = await axios.post(`${serverUrl}/api/auth/register`, { name, email, password })
        setMode("login")
        setPassword("")
        setNotice(result.data.message || "Account created. Please log in.")
        return
      }

      const result = await axios.post(`${serverUrl}/api/auth/login`, { email, password }, { withCredentials: true })
      dispatch(setUserData(result.data))
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setError("")
    setNotice("")
    setIsLoading(true)
    try {
      const response = await signInWithPopup(auth, provider)
      const { displayName: googleName, email: googleEmail } = response.user
      const result = await axios.post(
        `${serverUrl}/api/auth/google`,
        { name: googleName, email: googleEmail },
        { withCredentials: true }
      )
      dispatch(setUserData(result.data))
    } catch (authError) {
      setError(authError.response?.data?.message || "Google sign-in failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const isRegistering = mode === "register"

  return (
    <div className="min-h-screen overflow-x-hidden bg-paper px-3 py-3 text-ink sm:px-8 sm:py-4">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto flex max-w-6xl items-center justify-between gap-2 rounded-xl border border-rule bg-paper/95 px-3 py-2.5 text-ink shadow-sm backdrop-blur-sm sm:gap-4 sm:rounded-2xl sm:px-8 sm:py-3"
      >
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <img src={logo} alt="ExamNotes" className="h-10 w-10 shrink-0 rounded-md object-cover ring-1 ring-rule sm:h-12 sm:w-12" />
          <div className="min-w-0">
            <span className="font-sans text-lg font-semibold tracking-tight sm:text-xl">
              ExamNotes
            </span>
            <p className="mt-0.5 max-w-[190px] text-[11px] leading-4 text-muted sm:mt-1 sm:max-w-none sm:text-sm">AI-powered exam-oriented notes &amp; revision</p>
          </div>
        </div>
        <ThemeToggle className="shrink-0" />
      </motion.header>

      <main className="mx-auto grid max-w-6xl items-start gap-5 py-4 sm:gap-8 sm:py-6 lg:grid-cols-[1fr_0.9fr] lg:gap-16 lg:pb-8 lg:pt-20">
        <motion.section
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="min-w-0 lg:pt-24"
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] sm:mb-4 sm:text-sm sm:tracking-[0.2em]">Study smarter</p>
          <h2 className="max-w-xl text-3xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Focus on what matters.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8">
            Generate notes with important questions, diagrams, and revision points. Save them to your history or download a PDF.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-slate-700 sm:mt-8">
            <span className="inline-flex items-center gap-1.5"><HiOutlineBolt className="h-4 w-4 text-amber-500" aria-hidden="true" />50 starter credits</span>
            <span className="inline-flex items-center gap-1.5"><HiOutlineClock className="h-4 w-4 text-blue-600" aria-hidden="true" />Notes history</span>
            <span className="inline-flex items-center gap-1.5"><HiOutlineArrowDownTray className="h-4 w-4 text-blue-600" aria-hidden="true" />PDF downloads</span>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="w-full min-w-0 rounded-xl border border-slate-200 bg-white p-4 sm:p-7"
        >
          <div className="mb-4 sm:mb-5">
            <h3 className="text-xl font-bold sm:text-2xl">{isRegistering ? "Create your account" : "Welcome back"}</h3>
            <p className="mt-1.5 text-sm text-slate-500 sm:mt-2">
              {isRegistering ? "Register with your email to get started." : "Log in to continue to your notes."}
            </p>
          </div>

          <div className="mb-4 grid grid-cols-2 rounded-xl bg-slate-100 p-1 text-sm font-semibold sm:mb-5">
            <button
              type="button"
              onClick={() => { setMode("login"); setError(""); setNotice("") }}
              className={`rounded-lg px-2 py-2.5 transition sm:px-4 ${!isRegistering ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => { setMode("register"); setError(""); setNotice("") }}
              className={`rounded-lg px-2 py-2.5 transition sm:px-4 ${isRegistering ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {isRegistering && (
              <label className="block text-sm font-medium text-slate-700">
                Name
                <input
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  className="mt-1.5 min-w-0 w-full rounded-xl border border-slate-300 px-3 py-2 font-normal outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 sm:px-4 sm:py-2.5"
                />
              </label>
            )}
            <label className="block text-sm font-medium text-slate-700">
              Email
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="mt-1.5 min-w-0 w-full rounded-xl border border-slate-300 px-3 py-2 font-normal outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 sm:px-4 sm:py-2.5"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Password
              <input
                type="password"
                autoComplete={isRegistering ? "new-password" : "current-password"}
                required
                minLength={isRegistering ? 8 : undefined}
                maxLength={isRegistering ? 128 : undefined}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={isRegistering ? "At least 8 characters" : "Your password"}
                className="mt-1.5 min-w-0 w-full rounded-xl border border-slate-300 px-3 py-2 font-normal outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 sm:px-4 sm:py-2.5"
              />
            </label>

            {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            {notice && <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{notice}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-slate-600 px-4 py-2.5 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Please wait…" : isRegistering ? "Create account" : "Log in"}
            </button>
          </form>

          <div className="my-4 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            or
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 px-4 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FcGoogle size={21} />
            Continue with Google
          </button>
        </motion.section>
      </main>
    </div>
  )
}

export default Auth
