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
      {(!isMobile || showSidebar) && (
        <div className={`${isMobile ? 'w-full' : 'w-1/4'}`}>
          <Sidebar onConversationSelect={handleConversationSelect} />
        </div>
      )}
      {(!isMobile || !showSidebar) && (
        <div className="w-full">
          {isMobile && (
            <button 
              className="m-2 p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
              onClick={handleBackToSidebar}
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
          )}
          <MessageContainer />
        </div>
      )}
    </div>
  )
}

export default Home