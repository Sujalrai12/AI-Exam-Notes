import { useState } from "react"
import { motion } from "motion/react"
import { FcGoogle } from "react-icons/fc"
import { signInWithPopup } from "firebase/auth"
import { auth, provider } from "../utils/firebase"
import axios from "axios"
import { serverUrl } from "../App"
import { useDispatch } from "react-redux"
import { setUserData } from "../redux/userSlice"

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
    <div className="min-h-screen bg-[#f5f7fb] px-5 py-8 text-slate-900 sm:px-8">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-6xl rounded-2xl bg-slate-800 px-6 py-5 text-white shadow-xl sm:px-8"
      >
        <h1 className="text-2xl font-bold">ExamNotes AI</h1>
        <p className="mt-1 text-sm text-slate-300">AI-powered exam-oriented notes &amp; revision</p>
      </motion.header>

      <main className="mx-auto grid max-w-6xl items-center gap-12 py-10 lg:grid-cols-[1fr_0.9fr] lg:gap-20 lg:py-16">
        <motion.section
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Study smarter</p>
          <h2 className="max-w-xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            Unlock smarter <span className="text-blue-600">AI notes.</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Create exam-ready notes, project documentation, diagrams, and printable PDFs in moments.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm font-medium text-slate-700">
            <span className="rounded-full bg-white px-4 py-2 shadow-sm">🎁 50 free credits</span>
            <span className="rounded-full bg-white px-4 py-2 shadow-sm">📘 Revision-ready notes</span>
            <span className="rounded-full bg-white px-4 py-2 shadow-sm">⬇️ PDF downloads</span>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-9"
        >
          <div className="mb-7">
            <h3 className="text-2xl font-bold">{isRegistering ? "Create your account" : "Welcome back"}</h3>
            <p className="mt-2 text-sm text-slate-500">
              {isRegistering ? "Register with your email to get started." : "Log in to continue to your notes."}
            </p>
          </div>

          <div className="mb-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1 text-sm font-semibold">
            <button
              type="button"
              onClick={() => { setMode("login"); setError(""); setNotice("") }}
              className={`rounded-lg px-4 py-2.5 transition ${!isRegistering ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => { setMode("register"); setError(""); setNotice("") }}
              className={`rounded-lg px-4 py-2.5 transition ${isRegistering ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
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
                  className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
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
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
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
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
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
