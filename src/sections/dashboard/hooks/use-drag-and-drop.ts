import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';

import { useCallback } from 'react';

import { useAddToTable, useUpdateTable } from '../api/table/post';

export const useDragAndDrop = () => {
  const addToTableMutation = useAddToTable();
  const updateTableMutation = useUpdateTable();

  const handleDragStart = useCallback((event: DragStartEvent) => {
    // You can add any logic here when drag starts
    console.log('Drag started:', event);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;

      const loadData = active.data.current;
      const dropData = over.data.current;
      console.log('Drag ended:', dropData);

      if (!loadData || !dropData) return;

      if (dropData.existingSlotId) {
        // Update existing slot
        updateTableMutation.mutate({
          data: {
            arendator: loadData.arendator,
            arendator_id: loadData.arendator_id,
            car_number: loadData.car_number,
            loading_dock_id: dropData.dockId,
            time_slot_id: dropData.timeSlotId,
          },
          id: loadData.id,
        });
      } else {
        // Add to new slot
        addToTableMutation.mutate({
          arendator: loadData.arendator,
          arendator_id: loadData.arendator_id,
          car_number: loadData.car_number,
          loading_dock_id: dropData.dockId,
          time_slot_id: dropData.timeSlotId,
        });
      }
    },
    [addToTableMutation, updateTableMutation]
  );

  return {
    handleDragStart,
    handleDragEnd,
    isLoading: addToTableMutation.isPending || updateTableMutation.isPending,
  };
};
