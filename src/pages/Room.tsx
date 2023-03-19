import { memo, useEffect, useRef, useState } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { createCameraVideoTrack, MeetingProvider, useMeeting } from '@videosdk.live/react-sdk';
import { Flex, Heading, Text } from '@chakra-ui/react';
import { toast } from 'react-toastify';

import { config } from '../config';
// import { useRect } from '../hooks';
import { Loader } from '../components';

import { ControlsBar, InvalidMeeting, ParticipantsTiles } from '../features/meeting/components';
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
  const participantName = useLocation().state?.participantName as string;

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

const BaseRoom = memo(({ isMicEnabled, selectedMic, selectedWebcam, onMeetingLeave, isWebcamEnabled }: RoomProps) => {
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

  // const { width: containerWidth, height: containerHeight } = useRect(containerRef);

  function onEntryResponded(participantID: string, name: string) {
    const localParticipantID = meetingRef.current?.localParticipant?.id;

    if (localParticipantID !== participantID) return;

    if (name === 'allowed') return setIsParticipantAllowedToJoin(true);

    setIsParticipantAllowedToJoin(false);
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

  const copyMeetingLink = () =>
    navigator.clipboard.writeText(meeting.meetingId).then(() => toast.success('Meeting ID copied to clipboard'));

  useEffect(() => {
    meetingRef.current = meeting;
  }, [meeting]);

  return (
    <Flex flex={1} ref={containerRef} flexDir="column" gap="12" bg="gray.800">
      {isParticipantAllowedToJoin === null && !meeting.isMeetingJoined && <Text>Waiting to join meeting...</Text>}

      {isParticipantAllowedToJoin === false && <Text>Participant not allowed to join meeting</Text>}

      {isParticipantAllowedToJoin && (
        <>
          <Heading as="h1" color="gray.400" textAlign="center" _hover={{ '& > p': { color: 'white' } }}>
            Meeting{' '}
            <Text display="inline-block" transition="color 0.3s" cursor="pointer" onClick={copyMeetingLink}>
              {meeting.meetingId}
            </Text>
          </Heading>

          <Flex flex={1} flexDir="column" bg="gray.800">
            <ParticipantsTiles isPresenting={false} />

            <ControlsBar
              selectedMicID={selectedMic.id}
              selectedWebcamID={selectedWebcam.id}
              pos="fixed"
              bottom="6"
              alignSelf="center"
            />
          </Flex>
        </>
      )}
    </Flex>
  );
});
