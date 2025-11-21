import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import FidelidadPage from './pages/FidelidadPage';
import GamerStoreFromJira from './pages/GamerStoreFromJira';
import NotFoundPage from './pages/NotFoundPage';
import AdminDashboard from './pages/AdminDashboard';
import AuthPage from './pages/AuthPage';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: 'fidelidad',
          element: <FidelidadPage />,
        },
        {
          path: 'gamer-store',
          element: <GamerStoreFromJira />,
        },
        {
          path: 'admin',
          element: <AdminDashboard />,
          path: 'auth',
          element: <AuthPage />,
        },
        {
          path: '*',
          element: <NotFoundPage />,
        },
      ],
    },
  ],
  { basename: '/Pagina-de-compras/' }
);
