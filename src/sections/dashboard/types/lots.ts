// Data structure for the lots/time slots table

export interface ITimeSlot {
  id: string;
  start_time: string; // "08:00"
  end_time: string; // "09:00"
}

export interface ILoadingDock {
  id: string;
  section: string; // "1-bo'lim"
  gate: string; // "1-qator"
  display_name: string; // "1-bo'lim, 1-qator"
  is_active: boolean;
}

export interface ILotSlot {
  id: string;
  dock_id: string;
  time_slot_id: string;
  is_occupied: boolean;
  load_id?: number; // Reference to the load if occupied
  arendator_name?: string; // Name of the renter if occupied
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
}

export interface ILotsTableData {
  time_slots: ITimeSlot[];
  loading_docks: ILoadingDock[];
  lot_slots: ILotSlot[];
}

// Example response structure from backend:
/*
{
  "time_slots": [
    { "id": "1", "start_time": "08:00", "end_time": "09:00" },
    { "id": "2", "start_time": "09:00", "end_time": "10:00" },
    // ... more time slots
  ],
  "loading_docks": [
    { "id": "1", "section": "1-bo'lim", "gate": "1-qator", "display_name": "1-bo'lim, 1-qator", "is_active": true },
    { "id": "2", "section": "1-bo'lim", "gate": "2-qator", "display_name": "1-bo'lim, 2-qator", "is_active": true },
    // ... more docks
  ],
  "lot_slots": [
    { 
      "id": "1", 
      "dock_id": "1", 
      "time_slot_id": "1", 
      "is_occupied": false, 
      "status": "available" 
    },
    { 
      "id": "2", 
      "dock_id": "1", 
      "time_slot_id": "2", 
      "is_occupied": true, 
      "load_id": 123, 
      "arendator_name": "ООО Компания",
      "status": "occupied" 
    },
    // ... more slots
  ]
}
*/
