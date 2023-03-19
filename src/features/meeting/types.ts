import { useMeeting } from '@videosdk.live/react-sdk';

export type MeetingReturn = ReturnType<typeof useMeeting> & {
  isMeetingJoined: boolean;
  hlsState: string;
};

export type MeetingParam = Omit<Parameters<typeof useMeeting>[0], 'onEntryResponded'>;
