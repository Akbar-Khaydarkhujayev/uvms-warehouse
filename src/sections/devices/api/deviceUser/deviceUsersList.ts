import type { IPaginatedResponse } from 'src/types/default';

import { useQuery } from '@tanstack/react-query';

import axiosInstance, { endpoints } from 'src/utils/axios';

export interface IDeviceUser {
  user_index: number;
  user_ID: string;
  user_Name: string;
  valid_EndTime: string;
  valid_StartTime: string;
}

interface IParams {
  device_id: string | null;
  pageNumber: number;
  pageSize: number;
  data: string;
}

const getDeviceUsers = (params: IParams): Promise<IPaginatedResponse<IDeviceUser>> =>
  axiosInstance.get(endpoints.device.user.list, { params }).then((res) => res.data);

export const useGetDeviceUsers = (params: IParams) =>
  useQuery({
    queryKey: ['device-users', params],
    queryFn: () => getDeviceUsers(params),
    enabled: !!params.device_id,
  });
