import { Helmet } from 'react-helmet-async';

import { StatisticsView } from 'src/sections/statistics/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Socket</title>
      </Helmet>

      <StatisticsView />
    </>
  );
}
