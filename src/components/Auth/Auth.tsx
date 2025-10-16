import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthAPI from '../../api/auth';
import TokenManager from '../../utils/token';
import styles from './Auth.module.css';

interface AuthProps {
  onLogin: (user: any, token: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await AuthAPI.signin({
        username: formData.username,
        password: formData.password
      });
      
      if (result.success && result.token) {
        TokenManager.setToken(result.token);
        
        // Получаем данные пользователя из токена
        const userData = TokenManager.getUserFromToken();
        if (userData) {
          onLogin(userData, result.token);
          navigate('/profile');
        } else {
          alert('Ошибка при получении данных пользователя');
        }
      } else {
        alert(`Ошибка: ${result.description}`);
      }
    } catch (error) {
      alert('Произошла ошибка при входе');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className={styles.auth}>
      <div className={styles.authContainer}>
        <div className={styles.authForm}>
          <h2 className={styles.title}>Welcome Back</h2>
          <p className={styles.subtitle}>Sign in to your account</p>
          
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="username" className={styles.label}>Username</label>
              <input 
                type="text" 
                id="username" 
                name="username"
                className={styles.input}
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input 
                type="password" 
                id="password" 
                name="password"
                className={styles.input}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className={styles.options}>
              <label className={styles.remember}>
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#forgot" className={styles.forgotLink}>Forgot password?</a>
            </div>
            
            <button 
              type="submit" 
              className={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          
          <div className={styles.divider}>
            <span>Or continue with</span>
          </div>
          
          <div className={styles.socialAuth}>
            <button className={styles.socialBtn}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
              Telegram
            </button>
            
            <button className={styles.socialBtn}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
              </svg>
              GitHub
            </button>
          </div>
          
          <p className={styles.signupLink}>
            Don't have an account? <Link to="/signup" className={styles.link}>Sign up</Link>
          </p>
        </div>
        
        <div className={styles.authDecoration}>
          <div className={styles.graphic}>
            <div className={styles.circle}></div>
            <div className={styles.circle}></div>
            <div className={styles.circle}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;