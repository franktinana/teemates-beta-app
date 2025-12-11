import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight, Check, Loader2, Trophy, Footprints, Beer, 
  Music, Clock, MapPin, Users, Shield, Zap 
} from 'lucide-react'

// --- CONFIGURATION ---
const questions = [
  {
    id: 'vibe_music',
    icon: <Music size={32} />,
    text: "How's the volume?",
    subtext: "Do you like tunes on the course?",
    options: ["Silence is Golden", "Quiet Background", "Blast the Tunes"]
  },
  {
    id: 'vibe_transport',
    icon: <Footprints size={32} />,
    text: "How do you get around?",
    subtext: "Walking, riding, or surfing?",
    options: ["Walking / Push Cart", "Power Cart Only", "Whatever the group does"]
  },
  {
    id: 'vibe_skill',
    icon: <Trophy size={32} />,
    text: "What's your skill level?",
    subtext: "Be honest, we don't judge.",
    options: ["Newbie (100+)", "Intermediate (85-95)", "Stick (70s-80s)"]
  },
  {
    id: 'vibe_drinks',
    icon: <Beer size={32} />,
    text: "Thirsty out there?",
    subtext: "How do you handle the 19th hole?",
    options: ["Sober Round", "A Couple Cold Ones", "Party Time"]
  },
  {
    id: 'vibe_pace',
    icon: <Clock size={32} />,
    text: "Pace of Play?",
    subtext: "Are we rushing or relaxing?",
    options: ["Speed Golf (Sub 3.5h)", "Standard (4h)", "Relaxed / No Rush"]
  }
]

export default function VibeCheck() {
  const [view, setView] = useState('intro')
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [favCourse, setFavCourse] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleStart = () => {
    setView('quiz')
  }

  const handleOptionSelect = (key, value) => {
    setAnswers({ ...answers, [key]: value })
    if (step < questions.length - 1) {
      setTimeout(() => setStep(step + 1), 250)
    } else {
      setTimeout(() => setView('final'), 250)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    const payload = {
      ...answers,
      fav_course: favCourse,
      email: email
    }

    const { error } = await supabase
      .from('waitlist_surveys')
      .insert([payload])

    if (error) {
      alert("Error saving your vibe. Try again.")
      console.error(error)
    } else {
      setView('success')
    }
    setSubmitting(false)
  }

  // Animation Variants
  const slideVariants = {
    enter: { x: 20, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-golf-dark font-sans selection:bg-golf-green selection:text-golf-dark">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1592919505780-30395071d48f?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-golf-dark via-golf-dark/95 to-golf-dark/80"></div>
      </div>

      <div className="relative z-10 w-full max-w-xl">
        
        {/* Header Branding */}
        <motion.div layout className="text-center mb-8">
            <h1 className="text-5xl font-black tracking-tighter mb-4 text-white drop-shadow-lg">
              TEE<span className="text-golf-green">MATES</span>
            </h1>
            
            {/* NEW: Beta Badge (High Visibility) */}
            {view === 'intro' && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-golf-green/10 border border-golf-green/30 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-golf-green opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-golf-green"></span>
                </span>
                <span className="text-xs font-bold text-golf-green uppercase tracking-widest">
                  Accepting Beta Users
                </span>
              </div>
            )}
        </motion.div>

        {/* --- MAIN CARD --- */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl min-h-[480px] flex flex-col justify-center relative overflow-hidden ring-1 ring-white/5">
          
          <AnimatePresence mode='wait'>
            
            {/* 1. INTRO SCREEN */}
            {view === 'intro' && (
              <motion.div 
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="text-center"
              >
                <div className="mb-8 space-y-6">
                  <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                    Don't let a random <br/> 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-golf-green to-emerald-400">ruin your round.</span>
                  </h2>
                  
                  {/* UPDATED: Brighter Text for readability */}
                  <p className="text-slate-200 text-lg leading-relaxed font-light">
                    We've all been there: Paired with a weirdo, a slow-player, or someone who treats the fairway like a frat party.
                  </p>
                  
                  {/* UPDATED: Green Glow Box for "The Fix" */}
                  <div className="bg-emerald-900/20 p-5 rounded-xl border border-emerald-500/20 text-left relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-golf-green"></div>
                    <p className="text-emerald-100 text-sm">
                      <strong className="text-golf-green block mb-1 uppercase tracking-wider text-xs">The Solution</strong>
                      We're building a marketplace to match you with local golfers who share your vibe, pace, and style.
                    </p>
                  </div>
                </div>

                <button 
                  onClick={handleStart}
                  className="w-full bg-golf-green hover:bg-emerald-400 text-golf-dark font-black py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 group transition-all transform hover:scale-[1.02]"
                >
                  Start Vibe Check <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                </button>
                <p className="text-xs text-slate-400 mt-4 font-medium">Join the Calgary 2026 Waitlist</p>
              </motion.div>
            )}

            {/* 2. QUIZ SCREEN */}
            {view === 'quiz' && (
              <motion.div
                key={`q-${step}`}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col items-center mb-8 text-center">
                   <div className="text-golf-green mb-4 p-4 bg-golf-green/10 rounded-full ring-1 ring-golf-green/20">{questions[step].icon}</div>
                   <h2 className="text-2xl font-bold text-white mb-2">{questions[step].text}</h2>
                   <p className="text-slate-300 text-sm font-medium">{questions[step].subtext}</p>
                </div>
                
                <div className="space-y-3">
                  {questions[step].options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleOptionSelect(questions[step].id, opt)}
                      className="w-full text-left p-5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-golf-green/50 hover:text-golf-green transition-all group flex items-center justify-between"
                    >
                      <span className="font-medium text-lg text-slate-200 group-hover:text-golf-green">{opt}</span>
                      <div className="w-5 h-5 rounded-full border-2 border-slate-600 group-hover:border-golf-green group-hover:bg-golf-green transition-colors"></div>
                    </button>
                  ))}
                </div>
                
                {/* Progress Bar */}
                <div className="mt-8 flex justify-center gap-2">
                  {questions.map((_, i) => (
                    <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-golf-green shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'w-2 bg-slate-700'}`}></div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 3. FINAL INPUTS */}
            {view === 'final' && (
              <motion.div
                key="final"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                 <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="text-center mb-6">
                       <MapPin className="mx-auto text-golf-green mb-2 drop-shadow-lg" size={40} />
                       <h2 className="text-2xl font-bold text-white">Last Step.</h2>
                       <p className="text-slate-300 text-sm">Where do we send your invite?</p>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-golf-green ml-1 mb-2 block">Favorite Course in Calgary?</label>
                      <input 
                        type="text" 
                        required
                        value={favCourse}
                        onChange={(e) => setFavCourse(e.target.value)}
                        placeholder="e.g. Blue Devil / Heritage Pointe"
                        className="w-full bg-black/40 border border-slate-700 rounded-xl px-5 py-4 text-white focus:ring-2 focus:ring-golf-green focus:border-transparent outline-none transition-all placeholder:text-slate-600 font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-golf-green ml-1 mb-2 block">Your Email</label>
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="golfer@example.com"
                        className="w-full bg-black/40 border border-slate-700 rounded-xl px-5 py-4 text-white focus:ring-2 focus:ring-golf-green focus:border-transparent outline-none transition-all placeholder:text-slate-600 font-medium"
                      />
                    </div>

                    <button
                      disabled={submitting}
                      className="w-full bg-golf-green hover:bg-emerald-400 text-golf-dark font-black py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 mt-4 transition-all hover:scale-[1.02]"
                    >
                      {submitting ? <Loader2 className="animate-spin" /> : "Secure My Spot"}
                    </button>
                 </form>
              </motion.div>
            )}

            {/* 4. SUCCESS / FEATURES SCREEN */}
            {view === 'success' && (
               <motion.div 
                 key="success"
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="text-center h-full flex flex-col"
               >
                 <div className="flex-grow">
                    <div className="w-16 h-16 bg-golf-green text-golf-dark rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.6)]">
                      <Check size={32} strokeWidth={4} />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-2 tracking-tight">YOU'RE ON THE LIST.</h3>
                    <p className="text-slate-300 mb-8 max-w-xs mx-auto">
                      Your preferences have been saved. We'll match you when we drop.
                    </p>

                    {/* Feature Grid */}
                    <div className="grid grid-cols-1 gap-3 text-left">
                      <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-colors">
                        <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400"><Users size={20}/></div>
                        <div>
                          <h4 className="font-bold text-white text-sm">Squad Cards</h4>
                          <p className="text-xs text-slate-400">Browse players like a dating app.</p>
                        </div>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-colors">
                        <div className="bg-purple-500/20 p-2 rounded-lg text-purple-400"><Shield size={20}/></div>
                        <div>
                          <h4 className="font-bold text-white text-sm">Reputation Score</h4>
                          <p className="text-xs text-slate-400">No-shows get flagged. Reliability wins.</p>
                        </div>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-colors">
                         <div className="bg-yellow-500/20 p-2 rounded-lg text-yellow-400"><Zap size={20}/></div>
                        <div>
                          <h4 className="font-bold text-white text-sm">Fast-Fill</h4>
                          <p className="text-xs text-slate-400">Post a spot, fill it in minutes.</p>
                        </div>
                      </div>
                    </div>
                 </div>

                 <div className="mt-8 pt-6 border-t border-white/10">
                    <p className="text-xs font-bold text-golf-green uppercase tracking-widest animate-pulse">
                      Launching Before 2026 Season
                    </p>
                 </div>
               </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  )
}