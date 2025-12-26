// RegisterPage.tsx
import React from 'react';
import Register from '../../components/Auth/Register';
import styles from './Auth.module.css'; // тот же модуль, что и у AuthPage

interface RegisterPageProps {
  onLogin: (user: any, token: string) => void;
}

export const RegisterPage = ({ onLogin }: RegisterPageProps) => {
  return (
    <div className={styles.page}>
      {/* Левая часть - тот же блок, что и в AuthPage */}
      <div className={styles.left}>
        <div className={styles.sidebarContent}>
          <h1 className={styles.logo}>VISIO</h1>
          <p className={styles.tagline}>БУДУЩЕЕ ЗА НАМИ</p>

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
              «Лучшая админ‑панель, которую я использовал. Экономит часы работы ежедневно.»
            </div>
            <div className={styles.testimonialAuthor}>
              <div className={styles.authorAvatar}>АС</div>
              <div className={styles.authorInfo}>
                <div className={styles.authorName}>Анатолий Сандаровский</div>
                <div className={styles.authorRole}>БВТ2304</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Правая часть - вместо Auth ставим Register */}
      <div className={styles.right}>
        <div className={styles.formCard}>
          <Register onLogin={onLogin} />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
