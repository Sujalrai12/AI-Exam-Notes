import React from 'react'
import { motion } from 'motion/react'
import { FaTimesCircle } from "react-icons/fa";
import { useEffect } from 'react';
import { getCurrentUser } from '../../services/api';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle'

export const PaymentFailed = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(()=>{
    getCurrentUser(dispatch)

    const t = setTimeout(()=>{
      navigate("/")

    },5000)
    return ()=>clearTimeout(t)
  },[])
  return (
    <div className='relative min-h-screen flex flex-col items-center justify-center p-4 gap-4'>
       <ThemeToggle className="absolute right-5 top-5" />
       <motion.div 
       initial={{scale:0,rotate:-100}}
       animate={{scale:1, rotate:360}}
       transition={{
        duration:0.8,
        ease:"easeOut"
       }}
       className='text-red-500 text-6xl'>
        <FaTimesCircle />

       </motion.div>

       <motion.h1
       initial={{opacity:0,y:20}}
       animate={{opacity:1,y:0}}
       transition={{delay:0.3}}
       className='text-2xl font-bold text-red-600'>
        Payment Failed

       </motion.h1>

       <p>
        Redirecting to home...
       </p>


    </div>
  )
}
