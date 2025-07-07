import 'yet-another-react-lightbox/styles.css';

import type { DialogProps } from '@mui/material/Dialog';

import dayjs from 'dayjs';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { Box, Stack, Avatar, Divider, Typography, IconButton } from '@mui/material';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

import type { ILog } from '../api/getList';

// ----------------------------------------------------------------------

interface IDialogProps extends DialogProps {
  images: {
    face_Image: string;
    full_Image: string;
    local_Image: string;
    exit_Face_Image?: string;
    exit_Full_Image?: string;
  };
  data: ILog | null;
}

export function LogImagesDialog({ data, images, ...props }: IDialogProps) {
  const { t } = useTranslate();
  const [fullImg, setFullImg] = useState<string | null>(null);

  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {t('log images')}
          <IconButton
            onClick={(event) => props.onClose && props.onClose(event, 'backdropClick')}
            sx={{
              color: 'error.main',
            }}
          >
            <Iconify icon="mingcute:close-fill" />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider sx={{ borderStyle: 'dashed', mb: 2 }} />

      <DialogContent>
        <Stack width={1} direction="row" spacing={2} mb={2}>
          <Stack width={1}>
            <Typography fontWeight={700}>{t('name')}:</Typography>
            <Typography textAlign="center" fontSize={20}>
              {data?.user_Name}
            </Typography>
          </Stack>
          <Stack width={1}>
            <Typography fontWeight={700}>{t('enter time')}:</Typography>
            <Typography textAlign="center" fontSize={20}>
              {dayjs(data?.the_Date).format('YYYY-MM-DD HH:mm:ss')}
            </Typography>
          </Stack>
          {images.exit_Face_Image && (
            <Stack width={1}>
              <Typography fontWeight={700}>{t('exit time')}:</Typography>
              <Typography textAlign="center" fontSize={20}>
                {data?.exit_time ? dayjs(data?.exit_time).format('YYYY-MM-DD HH:mm:ss') : ' - '}
              </Typography>
            </Stack>
          )}
        </Stack>
        <Stack
          height="300px"
          width={1}
          direction="row"
          spacing={2}
          mb={2}
          divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
        >
          <Stack width={1}>
            <Avatar
              variant="rounded"
              src={`data:image/jpeg;base64,${images.local_Image}`}
              sx={{
                width: 1,
                height: 1,
                cursor: 'pointer',
                '& img': {
                  objectFit: 'fill',
                },
              }}
            />
          </Stack>
          <Stack width={1}>
            <Avatar
              onClick={() => setFullImg(`data:image/jpeg;base64,${images.local_Image}`)}
              variant="rounded"
              src={`data:image/jpeg;base64,${images.face_Image}`}
              sx={{
                width: 1,
                height: 1,
                cursor: 'pointer',
                '& img': {
                  objectFit: 'fill',
                },
              }}
            />
          </Stack>
          {images.exit_Face_Image && (
            <Stack width={1}>
              <Avatar
                variant="rounded"
                onClick={() => setFullImg(`data:image/jpeg;base64,${images.exit_Face_Image}`)}
                src={`data:image/jpeg;base64,${images.exit_Face_Image}`}
                sx={{
                  width: 1,
                  height: 1,
                  cursor: 'pointer',
                  '& img': {
                    objectFit: 'fill',
                  },
                }}
              />
            </Stack>
          )}
        </Stack>
        <Stack
          height="300px"
          width={1}
          direction="row"
          spacing={2}
          mb={2}
          divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
        >
          <Stack width={1}>
            <Avatar
              onClick={() => setFullImg(`data:image/jpeg;base64,${images.full_Image}`)}
              variant="rounded"
              src={`data:image/jpeg;base64,${images.full_Image}`}
              sx={{
                width: 1,
                height: 1,
                cursor: 'pointer',
                '& img': {
                  objectFit: 'fill',
                },
              }}
            />
          </Stack>
          {images.exit_Full_Image && (
            <Stack width={1}>
              <Avatar
                onClick={() => setFullImg(`data:image/jpeg;base64,${images.exit_Full_Image}`)}
                variant="rounded"
                src={`data:image/jpeg;base64,${images.exit_Full_Image}`}
                sx={{
                  width: 1,
                  height: 1,
                  cursor: 'pointer',
                  '& img': {
                    objectFit: 'fill',
                  },
                }}
              />
            </Stack>
          )}
        </Stack>

        <Lightbox
          open={fullImg !== null}
          close={() => setFullImg(null)}
          slides={[{ src: fullImg || '' }]}
          render={{
            buttonPrev: () => null,
            buttonNext: () => null,
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
