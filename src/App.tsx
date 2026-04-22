import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { TitleBar } from './components/titlebar/TitleBar';
import './i18n';
import './App.css';

// Lazy loading для страниц
const AuthPage = lazy(() => import('./pages/Auth/AuthPage'));
const RegisterPage = lazy(() => import('./pages/Auth/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/Dashboard/DashboardPage'));
const DocumentsPage = lazy(() => import('./pages/Document/DocumentsPage'));
const NewsPage = lazy(() => import('./pages/NewPage/NewPage'));
const ExternalPage = lazy(() => import('../src/pages/ExternalPage'));

declare global {
  interface Window {
    electronAPI?: {
      getAppVersion: () => Promise<string>;
      minimize: () => Promise<void>;
      maximize: () => Promise<void>;
      close: () => Promise<void>;
      platform: string;
    };
  }
}

interface User {
  id: number;
  email: string;
  name?: string;
  [key: string]: any;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isElectron, setIsElectron] = useState(false);
  const { t } = useTranslation('common');

  useEffect(() => {
    const checkElectron = async () => {
      if (window.electronAPI) {
        setIsElectron(true);
        try {
          const version = await window.electronAPI.getAppVersion();
          console.log('App version:', version);
        } catch {
          console.log('Running in browser');
        }
      }
    };
    checkElectron();
    checkAuth();
  }, []);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          id: payload.sub || payload.user_id,
          email: payload.email || payload.sub,
          name: payload.name || payload.fio || '',
          role: payload.role || 'USER',
          ...payload
        });
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('authToken');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((userData: User, token: string) => {
    localStorage.setItem('authToken', token);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setUser(null);
  }, []);

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    return user ? <>{children}</> : <Navigate to="/auth" replace />;
  };

  const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    return !user ? <>{children}</> : <Navigate to="/dashboard" replace />;
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <div className="loading-text">{t('loading')}</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {isElectron && <TitleBar />}
        <div className={isElectron ? 'app-content-with-titlebar' : 'app-content'}>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Navigate to={user ? "/dashboard" : "/auth"} replace />} />
              <Route path="/auth" element={<PublicRoute><AuthPage onLogin={login} /></PublicRoute>} />
              <Route path="/signup" element={<PublicRoute><RegisterPage onLogin={login} /></PublicRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage user={user} onLogout={logout} /></ProtectedRoute>} />
              <Route path="/documents" element={<ProtectedRoute><DocumentsPage /></ProtectedRoute>} />
              <Route path="/news" element={<ProtectedRoute><NewsPage /></ProtectedRoute>} />
              <Route path="/external" element={<ProtectedRoute><ExternalPage /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to={user ? "/dashboard" : "/auth"} replace />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </Router>
  );
}

export default App;