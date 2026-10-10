import { useEffect, useState } from "react"
import { motion } from "motion/react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { serverUrl } from "../App"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { FinalResult } from "../components/FinalResult"

export const HistoryNote = () => {
  const { noteId } = useParams()
  const navigate = useNavigate()
  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let isMounted = true

    const getNote = async () => {
      setLoading(true)
      setError("")

      try {
        const response = await axios.get(`${serverUrl}/api/notes/${noteId}`, { withCredentials: true })
        if (isMounted) setNote(response.data)
      } catch (requestError) {
        console.error(requestError)
        if (isMounted) setError(requestError.response?.data?.error || "We couldn't open these notes. Please return to your history and try again.")
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    getNote()
    return () => { isMounted = false }
  }, [noteId])

  const savedDate = note?.createdAt
    ? new Intl.DateTimeFormat(undefined, { dateStyle: "long" }).format(new Date(note.createdAt))
    : null

  return (
    <div className="min-h-screen bg-[#f5f8ff] text-ink">
      <Navbar />

      <main className="mx-auto max-w-6xl px-5 pb-8 pt-7 sm:px-8 sm:pt-10">
        <button type="button" onClick={() => navigate("/history")} className="mb-5 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-blue-700 transition focus:outline-none focus:ring-4 focus:ring-blue-100 hover:cursor-pointer">
          <span aria-hidden="true">←</span> Back to history
        </button>

        {loading ? (
          <div className="flex min-h-[460px] flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-center shadow-[0_10px_28px_rgba(28,48,92,0.06)]" aria-live="polite">
            <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-blue-100 border-t-blue-600" aria-hidden="true" />
            <p className="mt-4 text-sm font-semibold text-ink">Opening your notes</p>
            <p className="mt-1 text-sm text-muted">Just a moment while we load this study guide.</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-[0_10px_28px_rgba(28,48,92,0.06)]">
            <p role="alert" className="text-sm text-red-800">{error}</p>
            <button type="button" onClick={() => navigate("/history")} className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Return to history</button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <header className="mb-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_10px_28px_rgba(28,48,92,0.06)] sm:p-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <span className="grid h-13 w-13 shrink-0 place-items-center rounded-2xl bg-blue-50 text-2xl text-blue-600" aria-hidden="true">▤</span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">Saved study guide</p>
                    <h1 className="mt-1 break-words text-2xl font-bold tracking-tight text-[#111a32] sm:text-3xl">{note?.topic || "Study notes"}</h1>
                    {savedDate && <p className="mt-1.5 text-sm text-muted">Saved {savedDate}</p>}
                  </div>
                </div>
                <button type="button" onClick={() => navigate("/notes")} className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-blue-200 hover:bg-blue-50 sm:self-auto hover:cursor-pointer">
                  Create new notes <span aria-hidden="true">→</span>
                </button>
              </div>
            </header>

            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_10px_28px_rgba(28,48,92,0.06)] sm:p-7" aria-label={`${note?.topic || "Saved"} notes`}>
              <FinalResult key={note?._id} result={note?.content ? { ...note.content, noteId: note._id } : null} />
            </section>
          </motion.div>
        )}
      </main>

      <div className="mx-auto max-w-6xl px-5 sm:px-8"><Footer /></div>
    </div>
  )
}
