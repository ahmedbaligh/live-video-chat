import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Center, Flex, Heading, Text, Input } from '@chakra-ui/react';
import { RiVideoAddFill } from 'react-icons/ri';
import { toast } from 'react-toastify';

import { VideoPreview, VideoPreviewProps } from '../components/VideoPreview';

import { isValidRoom, useCreateMeetingMutation } from '../features/meeting/hooks';

interface LobbyProps extends VideoPreviewProps {}

export function Lobby(props: LobbyProps) {
  const [roomID, setRoomID] = useState('');

  const navigate = useNavigate();
  const { isCreatingMeeting, createMeeting } = useCreateMeetingMutation();

  const onJoinMeeting = async (e: React.FormEvent<HTMLFormElement | HTMLDivElement>) => {
    e.preventDefault();

    try {
      const isValidID = await isValidRoom(roomID);

      if (!isValidID) return toast.error('Invalid Room ID');
    } catch (err) {
      return toast.error('Invalid Room ID');
    }

    navigate(`/rooms/${roomID}`);
  };

  const onCreateMeeting = () =>
    createMeeting(undefined, {
      onSuccess: ({ roomId }) => navigate(`/rooms/${roomId}`),
      onError: () => toast.error('Something went wrong while trying to create a meeting. Please try again later.')
    });

  return (
    <Center flex={1} flexDir={{ base: 'column-reverse', xl: 'row-reverse' }} gap="12">
      <VideoPreview {...props} />

      <Flex flex={{ xl: 1 }} flexDir="column" justify="center" align={{ md: 'center', xl: 'flex-start' }} gap="4">
        <Heading as="h1" size="xl">
          Welcome to Video Chat
        </Heading>

        <Text fontSize="lg" color="gray.500">
          Create a meeting or join an existing one for free!
        </Text>

        <Flex mt="6" flexDir={{ base: 'column', md: 'row' }} align="stretch" gap={{ base: 6, md: 4 }}>
          <Button
            h="14"
            py="3.5"
            bg="blue.500"
            _hover={{ bg: 'blue.600' }}
            leftIcon={<RiVideoAddFill fontSize="1.25rem" />}
            isLoading={isCreatingMeeting}
            onClick={onCreateMeeting}
          >
            Create a Meeting
          </Button>

          <Flex minH="full" as="form" gap="3" onSubmit={onJoinMeeting}>
            <Input
              variant="outline"
              borderColor="gray.500"
              minH={{ base: '12', md: 'full' }}
              maxW="72"
              value={roomID}
              onChange={e => setRoomID(e.target.value)}
              placeholder="Enter a meeting ID to join"
              required
            />

            <Button type="submit" isDisabled={!roomID} variant="link">
              Join
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Center>
  );
}
