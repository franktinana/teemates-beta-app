import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react'

export default function Unsubscribe() {
  const [params] = useSearchParams()
  const token = params.get('token')
  const [status, setStatus] = useState('loading') // loading, success, error
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function performUnsub() {
      if (!token) {
        setStatus('error')
        setMessage('Missing verification token.')
        return
      }

      // Call Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('unsubscribe', {
        body: { token }
      })

      if (error) {
        console.error('Edge Function Error:', error)
        setStatus('error')
        setMessage(error.message || 'Connection failed.')
        return
      }

      // Check for application-level errors returned by function
      if (data && !data.ok) {
        setStatus('error')
        setMessage(data.error || 'Failed to unsubscribe.')
        return
      }

      setStatus('success')
    }
    performUnsub()
  }, [token])

  return (
    <div className="min-h-screen bg-golf-dark flex items-center justify-center p-4 text-white font-sans">
      <div className="max-w-md w-full bg-slate-900/50 border border-white/10 p-8 rounded-3xl text-center backdrop-blur-xl shadow-2xl">
        
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <Loader2 className="animate-spin text-golf-green mb-4" size={48} />
            <h2 className="text-xl font-bold">Unsubscribing...</h2>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
              <CheckCircle className="text-golf-green" size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Unsubscribed</h2>
            <p className="text-slate-400 mb-8">You have been removed from the TeeMates mailing list.</p>
            <Link 
              to="/" 
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold transition-all flex items-center gap-2 mx-auto"
            >
              <ArrowLeft size={16} /> Return to Home
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <XCircle className="text-red-500 mb-4" size={48} />
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p className="text-slate-400 mb-6">{message}</p>
            <Link to="/" className="text-golf-green hover:underline">Return Home</Link>
          </div>
        )}
      </div>
    </div>
  )
}
