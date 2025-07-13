import type { IReqParams } from 'src/types/common';

import { useQuery } from '@tanstack/react-query';

import axiosInstance from 'src/utils/axios';

export interface ITimeSlot {
  id: string;
  start_time: string;
  end_time: string;
}

export interface ILoadingDock {
  id: string;
  section: string;
  gate: string;
  display_name: string;
  is_active: boolean;
}

export interface ILotSlot {
  id: string;
  dock_id: string;
  time_slot_id: string;
  is_occupied: boolean;
  load_id?: number;
  arendator_name?: string;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
}

export interface ITableData {
  time_slots: ITimeSlot[];
  loading_docks: ILoadingDock[];
  lot_slots: ILotSlot[];
}

export const getTable = (params?: IReqParams): Promise<ITableData> =>
  axiosInstance
    .get('Table/get_table', {
      params,
    })
    .then((res) => res.data);

export const useGetTables = (date?: string) =>
  useQuery({
    queryKey: ['table', date],
    queryFn: () => getTable(date ? { date } : undefined),
  });
