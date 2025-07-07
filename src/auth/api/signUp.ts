import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import axiosInstance from 'src/utils/axios';

import type { SignUpSchemaType } from '../view/jwt';

const signUp = (data: SignUpSchemaType) =>
  axiosInstance.post('User/register', data).then((res) => res.data);

export const useSignUp = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company'] });
      toast.success(t('successfully registered'));
      navigate('/auth/jwt/sign-in');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
