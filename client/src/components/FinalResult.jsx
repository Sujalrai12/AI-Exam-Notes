import { useState } from "react"
import ReactMarkdown from "react-markdown"
import { MermaidSetup } from "./MermaidSetup"
import { ReChartSetup } from "./ReChartSetup"
import { QuickQuiz } from "./QuickQuiz"
import { downloadPdf, generateQuickQuiz } from "../../services/api"

const markdownComponents = {
  h1: ({ children }) => <h1 className="mb-4 mt-7 border-b border-slate-100 pb-2 text-2xl font-bold text-ink">{children}</h1>,
  h2: ({ children }) => <h2 className="mb-3 mt-6 text-xl font-semibold text-ink">{children}</h2>,
  h3: ({ children }) => <h3 className="mb-2 mt-5 text-lg font-semibold text-ink">{children}</h3>,
  p: ({ children }) => <p className="mb-3 leading-7 text-slate-700">{children}</p>,
  ul: ({ children }) => <ul className="mb-4 ml-6 list-disc space-y-1 text-slate-700">{children}</ul>,
  ol: ({ children }) => <ol className="mb-4 ml-6 list-decimal space-y-1 text-slate-700">{children}</ol>,
  li: ({ children }) => <li className="marker:text-blue-500">{children}</li>,
  blockquote: ({ children }) => <blockquote className="my-4 border-l-4 border-blue-200 pl-4 text-slate-600">{children}</blockquote>,
  code: ({ children }) => <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm text-blue-800">{children}</code>,
}

export const FinalResult = ({ result }) => {
  const [quickRevision, setQuickRevision] = useState(false)
  const [quizOpen, setQuizOpen] = useState(false)
  const [quizQuestions, setQuizQuestions] = useState(result?.quickQuiz || [])
  const [quizLoading, setQuizLoading] = useState(false)
  const [quizError, setQuizError] = useState("")

  const handleQuickQuiz = async () => {
    setQuizError("")
    if (quizOpen) {
      setQuizOpen(false)
      return
    }

    if (quizQuestions.length > 0) {
      setQuizOpen(true)
      return
    }

    if (!result.noteId) {
      setQuizError("Save these notes before generating a quiz.")
      return
    }

    setQuizLoading(true)
    try {
      const generatedQuiz = await generateQuickQuiz(result.noteId)
      setQuizQuestions(generatedQuiz)
      setQuizOpen(true)
    } catch (error) {
      setQuizError(error.message || "We couldn't generate the quiz. Please try again.")
    } finally {
      setQuizLoading(false)
    }
  }

  const handleDownloadPdf = async () => {
    try {
      await downloadPdf(result)
    } catch (error) {
      window.alert(error.message || "PDF download failed")
    }
  }

  if (!result?.subTopics || !result?.questions?.short || !result?.questions?.long || !result?.revisionPoints) {
    return null
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600">Your study guide</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-ink">Generated notes</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setQuickRevision((value) => !value)} aria-pressed={quickRevision} className={`rounded-lg border px-3.5 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-blue-100 ${quickRevision ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-ink hover:border-blue-200 hover:bg-blue-50 hover:cursor-pointer"}`}>
            {quickRevision ? "Show full notes" : "Quick revision"}
          </button>
          <button type="button" onClick={handleQuickQuiz} disabled={quizLoading} aria-expanded={quizOpen} className="quick-quiz-action rounded-lg border px-3.5 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-4 disabled:cursor-wait disabled:opacity-60">
            {quizLoading ? "Preparing quiz..." : quizOpen ? "Hide quiz" : quizQuestions.length > 0 ? "Take quick quiz" : "Generate quick quiz"}
          </button>
          <button type="button" onClick={handleDownloadPdf} className="rounded-lg bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 hover:cursor-pointer">
            Download PDF <span aria-hidden="true">↓</span>
          </button>
        </div>
      </div>

      {quizError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{quizError}</p>}
      {quizOpen && <QuickQuiz key={quizQuestions.map((question) => question.question).join("|")} questions={quizQuestions} />}

      {quickRevision ? (
        <section className="rounded-xl border border-blue-100 bg-blue-50/70 p-5 sm:p-6">
          <SectionHeader icon="✦" title="Quick revision points" />
          <ul className="ml-5 list-disc space-y-2 text-sm leading-6 text-slate-700 sm:text-base">
            {result.revisionPoints.map((point, index) => <li key={index}>{point}</li>)}
          </ul>
        </section>
      ) : (
        <>
          <section>
            <SectionHeader icon="✦" title="Subtopics to focus on" />
            <div className="grid gap-3 sm:grid-cols-2">
              {Object.entries(result.subTopics).map(([priority, topics]) => (
                <div key={priority} className="rounded-xl border border-slate-100 bg-[#fbfcff] p-4">
                  <p className="mb-2 text-sm font-semibold text-blue-700">{priority}</p>
                  <ul className="ml-5 list-disc space-y-1 text-sm leading-6 text-slate-700">
                    {topics.map((topic, index) => <li key={`${priority}-${index}`}>{topic}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <SectionHeader icon="▤" title="Detailed notes" />
            <article className="rounded-xl border border-slate-100 bg-white p-4 sm:p-6">
              <ReactMarkdown components={markdownComponents}>{result.notes}</ReactMarkdown>
            </article>
          </section>
        </>
      )}

      {result.diagram?.data && <section><SectionHeader icon="⌘" title="Diagram" /><MermaidSetup diagram={result.diagram.data} /></section>}
      {result.charts?.length > 0 && <section><SectionHeader icon="▥" title="Charts and tables" /><ReChartSetup charts={result.charts} /></section>}
      <section>
        <SectionHeader icon="?" title="Important questions" />
        <div className="grid gap-4 md:grid-cols-2">
          <QuestionGroup title="Short questions" questions={result.questions.short} />
          <QuestionGroup title="Long questions" questions={result.questions.long} />
          <QuestionGroup title="Diagram question" questions={[result.questions.diagram].filter(Boolean)} />
        </div>
      </section>
    </div>
  )
}

function SectionHeader({ icon, title }) {
  return <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-ink"><span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-sm text-blue-600" aria-hidden="true">{icon}</span>{title}</h3>
}

function QuestionGroup({ title, questions }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-[#fbfcff] p-4">
      <h4 className="text-sm font-semibold text-ink">{title}</h4>
      {questions.length > 0 ? <ul className="mt-2 ml-5 list-disc space-y-1.5 text-sm leading-6 text-slate-700">{questions.map((question, index) => <li key={index}>{question}</li>)}</ul> : <p className="mt-2 text-sm text-muted">No questions provided.</p>}
    </div>
  )
}
