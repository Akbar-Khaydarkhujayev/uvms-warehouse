import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { StatisticsView } from 'src/sections/statistics/view';

// ----------------------------------------------------------------------

const metadata = { title: `Page five | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <StatisticsView />
    </>
  );
}
