import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { serverUrl } from "../App"
import { setUserData } from "../redux/userSlice"
import { FaInstagram, FaLinkedinIn } from "react-icons/fa"
import logo from "../assets/logo.png"

export const Footer = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { userData } = useSelector((state) => state.user)

  const handleSignOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
      dispatch(setUserData(null))
      navigate("/")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <footer className="mt-20 border-t border-rule">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <img src={logo} alt="ExamNotes" className="h-9 w-9 rounded-md object-cover ring-1 ring-rule" />
            <span className="font-sans text-lg font-semibold">ExamNotes</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted">
            Start with one exam topic. Build a guide with explanations, revision points, and questions to practice before your next paper.
          </p>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Quick links</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li><button type="button" onClick={() => navigate("/notes")} className="hover:cursor-pointer">Generate notes</button></li>
            <li><button type="button" onClick={() => navigate("/history")} className="hover:cursor-pointer">History</button></li>
            <li><button type="button" onClick={() => navigate("/pricing")} className="hover:cursor-pointer">Buy credits</button></li>
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Account</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {userData ? (
              <li>
                <button type="button" onClick={handleSignOut} className="text-red-700 hover:cursor-pointer">Sign out</button>
              </li>
            ) : (
              <li>
                <button type="button" onClick={() => navigate("/login")} className="hover:cursor-pointer">Log in</button>
              </li>
            )}
            <li>
              <a href="mailto:raisujal205@gmail.com" className="text-muted transition hover:text-ink">
                raisujal205@gmail.com
              </a>
            </li>
          </ul>
          <div className="mt-5">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Find me online</h3>
            <div className="mt-3 flex items-center gap-2">
              <a
                href="https://www.instagram.com/raisujxl/?hl=en"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram profile"
                title="Instagram"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-rule text-muted transition hover:border-blue-300 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
              >
                <FaInstagram size={18} aria-hidden="true" />
              </a>
              <a
                href="https://www.linkedin.com/in/sujal-rai-60599141b"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn profile"
                title="LinkedIn"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-rule text-muted transition hover:border-blue-300 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
              >
                <FaLinkedinIn size={17} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <p className="border-t border-rule py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} ExamNotes. Made for exam week, not for dashboards.
      </p>
    </footer>
  )
}
