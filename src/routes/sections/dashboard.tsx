import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

const CompanyPage = lazy(() => import('src/pages/dashboard/company'));
const DevicePage = lazy(() => import('src/pages/dashboard/device'));
const DashboardPage = lazy(() => import('src/pages/dashboard/dashboard'));
const StatisticsPage = lazy(() => import('src/pages/dashboard/statistics'));
const PageFive = lazy(() => import('src/pages/dashboard/statistics'));
const PageSix = lazy(() => import('src/pages/dashboard/six'));

// ----------------------------------------------------------------------

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      { element: <DashboardPage />, index: true },
      { path: 'companies', element: <CompanyPage /> },
      { path: 'devices', element: <DevicePage /> },
      { path: 'logs', element: <StatisticsPage /> },
      {
        path: 'group',
        children: [
          { element: <StatisticsPage />, index: true },
          { path: 'five', element: <PageFive /> },
          { path: 'six', element: <PageSix /> },
        ],
      },
    ],
  },
];
