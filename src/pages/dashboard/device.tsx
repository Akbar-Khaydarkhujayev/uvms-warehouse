import { Helmet } from 'react-helmet-async';

import { useTranslate } from 'src/locales';

import { DevicesView } from 'src/sections/devices/view';

// ----------------------------------------------------------------------

export default function DevicePage() {
  const { t } = useTranslate();

  return (
    <>
      <Helmet>
        <title> {t('devices')}</title>
      </Helmet>

      <DevicesView />
    </>
  );
}
