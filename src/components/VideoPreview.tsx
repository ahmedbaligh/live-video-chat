import { useState, useRef, useMemo, useEffect } from 'react';
import { Flex, IconButton, Center } from '@chakra-ui/react';
import { RiMicFill, RiMicOffFill, RiCameraFill, RiCameraOffFill } from 'react-icons/ri';

export interface VideoPreviewProps {
  isMicEnabled: boolean;
  isWebcamEnabled: boolean;
  setIsMicOn: React.Dispatch<React.SetStateAction<boolean>>;
  setIsWebcamOn: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedMic: React.Dispatch<React.SetStateAction<{ id: string | undefined }>>;
  setSelectedWebcam: React.Dispatch<React.SetStateAction<{ id: string | undefined }>>;
}

type Devices = {
  devices: MediaDeviceInfo[];
  webcams: MediaDeviceInfo[];
  mics: MediaDeviceInfo[];
};

export const VideoPreview = ({
  isMicEnabled,
  isWebcamEnabled,
  setIsMicOn,
  setIsWebcamOn,
  setSelectedMic,
  setSelectedWebcam
}: VideoPreviewProps) => {
  const [, setDevices] = useState<Devices>({ devices: [], webcams: [], mics: [] });
  const [videoTrack, setVideoTrack] = useState<MediaStreamTrack | null>(null);
  const [audioTrack, setAudioTrack] = useState<MediaStreamTrack | null>(null);

  const videoPlayerRef = useRef<HTMLVideoElement>(null);
  const videoTrackRef = useRef<MediaStreamTrack | null>();
  const audioTrackRef = useRef<MediaStreamTrack | null>();

  const isMicOn = useMemo(() => !!audioTrack, [audioTrack]);
  const isWebcamOn = useMemo(() => !!videoTrack, [videoTrack]);

  const onWebcamOff = () => {
    const videoTrack = videoTrackRef.current;

    if (!videoTrack) return;

    videoTrack.stop();
    setVideoTrack(null);
    setIsWebcamOn(false);
  };

  const onWebcamOn = () => {
    const videoTrack = videoTrackRef.current;

    if (videoTrack) return;

    getDefaultMediaTracks({ hasMic: false, hasWebcam: true });
    setIsWebcamOn(true);
  };

  const onWebcamToggle = () => {
    const videoTrack = videoTrackRef.current;

    if (videoTrack) onWebcamOff();
    else onWebcamOn();
  };

  const onMicOff = () => {
    const audioTrack = audioTrackRef.current;

    if (!audioTrack) return;

    audioTrack.stop();
    setAudioTrack(null);
    setIsMicOn(false);
  };

  const onMicOn = () => {
    const audioTrack = audioTrackRef.current;

    if (audioTrack) return;

    getDefaultMediaTracks({ hasMic: true, hasWebcam: false });
    setIsMicOn(true);
  };

  const onMicToggle = () => {
    const audioTrack = audioTrackRef.current;

    if (audioTrack) onMicOff();
    else onMicOn();
  };

  const getDefaultMediaTracks = async (params: { hasMic: boolean; hasWebcam: boolean; isInitial?: boolean }) => {
    const constraints = { audio: true, video: { width: 1280, height: 720 } };

    if (params.hasMic) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: constraints.audio });
      const audioTracks = stream.getAudioTracks();

      const audioTrack = audioTracks?.[0] ?? null;
      setAudioTrack(audioTrack);

      if (params.isInitial) setSelectedMic({ id: audioTrack?.getSettings()?.deviceId });
    }

    if (params.hasWebcam) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: constraints.video });
      const videoTracks = stream.getVideoTracks();

      const videoTrack = videoTracks?.[0] ?? null;
      setVideoTrack(videoTrack);

      if (params.isInitial) setSelectedWebcam({ id: videoTrack?.getSettings()?.deviceId });
    }
  };

  const getDevices = async ({ isMicEnabled, isWebcamEnabled }: { isMicEnabled: boolean; isWebcamEnabled: boolean }) => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const webcams = devices.filter(device => device.kind === 'videoinput');
      const mics = devices.filter(device => device.kind === 'audioinput');

      setDevices({ webcams, mics, devices });

      getDefaultMediaTracks({
        hasMic: !!mics.length && isMicEnabled,
        hasWebcam: !!webcams.length && isWebcamEnabled,
        isInitial: true
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getDevices({ isMicEnabled, isWebcamEnabled });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    audioTrackRef.current = audioTrack;

    return () => {
      audioTrackRef.current?.stop();
      audioTrackRef.current = null;
    };
  }, [audioTrack]);

  useEffect(() => {
    videoTrackRef.current = videoTrack;

    if (videoTrack && videoPlayerRef.current) {
      const videoSrcObject = new MediaStream([videoTrack]);

      videoPlayerRef.current.srcObject = videoSrcObject;
      videoPlayerRef.current.play();

      return;
    }

    if (videoPlayerRef.current) videoPlayerRef.current.srcObject = null;
  }, [videoTrack]);

  return (
    <Flex flex={1} flexDir="column" align="center" boxSize="full" pos="relative">
      <Center
        as="video"
        // @ts-ignore
        ref={videoPlayerRef}
        autoPlay
        playsInline
        muted
        controls={false}
        flex={1}
        bg="gray.700"
        rounded="xl"
        boxSize="full"
        sx={{ aspectRatio: '16/9' }}
        objectFit="contain"
        transform="auto"
        scaleX={-1}
      />

      <Flex pos="absolute" bottom="4" gap="3">
        <IconButton
          aria-label="Toggle Mic"
          title="Toggle Mic"
          color={isMicOn ? 'green.500' : 'red.500'}
          icon={isMicOn ? <RiMicFill /> : <RiMicOffFill />}
          boxSize={12}
          fontSize="xl"
          rounded="full"
          minW="unset"
          onClick={onMicToggle}
        />

        <IconButton
          color={isWebcamOn ? 'green.500' : 'red.500'}
          aria-label="Toggle Webcam"
          title="Toggle Webcam"
          icon={isWebcamOn ? <RiCameraFill /> : <RiCameraOffFill color="red" />}
          boxSize={12}
          fontSize="xl"
          rounded="full"
          minW="unset"
          onClick={onWebcamToggle}
        />
      </Flex>
    </Flex>
  );
};
