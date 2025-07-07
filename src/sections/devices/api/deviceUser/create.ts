import { useMutation, useQueryClient } from '@tanstack/react-query';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';

import { toast } from 'src/components/snackbar';

import type { DeviceUserFormSchemaType } from '../../components/formSchema';

interface IParams {
  device_id: string;
}

export const createDeviceUser = (data: DeviceUserFormSchemaType, params: IParams) =>
  axiosInstance
    .post(endpoints.device.user.create, data, {
      params,
    })
    .then((res) => res.data);

export const useCreateDeviceUser = (handleClose: () => void) => {
  const queryClient = useQueryClient();
  const { t } = useTranslate();

  return useMutation({
    mutationFn: ({ data, params }: { data: DeviceUserFormSchemaType; params: IParams }) =>
      createDeviceUser(data, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['device-users'] });
      toast.success(t('successfully created'));
      handleClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
