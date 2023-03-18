import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from '@chakra-ui/react';

import { Lobby } from './pages';

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
              setIsMicOn={setMicOn}
              isMicEnabled={micOn}
              isWebcamEnabled={webcamOn}
              setIsWebcamOn={setWebcamOn}
              setSelectedMic={setSelectedMic}
              setSelectedWebcam={setSelectedWebcam}
            />
          }
        />
      </Routes>
    </Container>
  );
}
