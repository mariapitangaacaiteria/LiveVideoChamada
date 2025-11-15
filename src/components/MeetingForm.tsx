import { useState, useEffect, FormEvent } from 'react'

interface MeetingFormProps {
  onJoinMeeting: (roomName: string, displayName: string) => void
  initialRoomName?: string
}

export function MeetingForm({ onJoinMeeting, initialRoomName = '' }: MeetingFormProps) {
  const [roomName, setRoomName] = useState(initialRoomName)
  const [displayName, setDisplayName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [createdRoomLink, setCreatedRoomLink] = useState('')
  const [linkCopied, setLinkCopied] = useState(false)

  useEffect(() => {
    if (initialRoomName) {
      setRoomName(initialRoomName)
    }
  }, [initialRoomName])

  const generateRandomRoom = () => {
    const randomRoom = `videochamada-${Math.random().toString(36).substring(2, 9)}`
    return randomRoom
  }

  const handleCreateMeeting = (e: FormEvent) => {
    e.preventDefault()
    if (displayName.trim()) {
      const newRoom = generateRandomRoom()
      setRoomName(newRoom)
      setIsCreating(true)
      setCreatedRoomLink(`${window.location.origin}?room=${newRoom}`)
      // Criar a videochamada automaticamente
      setTimeout(() => {
        onJoinMeeting(newRoom, displayName.trim())
      }, 500)
    }
  }

  const handleJoinExisting = (e: FormEvent) => {
    e.preventDefault()
    if (roomName.trim() && displayName.trim()) {
      onJoinMeeting(roomName.trim(), displayName.trim())
    }
  }

  const copyRoomLink = async () => {
    try {
      await navigator.clipboard.writeText(createdRoomLink)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    } catch (err) {
      console.error('Erro ao copiar link:', err)
    }
  }

  return (
    <div className="meeting-form">
      <h1>LiveVideo - Reunião ao Vivo</h1>
      
      {!isCreating ? (
        <>
          {/* Opção 1: Criar Nova Videochamada */}
          <div className="meeting-option">
            <h2>🎥 Criar Nova Videochamada</h2>
            <form onSubmit={handleCreateMeeting}>
              <div className="form-group">
                <label htmlFor="displayNameCreate">Seu Nome:</label>
                <input
                  id="displayNameCreate"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Digite seu nome"
                  required
                  autoFocus
                />
              </div>
              <button type="submit" className="btn-create">
                🚀 Criar Videochamada
              </button>
            </form>
          </div>

          <div className="divider">
            <span>ou</span>
          </div>

          {/* Opção 2: Entrar em Videochamada Existente */}
          <div className="meeting-option">
            <h2>🔗 Entrar em Videochamada Existente</h2>
            <form onSubmit={handleJoinExisting}>
              <div className="form-group">
                <label htmlFor="displayNameJoin">Seu Nome:</label>
                <input
                  id="displayNameJoin"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Digite seu nome"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="roomName">Nome da Sala:</label>
                <div className="room-input-group">
                  <input
                    id="roomName"
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Digite o nome da sala"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setRoomName(generateRandomRoom())}
                    className="btn-random"
                    title="Gerar nome aleatório"
                  >
                    🎲
                  </button>
                </div>
              </div>
              <button type="submit" className="btn-join">
                Entrar na Videochamada
              </button>
            </form>
          </div>
        </>
      ) : (
        <div className="creating-meeting">
          <div className="spinner"></div>
          <h2>Criando sua videochamada...</h2>
          {createdRoomLink && (
            <div className="room-link-container">
              <p>Compartilhe este link:</p>
              <div className="link-box">
                <input
                  type="text"
                  value={createdRoomLink}
                  readOnly
                  className="link-input"
                />
                <button
                  onClick={copyRoomLink}
                  className="btn-copy"
                  title="Copiar link"
                >
                  {linkCopied ? '✓ Copiado!' : '📋 Copiar'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

