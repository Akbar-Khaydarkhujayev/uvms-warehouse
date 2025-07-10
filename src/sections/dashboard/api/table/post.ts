import { useMutation, useQueryClient } from '@tanstack/react-query';

import axiosInstance from 'src/utils/axios';

export interface IAddToTableRequest {
  arendator: string;
  arendator_id: string;
  car_number: string;
  time_slot_id: string;
  loading_dock_id: string;
}

export interface IUpdateTableRequest {
  arendator: string;
  arendator_id: string;
  car_number: string;
  time_slot_id: string;
  loading_dock_id: string;
}

export const addToTable = (data: IAddToTableRequest): Promise<any> =>
  axiosInstance.post('Table/add_to_table', data).then((res) => res.data);

export const updateTable = (id: string | number, data: IUpdateTableRequest): Promise<any> =>
  axiosInstance.put(`Table/add_to_table?=${id}`, data).then((res) => res.data);

export const useAddToTable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToTable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['table'] });
      queryClient.invalidateQueries({ queryKey: ['loads-infinite'] });
    },
  });
};

export const useUpdateTable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: IUpdateTableRequest }) =>
      updateTable(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['table'] });
      queryClient.invalidateQueries({ queryKey: ['loads-infinite'] });
    },
  });
};
