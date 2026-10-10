import { motion } from "motion/react"
import { useNavigate } from "react-router-dom"
import { Footer } from "../components/Footer"
import { Navbar } from "../components/Navbar"

const quickFeatures = [
  { icon: "▤", title: "Exam-focused notes", description: "Clear, structured notes tailored to your syllabus." },
  { icon: "⌘", title: "Flow diagrams", description: "Make complex topics easier to see and remember." },
  { icon: "▱", title: "Project documentation", description: "Turn a topic into a useful first draft for class." },
  { icon: "ϟ", title: "Quick revision", description: "Review key ideas and questions before exam day." },
]

const productFeatures = [
  { icon: "01", title: "Start with your topic", description: "Add your class and exam so each set of notes has the right level of detail." },
  { icon: "02", title: "Choose what to include", description: "Add a diagram, charts or a focused revision pass to suit the way you study." },
  { icon: "03", title: "Study from one place", description: "Keep generated notes, important questions and printable PDFs together." },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen overflow-hidden bg-paper text-ink transition-colors duration-300">
      <Navbar />

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-14 pt-12 sm:px-8 md:pb-20 md:pt-16 lg:grid-cols-[0.94fr_1.06fr] lg:gap-10">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-2 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
              <span aria-hidden="true">✦</span> Your AI-powered study companion
            </span> */}
            <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-[1.08] tracking-[-0.045em] text-[#111a32] sm:text-5xl lg:text-[3.7rem]">
              Turn your syllabus into <span className="text-yellow-400">smart notes.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
              Generate exam-focused notes, flow diagrams and revision-ready content for the subjects you&apos;re working on.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button type="button" onClick={() => navigate("/login")} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_26px_rgba(49,91,255,0.2)] transition hover:-translate-y-0.5 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200">
                Get started <span aria-hidden="true">→</span>
              </button>
              <a href="#how-it-works" className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-rule bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:border-blue-200 hover:bg-blue-50">
                <span className="grid h-6 w-6 place-items-center rounded-full border border-blue-200 text-blue-600" aria-hidden="true">▶</span>
                How it works
              </a>
            </div>
            
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="relative mx-auto w-full max-w-2xl">
            <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-blue-100/80 via-violet-50 to-sky-100/60 blur-xl" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-3 shadow-[0_24px_70px_rgba(34,52,94,0.14)] sm:p-4">
              <div className="flex items-center justify-between border-b border-slate-100 px-2 pb-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-ink"><span className="grid h-7 w-7 place-items-center rounded-lg bg-blue-50 text-blue-600">▤</span> ExamNotes</div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-medium text-blue-700">Study workspace</span>
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
                  <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] font-medium text-blue-700"><span className="rounded-full bg-blue-50 px-2 py-1">Revision mode</span><span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">Diagrams</span></div>
                  <div className="mt-4 rounded-lg bg-blue-600 py-2.5 text-center text-[11px] font-semibold text-white">Generate notes <span aria-hidden="true">✦</span></div>
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

        <section aria-label="Popular study tools" className="mx-auto grid max-w-6xl gap-3 px-5 pb-16 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
          {quickFeatures.map((feature, index) => (
            <div key={feature.title} className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_4px_18px_rgba(24,39,75,0.035)] sm:p-5">
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-lg font-bold ${["bg-violet-50 text-violet-600", "bg-emerald-50 text-emerald-600", "bg-amber-50 text-amber-600", "bg-sky-50 text-sky-600"][index]}`} aria-hidden="true">{feature.icon}</span>
              <div><h2 className="text-sm font-semibold text-ink">{feature.title}</h2><p className="mt-1 text-xs leading-5 text-muted">{feature.description}</p></div>
            </div>
          ))}
        </section>

        <section id="how-it-works" className="border-y border-slate-100 bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">A clearer way to study</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">Everything you need to study smarter</h2>
              <p className="mt-3 text-sm leading-6 text-muted sm:text-base">From the first topic to the final revision, keep your study session focused.</p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {productFeatures.map((feature) => <article key={feature.title} className="rounded-2xl border border-slate-100 bg-paper/60 p-6"><span className="text-xs font-bold tracking-[0.12em] text-blue-600">{feature.icon} / STEP</span><h3 className="mt-5 text-lg font-semibold text-ink">{feature.title}</h3><p className="mt-2 text-sm leading-6 text-muted">{feature.description}</p></article>)}
            </div>
            <div className="mt-9 text-center"><button type="button" onClick={() => navigate("/notes")} className="rounded-xl bg-yellow-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-yellow-700">Create your first notes <span aria-hidden="true">→</span></button></div>
          </div>
        </section>
      </main>

      <div className="mx-auto max-w-6xl px-5 sm:px-8"><Footer /></div>
    </div>
  )
}
