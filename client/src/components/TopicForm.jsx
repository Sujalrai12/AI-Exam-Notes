import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { generateNotes } from "../../services/api"
import { useDispatch } from "react-redux"
import { updateCredits } from "../redux/userSlice"

export const TopicForm = ({ setResult, setLoading, loading, setError }) => {
  const [topic, setTopic] = useState("")
  const [classLevel, setClassLevel] = useState("")
  const [examType, setExamType] = useState("")
  const [revisionMode, setRevisionMode] = useState(false)
  const [quickQuizMode, setQuickQuizMode] = useState(false)
  const [includeDiagram, setIncludeDiagram] = useState(false)
  const [includeChart, setIncludeChart] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressText, setProgressText] = useState("")
  const dispatch = useDispatch()

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!topic.trim()) {
      setError("Please enter the topic you want to study.")
      return
    }

    setError("")
    setProgress(0)
    setProgressText("")
    setLoading(true)
    setResult(null)
    try {
      const response = await generateNotes({
        topic,
        classLevel,
        examType,
        revisionMode,
        quickQuizMode,
        includeDiagram,
        includeChart,
      })

      setResult({ ...response.data, noteId: response.noteId })
      setClassLevel("")
      setTopic("")
      setExamType("")
      setIncludeChart(false)
      setRevisionMode(false)
      setQuickQuizMode(false)
      setIncludeDiagram(false)

      if (typeof response.creditsLeft === "number") {
        dispatch(updateCredits(response.creditsLeft))
      }
    } catch (error) {
      console.error(error)
      setError(error.response?.data?.message || error.message || "We couldn't generate notes. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!loading) {
      return undefined
    }

    let value = 0
    const interval = setInterval(() => {
      value += Math.random() * 8
      if (value >= 95) {
        value = 95
        setProgressText("Almost done...")
        clearInterval(interval)
      } else if (value > 70) {
        setProgressText("Finalizing your notes...")
      } else if (value > 40) {
        setProgressText("Organizing the key ideas...")
      } else {
        setProgressText("Preparing your notes...")
      }
      setProgress(Math.floor(value))
    }, 700)

    return () => clearInterval(interval)
  }, [loading])

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
      <div>
        <label htmlFor="notes-topic" className="mb-2 block text-sm font-semibold text-ink">Topic</label>
        <input
          id="notes-topic"
          type="text"
          autoComplete="off"
          required
          className="min-h-13 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          placeholder="e.g. Web Development, Photosynthesis, Binary Search"
          onChange={(event) => setTopic(event.target.value)}
          value={topic}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        <div>
          <label htmlFor="notes-class" className="mb-2 block text-sm font-semibold text-ink">Class / level <span className="font-normal text-muted">(optional)</span></label>
          <input
            id="notes-class"
            type="text"
            autoComplete="off"
            className="min-h-13 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            placeholder="e.g. Class 10, Class 12, B.Tech 3rd year"
            onChange={(event) => setClassLevel(event.target.value)}
            value={classLevel}
          />
        </div>
        <div>
          <label htmlFor="notes-exam" className="mb-2 block text-sm font-semibold text-ink">Exam type <span className="font-normal text-muted">(optional)</span></label>
          <input
            id="notes-exam"
            type="text"
            autoComplete="off"
            className="min-h-13 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            placeholder="e.g. CBSE, JEE, NEET, GATE, UPSC"
            onChange={(event) => setExamType(event.target.value)}
            value={examType}
          />
        </div>
      </div>

      <div className="grid gap-4 border-y border-slate-100 py-4 sm:grid-cols-2 sm:py-5 lg:grid-cols-4">
        <Toggle label="Exam revision mode" description="Optimized for quick review" checked={revisionMode} onChange={setRevisionMode} />
        
        <Toggle label="Include diagrams" description="Add relevant diagrams" checked={includeDiagram} onChange={setIncludeDiagram} />
        <Toggle label="Include charts" description="Add charts and tables" checked={includeChart} onChange={setIncludeChart} />
      </div>

      <motion.button
        type="submit"
        whileHover={!loading ? { y: -1 } : {}}
        whileTap={!loading ? { scale: 0.995 } : {}}
        disabled={loading || !topic.trim()}
        className="flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(49,91,255,0.18)] transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
      >
        <span aria-hidden="true">✦</span>{loading ? "Generating notes..." : "Generate notes"}<span aria-hidden="true">→</span>
      </motion.button>

      {loading && (
        <div className="space-y-2" aria-live="polite">
          <div className="h-2 overflow-hidden rounded-full bg-blue-50" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-label="Notes generation progress">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ ease: "easeOut", duration: 0.6 }} className="h-full rounded-full bg-blue-500" />
          </div>
          <div className="flex justify-between gap-3 text-xs text-muted"><span>{progressText}</span><span>{progress}%</span></div>
          <p className="text-center text-xs text-muted">This may take a few minutes. Please keep this page open.</p>
        </div>
      )}
    </form>
  )
}

function Toggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className={`relative h-7 w-12 shrink-0 rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-blue-100 ${checked ? "bg-blue-600" : "bg-slate-300"}`}>
        <span aria-hidden="true" className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
      </button>
      <span><span className="block text-sm font-semibold text-ink">{label}</span><span className="mt-0.5 block text-xs text-muted">{description}</span></span>
    </div>
  )
}
