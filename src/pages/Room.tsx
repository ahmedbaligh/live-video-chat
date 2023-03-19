import { useEffect, useRef, useState } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { createCameraVideoTrack, MeetingProvider, useMeeting } from '@videosdk.live/react-sdk';
import { Flex, Text } from '@chakra-ui/react';

import { config } from '../config';
import { Loader } from '../components';

import { InvalidMeeting } from '../features/meeting/components';
import { useValidateRoomQuery } from '../features/meeting/hooks';
import { handleMeetingError, setMeetingQuality } from '../features/meeting/helpers';
import type { MeetingParam, MeetingReturn } from '../features/meeting/types';

interface RoomProps {
  isMicEnabled: boolean;
  isWebcamEnabled: boolean;
  selectedMic: { id: string | undefined };
  selectedWebcam: { id: string | undefined };
  onMeetingLeave: () => void;
}

export const Room = (props: RoomProps) => {
  const roomID = useParams().roomID as string;
  const participantName: string | undefined = useLocation().state?.participantName;

  const { isValidRoom, isLoading } = useValidateRoomQuery(roomID);

  if (isLoading) return <Loader />;

  if (!isValidRoom) return <InvalidMeeting flex={1} />;

  if (!participantName) return <Navigate to="/user-details" state={{ roomID }} />;

  return (
    <MeetingProvider
      config={{
        meetingId: roomID,
        micEnabled: props.isMicEnabled,
        webcamEnabled: props.isWebcamEnabled,
        name: participantName,
        mode: 'CONFERENCE',
        multiStream: true
      }}
      token={config.VIDEO_SDK_TOKEN}
      reinitialiseMeetingOnConfigChange
      joinWithoutUserInteraction
    >
      <BaseRoom {...props} />
    </MeetingProvider>
  );
};

function BaseRoom({ isMicEnabled, selectedMic, selectedWebcam, onMeetingLeave, isWebcamEnabled }: RoomProps) {
  const [isParticipantAllowedToJoin, setIsParticipantAllowedToJoin] = useState<boolean | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const meetingRef = useRef<ReturnType<typeof useMeeting>>();

  const meeting = useMeeting({
    onParticipantJoined: setMeetingQuality,
    onEntryResponded,
    onMeetingJoined,
    onMeetingLeft: onMeetingLeft,
    onError: handleMeetingError
  } as MeetingParam) as MeetingReturn;

  function onEntryResponded(participantID: string, name: string) {
    const localParticipantID = meetingRef.current?.localParticipant?.id;

    if (localParticipantID !== participantID) return;

    if (name === 'allowed') return setIsParticipantAllowedToJoin(true);

    setIsParticipantAllowedToJoin(false);
    // onMeetingLeave();
  }

  async function onMeetingJoined() {
    if (!isWebcamEnabled || !selectedWebcam.id) return;

    const { changeMic, changeWebcam, muteMic, disableWebcam } = meetingRef.current!;

    await new Promise(resolve => {
      disableWebcam();

      const initiateVideo = async () => {
        const track = await createCameraVideoTrack({
          cameraId: selectedWebcam.id,
          optimizationMode: 'motion',
          encoderConfig: 'h540p_w960p',
          facingMode: 'environment',
          multiStream: false
        });

        changeWebcam(track);
      };

      resolve(initiateVideo);
    });

    if (!isMicEnabled || !selectedMic.id) return;

    await new Promise(resolve => {
      muteMic();

      resolve(() => changeMic(selectedMic.id!));
    });
  }

  function onMeetingLeft() {
    onMeetingLeave();
    // setParticipantName('');
  }

  useEffect(() => {
    meetingRef.current = meeting;
  }, [meeting]);

  return (
    <Flex ref={containerRef} flexDir="column" h="100vh" bg="gray.800">
      {isParticipantAllowedToJoin === null && !meeting.isMeetingJoined && <Text>Waiting to join meeting...</Text>}

      {isParticipantAllowedToJoin === false && <Text>Participant not allowed to join meeting</Text>}

      {isParticipantAllowedToJoin && (
        <Flex flex={1} bg="gray.800">
          Meeting with {meeting.localParticipant.displayName}
        </Flex>
      )}
    </Flex>
  );
}
