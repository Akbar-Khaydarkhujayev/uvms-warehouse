import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingButton } from '@mui/lab';
import { MenuItem } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useTranslate } from 'src/locales';

import { Form, Field } from 'src/components/hook-form';

import { formSchema } from '../api/arendators/formSchema';
import { useEditArendators } from '../api/arendators/edit';
import { useCreateArendators } from '../api/arendators/create';

import type { IArendator } from '../api/arendators/get';
import type { FormSchemaType } from '../api/arendators/formSchema';

// ----------------------------------------------------------------------

interface IArendatorDialogProps {
  onClose: () => void;
  open: boolean;
  arendator: IArendator | null;
  setArendator: (arendator: IArendator | null) => void;
}

const defaultValue: FormSchemaType = {
  arendator: '',
  tgUserId: '',
  status: true,
  id: '',
};

export function ArendatorDialog({ onClose, open, arendator, setArendator }: IArendatorDialogProps) {
  const { t } = useTranslate();
  const methods = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleClose = () => {
    onClose();
    setArendator(null);
    reset(defaultValue);
  };

  const { mutate: create, isPending: createPending } = useCreateArendators(handleClose);
  const { mutate: edit, isPending: editPending } = useEditArendators(handleClose);

  useEffect(() => {
    if (arendator?.id)
      reset({
        id: arendator.id,
        status: arendator.status,
        tgUserId: arendator.tgUserId,
        arendator: arendator.arendator,
      });
    else reset(defaultValue);
  }, [arendator, reset]);

  const onSubmit = handleSubmit(async (data) => {
    if (data?.id) edit(data);
    else create(data);
  });

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('add arendator')}</DialogTitle>

      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Field.Text margin="dense" fullWidth name="device_Name" label={t('arendator')} />
          <Field.Text margin="normal" fullWidth name="dev_Username" label={t('tgUserId')} />
          <Field.Select margin="normal" fullWidth name="company_ID" label={t('status')}>
            <MenuItem value="true">TRUE</MenuItem>
            <MenuItem value="false">FALSE</MenuItem>
          </Field.Select>
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
            {arendator?.id ? t('edit') : t('create')}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
