import { Box, Divider } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { useGetTables } from './api/table/get';
import { useGetArendators } from './api/arendators/get';
import { TableDialog } from './components/table-dialog';
import { LoadsList } from './components/loads-list';
import { LotsTable } from './components/lots-table';

// ----------------------------------------------------------------------

export function DashboardView() {
  const { data: tables } = useGetTables();

  return (
    <DashboardContent maxWidth="xl" sx={{ p: 2 }}>
      <Box
        height={1}
        width={1}
        display="grid"
        gridTemplateColumns="1fr auto 3fr"
        gap={2}
        alignItems="stretch"
        flexGrow={1}
      >
        {' '}
        <Box>
          <LoadsList />
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box>
          <LotsTable />
        </Box>
      </Box>
    </DashboardContent>
  );
}
