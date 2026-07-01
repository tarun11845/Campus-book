import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import LoadingSpinner from './components/LoadingSpinner';
import Navbar from './components/Navbar';
import WelcomePage from './pages/WelcomePage';
import TennisPage from './pages/TennisPage';
import BasketballPage from './pages/BasketballPage';
import BadmintonPage from './pages/BadmintonPage';
import LoginPage from './pages/LoginPage';
import CalendarPage from './pages/CalendarPage';
import AdminPage from './pages/AdminPage';
import MyBookingsPage from './pages/MyBookingsPage'; 
import StudentDashboard from './pages/StudentDashBoard'; 
import WebsiteWelcomePage from './pages/WebsiteWelcomPage';
import AboutPage from './pages/AboutPage';
import AdminVerificationPage from './pages/AdminVerificationPage';

const getStoredUser = () => {
  const rawUser = localStorage.getItem('user');
  if (!rawUser) return null;
  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
};

const getAuthRedirectPath = (user) => {
  const currentUser = user || getStoredUser();
  if (!currentUser) return '/login';
  return currentUser.role === 'admin' ? '/admin' : '/dashboard';
};

const RequireAuth = ({ children, role }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = getStoredUser();

    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to={getAuthRedirectPath(user)} replace />;
  }

  return children;
};

const AuthRedirect = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = getStoredUser();
    if (token && user) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? <Navigate to={getAuthRedirectPath()} replace /> : children;
};

const AppLayout = () => {
  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-gray-900 overflow-x-hidden professional-scroll">
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Routes */}
            <Route path="/sports/swimming" element={<WelcomePage />} />
            <Route path="/sports/tennis" element={<TennisPage />} />
            <Route path="/sports/basketball" element={<BasketballPage />} />
            <Route path="/sports/badminton" element={<BadmintonPage />} />
            <Route path="/" element={<AuthRedirect><WebsiteWelcomePage /></AuthRedirect>} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<AuthRedirect><LoginPage /></AuthRedirect>} />
            <Route path="/admin-verify" element={<AdminVerificationPage />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <RequireAuth role="student">
                  <div className="min-h-screen">
                    <Navbar />
                    <main className="content-with-navbar main-scroll">
                      <StudentDashboard />
                    </main>
                  </div>
                </RequireAuth>
              }
            />

            <Route
              path="/calendar/:sportKey"
              element={
                <RequireAuth role="student">
                  <div className="min-h-screen">
                    <Navbar />
                    <main className="content-with-navbar main-scroll">
                      <CalendarPage />
                    </main>
                  </div>
                </RequireAuth>
              }
            />
            <Route
              path="/admin"
              element={
                <RequireAuth role="admin">
                  <div className="min-h-screen">
                    <Navbar />
                    <main className="content-with-navbar main-scroll">
                      <AdminPage />
                    </main>
                  </div>
                </RequireAuth>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <RequireAuth role="student">
                  <div className="min-h-screen">
                    <Navbar />
                    <main className="content-with-navbar main-scroll">
                      <MyBookingsPage />
                    </main>
                  </div>
                </RequireAuth>
              }
            />

            {/* Optional catch-all redirect for unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
};

const App = () => (
  <ThemeProvider>
    <AppLayout />
  </ThemeProvider>
);

export default App;
