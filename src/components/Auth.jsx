import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Mail, Loader2, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    })
    if (error) alert(error.message)
    else setSent(true)
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-golf-dark">
      
      {/* 1. Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 blur-sm scale-105"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-golf-dark via-golf-dark/90 to-transparent"></div>
      </div>

      {/* 2. Main Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        
        {/* Brand Header */}
        <div className="text-center mb-8">
            <motion.h1 
              initial={{ letterSpacing: "-0.05em" }}
              animate={{ letterSpacing: "0em" }}
              className="text-5xl font-black tracking-tighter mb-2 text-white drop-shadow-2xl"
            >
              TEE<span className="text-golf-green">MATES</span>
            </motion.h1>
            <p className="text-slate-400 font-light tracking-wide uppercase text-xs">No Randoms. Just Golf.</p>
        </div>

        {/* Glass Container */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl ring-1 ring-white/5">
          
          {sent ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
               <div className="w-20 h-20 bg-golf-green/10 text-golf-green rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-golf-green/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                 <Mail size={40} />
               </div>
               <h3 className="text-2xl font-bold text-white mb-2">Check your inbox</h3>
               <p className="text-slate-400 leading-relaxed">
                 We sent a magic login link to <br/>
                 <span className="text-golf-green font-medium">{email}</span>
               </p>
               <button onClick={() => setSent(false)} className="mt-8 text-sm text-slate-500 hover:text-white transition-colors">
                 Entered wrong email?
               </button>
            </motion.div>
          ) : (
            <>
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-golf-green ml-1">Email</label>
                  <div className="relative group">
                    <input
                      type="email"
                      placeholder="golfer@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-4 text-white focus:ring-2 focus:ring-golf-green/50 focus:border-golf-green outline-none transition-all placeholder:text-slate-600"
                      required
                    />
                    <div className="absolute inset-0 rounded-xl bg-golf-green/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-golf-green to-emerald-600 hover:to-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <>Send Magic Link <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/></>}
                  </span>
                </motion.button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700/50"></div></div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-transparent px-2 text-slate-500 font-bold backdrop-blur-md">Or</span></div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 1)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogleLogin}
                className="w-full bg-white text-slate-900 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-3 shadow-xl"
              >
                {/* SVG fixed to ensure it doesn't blow up if tailwind fails */}
                <svg className="w-5 h-5" viewBox="0 0 24 24" style={{width: '20px', height: '20px'}}><path fill="currentColor" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81Z"/></svg>
                Continue with Google
              </motion.button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}