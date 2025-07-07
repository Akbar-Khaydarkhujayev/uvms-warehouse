import { Box, Button, Divider } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { useGetTables } from './api/table/get';
import { useGetArendators } from './api/arendators/get';
import { TableDialog } from './components/table-dialog';
import { ArendatorDialog } from './components/arendator-dialog';

// ----------------------------------------------------------------------

export function DashboardView() {
  const { t } = useTranslate();

  const { data: arendators } = useGetArendators();
  const { data: tables } = useGetTables();

  const tableDialog = useBoolean();
  const arendatorDialog = useBoolean();

  return (
    <DashboardContent maxWidth="xl" sx={{ p: 2 }}>
      <TableDialog onClose={tableDialog.onFalse} open={tableDialog.value} />
      <ArendatorDialog onClose={arendatorDialog.onFalse} open={arendatorDialog.value} />

      <Box
        height={1}
        width={1}
        display="grid"
        gridTemplateColumns="1fr auto 3fr"
        gap={2}
        alignItems="stretch"
        flexGrow={1}
      >
        <Box>
          <Button variant="contained" onClick={arendatorDialog.onTrue}>
            Create arendator
          </Button>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box>
          <Button variant="contained" onClick={tableDialog.onTrue}>
            Create table
          </Button>
        </Box>
      </Box>
    </DashboardContent>
  );
}
