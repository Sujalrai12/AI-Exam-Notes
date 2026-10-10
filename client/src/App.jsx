import { Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import {History} from './pages/History'
import {HistoryNote} from './pages/HistoryNote'
import {Notes} from './pages/Notes'
import {Pricing} from './pages/Pricing'
import {PaymentSuccess} from "./pages/PaymentSuccess"
import {PaymentFailed} from "./pages/PaymentFailed"
import { getCurrentUser } from '../services/api'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { ThemeProvider } from './components/ThemeContext'
export const serverUrl = import.meta.env.VITE_SERVER_URL || (
  import.meta.env.DEV
    ? "http://localhost:8080"
    : "https://ai-exam-notes-server-3lzn.onrender.com"
)


function NormalizeUnknownPath() {
  const location = useLocation()
  const normalizedPath = location.pathname.replace(/\/{2,}/g, "/")
  const currentPath = `${location.pathname}${location.search}${location.hash}`
  const target = `${normalizedPath}${location.search}${location.hash}`

  return <Navigate to={target === currentPath ? "/" : target} replace />
}

function App() {
  const dispatch = useDispatch()
  useEffect (()=>{
    getCurrentUser(dispatch)
  },[dispatch])
  
  const {userData} = useSelector((state)=>state.user)
  
  
  return (
    <ThemeProvider>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/auth' element={<Navigate to="/" replace/>}/>
      <Route path='/login' element={userData ? <Navigate to="/notes" replace/> : <Auth/>}/>
      <Route path='/history' element={userData ? <History/> : <Navigate to="/login" replace/> }/>
      <Route path='/history/:noteId' element={userData ? <HistoryNote/> : <Navigate to="/login" replace/> }/>
      <Route path='/notes' element={userData ? <Notes/> : <Navigate to="/login" replace/> }/>
      <Route path='/pricing' element={userData ? <Pricing/> : <Navigate to="/login" replace/> }/>
      <Route path="/payment-success" element={<PaymentSuccess/>}/>
      <Route path="/payment-failed" element={<PaymentFailed/>}/>
      <Route path="*" element={<NormalizeUnknownPath/>}/>
      
    </Routes>
    </ThemeProvider>
  )
}

export default App
