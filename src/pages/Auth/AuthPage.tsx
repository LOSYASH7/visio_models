// AuthPage.tsx
import React, { useState } from 'react';
import Auth from '../../components/Auth/Auth';
import styles from './Auth.module.css';

interface AuthPageProps {
  onLogin: (user: any, token: string) => void;
}

export const AuthPage = ({ onLogin }: AuthPageProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (user: any, token: string) => {
    setIsLoading(true);
    try {
      await onLogin(user, token);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authPageWrapper}>
      <div className={styles.authContainer}>
        {/* Левая часть - информационный блок */}
        <div className={styles.infoSidebar}>
          <div className={styles.sidebarContent}>
            <h1 className={styles.logo}>Slash Admin</h1>
            <p className={styles.tagline}>
              Мощная панель управления для вашего бизнеса. 
              Простота использования и передовые возможности в одном решении.
            </p>
            
            <ul className={styles.features}>
              <li>Безопасный доступ к панели управления</li>
              <li>Мощные инструменты аналитики</li>
              <li>Простое управление пользователями</li>
              <li>Интуитивный интерфейс</li>
              <li>Реальное время обновления данных</li>
              <li>Поддержка 24/7</li>
            </ul>
            
            <div className={styles.testimonial}>
              <div className={styles.testimonialContent}>
                "Лучшая админ-панель, которую я использовал. Экономит часы работы ежедневно."
              </div>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>АС</div>
                <div className={styles.authorInfo}>
                  <div className={styles.authorName}>Алексей Смирнов</div>
                  <div className={styles.authorRole}>CTO в TechCompany</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Правая часть - форма авторизации */}
        <div className={styles.authContent}>
          <div className={styles.authWrapper}>
            <Auth onLogin={handleLogin} isLoading={isLoading} />
            
            <div className={styles.authFooter}>
              <div className={styles.securityBadge}>
                <span className={styles.securityIcon}>🔒</span>
                <span>Secure authentication</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;