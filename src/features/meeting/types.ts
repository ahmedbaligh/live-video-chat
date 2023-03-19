import { useMeeting } from '@videosdk.live/react-sdk';

export type MeetingReturn = ReturnType<typeof useMeeting> & {
  isMeetingJoined: boolean;
};

export type MeetingParam = Omit<Parameters<typeof useMeeting>[0], 'onEntryResponded'>;
