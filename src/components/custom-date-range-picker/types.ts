import type { IDatePickerControl } from 'src/types/common';

// ----------------------------------------------------------------------

export type UseDateRangePickerReturn = {
  startDate: IDatePickerControl;
  endDate: IDatePickerControl;
  onChangeStartDate: (newValue: IDatePickerControl) => void;
  onChangeEndDate: (newValue: IDatePickerControl) => void;
  //
  open: boolean;
  onApply?: () => void;
  onOpen?: () => void;
  onClose: () => void;
  onReset?: () => void;
  //
  selected?: boolean;
  error?: boolean;
  //
  label?: string;
  shortLabel?: string;
  //
  title?: string;
  variant?: 'calendar' | 'input';
  //
  setStartDate?: React.Dispatch<React.SetStateAction<IDatePickerControl>>;
  setEndDate?: React.Dispatch<React.SetStateAction<IDatePickerControl>>;
};
