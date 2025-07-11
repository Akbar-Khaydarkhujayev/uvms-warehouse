import type { DialogProps } from '@mui/material';

import React, { useState, useEffect } from 'react';

import {
  Box,
  Chip,
  Paper,
  Stack,
  Table,
  Avatar,
  Button,
  Dialog,
  Tooltip,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  Pagination,
  Typography,
  DialogTitle,
  DialogContent,
  TableContainer,
  CircularProgress,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { useGetArendators } from '../api/arendators/get';
import { useDeleteArendators } from '../api/arendators/delete';
import { useEditArendators } from '../api/arendators/editStatus';

import type { IArendator } from '../api/arendators/get';

// ----------------------------------------------------------------------

interface ArendatorsDialogProps extends DialogProps {
  onClose: () => void;
}

export default function ArendatorsDialog({ onClose, ...other }: ArendatorsDialogProps) {
  const [page, setPage] = useState(1);
  const [selectedArendator, setSelectedArendator] = useState<IArendator | null>(null);
  const pageSize = 10;

  const confirm = useBoolean();

  const { data: allArendators, isLoading } = useGetArendators({
    status: false,
  });
  console.log(allArendators);
  const editMutation = useEditArendators();
  const deleteMutation = useDeleteArendators();

  const totalCount = allArendators?.length || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const arendators = allArendators?.slice(startIndex, endIndex) || [];

  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(1);
    }
  }, [page, totalPages]);

  const handleAccept = (arendator: IArendator) => {
    editMutation.mutate({
      id: arendator.id,
      status: true,
    });
  };

  const handleDecline = (arendator: IArendator) => {
    editMutation.mutate({
      id: arendator.id,
      status: false,
    });
  };

  const handleDelete = (arendator: IArendator) => {
    setSelectedArendator(arendator);
    confirm.onTrue();
  };

  const handleConfirmDelete = () => {
    if (selectedArendator) {
      deleteMutation.mutate(selectedArendator.id.toString());
      setSelectedArendator(null);
      confirm.onFalse();
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <>
      <Dialog fullWidth maxWidth="md" {...other} onClose={onClose}>
        <DialogTitle sx={{ p: 3, pb: 2 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Iconify icon="solar:users-group-two-rounded-bold" width={24} />
            <Typography variant="h6">Управление арендаторами</Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ px: 3, pb: 3 }}>
          <Box sx={{ height: 600 }}>
            {isLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
              </Box>
            ) : (
              <>
                <TableContainer
                  component={Paper}
                  sx={{
                    flexGrow: 1,
                    height: 'calc(100% - 80px)',
                    mb: 2,
                  }}
                >
                  <Scrollbar>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Арендатор</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Telegram ID</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Статус</TableCell>
                          <TableCell sx={{ fontWeight: 600 }} align="right">
                            Действия
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {arendators?.map((arendator) => (
                          <TableRow key={arendator.id} hover>
                            <TableCell>
                              <Box display="flex" alignItems="center" gap={2}>
                                <Avatar
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    bgcolor: 'primary.main',
                                    fontSize: 14,
                                    fontWeight: 600,
                                  }}
                                >
                                  {arendator.arendator
                                    .split(' ')
                                    .map((name) => name[0])
                                    .join('')
                                    .toUpperCase()}
                                </Avatar>
                                <Box>
                                  <Typography variant="body2" fontWeight={500}>
                                    {arendator.arendator}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    ID: {arendator.arendator_id}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontFamily="monospace">
                                #{arendator.id}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontFamily="monospace">
                                {arendator.tg_user_id}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={arendator.status ? 'Принят' : 'Ожидает'}
                                color={arendator.status ? 'success' : 'warning'}
                                size="small"
                                variant="soft"
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <Tooltip title="Принять">
                                  <IconButton
                                    size="small"
                                    color="success"
                                    onClick={() => handleAccept(arendator)}
                                    disabled={editMutation.isPending}
                                  >
                                    <Iconify icon="solar:check-circle-bold" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Отклонить">
                                  <IconButton
                                    size="small"
                                    color="warning"
                                    onClick={() => handleDecline(arendator)}
                                    disabled={editMutation.isPending}
                                  >
                                    <Iconify icon="solar:close-circle-bold" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Удалить">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleDelete(arendator)}
                                    disabled={deleteMutation.isPending}
                                  >
                                    <Iconify icon="solar:trash-bin-trash-bold" />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))}
                        {arendators?.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                              <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                gap={2}
                              >
                                <Iconify
                                  icon="solar:users-group-two-rounded-bold"
                                  width={64}
                                  sx={{ color: 'text.disabled' }}
                                />
                                <Typography variant="h6" color="text.secondary">
                                  Нет арендаторов для обработки
                                </Typography>
                                <Typography variant="body2" color="text.disabled">
                                  Все заявки обработаны
                                </Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </Scrollbar>
                </TableContainer>

                {totalPages > 1 && (
                  <Box display="flex" justifyContent="center" mt={2}>
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                      size="medium"
                    />
                  </Box>
                )}

                <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
                  <Button variant="outlined" onClick={onClose}>
                    Закрыть
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Удалить арендатора"
        content={
          <Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Вы уверены, что хотите удалить арендатора?
            </Typography>
            {selectedArendator && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'background.neutral',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="body2" fontWeight={500}>
                  {selectedArendator.arendator}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ID: {selectedArendator.arendator_id}
                </Typography>
              </Box>
            )}
          </Box>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            disabled={deleteMutation.isPending}
            startIcon={
              deleteMutation.isPending ? (
                <CircularProgress size={16} />
              ) : (
                <Iconify icon="solar:trash-bin-trash-bold" />
              )
            }
          >
            Удалить
          </Button>
        }
      />
    </>
  );
}
