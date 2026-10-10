import { useState } from "react"
import { motion } from "motion/react"
import { FcGoogle } from "react-icons/fc"
import { signInWithPopup } from "firebase/auth"
import { auth, provider } from "../utils/firebase"
import axios from "axios"
import { serverUrl } from "../App"
import { useDispatch } from "react-redux"
import { setUserData } from "../redux/userSlice"
import { ThemeToggle } from "../components/ThemeToggle"
import logo from "../assets/logo.png"

const Auth = () => {
  const dispatch = useDispatch()
  const [mode, setMode] = useState("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
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
    <div className="min-h-screen overflow-x-hidden bg-[#f5f7fb] px-3 py-4 text-slate-900 sm:px-8 sm:py-8">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto flex max-w-6xl items-center justify-between gap-2 rounded-xl bg-slate-800 px-3 py-3 text-white shadow-xl sm:gap-4 sm:rounded-2xl sm:px-8 sm:py-5"
      >
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <img src={logo} alt="ExamNotes" className="h-10 w-10 shrink-0 rounded-md object-cover ring-1 ring-rule sm:h-12 sm:w-12" />
          <div className="min-w-0">
            <span className="font-serif text-lg font-semibold tracking-tight sm:text-xl">
              ExamNotes
            </span>
            <p className="mt-0.5 max-w-[190px] text-[11px] leading-4 text-slate-300 sm:mt-1 sm:max-w-none sm:text-sm">AI-powered exam-oriented notes &amp; revision</p>
          </div>
        </div>
        <ThemeToggle className="shrink-0" />
      </motion.header>

      <main className="mx-auto grid max-w-6xl items-center gap-6 py-6 sm:gap-10 sm:py-10 lg:grid-cols-[1fr_0.9fr] lg:gap-20 lg:py-16">
        <motion.section
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="min-w-0"
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] sm:mb-4 sm:text-sm sm:tracking-[0.2em]">Study smarter</p>
          <h2 className="max-w-xl text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Unlock smarter <span className="text-yellow-400">AI notes.</span>
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8">
            Create exam-ready notes, project documentation, diagrams, and printable PDFs in moments.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-700 sm:mt-8 sm:flex sm:flex-wrap sm:gap-3 sm:text-sm">
            <span className="min-w-0 rounded-full bg-white px-2.5 py-2 shadow-sm sm:px-4">🎁 50 free credits</span>
            <span className="min-w-0 rounded-full bg-white px-2.5 py-2 shadow-sm sm:px-4">📘 Revision-ready notes</span>
            <span className="col-span-2 rounded-full bg-white px-2.5 py-2 shadow-sm sm:col-span-1 sm:px-4">⬇️ PDF downloads</span>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="w-full min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/60 sm:rounded-3xl sm:p-9"
        >
          <div className="mb-4 sm:mb-7">
            <h3 className="text-xl font-bold sm:text-2xl">{isRegistering ? "Create your account" : "Welcome back"}</h3>
            <p className="mt-1.5 text-sm text-slate-500 sm:mt-2">
              {isRegistering ? "Register with your email to get started." : "Log in to continue to your notes."}
            </p>
          </div>

          <div className="mb-4 grid grid-cols-2 rounded-xl bg-slate-100 p-1 text-sm font-semibold sm:mb-6">
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <label className="block text-sm font-medium text-slate-700">
                Name
                <input
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  className="mt-1.5 min-w-0 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 sm:px-4 sm:py-3"
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
                className="mt-1.5 min-w-0 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 sm:px-4 sm:py-3"
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
                className="mt-1.5 min-w-0 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 sm:px-4 sm:py-3"
              />
            </label>

            {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            {notice && <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{notice}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-slate-600 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Please wait…" : isRegistering ? "Create account" : "Log in"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            or
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
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
