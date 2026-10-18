import { useState } from 'react'
import {motion} from "motion/react"
import { serverUrl } from '../App'
import axios from 'axios'
import { Navbar } from '../components/Navbar'

export const Pricing = () => {
  const [selectedPrice , setSelectedPrice] = useState(null);
  const [paying, setPaying] = useState(false);
  const[payingAmount, setPayingAmount] = useState(null)

  const handlePaying = async(amount)=>{
    try {
      setPayingAmount(amount)
      setPaying(true)
      const result = await axios.post(serverUrl +"/api/credit/order",{amount},{withCredentials:true})

      if(result.data.url){
        window.alert("Stripe demo checkout: use card number 4242 4242 4242 4242, any future expiry date, and any 3-digit CVC.")
        window.location.href = result.data.url
      }
      setPaying(false)


    } catch (error) {
      setPaying(false)
      console.log("ERROR",error)
      
    }
  }
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Navbar />

      <main className="mx-auto max-w-6xl px-5 pb-10 pt-7 sm:px-8 sm:pt-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-7"
        >
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl flex justify-center">Buy credits</h1>
          <p className="mt-2 text-sm leading-6 text-muted flex justify-center">Choose a credit pack for your next study session.</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        <PricingCard
        title="Starter"
        price="₹100"
        amount={100}
        credits="50 credits"
        description="Perfect for quick revisions"
        features={[
          "Generate AI notes",
          "Exam-focused answers",
          "Diagram & Charts support",
          "Fast generation"
        ]}
        selectedPrice={selectedPrice}
        setSelectedPrice={setSelectedPrice}
        paying={paying}
        payingAmount={payingAmount}
        onBuy={handlePaying}/>

        <PricingCard
        title="Popular"
        price="₹200"
        amount={200}
        credits="120 credits"
        description="For serious exam preparation"
        features={[
          "All Starter features",
          "More credits per ₹",
          "Revision mode access",
          "Priority AI response"
        ]}
        selectedPrice={selectedPrice}
        setSelectedPrice={setSelectedPrice}
        paying={paying}
        payingAmount={payingAmount}
        onBuy={handlePaying}/>

        <PricingCard
        title="Pro Learner"
        price="₹500"
        amount={500}
        credits="300 credits"
        description="For serious exam preparation"
        features={[
          "Maximum credit value",
          "Unlimited revisions",
          "Charts & diagrams",
          "Ideal for full syllabus"
        ]}
        selectedPrice={selectedPrice}
        setSelectedPrice={setSelectedPrice}
        paying={paying}
        payingAmount={payingAmount}
        onBuy={handlePaying}/>

        </div>

      </main>
    </div>
  )
}

function PricingCard({
  title,
  price,
  amount,
  credits,
  description,
  features,
  popular,
  selectedPrice,
  setSelectedPrice,
  onBuy,
  paying,
  payingAmount
}){

  const isSelected = selectedPrice === amount;
  const isPayingThisCard = paying && payingAmount === amount;
return (
  <motion.div
  onClick={()=>setSelectedPrice(amount)}
  whileHover={{y:-4}}
  className={`relative cursor-pointer rounded-xl border bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(28,48,92,0.08)] sm:p-6 ${isSelected ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-100" : "border-slate-200"}`}
  >

    {popular && !isSelected && <span className="absolute right-4 top-4 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
      Popular
    </span>}

    { isSelected &&   <span className='absolute right-4 top-4 rounded-full bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white'>
      Selected
    </span>}

    <h2 className='text-xl font-semibold text-ink'>{title}</h2>
    <p className='mt-1 text-sm text-muted'>{description}</p>

    <div className='mt-4'>
      <p className='text-3xl font-bold tracking-tight text-ink'>{price}</p>
      <p className='text-sm text-muted'>{credits}</p>
    </div>
    <button type="button" disabled={isPayingThisCard} onClick={(e)=>{
      e.stopPropagation()
      onBuy(amount)
    }} className={`mt-5 min-h-11 w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-blue-200 ${isPayingThisCard ? "cursor-not-allowed bg-slate-300 text-white" : "bg-blue-600 text-white hover:bg-blue-700 hover:cursor-pointer"}`}>
        {isPayingThisCard ? "Redirecting..." :"Buy Now"}

      </button>
      <ul className='mt-5 space-y-2 text-sm text-muted'>
        {features.map((f,i)=>(
          <li key={i} className='flex items-start gap-2'>
            <span className='text-emerald-600' aria-hidden="true">✓</span>
            {f}
          </li>
        ))}
      </ul>


      
  </motion.div>
)
}
