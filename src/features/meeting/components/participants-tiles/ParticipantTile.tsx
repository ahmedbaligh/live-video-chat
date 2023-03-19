import { useEffect, useMemo, useRef } from 'react';
import { useParticipant } from '@videosdk.live/react-sdk';
import { toast } from 'react-toastify';
import { Text, Center, Flex } from '@chakra-ui/react';

import ReactPlayer from 'react-player';
import { getInitials } from '../../../../utils/strings';

interface ParticipantTileProps {
  participantID: string;
}

export const ParticipantTile = ({ participantID }: ParticipantTileProps) => {
  const micRef = useRef<HTMLAudioElement>(null);
  const { displayName, webcamStream, micStream, webcamOn, micOn, isLocal } = useParticipant(participantID);

  const webcamMediaStream = useMemo(() => {
    if (!webcamOn || !webcamStream) return;

    const mediaStream = new MediaStream();
    mediaStream.addTrack(webcamStream.track);
    return mediaStream;
  }, [webcamStream, webcamOn]);

  useEffect(() => {
    if (!micRef.current) return;

    if (!micOn || !micStream) {
      micRef.current.srcObject = null;
      return;
    }

    const mediaStream = new MediaStream();
    mediaStream.addTrack(micStream.track);
    micRef.current.srcObject = mediaStream;
    micRef.current.play().catch(() => toast.error(`Failed to play ${displayName}'s audio.`));
  }, [micStream, micOn, displayName]);

  return (
    <Flex
      pos="relative"
      w="full"
      sx={{ aspectRatio: '16/9' }}
      objectFit="contain"
      bg="gray.700"
      rounded="lg"
      overflow="hidden"
      transform="auto"
      scaleX={webcamOn ? -1 : 1}
    >
      <audio ref={micRef} autoPlay muted={isLocal} />

      {webcamOn ? (
        <ReactPlayer
          playsinline
          light={false}
          controls={false}
          muted={true}
          playing={true}
          url={webcamMediaStream}
          width="100%"
          height="100%"
          onError={() => toast.error(`Failed to play ${displayName}'s video.`)}
        />
      ) : (
        <Center boxSize="full" zIndex="10" isolation="isolate">
          <Text as={Center} boxSize="20" rounded="full" bg="gray.800" zIndex="10">
            {getInitials(displayName)}
          </Text>
        </Center>
      )}
    </Flex>
  );
};
