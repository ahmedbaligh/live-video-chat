import { Container } from '@chakra-ui/react';
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import { MeetingAppProvider } from './context/MeetingAppContext';
import { GetParticipantDetails } from './features/meeting/components';
import { Lobby, Room } from './pages';

export default function App() {
  const [micOn, setMicOn] = useState(false);
  const [webcamOn, setWebcamOn] = useState(true);
  const [selectedMic, setSelectedMic] = useState<{ id: string | undefined }>({ id: undefined });
  const [selectedWebcam, setSelectedWebcam] = useState<{ id: string | undefined }>({ id: undefined });

  const onMeetingLeave = () => {
    // TODO: Remove production token here
    setWebcamOn(false);
    setMicOn(false);
  };

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

        <Route path="/user-details" element={<GetParticipantDetails flex={1} />} />

        <Route
          path="/rooms/:roomID"
          element={
            <MeetingAppProvider>
              <Room
                isMicEnabled={micOn}
                isWebcamEnabled={webcamOn}
                selectedMic={selectedMic}
                selectedWebcam={selectedWebcam}
                onMeetingLeave={onMeetingLeave}
              />
            </MeetingAppProvider>
          }
        />
      </Routes>
    </Container>
  );
}
