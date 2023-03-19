import { Link } from 'react-router-dom';
import { CenterProps, Center, Heading, Button } from '@chakra-ui/react';

export const InvalidMeeting = (props: CenterProps) => (
  <Center flexDir="column" gap="16" {...props}>
    <Heading as="h1" size="2xl" color="gray.100">
      Sorry, this meeting does not exist!
    </Heading>

    <Button as={Link} to="/" variant="outline" _hover={{ bg: 'gray.600' }}>
      Return to Lobby
    </Button>
  </Center>
);
