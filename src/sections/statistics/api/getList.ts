import type { IPaginatedResponse } from 'src/types/default';

import { useQuery } from '@tanstack/react-query';

import axiosInstance, { endpoints } from 'src/utils/axios';

export interface ILog {
  log_id: number;
  user_Name: string;
  user_ID: string;
  the_Date: string;
  exit_time: string;
  total_Time: number;
}

interface IParams {
  pageNumber: number;
  pageSize: number;
  data: string;
  start_time: string;
  end_time: string;
}

const getLogs = (body: IParams): Promise<IPaginatedResponse<ILog>> =>
  axiosInstance.post(endpoints.report, body).then((res) => res.data);

export const useGetLogs = (params: IParams) =>
  useQuery({
    queryKey: ['logs', params],
    queryFn: () => getLogs(params),
    enabled: !!params.start_time || !!params.end_time,
  });
