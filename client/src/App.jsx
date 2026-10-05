import { Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import {History} from './pages/History'
import {Notes} from './pages/Notes'
import {Pricing} from './pages/Pricing'
import {PaymentSuccess} from "./pages/PaymentSuccess"
import {PaymentFailed} from "./pages/PaymentFailed"
import { getCurrentUser } from '../services/api'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
export const serverUrl = "https://ai-exam-notes-server-3lzn.onrender.com"


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
    <>
    <Routes>
      <Route path='/' element={userData ? <Home/> : <Navigate to="/auth" replace/> }/>
      <Route path='/auth' element={userData ? <Navigate to="/" replace/> : <Auth/>}/>
      <Route path='/history' element={userData ? <History/> : <Navigate to="/auth" replace/> }/>
      <Route path='/notes' element={userData ? <Notes/> : <Navigate to="/auth" replace/> }/>
      <Route path='/pricing' element={userData ? <Pricing/> : <Navigate to="/auth" replace/> }/>
      <Route path="/payment-success" element={<PaymentSuccess/>}/>
      <Route path="/payment-failed" element={<PaymentFailed/>}/>
      <Route path="*" element={<NormalizeUnknownPath/>}/>
      
    </Routes>
    </>
  )
}

export default App
