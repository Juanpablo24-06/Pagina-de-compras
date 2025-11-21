import { createBrowserRouter, Outlet } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import FidelidadPage from './pages/FidelidadPage';
import GamerStoreFromJira from './pages/GamerStoreFromJira';
import ProductDetailPage from './pages/ProductDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminDashboard from './pages/AdminDashboard';
import AuthPage from './pages/AuthPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { StoreProvider } from './context/StoreContext';

// Wrapper to provide StoreContext to the entire layout
const AppWrapper = () => (
  <StoreProvider>
    <MainLayout />
  </StoreProvider>
);

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <AppWrapper />, // MainLayout is now wrapped by StoreProvider
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
          path: 'product/:id',
          element: <ProductDetailPage />,
        },
        {
          path: 'admin',
          element: <AdminDashboard />,
        },
        {
          path: 'auth',
          element: <LoginPage />, // Default auth route
        },
        {
          path: 'login',
          element: <LoginPage />,
        },
        {
          path: 'register',
          element: <RegisterPage />,
        },
        {
          path: 'profile',
          element: <AuthPage />, // Renaming old AuthPage to Profile effectively
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
