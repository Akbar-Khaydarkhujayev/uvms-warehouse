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

      const dragData = active.data.current;
      const dropData = over.data.current;

      if (!dragData || !dropData) return;
      console.log('drop data:', dropData);
      console.log('Drag', dragData);
      if (dragData.from_table) {
        updateTableMutation.mutate({
          data: {
            arendator: dragData.arendator,
            arendator_id: dragData.arendator_id,
            car_number: dragData.car_number || '',
            loading_dock_id: dropData.dockId,
            time_slot_id: dropData.timeSlotId,
          },
          id: dragData.id,
        });
        return;
      }

      // This is a load from the loads list
      if (dropData.existingSlotId) {
        // Update existing slot
        updateTableMutation.mutate({
          data: {
            arendator: dragData.arendator,
            arendator_id: dragData.arendator_id,
            car_number: dragData.car_number || '',
            loading_dock_id: dropData.dockId,
            time_slot_id: dropData.timeSlotId,
          },
          id: dropData.existingSlotId,
        });
      } else {
        // Add to new slot
        addToTableMutation.mutate({
          arendator: dragData.arendator,
          arendator_id: dragData.arendator_id,
          car_number: dragData.car_number || '',
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
