import 'src/global.css';

// ----------------------------------------------------------------------

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Router } from 'src/routes/sections';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import { ThemeProvider } from 'src/theme/theme-provider';

import { ProgressBar } from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/components/settings';

import { AuthProvider } from 'src/auth/context/jwt';

import { Snackbar } from './components/snackbar';
import { I18nProvider, LocalizationProvider } from './locales';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  const queryClient = new QueryClient();

  return (
    <I18nProvider>
      <LocalizationProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <SettingsProvider settings={defaultSettings}>
              <ThemeProvider>
                <MotionLazy>
                  <Snackbar />
                  <ProgressBar />
                  <SettingsDrawer />
                  <Router />
                </MotionLazy>
              </ThemeProvider>
            </SettingsProvider>
          </AuthProvider>
        </QueryClientProvider>
      </LocalizationProvider>
    </I18nProvider>
  );
}
