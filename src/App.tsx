import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Home } from './pages/Home/Home'
import { AuthPage } from './pages/Auth/AuthPage'
import { RegisterPage } from './pages/Auth/RegisterPage'
import { ProfilePage } from './pages/UserPage/Profile' 
import './App.css'

function App() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    // Проверяем токен и получаем пользователя
    const token = localStorage.getItem('authToken')
    if (token) {
      try {
        // Декодируем пользователя из токена
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
    return <div className="app-loading">Загрузка...</div>
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Публичные маршруты */}
          <Route path="/" element={<Home user={user} onLogout={logout} />} />
          
          {/* Маршруты только для неавторизованных */}
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

          {/* Защищенные маршруты */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage user={user} onLogout={logout} />
              </ProtectedRoute>
            } 
          />

          {/* Резервные маршруты */}
          <Route path="*" element={<Navigate to={user ? "/profile" : "/"} replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App