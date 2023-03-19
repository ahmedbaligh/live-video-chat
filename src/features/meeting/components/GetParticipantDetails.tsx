import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Center, CenterProps, Flex, Heading, Input, Text } from '@chakra-ui/react';

export const GetParticipantDetails = (props: CenterProps) => {
  const [name, setName] = useState('');

  const navigate = useNavigate();
  const meetingID = useLocation().state?.roomID as string;

  if (!meetingID) navigate('/');

  const onDetailsSubmit = (e: React.FormEvent<HTMLFormElement | HTMLDivElement>) => {
    e.preventDefault();
    navigate(`/rooms/${meetingID}`, { state: { participantName: name } });
  };

  return (
    <Center flexDirection="column" gap="12" {...props}>
      <Heading as="h1" size="lg" lineHeight="1.5" textAlign="center" color="gray.200" maxW="500px">
        You are joining the meeting of id {''}
        <Text display="inline-block" color="blue.500">
          {meetingID}
        </Text>{' '}
        as
        <Text fontSize="1.5em" color={name ? 'white' : 'gray.700'}>
          {name || 'Your Name'}
        </Text>
      </Heading>

      <Flex
        as="form"
        flexDir={{ base: 'column', md: 'row' }}
        align={{ md: 'center' }}
        gap="3"
        onSubmit={onDetailsSubmit}
      >
        <Input autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" required />

        <Button type="submit" isDisabled={!name}>
          Enter Meeting
        </Button>
      </Flex>
    </Center>
  );
};
