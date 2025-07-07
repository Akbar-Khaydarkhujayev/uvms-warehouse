import { useState } from 'react';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import { Paper, Button, Collapse, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { TableNoData, TableHeadCustom } from 'src/components/table';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { useDeleteCompany } from './api/delete';
import { useGetCompanies } from './api/getList';
import { CompanyDialog } from './components/CompanyDialog';
import { directions } from '../devices/components/DeviceDialog';

import type { ICompany } from './api/getList';

// ----------------------------------------------------------------------

export function CompaniesView() {
  const { t } = useTranslate();
  const companiesDialog = useBoolean();

  const [company, setCompany] = useState<ICompany | null>(null);

  const { data: companies } = useGetCompanies();
  const { mutate: deleteMutation } = useDeleteCompany();

  const tableHead = [
    { id: 'collapse' },
    { id: 'order', label: '№' },
    { id: 'name', label: t('company name') },
    { id: 'created', label: t('created at') },
    { id: '' },
  ];

  const subTableHead = [
    { id: 'order', label: '№' },
    { id: 'name', label: t('device name') },
    { id: 'username', label: t('username') },
    { id: 'password', label: t('password') },
    { id: 'created', label: t('created at') },
    { id: 'ip', label: 'IP' },
    { id: 'port', label: t('port') },
    { id: 'status', label: t('status'), align: 'center' },
    { id: 'direction', label: t('direction'), align: 'right' },
  ];

  return (
    <DashboardContent maxWidth="xl" sx={{ pb: 0, pt: 2 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          mx: 1,
        }}
      >
        <Typography variant="h4"> {t('companies')} </Typography>

        {(companies?.length ?? 0) < 6 && (
          <Button
            size="medium"
            variant="contained"
            sx={{ px: 4 }}
            onClick={companiesDialog.onTrue}
            endIcon={<Iconify icon="gridicons:add" />}
          >
            {t('create')}
          </Button>
        )}
      </Box>

      <Box
        sx={{
          minWidth: 320,
          borderRadius: 3,
          border: (theme) => `solid 2px ${theme.palette.background.neutral}`,
          overflow: 'hidden',
        }}
      >
        <Scrollbar sx={{ maxHeight: 'calc(100vh - 170px)' }}>
          <Table
            stickyHeader
            sx={{
              minWidth: 320,
              borderRadius: 2,
            }}
          >
            <TableHeadCustom headLabel={tableHead} />

            <TableBody>
              {companies?.map((item, index) => (
                <RowItem
                  key={item.id}
                  row={item}
                  order={index + 1}
                  openDialog={companiesDialog.onTrue}
                  setCompany={setCompany}
                  deleteMutation={deleteMutation}
                  subTableHead={subTableHead}
                />
              ))}

              {(!companies || companies.length === 0) && (
                <TableNoData
                  notFound
                  sx={{
                    m: -1,
                    borderRadius: 3,
                    overflow: 'hidden',
                    backgroundColor: (theme) => theme.palette.background.paper,
                    border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
                  }}
                />
              )}
            </TableBody>
          </Table>
        </Scrollbar>
      </Box>

      <CompanyDialog
        onClose={companiesDialog.onFalse}
        open={companiesDialog.value}
        company={company}
        setCompany={setCompany}
      />
    </DashboardContent>
  );
}

type RowItemProps = {
  row: ICompany;
  order: number;
  openDialog: () => void;
  setCompany: (values: ICompany) => void;
  deleteMutation: (id: string) => void;
  subTableHead: { id: string; label?: string }[];
};

function RowItem({
  row,
  order,
  openDialog,
  setCompany,
  deleteMutation,
  subTableHead,
}: RowItemProps) {
  const { t } = useTranslate();
  const popover = usePopover();
  const confirm = useBoolean();
  const collapsible = useBoolean();

  const handleEdit = () => {
    setCompany(row);
    openDialog();
    popover.onClose();
  };

  const handleDelete = () => {
    deleteMutation(row.id);
    popover.onClose();
  };

  return (
    <>
      <TableRow
        onClick={collapsible.onToggle}
        hover
        sx={{ cursor: 'pointer', userSelect: 'none', '& > *': { borderBottom: 'unset' } }}
      >
        <TableCell width={20}>
          <IconButton size="small" color={collapsible.value ? 'inherit' : 'default'}>
            <Iconify
              icon={collapsible.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
            />
          </IconButton>
        </TableCell>

        <TableCell>
          <Typography>{order}</Typography>
        </TableCell>

        <TableCell>
          <ListItemText primary={row.name} primaryTypographyProps={{ typography: 'body2' }} />
        </TableCell>

        <TableCell>{fDate(row.created_At)}</TableCell>

        <TableCell align="right" sx={{ pr: 1 }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell sx={{ py: 0 }} colSpan={6}>
          <Collapse in={collapsible.value} timeout="auto" unmountOnExit>
            <Paper
              variant="outlined"
              sx={{
                mb: 2,
                mt: 2,
                borderRadius: 1.5,
                overflow: 'hidden',
                ...(collapsible.value && { boxShadow: (theme) => theme.customShadows.z20 }),
              }}
            >
              <Table>
                <TableHeadCustom headLabel={subTableHead} />
                <TableBody>
                  {row.devices_Info?.map((device) => (
                    <TableRow>
                      <TableCell sx={{ cursor: 'pointer', color: 'text.primary.main' }}>
                        {order}
                      </TableCell>
                      <TableCell>{device.device_Name}</TableCell>
                      <TableCell>{device.userName}</TableCell>
                      <TableCell>{device.password}</TableCell>
                      <TableCell>{fDate(device.created_At)}</TableCell>
                      <TableCell>{device.ip || '-'}</TableCell>
                      <TableCell>{device.port || '-'}</TableCell>
                      <TableCell align="center">
                        {device.status}
                        <Label variant="filled" color={device.status ? 'success' : 'error'}>
                          {device.status}
                        </Label>
                      </TableCell>
                      <TableCell align="right">
                        {t(
                          directions.find((direction) => direction.value === device.direction)
                            ?.label || ''
                        )}
                      </TableCell>
                    </TableRow>
                  ))}

                  {(!row.devices_Info || row.devices_Info.length === 0) && (
                    <TableNoData
                      notFound
                      sx={{
                        m: -1,
                        py: 2,
                        borderRadius: 3,
                        overflow: 'hidden',
                        backgroundColor: (theme) => theme.palette.background.paper,
                        border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
                      }}
                    />
                  )}
                </TableBody>
              </Table>
            </Paper>
          </Collapse>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem onClick={handleEdit}>
            <Iconify icon="basil:edit-outline" />
            {t('edit')}
          </MenuItem>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <MenuItem onClick={confirm.onTrue} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            {t('delete')}
          </MenuItem>

          <ConfirmDialog
            open={confirm.value}
            onClose={confirm.onFalse}
            title={t('delete')}
            content="Are you sure you want to delete?"
            action={
              <Button variant="contained" color="error" onClick={handleDelete}>
                {t('delete')}
              </Button>
            }
          />
        </MenuList>
      </CustomPopover>
    </>
  );
}
