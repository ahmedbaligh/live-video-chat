import { AxiosError } from 'axios';
import useSWRMutation, { SWRMutationConfiguration } from 'swr/mutation';

import { api } from '../../../api';

interface CreateMeetingResponse {
  roomId: string;
}

export const useCreateMeetingMutation = (options?: SWRMutationConfiguration<CreateMeetingResponse, AxiosError>) => {
  const { trigger, isMutating, ...rest } = useSWRMutation(
    'v2/rooms/',
    (url: string) => api.post<CreateMeetingResponse>(url).then(res => res.data),
    options
  );

  return {
    createMeeting: trigger,
    isCreatingMeeting: isMutating,
    ...rest
  };
};
