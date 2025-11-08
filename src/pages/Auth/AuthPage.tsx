// AuthPage.tsx
import Auth from '../../components/Auth/Auth';
import './Auth.module.css';

interface AuthPageProps {
  onLogin: (user: any, token: string) => void;
}

export const AuthPage = ({ onLogin }: AuthPageProps) => {
  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        <div className="auth-sidebar">
          <h1 className="logo">Slash Admin</h1>
          <p className="tagline">Управляйте вашей системой эффективно и безопасно</p>
          <ul className="features">
            <li>Безопасный доступ к панели управления</li>
            <li>Мощные инструменты аналитики</li>
            <li>Простое управление пользователями</li>
            <li>Интуитивный интерфейс</li>
          </ul>
        </div>
        <div className="auth-content">
          <div className="auth-form-container">
            <h2 className="auth-title">Sign in</h2>
            <Auth onLogin={onLogin} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;