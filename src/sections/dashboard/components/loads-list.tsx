import { useState, useCallback, useEffect } from 'react';

import {
  Box,
  Paper,
  Chip,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Stack,
  Divider,
} from '@mui/material';

import { useTranslate } from 'src/locales';
import { useGetLoadsInfinite } from '../api/load/get';
import { fDate, fTime } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export function LoadsList() {
  const { t } = useTranslate();
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } =
    useGetLoadsInfinite();

  const handleScroll = useCallback(() => {
    if (!containerRef || !hasNextPage || isFetchingNextPage) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

    if (isNearBottom) {
      fetchNextPage();
    }
  }, [containerRef, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (!containerRef) return;

    containerRef.addEventListener('scroll', handleScroll);
    return () => containerRef.removeEventListener('scroll', handleScroll);
  }, [containerRef, handleScroll]);

  const allLoads = data?.pages.flatMap((page) => page.data) ?? [];

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={400}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={400}>
        <Typography color="error">Ошибка загрузки данных</Typography>
      </Box>
    );
  }
  if (!isLoading && allLoads.length === 0) {
    return (
      <Box height="100%" display="flex" flexDirection="column">
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Входящие грузы (0)
        </Typography>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height={400}
          sx={{ backgroundColor: 'background.neutral', borderRadius: 1 }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Грузы не найдены
          </Typography>
          <Typography variant="body2" color="text.secondary">
            В настоящее время нет входящих грузов для отображения.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box height="100%" display="flex" flexDirection="column">
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Входящие грузы ({data?.pages[0]?.total_count || 0})
      </Typography>

      <Box
        ref={setContainerRef}
        sx={{
          flexGrow: 1,
          maxHeight: 'calc(100vh - 200px)',
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: 8,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(0,0,0,0.1)',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.3)',
            borderRadius: 4,
          },
        }}
      >
        <Stack spacing={1.5}>
          {allLoads.map((load) => (
            <Card
              key={load.id}
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2,
                },
              }}
            >
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                  <Typography variant="subtitle2" color="primary.main" fontWeight={600}>
                    Груз #{load.id}
                  </Typography>
                  <Chip
                    size="small"
                    label={load.status ? 'Активный' : 'Неактивный'}
                    color={load.status ? 'success' : 'default'}
                    variant={load.status ? 'filled' : 'outlined'}
                    sx={{ minWidth: 60 }}
                  />
                </Box>
                <Typography variant="body2" fontWeight={500} gutterBottom>
                  {load.arendator}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  ID Арендатора: {load.arendator_id}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Дата
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {fDate(load.the_date)}
                    </Typography>
                  </Box>
                  <Box textAlign="right">
                    <Typography variant="caption" color="text.secondary" display="block">
                      Временной период
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {fTime(load.period_start)} - {fTime(load.period_stop)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
          {isFetchingNextPage && (
            <Box display="flex" alignItems="center" justifyContent="center" py={2}>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Загрузка дополнительных грузов...
              </Typography>
            </Box>
          )}
          {!hasNextPage && allLoads.length > 0 && (
            <Box display="flex" justifyContent="center" py={2}>
              <Typography variant="body2" color="text.secondary">
                Больше нет грузов для загрузки
              </Typography>
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
