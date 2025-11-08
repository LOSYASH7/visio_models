// src/components/Header/Header.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../hooks/useLanguage';
import styles from './Header.module.css';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const { t } = useTranslation('common');
  const { changeLanguage, currentLanguage, languages } = useLanguage();

  const handleLanguageSelect = (languageCode: string) => {
    changeLanguage(languageCode);
    setIsLanguageOpen(false);
    setIsMenuOpen(false);
  };

  const getCurrentLanguageData = () => {
    return languages.find(lang => lang.code === currentLanguage) || languages[0];
  };

  return (
    <header className={`${styles.header} ${className}`}>
      <div className={styles.container}>
        {/* Логотип */}
        <div className={styles.logo}>
          <Link to="/" className={styles.logoLink}>
            <span className={styles.logoText}>Visio</span>
          </Link>
        </div>

        {/* Навигация для десктопа */}
        <nav className={styles.nav}>
          <ul className={styles.menu}>
            <li><Link to="/features" className={styles.menuLink}>{t('features')}</Link></li>
            <li><Link to="/about" className={styles.menuLink}>{t('about')}</Link></li>
            <li><Link to="/contact" className={styles.menuLink}>{t('contact')}</Link></li>
          </ul>
        </nav>

        {/* Кнопки действий */}
        <div className={styles.actions}>
          {/* Селектор языка */}
          <div className={styles.languageSelector}>
            <button 
              className={styles.languageButton}
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
            >
              <span className={styles.languageFlag}>
                {getCurrentLanguageData().flag}
              </span>
              <span className={styles.languageCode}>{getCurrentLanguageData().code.toUpperCase()}</span>
              <svg className={styles.languageArrow} viewBox="0 0 24 24" fill="none">
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
            
            {isLanguageOpen && (
              <div className={styles.languageDropdown}>
                {languages.map((language) => (
                  <button
                    key={language.code}
                    className={`${styles.languageOption} ${
                      currentLanguage === language.code ? styles.languageOptionActive : ''
                    }`}
                    onClick={() => handleLanguageSelect(language.code)}
                  >
                    <span className={styles.languageFlag}>{language.flag}</span>
                    <span className={styles.languageName}>{language.name}</span>
                    {currentLanguage === language.code && (
                      <svg className={styles.languageCheck} viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Иконка пользователя */}
          <Link to="/profile" className={styles.userIconBtn}>
            <svg className={styles.userIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>

          {/* Кнопка Get Started */}
          <Link to="/signup" className={styles.signupBtn}>{t('getStarted')}</Link>
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
          {/* Селектор языка в мобильном меню */}
          <div className={styles.mobileLanguageSelector}>
            <span className={styles.mobileLanguageLabel}>{t('language')}:</span>
            <div className={styles.mobileLanguageButtons}>
              {languages.map((language) => (
                <button
                  key={language.code}
                  className={`${styles.mobileLanguageBtn} ${
                    currentLanguage === language.code ? styles.mobileLanguageBtnActive : ''
                  }`}
                  onClick={() => handleLanguageSelect(language.code)}
                >
                  <span className={styles.mobileLanguageFlag}>{language.flag}</span>
                  <span>{language.code.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>

          <Link 
            to="/features" 
            className={styles.mobileLink}
            onClick={() => setIsMenuOpen(false)}
          >
            {t('features')}
          </Link>
          <Link 
            to="/about" 
            className={styles.mobileLink}
            onClick={() => setIsMenuOpen(false)}
          >
            {t('about')}
          </Link>
          <Link 
            to="/contact" 
            className={styles.mobileLink}
            onClick={() => setIsMenuOpen(false)}
          >
            {t('contact')}
          </Link>
          
          <div className={styles.mobileActions}>
            <Link 
              to="/profile" 
              className={styles.mobileUserBtn}
              onClick={() => setIsMenuOpen(false)}
            >
              <svg className={styles.mobileUserIcon} viewBox="0 0 24 24" fill="none">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {t('profile')}
            </Link>
            <Link 
              to="/signup" 
              className={styles.mobileSignupBtn}
              onClick={() => setIsMenuOpen(false)}
            >
              {t('getStarted')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};