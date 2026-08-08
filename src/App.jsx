import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import AdminDashboard from './components/AdminDashboard'
import "leaflet/dist/leaflet.css";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>

    <AdminDashboard/>

    </>
  )
}

export default App
