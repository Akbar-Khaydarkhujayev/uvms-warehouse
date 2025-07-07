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

import { formSchema } from '../api/table/formSchema';
import { useCreateTable } from '../api/table/create';

import type { FormSchemaType } from '../api/table/formSchema';

// ----------------------------------------------------------------------

interface ITableDialogProps {
  onClose: () => void;
  open: boolean;
}

const defaultValue: FormSchemaType = {
  arendator: '',
  tgUserId: '',
  status: true,
  id: '',
};

export function TableDialog({ onClose, open }: ITableDialogProps) {
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
    reset(defaultValue);
  };

  const { mutate: create, isPending: createPending } = useCreateTable(handleClose);

  const onSubmit = handleSubmit(async (data) => {
    create(data);
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
          <LoadingButton type="submit" variant="contained" loading={isSubmitting || createPending}>
            {t('create')}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
