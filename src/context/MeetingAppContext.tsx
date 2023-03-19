import { ReactNode } from 'react';
import { useContext, createContext, useState } from 'react';

interface MeetingAppContextProps {
  meetingType: MeetingType;
  setMeetingType: React.Dispatch<React.SetStateAction<MeetingType>>;
  sideBarMode: SideBarMode;
  setSideBarMode: React.Dispatch<React.SetStateAction<SideBarMode>>;
  downstreamUrl: string | null;
  setDownstreamUrl: React.Dispatch<React.SetStateAction<string | null>>;
}

const MeetingAppContext = createContext<MeetingAppContextProps>({
  meetingType: 'MEETING',
  downstreamUrl: null,
  sideBarMode: 'PARTICIPANTS',
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
  const [sideBarMode, setSideBarMode] = useState<SideBarMode>(null);
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
