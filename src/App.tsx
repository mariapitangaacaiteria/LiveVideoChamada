import { useState, useEffect } from 'react'
import { VideoMeeting } from './components/VideoMeeting'
import { MeetingForm } from './components/MeetingForm'
import './App.css'

function App() {
  const [isInMeeting, setIsInMeeting] = useState(false)
  const [roomName, setRoomName] = useState('')
  const [displayName, setDisplayName] = useState('')

  useEffect(() => {
    // Verificar se há um parâmetro de sala na URL
    const urlParams = new URLSearchParams(window.location.search)
    const roomFromUrl = urlParams.get('room')
    if (roomFromUrl) {
      setRoomName(roomFromUrl)
    }
  }, [])

  const handleJoinMeeting = (room: string, name: string) => {
    setRoomName(room)
    setDisplayName(name)
    setIsInMeeting(true)
    // Limpar parâmetro da URL ao entrar na reunião
    window.history.replaceState({}, '', window.location.pathname)
  }

  const handleLeaveMeeting = () => {
    setIsInMeeting(false)
    setRoomName('')
    setDisplayName('')
  }

  if (isInMeeting) {
    return (
      <VideoMeeting
        roomName={roomName}
        displayName={displayName}
        onReadyToClose={handleLeaveMeeting}
      />
    )
  }

  return (
    <div className="app-container">
      <MeetingForm 
        onJoinMeeting={handleJoinMeeting} 
        initialRoomName={roomName}
      />
    </div>
  )
}

export default App
