import { useRef } from 'react'
import { JitsiMeeting } from '@jitsi/react-sdk'

interface VideoMeetingProps {
  roomName: string
  displayName: string
  onReadyToClose?: () => void
}

export function VideoMeeting({ roomName, displayName, onReadyToClose }: VideoMeetingProps) {
  const apiRef = useRef<any>(null)

  const handleApiReady = (externalApi: any) => {
    apiRef.current = externalApi
    
    // Adicionar listeners de eventos personalizados
    externalApi.addEventListeners({
      readyToClose: () => {
        if (onReadyToClose) {
          onReadyToClose()
        }
      },
      participantJoined: (participant: any) => {
        console.log('Participante entrou:', participant)
      },
      participantLeft: (participant: any) => {
        console.log('Participante saiu:', participant)
      },
      videoConferenceJoined: () => {
        console.log('Conferência iniciada')
      },
      videoConferenceLeft: () => {
        console.log('Conferência encerrada')
      }
    })
  }

  const handleIFrameRef = (iframeRef: HTMLIFrameElement | null) => {
    if (iframeRef) {
      iframeRef.style.height = '100%'
      iframeRef.style.width = '100%'
      iframeRef.style.border = 'none'
    }
  }

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <JitsiMeeting
        domain="meet.jit.si"
        roomName={roomName}
        configOverwrite={{
          startWithAudioMuted: false,
          disableModeratorIndicator: false,
          startScreenSharing: false,
          enableEmailInStats: false,
          enableWelcomePage: false,
          enableClosePage: false
        }}
        interfaceConfigOverwrite={{
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
          SHOW_JITSI_WATERMARK: true,
          SHOW_WATERMARK_FOR_GUESTS: true,
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
            'livestreaming', 'settings', 'raisehand', 'videoquality', 'filmstrip',
            'invite', 'feedback', 'stats', 'shortcuts', 'tileview', 'videobackgroundblur',
            'download', 'help', 'mute-everyone', 'security'
          ]
        }}
        userInfo={{
          displayName: displayName
        }}
        onApiReady={handleApiReady}
        getIFrameRef={handleIFrameRef}
        onReadyToClose={onReadyToClose}
      />
    </div>
  )
}

