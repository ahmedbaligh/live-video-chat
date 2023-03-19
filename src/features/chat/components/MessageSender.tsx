import { useState } from 'react';
import { usePubSub } from '@videosdk.live/react-sdk';
import { Button, Flex, FlexProps, Input } from '@chakra-ui/react';

export const MessageSender = (props: FlexProps) => {
  const [message, setMessage] = useState('');
  const { publish } = usePubSub('CHAT');

  const onSendMessage = (e: React.FormEvent<HTMLFormElement | HTMLDivElement>) => {
    e.preventDefault();

    publish(message.trim(), { persist: true });
    setMessage('');
  };

  return (
    <Flex as="form" gap="3" onSubmit={onSendMessage} {...props}>
      <Input
        autoFocus
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
