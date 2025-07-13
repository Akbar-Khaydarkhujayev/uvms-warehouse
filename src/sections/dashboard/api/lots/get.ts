import type { IReqParams } from 'src/types/common';

import { useQuery } from '@tanstack/react-query';

import axiosInstance from 'src/utils/axios';
import { ITableData } from '../table/get';

// ----------------------------------------------------------------------

export const getLotsTable = (params?: IReqParams): Promise<ITableData> =>
  axiosInstance
    .get('lots/table', {
      params,
    })
    .then((res) => res.data);

export const useGetLotsTable = () =>
  useQuery({
    queryKey: ['lots-table'],
    queryFn: () => getLotsTable(),
  });
