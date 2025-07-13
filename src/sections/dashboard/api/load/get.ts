import type { IReqParams } from 'src/types/common';

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';

import axiosInstance from 'src/utils/axios';

export interface ILoad {
  id: number;
  arendator_id: string;
  arendator: string;
  the_date: string;
  period_start: string;
  period_stop: string;
  status: boolean;
}

export interface ILoadResponse {
  data: ILoad[];
  current_page: number;
  total_count: number;
  total_pages: number;
}

export const getLoads = (params?: IReqParams): Promise<ILoadResponse> =>
  axiosInstance
    .get('RequestUnloading/get_all', {
      params,
    })
    .then((res) => res.data);

export const useGetLoads = () =>
  useQuery({
    queryKey: ['loads'],
    queryFn: () => getLoads(),
  });

export const useGetLoadsInfinite = () =>
  useInfiniteQuery({
    queryKey: ['loads-infinite'],
    queryFn: ({ pageParam = 1 }) => getLoads({ page: pageParam, set_status: false }),
    getNextPageParam: (lastPage) => {
      const { current_page, total_pages } = lastPage;
      return current_page < total_pages ? current_page + 1 : undefined;
    },
    initialPageParam: 1,
    refetchInterval: 3000,
  });
