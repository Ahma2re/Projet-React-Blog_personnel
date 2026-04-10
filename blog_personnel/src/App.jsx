import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ArticlesPage from './pages/ArticlesPage';
import ArticleFormPage from './pages/ArticleFormPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import FriendsPage from './pages/FriendsPage';
import FriendSearchPage from './pages/FriendSearchPage';
import FriendRequestsPage from './pages/FriendRequestsPage';

function AppLayout() {
  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<PrivateRoute><AppLayout /></PrivateRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="articles" element={<ArticlesPage />} />
            <Route path="articles/new" element={<ArticleFormPage />} />
            <Route path="articles/:id" element={<ArticleDetailPage />} />
            <Route path="articles/:id/edit" element={<ArticleFormPage />} />
            <Route path="friends" element={<FriendsPage />} />
            <Route path="friends/search" element={<FriendSearchPage />} />
            <Route path="friends/requests" element={<FriendRequestsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
