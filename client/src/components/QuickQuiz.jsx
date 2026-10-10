import { useState } from "react"

export function QuickQuiz({ questions }) {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)

  if (!Array.isArray(questions) || questions.length === 0) return null

  const score = questions.reduce(
    (total, question, index) => total + (answers[index] === question.answer ? 1 : 0),
    0
  )

  const handleRetry = () => {
    setAnswers({})
    setSubmitted(false)
  }

  return (
    <section aria-labelledby="quick-quiz-title" className="quick-quiz-panel rounded-2xl border p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="quick-quiz-kicker text-xs font-bold uppercase tracking-[0.14em]">Quick self-check</p>
          <h3 id="quick-quiz-title" className="mt-1 text-xl font-bold text-ink">Quick quiz</h3>
          <p className="mt-1 text-sm text-muted">Choose one answer for each question, then submit to see your score.</p>
        </div>
        {submitted && (
          <p role="status" className="quick-quiz-score rounded-full px-4 py-2 text-sm font-semibold text-ink ring-1">
            Score: {score} / {questions.length}
          </p>
        )}
      </div>

      <div className="mt-5 space-y-4">
        {questions.map((question, questionIndex) => (
          <div key={`${question.question}-${questionIndex}`} role="group" aria-labelledby={`quick-quiz-question-${questionIndex}`} className="quick-quiz-card rounded-xl border p-4 sm:p-5">
            <h4 id={`quick-quiz-question-${questionIndex}`} className="quick-quiz-question text-sm font-semibold leading-6">
              <span className="quick-quiz-number mr-2">{questionIndex + 1}.</span>{question.question}
            </h4>
            <div className="mt-2 space-y-2">
              {(Array.isArray(question.options) ? question.options : []).map((option, optionIndex) => {
                const selected = answers[questionIndex] === option
                const isCorrectOption = submitted && question.answer === option
                const isWrongSelection = submitted && selected && !isCorrectOption
                const optionStyle = isCorrectOption
                  ? "quick-quiz-option-correct"
                  : isWrongSelection
                    ? "quick-quiz-option-wrong"
                    : selected
                      ? "quick-quiz-option-selected"
                      : ""

                return (
                  <label key={`${option}-${optionIndex}`} className={`quick-quiz-option flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 text-sm leading-5 transition ${optionStyle} ${submitted ? "cursor-default" : ""}`}>
                    <input
                      type="radio"
                      name={`quick-quiz-${questionIndex}`}
                      value={option}
                      checked={selected}
                      disabled={submitted}
                      onChange={() => setAnswers((current) => ({ ...current, [questionIndex]: option }))}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600"
                    />
                    <span>{option}</span>
                  </label>
                )
              })}
            </div>
            {submitted && (
              <p className="quick-quiz-feedback mt-3 text-sm leading-6">
                <span className="font-semibold text-ink">Answer: {question.answer}.</span>{" "}
                {question.explanation}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {submitted ? (
          <button type="button" onClick={handleRetry} className="quick-quiz-submit rounded-xl px-5 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-4">
            Try again
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setSubmitted(true)}
            disabled={Object.keys(answers).length < questions.length}
            className="quick-quiz-submit rounded-xl px-5 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-4 disabled:cursor-not-allowed"
          >
            Check answers
          </button>
        )}
        {!submitted && <span className="text-xs text-muted">{Object.keys(answers).length} of {questions.length} answered</span>}
      </div>
    </section>
  )
}
