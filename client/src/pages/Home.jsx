import { motion } from "motion/react"
import { HiOutlineDocumentText, HiOutlineChartBar, HiOutlineQuestionMarkCircle, HiOutlineArrowDownTray } from "react-icons/hi2"
import { useNavigate } from "react-router-dom"
import { Footer } from "../components/Footer"
import { Navbar } from "../components/Navbar"

const quickFeatures = [
  {
    title: "Structured notes",
    description: "Topic sections with clear explanations and key terms.",
    icon: HiOutlineDocumentText,
  },
  {
    title: "Diagrams and charts",
    description: "See processes and comparisons at a glance.",
    icon: HiOutlineChartBar,
  },
  {
    title: "Exam questions",
    description: "Practice short, long, and diagram questions.",
    icon: HiOutlineQuestionMarkCircle,
  },
  {
    title: "Revision and PDF",
    description: "Review key points or save a copy for offline study.",
    icon: HiOutlineArrowDownTray,
  },
]

const productFeatures = [
  { title: "Enter a topic", description: "Set the topic, class or year, and exam type before generating notes." },
  { title: "Choose the format", description: "Include diagrams, charts, revision points, or a short self-check quiz." },
  { title: "Review and download", description: "Read the notes, revisit them in your history, or save a PDF." },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen overflow-x-clip bg-paper text-ink transition-colors duration-300">
      <Navbar />

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-14 pt-12 sm:px-8 md:pb-20 md:pt-16 lg:grid-cols-[0.94fr_1.06fr] lg:gap-10">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-[1.08] tracking-[-0.04em] text-[#111a32] sm:text-5xl lg:text-[3.7rem]">
              Turn your syllabus into smart notes
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
              Add the topic, class, and exam type. Get a clear explanation, practice questions, and last-minute revision points, with diagrams when you need them.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button type="button" onClick={() => navigate("/login")} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 hover:cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-200">
                Generate notes
              </button>
              <a href="#how-it-works" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-rule bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-blue-200 hover:bg-blue-50">
                How it works
              </a>
            </div>
            
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="relative mx-auto w-full max-w-2xl">
            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
              <div className="flex items-center justify-between border-b border-slate-100 px-2 pb-3">
                <div className="text-sm font-semibold text-ink">Example study guide</div>
                <span className="text-[11px] text-muted">Operating Systems</span>
              </div>
              <div className="grid gap-3 pt-3 sm:grid-cols-[0.82fr_1.18fr]">
                <div className="rounded-xl bg-[#f8faff] p-3 sm:p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Generate notes</p>
                  <p className="mt-3 text-xs font-semibold text-ink">Topic</p>
                  <div className="mt-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-400">Operating Systems</div>
                  <p className="mt-3 text-xs font-semibold text-ink">Class / year</p>
                  <div className="mt-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-500">B.Tech · 2nd year</div>
                  <p className="mt-3 text-xs font-semibold text-ink">Exam type</p>
                  <div className="mt-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-500">Semester exam</div>
                  <p className="mt-3 text-[10px] text-muted">Includes revision points and diagrams</p>
                  <div className="mt-4 rounded-md bg-blue-600 py-2.5 text-center text-[11px] font-semibold text-white">Generate notes</div>
                </div>
                <div className="min-h-64 rounded-xl border border-slate-100 p-3 sm:p-4">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div><p className="text-[10px] font-medium text-muted">PREVIEW</p><p className="mt-1 text-sm font-semibold text-ink">Operating Systems</p></div>
                    <span className="rounded-md bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-700">Notes</span>
                  </div>
                  <h2 className="mt-3 text-xs font-bold text-ink">1. Process management</h2>
                  <p className="mt-1 text-[11px] leading-5 text-slate-600">The operating system manages processes and allocates resources so programs can run efficiently.</p>
                  <h2 className="mt-3 text-xs font-bold text-ink">2. Key functions</h2>
                  <ul className="mt-1 space-y-1 text-[11px] text-slate-600"><li>• CPU scheduling</li><li>• Memory management</li><li>• File and device handling</li></ul>
                  <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50/70 p-2.5"><p className="text-[10px] font-semibold text-blue-800">Quick revision</p><div className="mt-2 h-1.5 w-4/5 rounded-full bg-blue-200"/><div className="mt-1.5 h-1.5 w-3/5 rounded-full bg-blue-100"/></div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section aria-labelledby="guide-includes-title" className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
          <h2 id="guide-includes-title" className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted">A study guide can include</h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {quickFeatures.map((feature) => (
              <li key={feature.title} className="h-full rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
                <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-blue-700" aria-hidden="true">
                  <feature.icon size={19} strokeWidth={1.8} />
                </span>
                <h3 className="text-base font-semibold text-ink">{feature.title}</h3>
                <p className="mt-1.5 max-w-xs text-sm leading-6 text-muted">{feature.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="how-it-works" className="border-y border-study-section-rule bg-study-section py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">How it works</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">A practical first pass at a topic</h2>
              <p className="mt-3 text-sm leading-6 text-muted sm:text-base">Set the study context, choose what belongs in your guide, then review or download it.</p>
            </div>
            <ol className="mt-10 divide-y divide-slate-200 border-y border-slate-200 md:grid md:grid-cols-3 md:divide-x md:divide-y-0">
              {productFeatures.map((feature, index) => <li key={feature.title} className="py-5 md:px-5 md:py-6 first:md:pl-0 last:md:pr-0"><p className="text-xs font-medium text-muted">0{index + 1}</p><h3 className="mt-2 text-lg font-semibold text-ink">{feature.title}</h3><p className="mt-2 text-sm leading-6 text-muted">{feature.description}</p></li>)}
            </ol>
            <div className="mt-8 text-center"><button type="button" onClick={() => navigate("/notes")} className="min-h-11 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 hover:cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-200">Create notes</button></div>
          </div>
        </section>

        <section aria-labelledby="about-title" className="mx-auto grid max-w-6xl gap-5 px-5 py-16 sm:px-8 md:grid-cols-[0.8fr_1.2fr] md:gap-16 md:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">About the project</p>
            <h2 id="about-title" className="mt-3 text-3xl font-bold tracking-tight text-ink">Why I built ExamNotes</h2>
          </div>
          <div className="max-w-2xl text-base leading-7 text-muted">
            <p>I built ExamNotes to make the first revision pass less scattered. Give it one topic and your class and exam context; it brings the explanation, key subtopics, practice questions, and revision points into one guide.</p>
            <p className="mt-4">Quick quiz that helps you check your understanding. Save the guide in your history or download it, then use it alongside your course material while you study.</p>
          </div>
        </section>
      </main>

      <div className="mx-auto max-w-6xl px-5 sm:px-8"><Footer /></div>
    </div>
  )
}
