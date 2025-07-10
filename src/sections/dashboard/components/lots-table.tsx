import { useState } from 'react';

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Chip,
  Tooltip,
  Card,
} from '@mui/material';

import { useTranslate } from 'src/locales';
import { useGetLotsTable } from '../api/lots/get';

import type { ITimeSlot, ILoadingDock, ILotSlot } from '../types/lots';

// ----------------------------------------------------------------------

// Mock data for development since backend is not ready
const mockData = {
  time_slots: [
    { id: '1', start_time: '08:00', end_time: '09:00' },
    { id: '2', start_time: '09:00', end_time: '10:00' },
    { id: '3', start_time: '10:00', end_time: '11:00' },
    { id: '4', start_time: '11:00', end_time: '12:00' },
    { id: '5', start_time: '12:00', end_time: '13:00' },
    { id: '6', start_time: '13:00', end_time: '14:00' },
    { id: '7', start_time: '14:00', end_time: '15:00' },
    { id: '8', start_time: '15:00', end_time: '16:00' },
    { id: '9', start_time: '16:00', end_time: '17:00' },
    { id: '10', start_time: '17:00', end_time: '18:00' },
  ],
  loading_docks: [
    {
      id: '1',
      section: "1-bo'lim",
      gate: '1-qator',
      display_name: "1-bo'lim, 1-qator",
      is_active: true,
    },
    {
      id: '2',
      section: "1-bo'lim",
      gate: '2-qator',
      display_name: "1-bo'lim, 2-qator",
      is_active: true,
    },
    {
      id: '3',
      section: "1-bo'lim",
      gate: '3-qator',
      display_name: "1-bo'lim, 3-qator",
      is_active: true,
    },
    {
      id: '4',
      section: "2-bo'lim",
      gate: '1-qator',
      display_name: "2-bo'lim, 1-qator",
      is_active: true,
    },
    {
      id: '5',
      section: "2-bo'lim",
      gate: '2-qator',
      display_name: "2-bo'lim, 2-qator",
      is_active: true,
    },
    {
      id: '6',
      section: "2-bo'lim",
      gate: '3-qator',
      display_name: "2-bo'lim, 3-qator",
      is_active: true,
    },
    {
      id: '7',
      section: "2-bo'lim",
      gate: '4-qator',
      display_name: "2-bo'lim, 4-qator",
      is_active: true,
    },
    {
      id: '8',
      section: "2-bo'lim",
      gate: '5-qator',
      display_name: "2-bo'lim, 5-qator",
      is_active: true,
    },
    {
      id: '9',
      section: "3-bo'lim",
      gate: '1-qator',
      display_name: "3-bo'lim, 1-qator",
      is_active: true,
    },
    {
      id: '10',
      section: "3-bo'lim",
      gate: '2-qator',
      display_name: "3-bo'lim, 2-qator",
      is_active: true,
    },
  ],
  lot_slots: [
    // Some sample occupied slots
    {
      id: '1',
      dock_id: '2',
      time_slot_id: '3',
      is_occupied: true,
      load_id: 123,
      arendator_name: 'ООО Компания А',
      status: 'occupied' as const,
    },
    {
      id: '2',
      dock_id: '4',
      time_slot_id: '5',
      is_occupied: true,
      load_id: 124,
      arendator_name: 'ИП Иванов',
      status: 'occupied' as const,
    },
    { id: '3', dock_id: '1', time_slot_id: '7', is_occupied: false, status: 'reserved' as const },
    {
      id: '4',
      dock_id: '6',
      time_slot_id: '2',
      is_occupied: false,
      status: 'maintenance' as const,
    },
    // All other slots are available by default
  ],
};

// ----------------------------------------------------------------------

export function LotsTable() {
  const { t } = useTranslate();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // For now, using mock data. Uncomment below when backend is ready:
  // const { data, isLoading, error } = useGetLotsTable();

  // Mock data usage
  const data = mockData;
  const isLoading = false;
  const error = null;

  const getSlotStatus = (dockId: string, timeSlotId: string): ILotSlot | null => {
    return (
      data?.lot_slots.find((slot) => slot.dock_id === dockId && slot.time_slot_id === timeSlotId) ||
      null
    );
  };

  const getSlotColor = (status: string | undefined) => {
    switch (status) {
      case 'occupied':
        return {
          backgroundColor: '#ffcdd2',
          color: '#c62828',
          border: '1px solid #ef5350',
        };
      case 'reserved':
        return {
          backgroundColor: '#fff3e0',
          color: '#ef6c00',
          border: '1px solid #ff9800',
        };
      case 'maintenance':
        return {
          backgroundColor: '#f3e5f5',
          color: '#7b1fa2',
          border: '1px solid #ba68c8',
        };
      default:
        return {
          backgroundColor: '#e8f5e8',
          color: '#2e7d32',
          border: '1px solid #4caf50',
        };
    }
  };

  const handleSlotClick = (dockId: string, timeSlotId: string) => {
    const slotKey = `${dockId}-${timeSlotId}`;
    setSelectedSlot(selectedSlot === slotKey ? null : slotKey);
  };

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

  return (
    <Box height="100%" display="flex" flexDirection="column">
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Таблица доступных мест
      </Typography>

      {/* Legend */}
      <Box display="flex" gap={2} mb={2} flexWrap="wrap">
        <Box display="flex" alignItems="center" gap={0.5}>
          <Box
            width={16}
            height={16}
            sx={{ backgroundColor: '#e8f5e8', border: '1px solid #4caf50', borderRadius: 0.5 }}
          />
          <Typography variant="caption">Доступно</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={0.5}>
          <Box
            width={16}
            height={16}
            sx={{ backgroundColor: '#ffcdd2', border: '1px solid #ef5350', borderRadius: 0.5 }}
          />
          <Typography variant="caption">Занято</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={0.5}>
          <Box
            width={16}
            height={16}
            sx={{ backgroundColor: '#fff3e0', border: '1px solid #ff9800', borderRadius: 0.5 }}
          />
          <Typography variant="caption">Зарезервировано</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={0.5}>
          <Box
            width={16}
            height={16}
            sx={{ backgroundColor: '#f3e5f5', border: '1px solid #ba68c8', borderRadius: 0.5 }}
          />
          <Typography variant="caption">Обслуживание</Typography>
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          flexGrow: 1,
          maxHeight: 'calc(100vh - 300px)',
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: 8,
            height: 8,
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
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 600,
                  backgroundColor: 'background.neutral',
                  minWidth: 150,
                  position: 'sticky',
                  left: 0,
                  zIndex: 10,
                }}
              >
                Место разгрузки
              </TableCell>
              {data?.time_slots.map((timeSlot) => (
                <TableCell
                  key={timeSlot.id}
                  align="center"
                  sx={{
                    fontWeight: 600,
                    backgroundColor: 'background.neutral',
                    minWidth: 120,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {timeSlot.start_time}-{timeSlot.end_time}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.loading_docks.map((dock) => (
              <TableRow key={dock.id} hover>
                <TableCell
                  sx={{
                    fontWeight: 500,
                    position: 'sticky',
                    left: 0,
                    backgroundColor: 'background.paper',
                    zIndex: 5,
                  }}
                >
                  {dock.display_name}
                </TableCell>
                {data.time_slots.map((timeSlot) => {
                  const slot = getSlotStatus(dock.id, timeSlot.id);
                  const slotKey = `${dock.id}-${timeSlot.id}`;
                  const isSelected = selectedSlot === slotKey;
                  const slotStyle = getSlotColor(slot?.status);

                  return (
                    <TableCell
                      key={timeSlot.id}
                      align="center"
                      sx={{
                        p: 0.5,
                        cursor: 'pointer',
                        position: 'relative',
                      }}
                      onClick={() => handleSlotClick(dock.id, timeSlot.id)}
                    >
                      <Tooltip
                        title={
                          slot?.is_occupied
                            ? `Занято: ${slot.arendator_name} (Груз #${slot.load_id})`
                            : slot?.status === 'reserved'
                              ? 'Зарезервировано'
                              : slot?.status === 'maintenance'
                                ? 'Техническое обслуживание'
                                : 'Доступно для бронирования'
                        }
                        arrow
                      >
                        <Box
                          sx={{
                            width: '100%',
                            height: 40,
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s',
                            transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                            boxShadow: isSelected ? 2 : 0,
                            ...slotStyle,
                            '&:hover': {
                              transform: 'scale(1.02)',
                              boxShadow: 1,
                            },
                          }}
                        >
                          {slot?.is_occupied ? (
                            <Typography variant="caption" fontWeight={500} noWrap>
                              #{slot.load_id}
                            </Typography>
                          ) : (
                            <Typography variant="caption">
                              {slot?.status === 'reserved'
                                ? 'Рез.'
                                : slot?.status === 'maintenance'
                                  ? 'Обсл.'
                                  : '—'}
                            </Typography>
                          )}
                        </Box>
                      </Tooltip>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
