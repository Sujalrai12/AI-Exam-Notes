import { useEffect, useState } from "react"
import { motion } from "motion/react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { HiOutlineDocumentText } from "react-icons/hi2"
import { serverUrl } from "../App"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"

export const History = () => {
  const navigate = useNavigate()
  const [topics, setTopics] = useState([])
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [deletingNoteId, setDeletingNoteId] = useState(null)

  useEffect(() => {
    let isMounted = true

    const getNotes = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/notes/getnotes`, { withCredentials: true })
        if (isMounted) setTopics(Array.isArray(response.data) ? response.data : [])
      } catch (requestError) {
        console.error(requestError)
        if (isMounted) setError("We couldn't load your notes. Please refresh and try again.")
      } finally {
        if (isMounted) setIsFetching(false)
      }
    }

    getNotes()
    return () => { isMounted = false }
  }, [])

  const handleDeleteNote = async (note) => {
    const title = note.topic || "this note"
    if (!window.confirm(`Delete “${title}”? This can't be undone.`)) return

    setDeletingNoteId(note._id)
    setError("")
    setNotice("")
    try {
      await axios.delete(`${serverUrl}/api/notes/${note._id}`, { withCredentials: true })
      setTopics((currentTopics) => currentTopics.filter((item) => item._id !== note._id))
      setNotice(`“${title}” was deleted.`)
    } catch (requestError) {
      console.error(requestError)
      setError(requestError.response?.data?.error || "We couldn't delete these notes. Please try again.")
    } finally {
      setDeletingNoteId(null)
    }
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Navbar />

      <main className="mx-auto max-w-6xl px-5 pb-8 pt-7 sm:px-8 sm:pt-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Your workspace</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">Study history</h1>
            <p className="mt-2 text-sm leading-6 text-muted">Pick up where you left off and revisit your generated notes.</p>
          </div>
          <button type="button" onClick={() => navigate("/notes")} className="inline-flex min-h-11 items-center justify-center self-start rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 sm:self-auto">
            Create notes
          </button>
        </motion.div>

        {error && <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
        {notice && <p role="status" className="mb-5 rounded-xl border border-emerald-200 bg-green-50 px-4 py-3 text-sm text-green-400">{notice}</p>}

        <section aria-labelledby="history-list-title" className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
            <div>
              <h2 id="history-list-title" className="font-semibold text-ink">Your notes</h2>
              <p className="mt-0.5 text-xs text-muted">{topics.length} {topics.length === 1 ? "saved set" : "saved sets"}</p>
            </div>
            <HiOutlineDocumentText className="text-blue-600" size={21} aria-hidden="true" />
          </div>

          {isFetching ? (
            <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-3" aria-label="Loading saved notes" aria-live="polite">
              {[0, 1, 2, 3, 4, 5].map((item) => <div key={item} className="animate-pulse rounded-lg border border-slate-100 p-5"><div className="h-4 w-2/3 rounded bg-slate-100" /><div className="mt-3 h-3 w-1/2 rounded bg-slate-50" /><div className="mt-8 h-4 w-24 rounded bg-slate-50" /></div>)}
            </div>
          ) : topics.length === 0 ? (
            <div className="px-5 py-14 text-center sm:py-16">
              <HiOutlineDocumentText className="mx-auto text-blue-600" size={28} aria-hidden="true" />
              <h2 className="mt-4 text-lg font-semibold text-ink">No saved notes yet</h2>
              <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-muted">Create a set of notes and it will appear here, ready for your next revision session.</p>
              <button type="button" onClick={() => navigate("/notes")} className="mt-5 min-h-11 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200">Generate notes</button>
            </div>
          ) : (
            <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
              {topics.map((note) => (
                <article
                  key={note._id}
                  className="group flex min-h-40 items-start gap-2 rounded-lg border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-[0_10px_25px_rgba(28,48,92,0.08)] sm:p-5"
                >
                  <button
                    type="button"
                    onClick={() => navigate(`/history/${note._id}`)}
                    className="min-w-0 flex-1 rounded-lg text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 hover:cursor-pointer"
                    aria-label={`Open notes for ${note.topic || "untitled topic"}`}
                  >
                    <span className="flex items-start justify-between gap-3">
                      <HiOutlineDocumentText className="shrink-0 text-blue-600" size={21} aria-hidden="true" />
                    </span>
                    <span className="mt-4 block w-full truncate text-lg font-semibold text-ink">{note.topic || "Untitled notes"}</span>

                    <span className="mt-1 block w-full truncate text-xs text-muted">{[note.classLevel, note.examType].filter(Boolean).join(" · ") || "Study notes"}</span>
                    {/* {(note.revisionMode || note.quickQuizMode || note.includeDiagram || note.includeChart) && (
                      <span className="mt-3 block truncate text-xs font-medium text-blue-700">
                        {[note.revisionMode && "Revision", note.quickQuizMode && "Quick quiz", note.includeDiagram && "Diagram", note.includeChart && "Charts"].filter(Boolean).join(" · ")}
                      </span>
                    )} */}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteNote(note)}
                    disabled={deletingNoteId === note._id}
                    aria-label={`Delete notes for ${note.topic || "untitled topic"}`}
                    className="shrink-0 rounded-md px-2 py-1.5 text-xs font-medium text-muted transition hover:text -red-600 focus:outline-none focus:ring-4 focus:ring-red-100 disabled:cursor-wait disabled:opacity-60
                    hover:cursor-pointer"
                  >
                    {deletingNoteId === note._id ? "Deleting…" : "Delete"}
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <div className="mx-auto max-w-6xl px-5 sm:px-8"><Footer /></div>
    </div>
  )
}
