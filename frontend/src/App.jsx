import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import WelcomeScreen from "./components/WelcomeScreen"
import ChatInterface from "./components/ChatInterface"

export default function App() {
  const [currentView, setCurrentView] = useState('welcome') // 'welcome' or 'chat'

  const startChat = () => {
    setCurrentView('chat')
  }

  const goBack = () => {
    setCurrentView('welcome')
  }

  return (
    <div 
      className="min-h-screen text-white" 
      style={{ 
        backgroundColor: '#0a0a0a',
        color: 'rgba(255, 255, 255, 0.95)'
      }}
    >
      <AnimatePresence mode="wait">
        {currentView === 'welcome' ? (
          <WelcomeScreen key="welcome" onStart={startChat} />
        ) : (
          <ChatInterface key="chat" onBack={goBack} />
        )}
      </AnimatePresence>
    </div>
  )
} 