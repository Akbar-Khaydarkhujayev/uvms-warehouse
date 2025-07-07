import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Stack, Avatar, Button, TextField, Pagination, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import { useDebounce } from 'src/hooks/use-debounce';

import { fDate, fDateTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { TableNoData, TableHeadCustom } from 'src/components/table';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { getImage } from './api/getImage';
import { useGetDevices } from './api/device/getList';
import { useDeleteDevice } from './api/device/delete';
import { useDeleteDeviceUser } from './api/deviceUser/delete';
import { DeviceUsersDialog } from './components/DeviceUsersDialog';
import { directions, DeviceDialog } from './components/DeviceDialog';
import { useGetDeviceUsers } from './api/deviceUser/deviceUsersList';

import type { IDevice } from './api/device/getList';
import type { IDeviceUser } from './api/deviceUser/deviceUsersList';

// ----------------------------------------------------------------------

export function DevicesView() {
  const { t } = useTranslate();
  const deviceDialog = useBoolean();
  const deviceUserDialog = useBoolean();

  const [device, setDevice] = useState<IDevice | null>(null);
  const [devicePage, setDevicePage] = useState(1);
  const [devicePageSize] = useState(15);
  const [deviceSearch, setDeviceSearch] = useState<string>('');

  const [deviceUser, setDeviceUser] = useState<IDeviceUser | null>(null);
  const [userPage, setUserPage] = useState(1);
  const [userPageSize] = useState(15);
  const [userSearch, setUserSearch] = useState<string>('');

  const deviceDebouncedQuery = useDebounce(deviceSearch, 300);

  const userDebouncedQuery = useDebounce(userSearch, 300);

  const { data: devices } = useGetDevices({
    pageNumber: devicePage,
    pageSize: devicePageSize,
    data: deviceDebouncedQuery,
  });

  const [deviceId, setDeviceId] = useState<string | null>(null);

  const { data: deviceUsers } = useGetDeviceUsers({
    device_id: deviceId,
    pageNumber: userPage,
    pageSize: userPageSize,
    data: userDebouncedQuery,
  });

  useEffect(() => {
    if (devices) setDeviceId(devices.data[0]?.device_ID || null);
  }, [devices]);

  const { mutate: deleteMutation } = useDeleteDevice();
  const { mutate: deleteUserMutation } = useDeleteDeviceUser();

  const deviceHeadLabel = [
    { id: 'order', label: '№' },
    { id: 'name', label: t('device name') },
    { id: 'username', label: t('username') },
    { id: 'password', label: t('password') },
    { id: 'created', label: t('created at') },
    { id: 'ip', label: 'IP' },
    { id: 'port', label: t('port') },
    { id: 'status', label: t('status'), align: 'center' },
    { id: 'direction', label: t('direction'), align: 'right' },
    { id: '' },
  ];

  const usersHeadLabel = [
    { id: 'avatar' },
    { id: 'username', label: t('username') },
    { id: 'enter', label: t('allowed enter time') },
    { id: 'exit', label: t('allowed exit time') },
    { id: '' },
  ];

  return (
    <DashboardContent maxWidth="xl" sx={{ pb: 0, pt: 2 }}>
      <Stack
        spacing={1}
        display="flex"
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
      >
        <Box width="55%">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
              mx: 1,
            }}
          >
            <Typography variant="h4"> {t('devices')} </Typography>

            <Box display="flex" gap={2}>
              <TextField
                placeholder={t('search')}
                value={deviceSearch}
                onChange={(e) => setDeviceSearch(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                size="medium"
                variant="contained"
                sx={{ px: 4 }}
                onClick={deviceDialog.onTrue}
                endIcon={<Iconify icon="gridicons:add" />}
              >
                {t('create')}
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              width: 1,
              borderRadius: 3,
              border: (theme) => `solid 2px ${theme.palette.background.neutral}`,
              overflow: 'hidden',
            }}
          >
            <Scrollbar sx={{ height: 'calc(100vh - 290px)', maxHeight: 'calc(100vh - 290px)' }}>
              <Table
                stickyHeader
                sx={{
                  borderRadius: 2,
                }}
              >
                <TableHeadCustom headLabel={deviceHeadLabel} />

                <TableBody>
                  {devices?.data.map((item, index) => (
                    <DeviceRowItem
                      key={item.id}
                      row={item}
                      order={index + 1}
                      deviceId={deviceId}
                      setDevice={setDevice}
                      deleteMutation={deleteMutation}
                      setDeviceId={setDeviceId}
                      openDeviceDialog={deviceDialog.onTrue}
                    />
                  ))}

                  {(!devices || devices.data.length === 0) && (
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

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                borderTop: (theme) => `solid 2px ${theme.palette.background.neutral}`,
                bgcolor: 'background.neutral',
              }}
            >
              <Pagination
                shape="circular"
                page={devicePage}
                onChange={(_e, value) => setDevicePage(value)}
                count={devices?.pageCount || 1}
                variant="text"
                sx={{
                  my: 1.5,
                }}
              />
            </Box>
          </Box>
        </Box>
        <Box width="45%">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
              mx: 1,
            }}
          >
            <Typography variant="h4"> {t('device users')} </Typography>

            <Box display="flex" gap={2}>
              <TextField
                placeholder={t('search')}
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                size="medium"
                variant="contained"
                sx={{ px: 4 }}
                onClick={deviceUserDialog.onTrue}
                endIcon={<Iconify icon="gridicons:add" />}
              >
                {t('create')}
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              width: 1,
              borderRadius: 3,
              border: (theme) => `solid 2px ${theme.palette.background.neutral}`,
              overflow: 'hidden',
            }}
          >
            <Scrollbar sx={{ height: 'calc(100vh - 290px)', maxHeight: 'calc(100vh - 290px)' }}>
              <Table
                stickyHeader
                sx={{
                  minWidth: 320,
                  borderRadius: 2,
                }}
              >
                <TableHeadCustom headLabel={usersHeadLabel} />

                <TableBody>
                  {deviceUsers?.data?.map((item, index) => (
                    <UserRowItem
                      key={index}
                      row={item}
                      setDeviceUser={setDeviceUser}
                      openDeviceUserDialog={deviceUserDialog.onTrue}
                      deleteUserMutation={() =>
                        deleteUserMutation({ device_id: deviceId!, user_id: item.user_ID })
                      }
                    />
                  ))}

                  {(!deviceUsers || deviceUsers?.data?.length === 0) && (
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

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                borderTop: (theme) => `solid 2px ${theme.palette.background.neutral}`,
                bgcolor: 'background.neutral',
              }}
            >
              <Pagination
                shape="circular"
                page={userPage}
                onChange={(_e, value) => setUserPage(value)}
                count={deviceUsers?.pageCount || 1}
                variant="text"
                sx={{
                  my: 1.5,
                }}
              />
            </Box>
          </Box>
        </Box>
      </Stack>

      <DeviceDialog
        onClose={deviceDialog.onFalse}
        open={deviceDialog.value}
        device={device}
        setDevice={setDevice}
      />

      <DeviceUsersDialog
        onClose={deviceUserDialog.onFalse}
        open={deviceUserDialog.value && !!deviceId}
        deviceUser={deviceUser}
        device_id={deviceId!}
        setDeviceUser={setDeviceUser}
      />
    </DashboardContent>
  );
}

type DeviceRowItemProps = {
  row: IDevice;
  order: number;
  deviceId: string | null;
  setDevice: (values: IDevice) => void;
  deleteMutation: (id: string) => void;
  setDeviceId: (id: string) => void;
  openDeviceDialog: () => void;
};

function DeviceRowItem({
  row,
  order,
  deviceId,
  setDevice,
  deleteMutation,
  setDeviceId,
  openDeviceDialog,
}: DeviceRowItemProps) {
  const { t } = useTranslate();
  const popover = usePopover();
  const confirm = useBoolean();

  const handleEdit = () => {
    setDevice(row);
    openDeviceDialog();
    popover.onClose();
  };

  const handleDelete = () => {
    deleteMutation(row.device_ID);
    popover.onClose();
  };

  return (
    <>
      <TableRow
        hover={row.device_ID !== deviceId}
        sx={{
          cursor: 'pointer',
          backgroundColor: row.device_ID === deviceId ? 'primary.darker' : 'inherit',
        }}
        onClick={() => setDeviceId(row.device_ID)}
      >
        <TableCell sx={{ cursor: 'pointer', color: 'text.primary.main' }}>{order}</TableCell>
        <TableCell>{row.device_Name}</TableCell>
        <TableCell>{row.userName}</TableCell>
        <TableCell>{row.password}</TableCell>
        <TableCell>{fDate(row.created_At)}</TableCell>
        <TableCell>{row.ip || '-'}</TableCell>
        <TableCell>{row.port || '-'}</TableCell>
        <TableCell align="center">
          {row.status}
          <Label variant="filled" color={row.status ? 'success' : 'error'}>
            {row.status}
          </Label>
        </TableCell>
        <TableCell align="right">
          {t(directions.find((direction) => direction.value === row.direction)?.label || '')}
        </TableCell>
        <TableCell align="right" sx={{ pr: 1 }}>
          <IconButton
            color={popover.open ? 'inherit' : 'default'}
            onClick={(event) => {
              event.stopPropagation();
              popover.onOpen(event);
            }}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
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

type UserRowItemProps = {
  row: IDeviceUser;
  setDeviceUser: (user: IDeviceUser) => void;
  openDeviceUserDialog: () => void;
  deleteUserMutation: () => void;
};

function UserRowItem({
  row,
  setDeviceUser,
  openDeviceUserDialog,
  deleteUserMutation,
}: UserRowItemProps) {
  const { t } = useTranslate();
  const popover = usePopover();
  const confirm = useBoolean();
  const [image, setImage] = useState<string>('');

  const handleEdit = () => {
    popover.onClose();
    setDeviceUser(row);
    openDeviceUserDialog();
  };

  const handleDelete = () => {
    popover.onClose();
    deleteUserMutation();
  };

  useEffect(() => {
    getImage(row.user_index).then((img) => {
      if (img) setImage(img);
    });
  }, [row.user_index]);

  return (
    <>
      <TableRow>
        <TableCell>
          <Avatar src={image} sx={{ width: 36, height: 36 }} />
        </TableCell>

        <TableCell>{row.user_Name}</TableCell>

        <TableCell>{fDateTime(row.valid_StartTime)}</TableCell>

        <TableCell>{fDateTime(row.valid_EndTime)}</TableCell>

        <TableCell align="right" sx={{ pr: 1 }}>
          <IconButton
            color={popover.open ? 'inherit' : 'default'}
            onClick={(event) => {
              event.stopPropagation();
              popover.onOpen(event);
            }}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
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
