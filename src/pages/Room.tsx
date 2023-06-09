import { memo, useEffect, useRef, useState } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { createCameraVideoTrack, MeetingProvider, useMeeting, usePubSub } from '@videosdk.live/react-sdk';
import { Center, Flex, Heading, Text } from '@chakra-ui/react';
import { toast } from 'react-toastify';

import { config } from '../config';
import { Loader } from '../components';
import { useMeetingAppContext } from '../context/MeetingAppContext';
import { notificationSound } from '../utils/helpers';

import { ControlsBar, InvalidMeeting, ParticipantsTiles, MeetingSidebar } from '../features/meeting/components';
import { useValidateRoomQuery } from '../features/meeting/hooks';
import { handleMeetingError, setMeetingQuality } from '../features/meeting/helpers';
import type { MeetingParam, MeetingReturn } from '../features/meeting/types';
import type { Message } from '../features/chat/types';

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

  const { setSideBarMode } = useMeetingAppContext();

  const meeting = useMeeting({
    onParticipantJoined: setMeetingQuality,
    onEntryResponded,
    onMeetingJoined,
    onMeetingLeft: onMeetingLeft,
    onError: handleMeetingError
  } as MeetingParam) as MeetingReturn;

  const { messages } = usePubSub('CHAT', {
    onMessageReceived: ({ message, senderId, senderName }: Message) => {
      if (senderId === meetingRef.current?.localParticipant?.id) return;

      notificationSound.play();

      toast.info(message ? `${senderName} says: ${message}` : 'New message received', {
        position: 'bottom-left',
        hideProgressBar: true,
        autoClose: 4000,
        onClick: () => setSideBarMode('CHAT')
      });
    }
  });

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
      {isParticipantAllowedToJoin === null && !meeting.isMeetingJoined && (
        <Center flex={1} gap="16" flexDir="column" fontSize="xl">
          <Loader flex="unset" />
          Waiting to join meeting...
        </Center>
      )}

      {isParticipantAllowedToJoin === false && (
        <Center flex={1} color="red.500">
          Participant not allowed to join meeting! Try again later.
        </Center>
      )}

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

          <MeetingSidebar messages={messages} />
        </>
      )}
    </Flex>
  );
});
