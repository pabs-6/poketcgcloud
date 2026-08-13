import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { HomePage, DashboardRedirect } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { Skeleton } from '@/components/ui/Skeleton';

const SearchCardsPage = lazy(() => import('@/pages/SearchCardsPage').then((m) => ({ default: m.SearchCardsPage })));
const CardDetailPage = lazy(() => import('@/pages/CardDetailPage').then((m) => ({ default: m.CardDetailPage })));
const CollectionPage = lazy(() => import('@/pages/CollectionPage').then((m) => ({ default: m.CollectionPage })));
const WishlistPage = lazy(() => import('@/pages/WishlistPage').then((m) => ({ default: m.WishlistPage })));
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage').then((m) => ({ default: m.FavoritesPage })));
const DashboardPage = lazy(() => Promise.resolve({ default: DashboardRedirect }));
const ProfilePage = lazy(() => import('@/pages/ProfilePage').then((m) => ({ default: m.ProfilePage })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, retry: 1 },
  },
});

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

function PageLoader() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="cards" element={<Suspense fallback={<PageLoader />}><SearchCardsPage /></Suspense>} />
          <Route path="cards/:id" element={<Suspense fallback={<PageLoader />}><CardDetailPage /></Suspense>} />
          <Route path="collection" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><CollectionPage /></Suspense></ProtectedRoute>} />
          <Route path="wishlist" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><WishlistPage /></Suspense></ProtectedRoute>} />
          <Route path="favorites" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><FavoritesPage /></Suspense></ProtectedRoute>} />
          <Route path="dashboard" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><DashboardPage /></Suspense></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><ProfilePage /></Suspense></ProtectedRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  const content = (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );

  if (!googleClientId) return content;

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      {content}
    </GoogleOAuthProvider>
  );
}
