import type { IReqParams } from 'src/types/common';

import { useQuery } from '@tanstack/react-query';

import axiosInstance from 'src/utils/axios';

export interface ITable {
  birthday: string;
  lastName: string;
  firstName: string;
  middleName: string;
  image: string;
  registeredStreet: string;
  address: string;
}

export const getTable = (params?: IReqParams): Promise<ITable[]> =>
  axiosInstance
    .get('Table/get_table', {
      params,
    })
    .then((res) => res.data.result);

export const useGetTables = () =>
  useQuery({
    queryKey: ['table'],
    queryFn: () => getTable(),
  });
