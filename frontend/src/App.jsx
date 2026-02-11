import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import TechStack from './components/techstack'
import './App.css'
import Chatbot from './components/Chatbox'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />|
      <Chatbot />
      <Hero />
      <TechStack />
    </>
  )
}

export default App
