import type { IReqParams } from 'src/types/common';

import { useQuery } from '@tanstack/react-query';

import axiosInstance from 'src/utils/axios';

export interface IArendator {
  id: number;
  arendator_id: string;
  arendator: string;
  tg_user_id: number;
  status: boolean;
}

export const getArendators = (params?: IReqParams): Promise<IArendator[]> =>
  axiosInstance
    .get('Arendators/get_all', {
      params,
    })
    .then((res) => res.data);

export const useGetArendators = (params?: IReqParams) =>
  useQuery({
    queryKey: ['arendators', params],
    queryFn: () => getArendators(params),
  });
