import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext(null)

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = window.localStorage.getItem("examnotes-theme")
      || window.localStorage.getItem("examnotes-home-theme")
    return savedTheme === "dark"
  })

  useEffect(() => {
    document.documentElement.classList.toggle("dark-theme", darkMode)
    window.localStorage.setItem("examnotes-theme", darkMode ? "dark" : "light")
  }, [darkMode])

  const toggleTheme = () => setDarkMode((current) => !current)

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be used within a ThemeProvider")
  return context
}
