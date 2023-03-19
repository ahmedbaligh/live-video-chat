import { useState } from 'react';
import { usePubSub } from '@videosdk.live/react-sdk';
import { Button, Flex, Input } from '@chakra-ui/react';

export const MessageSender = () => {
  const [message, setMessage] = useState('');
  const { publish } = usePubSub('CHAT');

  const onSendMessage = (e: React.FormEvent<HTMLFormElement | HTMLDivElement>) => {
    e.preventDefault();

    publish(message.trim(), { persist: true });
    setMessage('');
  };

  return (
    <Flex as="form" gap="2" onSubmit={onSendMessage}>
      <Input
        variant="flushed"
        placeholder="Send a message to the meeting"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />

      <Button type="submit" isDisabled={!message.length}>
        Send
      </Button>
    </Flex>
  );
};
