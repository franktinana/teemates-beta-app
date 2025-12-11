import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import VibeCheck from './components/VibeCheck' // <--- Import the new component

export default function App() {
  // We removed the session check because we WANT anonymous users to see this.
  return (
    <VibeCheck />
  )
}