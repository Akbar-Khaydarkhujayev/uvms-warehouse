import { Helmet } from 'react-helmet-async';

import { JwtSignInView } from 'src/auth/view/jwt';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Sign in</title>
      </Helmet>

      <JwtSignInView />
    </>
  );
}
