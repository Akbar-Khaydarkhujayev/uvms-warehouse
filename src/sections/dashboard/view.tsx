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
  const { handleDragStart, handleDragEnd } = useDragAndDrop();

  return (
    <DashboardContent maxWidth="xl" sx={{ p: 2, height: 'calc(100vh - 80px)' }}>
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={(event) => {
          handleDragStart(event);
          setActiveLoad(event.active.data.current as ILoad);
        }}
        onDragEnd={(event) => {
          handleDragEnd(event);
          setActiveLoad(null);
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
          {activeLoad ? <DragOverlayCard load={activeLoad} /> : null}
        </DragOverlay>
      </DndContext>
    </DashboardContent>
  );
}
