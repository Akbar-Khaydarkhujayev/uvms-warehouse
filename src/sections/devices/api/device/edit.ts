import { useMutation, useQueryClient } from '@tanstack/react-query';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';

import { toast } from 'src/components/snackbar';

import type { FormSchemaType } from '../../components/formSchema';

export const editDevice = (data: FormSchemaType) =>
  axiosInstance.put(endpoints.device.edit(data.device_id!), data);

export const useEditDevice = (handleClose: () => void) => {
  const queryClient = useQueryClient();
  const { t } = useTranslate();

  return useMutation({
    mutationFn: editDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['device'] });
      toast.success(t('successfully updated'));
      handleClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
