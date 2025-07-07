import { useMutation, useQueryClient } from '@tanstack/react-query';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';

import { toast } from 'src/components/snackbar';

interface IParams {
  device_id: string;
  user_id: string;
}

export const deleteDeviceUser = (params: IParams) =>
  axiosInstance
    .delete(endpoints.device.user.delete, {
      params,
    })
    .then((res) => res.data);

export const useDeleteDeviceUser = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslate();

  return useMutation({
    mutationFn: deleteDeviceUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['device-users'] });
      toast.success(t('successfully deleted'));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
