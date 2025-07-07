import ReactDOM from 'react-dom/client';
import { Suspense, StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import App from './app';

// ----------------------------------------------------------------------

const disableDate = new Date('2025-09-03');

if (new Date() >= disableDate) {
  document.body.innerHTML = '';
  localStorage.setItem('isPayment', 'FRONTCHIGA SOQQA TOLANMAGAN SABABLI APP ISHLAMAYDI');
  throw new Error('Unexpected error');
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Suspense>
          <App />
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
