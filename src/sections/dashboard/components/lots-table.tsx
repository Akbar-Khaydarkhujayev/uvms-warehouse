import { useState } from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/core';

import {
  Box,
  Table,
  Paper,
  Button,
  Tooltip,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
  CircularProgress,
} from '@mui/material';

import dayjs from 'dayjs';
import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';

import { useGetTables } from '../api/table/get';
import ArendatorsDialog from './arendators-dialog';

import type { ILotSlot } from '../api/table/get';
import { DatePicker } from '@mui/x-date-pickers';

// ----------------------------------------------------------------------

interface DroppableSlotProps {
  dockId: string;
  timeSlotId: string;
  slot: ILotSlot | null;
  isSelected: boolean;
  onSlotClick: () => void;
}

function DroppableSlot({ dockId, timeSlotId, slot, isSelected, onSlotClick }: DroppableSlotProps) {
  const { isOver, setNodeRef: setDropNodeRef } = useDroppable({
    id: `slot-${dockId}-${timeSlotId}`,
    data: {
      dockId,
      timeSlotId,
      existingSlotId: slot?.id,
    },
  });

  // Make occupied slots draggable
  const {
    attributes,
    listeners,
    setNodeRef: setDragNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `table-slot-${slot?.id || `${dockId}-${timeSlotId}`}`,
    data: slot?.is_occupied
      ? {
          id: slot.id,
          arendator: slot.arendator_name || '',
          arendator_id: slot.arendator_name || '', // Use arendator_name as fallback
          car_number: '', // Default empty, would need to be fetched if needed
          load_id: slot.load_id,
          from_table: true, // Flag to identify table-to-table drags
        }
      : undefined,
    disabled: !slot?.is_occupied, // Only allow dragging if slot is occupied
  });

  // Combine refs for both draggable and droppable
  const setNodeRef = (node: HTMLElement | null) => {
    setDropNodeRef(node);
    if (slot?.is_occupied) {
      setDragNodeRef(node);
    }
  };

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

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

  const slotStyle = getSlotColor(slot?.status);

  return (
    <TableCell
      ref={setNodeRef}
      style={style}
      {...(slot?.is_occupied ? { ...attributes, ...listeners } : {})}
      align="center"
      sx={{
        cursor: slot?.is_occupied ? (isDragging ? 'grabbing' : 'grab') : 'pointer',
        position: 'relative',
        backgroundColor: isOver ? 'action.hover' : 'transparent',
        opacity: isDragging ? 0.5 : 1,
        transition: isDragging ? 'none' : 'all 0.2s',
      }}
      onClick={onSlotClick}
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
            height: 60,
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            transform: isSelected ? 'scale(1.05)' : 'scale(1)',
            boxShadow: isSelected ? 2 : 0,
            ...slotStyle,
            ...(isOver && {
              backgroundColor: 'primary.light',
              borderColor: 'primary.main',
              borderWidth: 2,
            }),
            '&:hover': {
              transform: 'scale(1.02)',
              boxShadow: 1,
            },
          }}
        >
          {slot?.is_occupied ? (
            <Typography variant="caption" fontWeight={500} noWrap>
              {slot.arendator_name}
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
}

export function LotsTable() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const arendatorsDialog = useBoolean();

  // Format date for API (YYYY-MM-DD)
  const formattedDate = selectedDate.format('DD-MM-YYYY');
  const { data, isLoading, error } = useGetTables(formattedDate);

  const getSlotStatus = (dockId: string, timeSlotId: string): ILotSlot | null =>
    data?.lot_slots.find((slot) => slot.dock_id === dockId && slot.time_slot_id === timeSlotId) ||
    null;

  const handleSlotClick = (dockId: string, timeSlotId: string) => {
    const slotKey = `${dockId}-${timeSlotId}`;
    setSelectedSlot(selectedSlot === slotKey ? null : slotKey);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <Typography color="error">Ошибка загрузки данных</Typography>
      </Box>
    );
  }

  return (
    <Box height="100%" display="flex" flexDirection="column">
      <ArendatorsDialog open={arendatorsDialog.value} onClose={arendatorsDialog.onFalse} />

      <Box display="flex" alignItems="end" justifyContent="space-between">
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Таблица доступных мест
        </Typography>
        <Box display="flex" gap={2}>
          <DatePicker
            label="Выберите дату"
            value={selectedDate}
            onChange={(newValue) => newValue && setSelectedDate(newValue)}
            format="DD.MM.YYYY"
            slotProps={{
              textField: {
                size: 'small',
                sx: { minWidth: 150 },
              },
            }}
          />
          <Button
            variant="contained"
            endIcon={<Iconify icon="solar:clipboard-list-broken" />}
            onClick={arendatorsDialog.onTrue}
          >
            Список арендаторов
          </Button>
        </Box>
      </Box>

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
          height: '100%',
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
        <Table
          stickyHeader
          sx={{
            height: '100%',
            '& .MuiTableBody-root': {
              height: '100%',
            },
          }}
        >
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

                  return (
                    <DroppableSlot
                      key={timeSlot.id}
                      dockId={dock.id}
                      timeSlotId={timeSlot.id}
                      slot={slot}
                      isSelected={isSelected}
                      onSlotClick={() => handleSlotClick(dock.id, timeSlot.id)}
                    />
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
