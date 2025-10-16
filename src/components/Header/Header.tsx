// src/components/Header/Header.tsx
import React, { useState } from 'react';
import styles from './Header.module.css';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={`${styles.header} ${className}`}>
      <div className={styles.container}>
        {/* Логотип */}
        <div className={styles.logo}>
          <span className={styles.logoText}>Visio</span>
        </div>

        {/* Навигация для десктопа */}
        <nav className={styles.nav}>
          <ul className={styles.menu}>
            <li><a href="/features" className={styles.menuLink}>Features</a></li>
            <li><a href="/about" className={styles.menuLink}>About</a></li>
            <li><a href="/contact" className={styles.menuLink}>Contact</a></li>
          </ul>
        </nav>

        {/* Кнопки действий */}
          <div className={styles.actions}>
            <a href="/login" className={styles.loginIconBtn}>
              {/* Пример иконки пользователя из Heroicons */}
              <svg className={styles.loginIcon} viewBox="0 0 24 24"  stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </a>
            <button className={styles.signupBtn}>Get Started</button>
          </div>

        {/* Мобильное меню */}
        <button 
          className={styles.mobileMenuBtn}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Мобильное меню (выпадающее) */}
      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <a href="/features" className={styles.mobileLink}>Features</a>
          <a href="/about" className={styles.mobileLink}>About</a>
          <a href="/contact" className={styles.mobileLink}>Contact</a>
          <div className={styles.mobileActions}>
            <button className={styles.mobileLoginBtn}>Sign In</button>
            <button className={styles.mobileSignupBtn}>Get Started</button>
          </div>
        </div>
      )}
    </header>
  );
};