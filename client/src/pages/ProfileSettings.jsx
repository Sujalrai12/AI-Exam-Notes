import { useState } from "react"
import { motion } from "motion/react"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { serverUrl } from "../App"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { setUserData } from "../redux/userSlice"

const ProfileSettings = () => {
  const { userData } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [name, setName] = useState(userData?.name || "")
  const [profileBusy, setProfileBusy] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [passwordBusy, setPasswordBusy] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")

  const updateProfile = async (event) => {
    event.preventDefault()
    setError("")
    setNotice("")
    setProfileBusy(true)
    try {
      const response = await axios.put(`${serverUrl}/api/user/profile`, { name }, { withCredentials: true })
      dispatch(setUserData(response.data))
      setNotice("Your profile has been updated.")
    } catch (requestError) {
      setError(requestError.response?.data?.message || "We couldn't update your profile. Please try again.")
    } finally {
      setProfileBusy(false)
    }
  }

  const updatePassword = async (event) => {
    event.preventDefault()
    setError("")
    setNotice("")
    if (newPassword !== confirmPassword) {
      setError("The new password and confirmation do not match.")
      return
    }

    setPasswordBusy(true)
    try {
      await axios.put(`${serverUrl}/api/user/password`, { currentPassword, newPassword }, { withCredentials: true })
      dispatch(setUserData({ ...userData, hasPassword: true }))
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setPasswordOpen(false)
      setNotice("Your password has been updated.")
    } catch (requestError) {
      setError(requestError.response?.data?.message || "We couldn't update your password. Please try again.")
    } finally {
      setPasswordBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f8ff] text-ink">
      <Navbar />

      <main className="mx-auto max-w-3xl px-3 pb-8 pt-5 sm:px-8 sm:pt-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <button type="button" onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-100">
            <span aria-hidden="true">←</span> Back
          </button>

          <header className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">Your account</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#111a32] sm:text-3xl">Profile settings</h1>
            <p className="mt-1 text-sm leading-6 text-muted">Manage your account information and sign-in security.</p>
          </header>

          {error && <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
          {notice && <p role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-green-500">{notice}</p>}

          <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_10px_28px_rgba(28,48,92,0.05)] sm:p-6" aria-labelledby="personal-info-title">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-blue-100 text-lg font-bold text-blue-700" aria-hidden="true">
                {(userData?.name || "U").slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0">
                <h2 id="personal-info-title" className="text-lg font-semibold text-ink">Personal information</h2>
                <p className="truncate text-sm text-muted">{userData?.email}</p>
              </div>
            </div>

            <form onSubmit={updateProfile} className="space-y-4">
              <label className="block text-sm font-medium text-ink">
                Full name
                <input
                  required
                  maxLength={80}
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-1.5 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-ink outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:px-4"
                />
              </label>
              <label className="block text-sm font-medium text-ink">
                Email address
                <input
                  type="email"
                  value={userData?.email || ""}
                  readOnly
                  aria-describedby="email-help"
                  className="mt-1.5 min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-muted outline-none sm:px-4"
                />
                <span id="email-help" className="mt-1.5 block text-xs leading-5 text-muted">This is the email used to sign in and cannot be changed here.</span>
              </label>
              <button type="submit" disabled={profileBusy || !name.trim() || name.trim() === userData?.name} className="min-h-11 w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-40">
                {profileBusy ? "Saving…" : "Save changes"}
              </button>
            </form>
          </section>

          <section className="mt-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_10px_28px_rgba(28,48,92,0.05)] sm:mt-5 sm:p-6" aria-labelledby="security-title">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 id="security-title" className="text-lg font-semibold text-ink">Security</h2>
                <p className="mt-1 text-sm text-muted">{userData?.hasPassword ? "Password sign-in is enabled for your account." : "Add a password to also sign in with your email."}</p>
              </div>
              <button type="button" onClick={() => { setPasswordOpen((isOpen) => !isOpen); setError(""); setNotice("") }} className="min-h-10 w-full rounded-xl border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-100 sm:w-auto">
                {passwordOpen ? "Cancel" : userData?.hasPassword ? "Change password" : "Set a password"}
              </button>
            </div>

            {passwordOpen && (
              <form onSubmit={updatePassword} className="mt-5 space-y-4 border-t border-slate-100 pt-5">
                {userData?.hasPassword && (
                  <PasswordField label="Current password" value={currentPassword} onChange={setCurrentPassword} autoComplete="current-password" />
                )}
                <PasswordField label="New password" value={newPassword} onChange={setNewPassword} autoComplete="new-password" />
                <PasswordField label="Confirm new password" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" />
                <p className="text-xs text-muted">Use at least 8 characters. Passwords are stored securely.</p>
                <button type="submit" disabled={passwordBusy || !newPassword || !confirmPassword || (userData?.hasPassword && !currentPassword)} className="min-h-11 w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-40">
                  {passwordBusy ? "Updating…" : userData?.hasPassword ? "Update password" : "Set password"}
                </button>
              </form>
            )}
          </section>
        </motion.div>
      </main>

      <div className="mx-auto max-w-3xl px-3 sm:px-8"><Footer /></div>
    </div>
  )
}

function PasswordField({ label, value, onChange, autoComplete }) {
  return (
    <label className="block text-sm font-medium text-ink">
      {label}
      <input
        type="password"
        required
        minLength={8}
        maxLength={128}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-ink outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:px-4"
      />
    </label>
  )
}

export default ProfileSettings
