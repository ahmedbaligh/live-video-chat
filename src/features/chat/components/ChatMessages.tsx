import { useEffect, useRef } from 'react';
import { useMeeting } from '@videosdk.live/react-sdk';
import { Flex, Grid, Text } from '@chakra-ui/react';

import { formatTime } from '../../../utils/helpers';

import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message: { senderId, senderName, message, timestamp } }: ChatMessageProps) => {
  const { localParticipant } = useMeeting();

  const isUserSender = localParticipant.id === senderId;

  return (
    <Flex
      flexDir="column"
      gap="1"
      maxW="90%"
      w="fit-content"
      minW="50%"
      bg="blackAlpha.400"
      py="1"
      px="3"
      rounded="lg"
      fontWeight="400"
      justifySelf={isUserSender ? 'end' : 'start'}
    >
      <Text
        color="gray.400"
        maxW="16ch"
        justifySelf={isUserSender ? 'end' : 'start'}
        fontSize="x-small"
        fontWeight="400"
        isTruncated
      >
        {isUserSender ? 'Me' : senderName}
      </Text>

      <Text wordBreak="break-word" fontSize="sm">
        {message}
      </Text>

      <Text as="span" ms="auto" fontSize="xx-small" fontStyle="italic" color="gray.500">
        {formatTime(timestamp)}
      </Text>
    </Flex>
  );
};

export const ChatMessages = ({ messages }: { messages: Message[] }) => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollToBottom = () => {
      if (!messagesContainerRef.current) return;

      messagesContainerRef.current.children[messagesContainerRef.current.children.length - 1].scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    };

    scrollToBottom();
  }, [messages]);

  return (
    <Grid ref={messagesContainerRef} flex={1} gap="2" templateColumns="1fr" alignContent="end">
      {!messages?.length ? (
        <Text maxW="90%" justifySelf="end" bg="blue.600" px="3" py="1.5" rounded="lg">
          No messages have been sent, yet. Start a conversation, now! 🤗
        </Text>
      ) : (
        messages.map(message => <ChatMessage key={message.timestamp} message={message} />)
      )}
    </Grid>
  );
};
