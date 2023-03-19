import { Center, CenterProps, Spinner } from '@chakra-ui/react';

export const Loader = (props: CenterProps) => (
  <Center flex={1} color="cyan" {...props}>
    <Spinner boxSize="16" color="inherit" />
  </Center>
);
