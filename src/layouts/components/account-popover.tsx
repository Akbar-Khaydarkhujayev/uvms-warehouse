import type { UserType } from 'src/auth/types';
import type { IconButtonProps } from '@mui/material/IconButton';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { useMockedUser } from 'src/auth/hooks';

import { AccountButton } from './account-button';
import { SignOutButton } from './sign-out-button';

// ----------------------------------------------------------------------

export type AccountPopoverProps = IconButtonProps & {
  data?: UserType;
};

export function AccountPopover({ data, sx, ...other }: AccountPopoverProps) {
  const popover = usePopover();
  const { user } = useMockedUser();

  return (
    <>
      <AccountButton
        onClick={popover.onOpen}
        photoURL={user?.photoURL}
        displayName={user?.displayName}
        sx={sx}
        {...other}
      />

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{
          paper: { sx: { p: 0, width: 200 } },
          arrow: { offset: 20 },
        }}
      >
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="subtitle2" noWrap>
            {data?.first_Name} {data?.last_Name}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {data?.phone_number}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          <SignOutButton
            size="medium"
            variant="text"
            onClose={popover.onClose}
            sx={{ display: 'block', textAlign: 'left' }}
          />
        </Box>
      </CustomPopover>
    </>
  );
}
