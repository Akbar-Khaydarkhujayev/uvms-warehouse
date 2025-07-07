import { useMutation, useQueryClient } from '@tanstack/react-query';

import axiosInstance from 'src/utils/axios';

import { useTranslate } from 'src/locales';

import { toast } from 'src/components/snackbar';

export const deleteArendators = (id: string) =>
  axiosInstance.delete(`Arendators/delete/${id}`).then((res) => res.data);

export const useDeleteArendators = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslate();

  return useMutation({
    mutationFn: deleteArendators,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['arendators'] });
      toast.success(t('successfully deleted'));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
