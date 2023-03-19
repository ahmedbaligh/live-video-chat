import { useNavigate } from 'react-router-dom';
import { createCameraVideoTrack, useMeeting, usePubSub } from '@videosdk.live/react-sdk';
import { Flex, FlexProps } from '@chakra-ui/react';
import { HiHandRaised, HiUsers } from 'react-icons/hi2';
import { RiCameraFill, RiCameraOffFill, RiChat3Fill, RiMicFill, RiMicOffFill } from 'react-icons/ri';
import { MdCallEnd } from 'react-icons/md';

import { IconButton } from '../../../components';
import { useMeetingAppContext } from '../../../context/MeetingAppContext';
import { useEffect } from 'react';

interface ControlsBarProps extends FlexProps {
  selectedMicID?: string;
  selectedWebcamID?: string;
}

export const ControlsBar = ({ selectedMicID, selectedWebcamID, ...props }: ControlsBarProps) => {
  useEffect(() => {
    let timeoutID: NodeJS.Timeout;

    const toggleControlsBarVisibility = () => {
      clearTimeout(timeoutID);

      const controlsBar = document.querySelector('.controls-bar') as HTMLElement;
      controlsBar.style.transform = 'translateY(0)';
      controlsBar.style.opacity = '1';

      timeoutID = setTimeout(() => {
        controlsBar.style.transform = 'translateY(250%)';
        controlsBar.style.opacity = '0';
      }, 3000);
    };

    window.addEventListener('mousemove', toggleControlsBarVisibility);

    return () => {
      window.removeEventListener('mousemove', toggleControlsBarVisibility);
      clearTimeout(timeoutID);
    };
  }, []);

  return (
    <Flex
      className="controls-bar"
      align="center"
      justify="space-between"
      gap="2"
      px="6"
      py="3"
      zIndex="popover"
      isolation="isolate"
      bg="gray.700"
      rounded="full"
      shadow="md"
      transform="auto"
      transition="transform 0.4s, opacity 0.2s"
      {...props}
    >
      <RaiseHandButton />
      <ToggleMicButton />
      <ToggleWebcamButton selectedWebcamID={selectedWebcamID} />
      <LeaveMeetingButton />
      <ToggleViewParticipantsButton />
      <ToggleChatButton />
    </Flex>
  );
};

const RaiseHandButton = () => {
  const { publish } = usePubSub('RAISE_HAND');

  return (
    <IconButton
      aria-label="Raise Hand"
      icon={<HiHandRaised />}
      color="orange.400"
      onClick={() => publish('Raise Hand', { persist: false })}
    />
  );
};

const ToggleMicButton = () => {
  const { localMicOn, toggleMic } = useMeeting();

  return (
    <IconButton
      aria-label="Toggle Mic"
      icon={localMicOn ? <RiMicFill /> : <RiMicOffFill />}
      color={localMicOn ? 'blue.800' : 'red.500'}
      onClick={() => toggleMic()}
    />
  );
};

const ToggleWebcamButton = ({ selectedWebcamID }: { selectedWebcamID?: string }) => {
  const { localWebcamOn, toggleWebcam } = useMeeting();

  return (
    <IconButton
      aria-label="Toggle Webcam"
      color={localWebcamOn ? 'blue.800' : 'red.500'}
      icon={localWebcamOn ? <RiCameraFill /> : <RiCameraOffFill />}
      onClick={async () => {
        let track;

        if (!localWebcamOn)
          track = await createCameraVideoTrack({
            optimizationMode: 'motion',
            encoderConfig: 'h540p_w960p',
            facingMode: 'environment',
            multiStream: false,
            cameraId: selectedWebcamID
          });

        toggleWebcam(track);
      }}
    />
  );
};

const LeaveMeetingButton = () => {
  const { leave } = useMeeting();
  const navigate = useNavigate();

  const onLeaveMeeting = () => {
    leave();
    navigate('/');
  };

  return (
    <IconButton
      aria-label="Leave Room"
      icon={<MdCallEnd />}
      color="red.500"
      _hover={{ bg: 'red.500', color: 'white' }}
      onClick={onLeaveMeeting}
    />
  );
};

const ToggleChatButton = () => {
  const { sideBarMode, setSideBarMode } = useMeetingAppContext();

  return (
    <IconButton
      aria-label="Chat"
      icon={<RiChat3Fill />}
      bg={sideBarMode === 'CHAT' ? 'white' : 'gray.200'}
      color={sideBarMode === 'CHAT' ? 'gray.700' : 'gray.800'}
      onClick={() => setSideBarMode(mode => (mode === 'CHAT' ? null : 'CHAT'))}
    />
  );
};

const ToggleViewParticipantsButton = () => {
  const { sideBarMode, setSideBarMode } = useMeetingAppContext();

  return (
    <IconButton
      aria-label="View Participants"
      icon={<HiUsers />}
      bg={sideBarMode === 'PARTICIPANTS' ? 'white' : 'gray.200'}
      color={sideBarMode === 'PARTICIPANTS' ? 'gray.700' : 'gray.800'}
      onClick={() => setSideBarMode(mode => (mode === 'PARTICIPANTS' ? null : 'PARTICIPANTS'))}
    />
  );
};
