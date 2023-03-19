import { Container } from '@chakra-ui/react';
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import { MeetingAppProvider } from './context/MeetingAppContext';
import { Lobby, Room } from './pages';

export default function App() {
  const [micOn, setMicOn] = useState(false);
  const [webcamOn, setWebcamOn] = useState(true);
  const [, setSelectedMic] = useState<{ id: string | undefined }>({ id: undefined });
  const [, setSelectedWebcam] = useState<{ id: string | undefined }>({ id: undefined });

  return (
    <Container>
      <Routes>
        <Route
          path="/"
          element={
            <Lobby
              isMicEnabled={micOn}
              isWebcamEnabled={webcamOn}
              setIsMicOn={setMicOn}
              setIsWebcamOn={setWebcamOn}
              setSelectedMic={setSelectedMic}
              setSelectedWebcam={setSelectedWebcam}
            />
          }
        />

        <Route
          path="/rooms/:roomID"
          element={
            <MeetingAppProvider>
              <Room />
            </MeetingAppProvider>
          }
        />
      </Routes>
    </Container>
  );
}
