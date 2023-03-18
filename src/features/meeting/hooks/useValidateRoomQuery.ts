import useSWR from 'swr';

import { api } from '../../../api';

interface ValidateRoomResponse {
  roomId: string;
}

export const useValidateRoomQuery = (roomID: string) => {
  const { data, error, isValidating } = useSWR<ValidateRoomResponse>(`/v2/rooms/validate/${roomID}`);

  return {
    isValidRoom: data ? data.roomId === roomID : false,
    error,
    isValidating
  };
};

export const isValidRoom = (roomID: string) =>
  api.get<ValidateRoomResponse>(`validate/${roomID}`).then(res => res.data.roomId === roomID);
