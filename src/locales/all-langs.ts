// core (MUI)
import { ruRU as ruRUCore } from '@mui/material/locale';
// date pickers (MUI)
import { ruRU as ruRUDate } from '@mui/x-date-pickers/locales';
// data grid (MUI)
import { ruRU as ruRUataGrid } from '@mui/x-data-grid/locales';

// ----------------------------------------------------------------------

export const allLangs = [
  // {
  //   value: 'en',
  //   label: 'English',
  //   countryCode: 'GB',
  //   adapterLocale: 'en',
  //   numberFormat: { code: 'en-US', currency: 'USD' },
  //   systemValue: {
  //     components: { ...enUSCore.components, ...enUSDate.components, ...enUSDataGrid.components },
  //   },
  // },
  {
    value: 'uz',
    label: 'Uzbek',
    countryCode: 'UZ',
    adapterLocale: 'uz',
    numberFormat: { code: 'uz-UZ', currency: 'UZS' },
    systemValue: {
      components: {},
    },
  },
  {
    value: 'ru',
    label: 'Russian',
    countryCode: 'RU',
    adapterLocale: 'ru',
    numberFormat: { code: 'ru-RU', currency: 'RUB' },
    systemValue: {
      components: { ...ruRUCore.components, ...ruRUDate.components, ...ruRUataGrid.components },
    },
  },
];

/**
 * Country code:
 * https://flagcdn.com/en/codes.json
 *
 * Number format code:
 * https://gist.github.com/raushankrjha/d1c7e35cf87e69aa8b4208a8171a8416
 */
