import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Home } from './pages/Home/Home'
import { AuthPage } from './pages/Auth/AuthPage'
import { RegisterPage } from './pages/Auth/RegisterPage'
import { ProfilePage } from './pages/UserPage/Profile' 
import { About } from './pages/about/about'
import { Features } from './pages/Features/features'
import { TitleBar } from './components/titlebar/TitleBar' 
import './i18n'
import './App.css'

// ✅ Правильное объявление с большой буквы Window
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

function App() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isElectron, setIsElectron] = useState(false)
  const { t } = useTranslation('common')

  useEffect(() => {
    const checkElectron = () => {
      if (window.electronAPI) {
        setIsElectron(true);
        window.electronAPI.getAppVersion().then(version => {
          console.log('App version:', version);
        }).catch(() => {
          console.log('Running in browser');
        });
      }
    };

    checkElectron();
    checkAuth();
  }, [])


  const checkAuth = async () => {
    const token = localStorage.getItem('authToken')
    if (token) {
      try {
        const userData = JSON.parse(atob(token.split('.')[1]))
        setUser(userData)
      } catch (error) {
        console.error('Error decoding token:', error)
        localStorage.removeItem('authToken')
      }
    }
    setLoading(false)
  }

  const login = (userData: any, token: string) => {
    localStorage.setItem('authToken', token)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    setUser(null)
  }

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    return user ? <>{children}</> : <Navigate to="/auth" replace />
  }

  const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    return !user ? <>{children}</> : <Navigate to="/profile" replace />
  }

  if (loading) {
    return <div className="app-loading">{t('loading')}</div>
  }

  return (
    <Router>
      <div className="App">
        {isElectron && <TitleBar />}
        
        <div className={isElectron ? 'app-content-with-titlebar' : 'app-content'}>
          <Routes>
            {/* Исправьте Home component если он не принимает props */}
            <Route path="/" element={<Home />} />
            
            <Route 
              path="/auth" 
              element={
                <PublicRoute>
                  <AuthPage onLogin={login} />
                </PublicRoute>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <PublicRoute>
                  <RegisterPage onLogin={login} />
                </PublicRoute>
              } 
            />

            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage user={user} onLogout={logout} />
                </ProtectedRoute>
              } 
            />

            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />

            <Route path="*" element={<Navigate to={user ? "/profile" : "/"} replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App