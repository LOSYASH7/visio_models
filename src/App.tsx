import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthPage } from './pages/Auth/AuthPage';
import { RegisterPage } from './pages/Auth/RegisterPage';
import { DashboardPage } from './pages/Dashboard/DashboardPage'; 
import { TitleBar } from './components/titlebar/TitleBar'; 
import './i18n';
import './App.css';

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

interface AuthPageProps {
  onLogin: (userData: User, token: string) => void;
}

interface RegisterPageProps {
  onLogin: (userData: User, token: string) => void;
}

interface DashboardPageProps {
  user: User | null;
  onLogout: () => void; // Добавляем onLogout пропс
}

interface ProtectedRouteProps {
  children: React.ReactNode;
}

interface PublicRouteProps {
  children: React.ReactNode;
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

  const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    return user ? <>{children}</> : <Navigate to="/auth" replace />;
  };

  const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
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
          <Routes>
            {/* Главная страница - редирект на авторизацию или дашборд */}
            <Route 
              path="/" 
              element={<Navigate to={user ? "/dashboard" : "/auth"} replace />} 
            />
            
            {/* Авторизация */}
            <Route 
              path="/auth" 
              element={
                <PublicRoute>
                  <AuthPage onLogin={login} />
                </PublicRoute>
              } 
            />
            
            {/* Регистрация */}
            <Route 
              path="/signup" 
              element={
                <PublicRoute>
                  <RegisterPage onLogin={login} />
                </PublicRoute>
              } 
            />

            {/* Главный Dashboard со встроенным профилем и YOLO */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage user={user} onLogout={logout} />
                </ProtectedRoute>
              } 
            />

            {/* Все остальные пути - редирект */}
            <Route path="*" element={<Navigate to={user ? "/dashboard" : "/auth"} replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;