import { memo, useMemo } from 'react';
import { Grid, useBreakpointValue } from '@chakra-ui/react';
import { useMeeting } from '@videosdk.live/react-sdk';

import { ParticipantTile } from './';

const MemoedParticipantTile = memo(
  ParticipantTile,
  (prevProps, nextProps) => prevProps.participantID === nextProps.participantID
);

interface ParticipantsTilesProps {
  participantsIDs: string[];
  isPresenting: boolean;
}

export function ParticipantsGrid({ participantsIDs }: ParticipantsTilesProps) {
  const numOfParticipants = participantsIDs.length;
  const participantsPerRow = useBreakpointValue([
    numOfParticipants < 4 ? 1 : numOfParticipants < 9 ? 2 : 3,
    null,
    numOfParticipants < 5 ? 2 : numOfParticipants < 7 ? 3 : numOfParticipants < 9 ? 4 : numOfParticipants < 10 ? 3 : 4
  ])!;

  return (
    <Grid templateColumns={`repeat(${participantsPerRow}, 1fr)`} gap="4" alignContent="start">
      {participantsIDs.map(participantID => (
        <MemoedParticipantTile key={participantID} participantID={participantID} />
      ))}
    </Grid>
  );
}

const MemoedParticipantsGrid = memo(
  ParticipantsGrid,
  (prevProps, nextProps) =>
    JSON.stringify(prevProps.participantsIDs) === JSON.stringify(nextProps.participantsIDs) &&
    prevProps.isPresenting === nextProps.isPresenting
);

export const ParticipantsTiles = memo(
  ({ isPresenting }: { isPresenting: boolean }) => {
    const { participants, pinnedParticipants, activeSpeakerId, localParticipant } = useMeeting();

    const participantsIDs = useMemo(() => {
      const uniqueParticipantIds = [
        ...new Set([localParticipant.id, ...pinnedParticipants.keys(), ...participants.keys()])
      ];

      const ids = uniqueParticipantIds.slice(0, isPresenting ? 6 : 12);

      if (activeSpeakerId && !ids.includes(activeSpeakerId)) ids[ids.length - 1] = activeSpeakerId;

      return ids;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [participants, activeSpeakerId, pinnedParticipants]);

    return <MemoedParticipantsGrid participantsIDs={participantsIDs} isPresenting={isPresenting} />;
  },
  (prevProps, nextProps) => prevProps.isPresenting === nextProps.isPresenting
);
