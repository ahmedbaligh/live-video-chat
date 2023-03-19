import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { GetParticipantDetails, InvalidMeeting } from '../features/meeting/components';
import { useValidateRoomQuery } from '../features/meeting/hooks';

import { Loader } from '../components';

export function Room() {
  const roomID = useParams().roomID as string;
  const [participantName, setParticipantName] = useState('');

  const { isValidRoom, isLoading } = useValidateRoomQuery(roomID);

  if (isLoading) return <Loader />;

  if (!isValidRoom) return <InvalidMeeting flex={1} />;

  if (!participantName)
    return (
      <GetParticipantDetails
        participantName={participantName}
        setParticipantName={setParticipantName}
        meetingID={roomID}
        flex={1}
      />
    );

  return <></>;
}
