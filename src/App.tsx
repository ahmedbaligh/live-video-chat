import { useState } from 'react';
import { Constants } from '@videosdk.live/react-sdk';

import { Lobby } from './pages';

function App() {
  const [micOn, setMicOn] = useState(false);
  const [webcamOn, setWebcamOn] = useState(true);
  const [, setSelectedMic] = useState<{ id: string | undefined }>({ id: undefined });
  const [, setSelectedWebcam] = useState<{ id: string | undefined }>({ id: undefined });
  const [meetingMode] = useState(Constants.modes.CONFERENCE);

  return (
    <>
      <Lobby
        setIsMicOn={setMicOn}
        isMicEnabled={micOn}
        isWebcamEnabled={webcamOn}
        setIsWebcamOn={setWebcamOn}
        setSelectedMic={setSelectedMic}
        setSelectedWebcam={setSelectedWebcam}
        meetingMode={meetingMode}
      />
    </>
  );
}

export default App;
