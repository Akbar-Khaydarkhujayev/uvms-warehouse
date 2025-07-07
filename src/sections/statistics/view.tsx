import dayjs from 'dayjs';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import { DatePicker } from '@mui/x-date-pickers';
import Typography from '@mui/material/Typography';
import {
  Table,
  Avatar,
  Button,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Pagination,
  InputAdornment,
} from '@mui/material';

import { useDebounce } from 'src/hooks/use-debounce';
import { useDownloadFile } from 'src/hooks/use-download';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData, TableHeadCustom } from 'src/components/table';
import { useDateRangePicker, CustomDateRangePicker } from 'src/components/custom-date-range-picker';

import { getImage } from './api/getImage';
import { useGetLogs } from './api/getList';
import { LogImagesDialog } from './components/LogImagesDialog';

import type { ILog } from './api/getList';

// ----------------------------------------------------------------------

interface ILogImages {
  face_Image: string;
  full_Image: string;
  local_Image: string;
  exit_Face_Image?: string;
  exit_Full_Image?: string;
}

export function StatisticsView() {
  const { t } = useTranslate();

  const [page, setPage] = useState(1);
  const [pageSize] = useState(15);
  const [search, setSearch] = useState<string>('');
  const [date, setDate] = useState(dayjs());
  const [images, setImages] = useState<ILogImages | null>(null);
  const [log, setLog] = useState<ILog | null>(null);

  const debouncedQuery = useDebounce(search, 300);

  const rangeCalendarPicker = useDateRangePicker(null, dayjs(new Date()));

  const { handleDownload } = useDownloadFile();

  const { data } = useGetLogs({
    pageNumber: page,
    pageSize,
    data: debouncedQuery,
    start_time: date.startOf('day').format('YYYY-MM-DDTHH:mm:ss'),
    end_time: date.endOf('day').format('YYYY-MM-DDTHH:mm:ss'),
  });
  console.log(data);
  const headLabel = [
    { id: 'img', label: '' },
    { id: 'id', label: 'ID' },
    { id: 'name', label: t('name') },
    { id: 'enter', label: t('enter') },
    { id: 'exit', label: t('exit') },
    { id: 'mins', label: t('total time') },
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
          pt: 0,
        }}
      >
        <Typography variant="h4"> {t('logs')} </Typography>

        <Box display="flex" gap={2}>
          <Button variant="contained" onClick={rangeCalendarPicker.onOpen}>
            {t('download excel')}
          </Button>
          <DatePicker
            label={t('date')}
            value={date}
            onChange={(newValue) => setDate(newValue ?? dayjs())}
            sx={{
              '& .MuiInputBase-root': {
                height: 40,
              },
            }}
          />
          <TextField
            size="small"
            placeholder={t('search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
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
        <Scrollbar sx={{ height: 'calc(100vh - 310px)', maxHeight: 'calc(100vh - 310px)' }}>
          <Table
            stickyHeader
            sx={{
              minWidth: 320,
              borderRadius: 2,
            }}
          >
            <TableHeadCustom headLabel={headLabel} />

            <TableBody>
              {data?.data?.map((item, index) => (
                <RowItem key={index} setData={setLog} row={item} setImages={setImages} />
              ))}

              {(!data || data?.data?.length === 0) && (
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
            page={page}
            onChange={(_e, value) => setPage(value)}
            count={data?.pageCount || 1}
            variant="text"
            sx={{
              my: 1.5,
            }}
          />
        </Box>
      </Box>

      {!!images && !!data && (
        <LogImagesDialog
          data={log}
          images={images}
          open={!!images}
          onClose={() => setImages(null)}
        />
      )}

      <CustomDateRangePicker
        variant="calendar"
        title={t('select date range')}
        onApply={() => {
          handleDownload('Files/report_excel', {
            start_time: rangeCalendarPicker.startDate
              ? rangeCalendarPicker.startDate.format('YYYY-MM-DDTHH:mm:ss')
              : '',
            end_time: rangeCalendarPicker.endDate
              ? rangeCalendarPicker.endDate.format('YYYY-MM-DDTHH:mm:ss')
              : '',
          });
        }}
        open={rangeCalendarPicker.open}
        startDate={rangeCalendarPicker.startDate}
        endDate={rangeCalendarPicker.endDate}
        onChangeStartDate={rangeCalendarPicker.onChangeStartDate}
        onChangeEndDate={rangeCalendarPicker.onChangeEndDate}
        onClose={rangeCalendarPicker.onClose}
        error={rangeCalendarPicker.error}
      />
    </DashboardContent>
  );
}

type RowItemProps = {
  row: ILog;
  setImages: (images: ILogImages | null) => void;
  setData: (data: ILog) => void;
};

function RowItem({ row, setData, setImages }: RowItemProps) {
  const [image, setImage] = useState<ILogImages | null>(null);

  useEffect(() => {
    getImage(row.log_id).then((imgs) => {
      if (imgs) setImage(imgs);
    });
  }, [row.log_id]);

  return (
    <TableRow
      hover
      sx={{ cursor: 'pointer' }}
      onClick={() => {
        setImages(image);
        setData(row);
      }}
    >
      <TableCell>
        <Avatar
          src={`data:image/jpeg;base64,${image?.face_Image}`}
          sx={{ width: 36, height: 36 }}
        />
      </TableCell>

      <TableCell>{row.user_ID}</TableCell>

      <TableCell>{row.user_Name}</TableCell>

      <TableCell>{dayjs(row?.the_Date).format('YYYY-MM-DD HH:mm:ss')}</TableCell>

      <TableCell>
        {row.exit_time ? dayjs(row?.exit_time).format('YYYY-MM-DD HH:mm:ss') : ' - '}
      </TableCell>

      <TableCell>{row.total_Time ?? ' - '}</TableCell>
    </TableRow>
  );
}
