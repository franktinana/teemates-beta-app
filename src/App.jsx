import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import VibeCheck from './components/VibeCheck'
import Unsubscribe from './components/Unsubscribe'
import ClaimBeta from './components/ClaimBeta'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VibeCheck />} />
        <Route path="/unsubscribe" element={<Unsubscribe />} />
        <Route path="/claim-beta" element={<ClaimBeta />} />
      </Routes>
    </Router>
  )
}
