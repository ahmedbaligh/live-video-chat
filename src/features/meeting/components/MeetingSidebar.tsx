import { useMeeting } from '@videosdk.live/react-sdk';
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Text
} from '@chakra-ui/react';

import { useMeetingAppContext } from '../../../context/MeetingAppContext';

import { ParticipantsList } from './';

export function MeetingSidebar() {
  const { participants } = useMeeting();

  const { sideBarMode, setSideBarMode } = useMeetingAppContext();

  if (!sideBarMode) return null;

  return (
    <Drawer isOpen={!!sideBarMode} onClose={() => setSideBarMode(null)} size="sm">
      <DrawerOverlay />

      <DrawerContent bg="gray.800">
        <DrawerCloseButton mt="6" />

        <DrawerHeader pt="8">
          <Text fontWeight="800">{sideBarMode === 'CHAT' ? 'Chat' : `Participants (${participants.size})`}</Text>
        </DrawerHeader>

        <DrawerBody overflowY="auto">{sideBarMode === 'PARTICIPANTS' && <ParticipantsList />}</DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
