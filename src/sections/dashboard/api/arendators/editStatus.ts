import { useMutation, useQueryClient } from '@tanstack/react-query';

import axiosInstance from 'src/utils/axios';

import { toast } from 'src/components/snackbar';

export const editArendators = ({ id, status }: { id: string | number; status: boolean }) =>
  axiosInstance.put(`Arendators/edit/status/${id}?status=${status}`);

export const useEditArendators = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editArendators,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['arendators'] });
      toast.success('Успешно изменено');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
