import { Helmet } from 'react-helmet-async';

import { SignUpView } from 'src/auth/view/jwt';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Sign up</title>
      </Helmet>

      <SignUpView />
    </>
  );
}
