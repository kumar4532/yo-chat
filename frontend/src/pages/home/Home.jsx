import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/sidebar/Sidebar'
import MessageContainer from '../../components/messages/MessageContainer'
import { ArrowLeft } from "lucide-react"

function Home() {
  const [isMobile, setIsMobile] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    handleResize() // Check on initial render
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleConversationSelect = () => {
    if (isMobile) {
      setShowSidebar(false)
    }
  }

  const handleBackToSidebar = () => {
    setShowSidebar(true)
  }

  return (
    <div className='flex h-[90vh] w-full rounded-lg overflow-hidden'>
      <div>
        <Sidebar onConversationSelect={handleConversationSelect} />
      </div>
      <MessageContainer />
    </div>
  )
}

export default Home