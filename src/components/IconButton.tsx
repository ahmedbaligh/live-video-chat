import { IconButton as ChakraIconButton, IconButtonProps } from '@chakra-ui/react';

export const IconButton = ({ title, ...props }: IconButtonProps) => (
  <ChakraIconButton
    title={title ?? props['aria-label']}
    boxSize={12}
    bg="gray.200"
    rounded="full"
    color="red.500"
    fontSize="xl"
    _hover={{ bg: 'gray.400' }}
    {...props}
  />
);
