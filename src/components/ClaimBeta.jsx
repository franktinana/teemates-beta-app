import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Trophy, XCircle, Loader2, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ClaimBeta() {
  const [params] = useSearchParams()
  const token = params.get('token')
  const [status, setStatus] = useState('loading') // loading, success, error
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function claimSpot() {
      if (!token) {
        setStatus('error')
        setMessage('Missing verification token.')
        return
      }

      // Call Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('claim-beta', {
        body: { token }
      })

      if (error) {
        console.error('Edge Function Error:', error)
        setStatus('error')
        setMessage(error.message || 'Connection failed.')
        return
      }

      if (data && !data.ok) {
        setStatus('error')
        setMessage(data.error || 'Unable to claim spot.')
        return
      }

      setStatus('success')
    }
    claimSpot()
  }, [token])

  return (
    <div className="min-h-screen bg-golf-dark flex items-center justify-center p-4 text-white font-sans relative overflow-hidden">
      {/* Background FX */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2070&auto=format&fit=crop')] bg-cover opacity-10 blur-sm"></div>

      <div className="relative z-10 max-w-lg w-full bg-slate-900/80 border border-golf-green/30 p-10 rounded-3xl text-center backdrop-blur-xl shadow-2xl">
        
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <Loader2 className="animate-spin text-golf-green mb-4" size={48} />
            <h2 className="text-xl font-bold animate-pulse">Verifying Invite...</h2>
          </div>
        )}

        {status === 'success' && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="w-20 h-20 bg-golf-green text-golf-dark rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.6)]">
              <Trophy size={40} />
            </div>
            <h1 className="text-4xl font-black mb-4">YOU'RE IN.</h1>
            <p className="text-lg text-slate-300 mb-8">
              Spot confirmed. You have officially claimed your Beta Access for the 2026 season.
            </p>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-8">
              <p className="text-sm text-slate-400">Status: <span className="text-golf-green font-bold uppercase">Confirmed</span></p>
              <p className="text-xs text-slate-500 mt-1">We will email you the download link when the app drops.</p>
            </div>
            <Link to="/" className="inline-flex items-center gap-2 text-golf-green hover:text-white transition-colors font-bold">
              Back to TeeMates <ArrowRight size={18} />
            </Link>
          </motion.div>
        )}

        {status === 'error' && (
          <div>
            <XCircle className="text-red-500 mb-4 mx-auto" size={48} />
            <h2 className="text-xl font-bold mb-2">Link Invalid</h2>
            <p className="text-slate-400 mb-6">{message}</p>
            <Link to="/" className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-xl font-bold text-sm transition-colors">
              Return Home
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
