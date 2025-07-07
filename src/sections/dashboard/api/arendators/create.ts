import { useMutation, useQueryClient } from '@tanstack/react-query';

import axiosInstance from 'src/utils/axios';

import { useTranslate } from 'src/locales';

import { toast } from 'src/components/snackbar';

import type { FormSchemaType } from './formSchema';

export const createArendators = (data: FormSchemaType) =>
  axiosInstance.post('Arendators/add', data).then((res) => res.data);

export const useCreateArendators = (handleClose: () => void) => {
  const queryClient = useQueryClient();
  const { t } = useTranslate();

  return useMutation({
    mutationFn: createArendators,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['arendators'] });
      toast.success(t('successfully created'));
      handleClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
