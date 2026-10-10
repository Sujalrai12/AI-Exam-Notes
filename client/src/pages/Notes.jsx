import { motion } from "motion/react"
import { useState } from "react"
import { Navbar } from "../components/Navbar"
import { TopicForm } from "../components/TopicForm"
import { FinalResult } from "../components/FinalResult"
import { Footer } from "../components/Footer"

export const Notes = () => {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")

  return (
    <div className="min-h-screen bg-[#f5f8ff] text-ink">
      <Navbar />

      <main className="mx-auto max-w-6xl px-3 pb-8 pt-4 sm:px-8 sm:pt-10">
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} aria-labelledby="generate-title" className="rounded-xl border-0 bg-transparent p-0 shadow-none sm:rounded-2xl sm:border sm:border-slate-600/80 sm:bg-white sm:p-8 sm:shadow-[0_12px_34px_rgba(28,48,92,0.07)] lg:p-9">
          <div className="mb-5 flex flex-col gap-4 sm:mb-7 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
            <div className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-xl text-blue-600 sm:h-14 sm:w-14 sm:rounded-2xl sm:text-2xl" aria-hidden="true">▤</span>
              <div>
                <h1 id="generate-title" className="text-xl font-bold tracking-tight text-[#111a32] sm:text-3xl">Generate study notes</h1>
                <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted sm:text-base">Enter a topic and a few details to create structured, exam-ready notes.</p>
              </div>
            </div>
            {/* <div className="flex max-w-sm items-center gap-3 rounded-xl bg-blue-50/80 px-4 py-3 text-sm leading-5 text-gray-900">
              <span className="text-xl text-blue-600" aria-hidden="true">✦</span>
              <span>Make a focused set of notes, diagrams and revision points for your next study session.</span>
            </div> */}
          </div>

          <TopicForm loading={loading} setResult={setResult} setLoading={setLoading} setError={setError} />
          {error && <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
        </motion.section>

        <section aria-labelledby="generated-notes-title" className="mt-6 rounded-xl border-0 bg-transparent p-0 shadow-none sm:rounded-2xl sm:border sm:border-slate-600 sm:bg-white sm:p-8 sm:shadow-[0_12px_34px_rgba(28,48,92,0.055)]">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-xl text-blue-600" aria-hidden="true">▤</span>
            <div>
              <h2 id="generated-notes-title" className="text-xl font-bold text-[#111a32]">Generated notes</h2>
              <p className="mt-1 text-sm text-muted">{result ? "Your study notes are ready." : "Your AI-generated notes will appear here."}</p>
            </div>
          </div>

          {loading ? (
            <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/50 px-5 py-10 text-center" aria-live="polite">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-[3px] border-blue-200 border-t-blue-600" aria-hidden="true" />
              <p className="mt-4 text-sm font-semibold text-ink">Preparing your notes</p>
              <p className="mt-1 text-sm text-muted">This can take a few minutes. Keep this page open while we work.</p>
            </div>
          ) : result ? (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-5 rounded-xl border-0 bg-transparent p-0 sm:border sm:border-slate-100 sm:bg-white sm:p-3">
              <FinalResult result={result} compact />
            </motion.div>
          ) : (
            <div className="mt-5 flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-[#fbfcff] px-5 py-9 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-2xl text-slate-400 shadow-sm" aria-hidden="true">▤</span>
              <p className="mt-3 text-sm font-semibold text-slate-700">No notes generated yet</p>
              <p className="mt-1 max-w-md text-sm leading-6 text-muted">Add a topic above and choose Generate notes to get started.</p>
            </div>
          )}
        </section>
      </main>

      <div className="mx-auto max-w-6xl px-5 sm:px-8"><Footer /></div>
    </div>
  )
}
