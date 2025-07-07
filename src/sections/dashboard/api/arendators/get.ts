import type { IReqParams } from 'src/types/common';

import { useQuery } from '@tanstack/react-query';

import axiosInstance from 'src/utils/axios';

export interface IArendator {
  birthday: string;
  lastName: string;
  firstName: string;
  middleName: string;
  image: string;
  registeredStreet: string;
  address: string;
}

export const getArendators = (params?: IReqParams): Promise<IArendator[]> =>
  axiosInstance
    .get('Arendators/get_all', {
      params,
    })
    .then((res) => res.data.result);

export const useGetArendators = () =>
  useQuery({
    queryKey: ['arendators'],
    queryFn: () => getArendators(),
  });
