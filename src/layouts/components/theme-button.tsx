import { m } from 'framer-motion';

import IconButton from '@mui/material/IconButton';
import { Tooltip, useColorScheme } from '@mui/material';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { varHover } from 'src/components/animate';
import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------

export default function ThemeButton() {
  const settings = useSettingsContext();
  const { t } = useTranslate();

  const { mode, setMode } = useColorScheme();

  const renderIcon = (
    <Iconify
      icon={settings.colorScheme === 'light' ? 'ic:baseline-dark-mode' : 'tdesign:brightness'}
    />
  );

  return (
    <Tooltip title={settings.colorScheme === 'light' ? t('Night') : t('Day')}>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        aria-label="settings"
        onClick={() => {
          settings.onUpdateField(
            'colorScheme',
            settings.colorScheme === 'light' ? 'dark' : 'light'
          );
          setMode(mode === 'light' ? 'dark' : 'light');
        }}
        sx={{
          width: 40,
          height: 40,
        }}
      >
        {renderIcon}
      </IconButton>
    </Tooltip>
  );
}
