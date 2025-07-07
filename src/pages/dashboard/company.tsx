import { Helmet } from 'react-helmet-async';

import { useTranslate } from 'src/locales';

import { CompaniesView } from 'src/sections/companies/view';

// ----------------------------------------------------------------------

export default function CompaniesPage() {
  const { t } = useTranslate();

  return (
    <>
      <Helmet>
        <title> {t('companies')}</title>
      </Helmet>

      <CompaniesView />
    </>
  );
}
