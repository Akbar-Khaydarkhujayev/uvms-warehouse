import { useState } from 'react';
import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core';

import { Box, Divider } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { DragOverlayCard } from './components';
import { LoadsList } from './components/loads-list';
import { LotsTable } from './components/lots-table';
import { useDragAndDrop } from './hooks/use-drag-and-drop';

import type { ILoad } from './api/load/get';

// ----------------------------------------------------------------------

export function DashboardView() {
  const [activeLoad, setActiveLoad] = useState<ILoad | null>(null);
  const [activeSlot, setActiveSlot] = useState<any>(null);
  const { handleDragStart, handleDragEnd } = useDragAndDrop();

  return (
    <DashboardContent maxWidth="xl" sx={{ p: 2, height: 'calc(100vh - 80px)' }}>
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={(event) => {
          handleDragStart(event);
          const dragData = event.active.data.current;

          if (dragData?.from_table) {
            // Dragging from table
            setActiveSlot(dragData);
            setActiveLoad(null);
          } else {
            // Dragging from loads list
            setActiveLoad(dragData as ILoad);
            setActiveSlot(null);
          }
        }}
        onDragEnd={(event) => {
          handleDragEnd(event);
          setActiveLoad(null);
          setActiveSlot(null);
        }}
      >
        <Box
          height={1}
          width={1}
          display="grid"
          gridTemplateColumns="1fr auto 5fr"
          gap={2}
          alignItems="stretch"
          flexGrow={1}
        >
          <Box>
            <LoadsList />
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box>
            <LotsTable />
          </Box>
        </Box>

        <DragOverlay adjustScale={false} dropAnimation={null}>
          {activeLoad ? (
            <DragOverlayCard load={activeLoad} />
          ) : activeSlot ? (
            <DragOverlayCard
              load={{
                id: activeSlot.load_id || 0,
                arendator: activeSlot.arendator || '',
                arendator_id: activeSlot.arendator_id || '',
                period_start: '',
                period_stop: '',
                the_date: '',
                status: true,
              }}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </DashboardContent>
  );
}
