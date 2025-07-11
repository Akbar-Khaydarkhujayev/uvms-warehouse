import { useMutation, useQueryClient } from '@tanstack/react-query';

import axiosInstance from 'src/utils/axios';

import { useTranslate } from 'src/locales';

import { toast } from 'src/components/snackbar';

export const editArendators = ({ id, status }: { id: string | number; status: boolean }) =>
  axiosInstance.put(`Arendators/edit/${id}`, {
    params: {
      status,
    },
  });

export const useEditArendators = (handleClose: () => void) => {
  const queryClient = useQueryClient();
  const { t } = useTranslate();

  return useMutation({
    mutationFn: editArendators,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['arendators'] });
      toast.success(t('successfully updated'));
      handleClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
