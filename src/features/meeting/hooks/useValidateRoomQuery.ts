import useSWR from 'swr';

import { api } from '../../../api';

interface ValidateRoomResponse {
  roomId: string;
}

const fetcher = (url: string) => api.get<ValidateRoomResponse>(url).then(res => res.data);

export const useValidateRoomQuery = (roomID: string) => {
  const { data, ...rest } = useSWR<ValidateRoomResponse>(`v2/rooms/validate/${roomID}`, fetcher);

  return {
    isValidRoom: data?.roomId === roomID,
    ...rest
  };
};

export const isValidRoom = (roomID: string) =>
  api.get<ValidateRoomResponse>(`v2/rooms/validate/${roomID}`).then(res => res.data.roomId === roomID);
