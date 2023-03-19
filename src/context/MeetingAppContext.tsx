import { ReactNode } from 'react';
import { useContext, createContext, useState } from 'react';

interface MeetingAppContextProps {
  meetingType: MeetingType;
  downstreamUrl: string | null;
  sideBarMode: string | null;
  setMeetingType: (meetingType: MeetingType) => void;
  setDownstreamUrl: (downstreamUrl: string) => void;
  setSideBarMode: (sideBarMode: string | null) => void;
}

const MeetingAppContext = createContext<MeetingAppContextProps>({
  meetingType: 'MEETING',
  downstreamUrl: null,
  sideBarMode: null,
  setMeetingType: () => {},
  setDownstreamUrl: () => {},
  setSideBarMode: () => {}
});

export const useMeetingAppContext = () => useContext(MeetingAppContext);

interface MeetingAppProviderProps {
  children: ReactNode;
}

export const MeetingAppProvider = ({ children }: MeetingAppProviderProps) => {
  const [meetingType, setMeetingType] = useState<MeetingType>('MEETING');
  const [sideBarMode, setSideBarMode] = useState<string | null>(null);
  const [downstreamUrl, setDownstreamUrl] = useState<string | null>(null);

  const sharedObj = {
    meetingType,
    downstreamUrl,
    sideBarMode,
    setMeetingType,
    setDownstreamUrl,
    setSideBarMode
  };

  return <MeetingAppContext.Provider value={sharedObj}>{children}</MeetingAppContext.Provider>;
};
