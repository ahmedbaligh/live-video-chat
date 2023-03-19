import { Box, Center, Flex, Text } from '@chakra-ui/react';
import { useMeeting, useParticipant } from '@videosdk.live/react-sdk';
import { RiMicFill, RiMicOffFill, RiCameraFill, RiCameraOffFill } from 'react-icons/ri';

import { getInitials } from '../../../utils/strings';

export const ParticipantsList = () => {
  const { participants } = useMeeting();

  return (
    <Flex w="full" flexDir="column" gap="4" bg-gray-600>
      {[...participants.keys()].map(participantID => (
        <Participant key={participantID} participantID={participantID} />
      ))}
    </Flex>
  );
};

interface ParticipantProps {
  participantID: string;
}

const Participant = ({ participantID }: ParticipantProps) => {
  const { micOn, webcamOn, displayName, isLocal } = useParticipant(participantID);

  return (
    <Flex bg="gray.700" align="center" gap="4" px="4" py="3">
      <Center bg="gray.400" color="gray.800" px="2" py="1" w="2.8rem" fontWeight="600" rounded="md">
        {getInitials(displayName)}
      </Center>

      <Text flex={1} noOfLines={1}>
        {isLocal ? 'Me' : displayName}
      </Text>

      <Box fontSize="lg" color={micOn ? 'white' : 'gray.500'}>
        {micOn ? <RiMicFill /> : <RiMicOffFill />}
      </Box>

      <Box fontSize="lg" color={webcamOn ? 'white' : 'gray.500'}>
        {webcamOn ? <RiCameraFill /> : <RiCameraOffFill />}
      </Box>
    </Flex>
  );
};
