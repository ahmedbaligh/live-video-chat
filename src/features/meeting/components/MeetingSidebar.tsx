import { useMeeting } from '@videosdk.live/react-sdk';
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Text
} from '@chakra-ui/react';

import { useMeetingAppContext } from '../../../context/MeetingAppContext';

import { ChatMessages, MessageSender } from '../../chat/components';
import type { Message } from '../../chat/types';

import { ParticipantsList } from './';

export function MeetingSidebar({ messages }: { messages: Message[] }) {
  const { participants } = useMeeting();

  const { sideBarMode, setSideBarMode } = useMeetingAppContext();

  return (
    <Drawer isOpen={!!sideBarMode} onClose={() => setSideBarMode(null)} size="sm">
      <DrawerOverlay />

      <DrawerContent gap="4" bg="gray.800" pb="2">
        <DrawerCloseButton mt="6" />

        <DrawerHeader pt="8">
          <Text fontWeight="800">{sideBarMode === 'CHAT' ? 'Chat' : `Participants (${participants.size})`}</Text>
        </DrawerHeader>

        <DrawerBody display="flex" flexDir="column" bg="gray.700" px="3" mx="5" py="6" overflowY="auto" rounded="2xl">
          {sideBarMode === 'PARTICIPANTS' && <ParticipantsList />}

          {sideBarMode === 'CHAT' && <ChatMessages messages={messages} />}
        </DrawerBody>

        <DrawerFooter>
          <MessageSender />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
