import { useMutation, useQueryClient } from '@tanstack/react-query';

import axiosInstance from 'src/utils/axios';

import { useTranslate } from 'src/locales';

import { toast } from 'src/components/snackbar';

export const deleteTable = (id: string) =>
  axiosInstance.delete(`Table/delete_table/${id}`).then((res) => res.data);

export const useDeleteTable = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslate();

  return useMutation({
    mutationFn: deleteTable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['table'] });
      toast.success(t('successfully deleted'));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
