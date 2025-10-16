import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthAPI from '../../api/auth';
import TokenManager from '../../utils/token';
import styles from './Auth.module.css';

interface RegisterFormData {
  fio: string;
  username: string;
  email: string;
  companyName: string;
  password: string;
  role: string;
  agreeToTerms: boolean;
}

interface RegisterProps {
  onLogin: (user: any, token: string) => void;
}

const Register: React.FC<RegisterProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    fio: '',
    username: '',
    email: '',
    companyName: '',
    password: '',
    role: 'HR',
    agreeToTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      alert('Пожалуйста, согласитесь с условиями использования');
      return;
    }

    setIsLoading(true);

    try {
      const result = await AuthAPI.signup({
        fio: formData.fio,
        username: formData.username,
        email: formData.email,
        companyName: formData.companyName,
        password: formData.password,
        role: formData.role as 'CANDIDATE' | 'HR' | 'ADMIN'
      });

      if (result.success) {
        // После успешной регистрации автоматически логиним пользователя
        const loginResult = await AuthAPI.signin({
          username: formData.username,
          password: formData.password
        });

        if (loginResult.success && loginResult.token) {
          TokenManager.setToken(loginResult.token);
          const userData = TokenManager.getUserFromToken();
          if (userData) {
            onLogin(userData, loginResult.token);
            navigate('/profile');
          }
        } else {
          alert('Регистрация успешна! Теперь вы можете войти.');
          navigate('/auth');
        }
      } else {
        alert(`Ошибка регистрации: ${result.description}`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Произошла ошибка при регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.auth}>
      <div className={styles.authContainer}>
        <h2 className={styles.title}>Создать аккаунт</h2>
        <p className={styles.subtitle}>Присоединяйтесь к нашей платформе</p>
        
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="fio" className={styles.label}>ФИО *</label>
            <input 
              type="text" 
              id="fio" 
              name="fio"
              className={styles.input}
              placeholder="Введите ваше полное имя"
              value={formData.fio}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>Имя пользователя *</label>
            <input 
              type="text" 
              id="username" 
              name="username"
              className={styles.input}
              placeholder="Придумайте имя пользователя"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email *</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              className={styles.input}
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="companyName" className={styles.label}>Компания</label>
            <input 
              type="text" 
              id="companyName" 
              name="companyName"
              className={styles.input}
              placeholder="Название вашей компании"
              value={formData.companyName}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Пароль *</label>
            <input 
              type="password" 
              id="password" 
              name="password"
              className={styles.input}
              placeholder="Создайте надежный пароль"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="role" className={styles.label}>Роль *</label>
            <select 
              id="role" 
              name="role"
              className={styles.input}
              value={formData.role}
              onChange={handleChange}
              required
              disabled={isLoading}
            >
              <option value="CANDIDATE">Кандидат</option>
              <option value="HR">HR</option>
              <option value="ADMIN">Администратор</option>
            </select>
          </div>
          
          <div className={styles.options}>
            <label className={styles.remember}>
              <input 
                type="checkbox" 
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              <span>Я согласен с <a href="#terms" className={styles.link}>условиями использования</a></span>
            </label>
          </div>
          
          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
        
        <div className={styles.divider}>
          <span>Или войдите через</span>
        </div>
        
        <div className={styles.socialAuth}>
          <button type="button" className={styles.socialBtn} disabled={isLoading}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
            Telegram
          </button>
          
          <button type="button" className={styles.socialBtn} disabled={isLoading}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
            </svg>
            GitHub
          </button>
        </div>
        
        <p className={styles.signupLink}>
          Уже есть аккаунт? <Link to="/auth" className={styles.link}>Войти</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;