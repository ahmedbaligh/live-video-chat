import { Button, Center, CenterProps, Flex, Heading, Input, Text } from '@chakra-ui/react';
import { useState } from 'react';

interface GetParticipantDetailsProps extends CenterProps {
  participantName: string;
  setParticipantName: React.Dispatch<React.SetStateAction<string>>;
  meetingID: string;
}

export const GetParticipantDetails = ({
  participantName,
  setParticipantName,
  meetingID,
  ...props
}: GetParticipantDetailsProps) => {
  const [name, setName] = useState(participantName);

  const onDetailsSubmit = (e: React.FormEvent<HTMLFormElement | HTMLDivElement>) => {
    e.preventDefault();
    setParticipantName(name);
  };

  return (
    <Center flexDirection="column" gap="12" {...props}>
      <Heading as="h1" size="lg" lineHeight="1.5" textAlign="center" color="gray.200" maxW="500px">
        You are joining the meeting of id {''}
        <Text display="inline" color="blue.500">
          {meetingID}
        </Text>{' '}
        as
        <Text fontSize="1.5em" color={name ? 'white' : 'gray.700'}>
          {name || 'Your Name'}
        </Text>
      </Heading>

      <Flex as="form" align="center" gap="3" onSubmit={onDetailsSubmit}>
        <Input value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" required />

        <Button type="submit" isDisabled={!name}>
          Enter Meeting
        </Button>
      </Flex>
    </Center>
  );
};
