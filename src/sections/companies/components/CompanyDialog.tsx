import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingButton } from '@mui/lab';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useTranslate } from 'src/locales';

import { Form, Field } from 'src/components/hook-form';

import { FormSchema } from './formSchema';
import { useEditCompany } from '../api/edit';
import { useCreateCompany } from '../api/create';

import type { ICompany } from '../api/getList';
import type { FormSchemaType } from './formSchema';

// ----------------------------------------------------------------------

interface ICompanyDialogProps {
  onClose: () => void;
  open: boolean;
  company: ICompany | null;
  setCompany: (company: ICompany | null) => void;
}

const defaultValue = {
  id: undefined,
  company_name: '',
};

export function CompanyDialog({ onClose, open, company, setCompany }: ICompanyDialogProps) {
  const { t } = useTranslate();
  const methods = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: defaultValue,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleClose = () => {
    onClose();
    setCompany(null);
    reset(defaultValue);
  };

  const { mutate: create, isPending: createPending } = useCreateCompany(handleClose);
  const { mutate: edit, isPending: editPending } = useEditCompany(handleClose);

  useEffect(() => {
    if (company?.id)
      reset({
        id: company.id,
        company_name: company?.name,
      });
    else reset(defaultValue);
  }, [company, reset]);

  const onSubmit = handleSubmit(async (data) => {
    if (data?.id) edit(data);
    else create(data);
  });

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('create company')}</DialogTitle>

      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Field.Text margin="dense" fullWidth name="company_name" label={t('company name')} />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="inherit">
            {t('cancel')}
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting || createPending || editPending}
          >
            {company?.id ? t('edit') : t('create')}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
