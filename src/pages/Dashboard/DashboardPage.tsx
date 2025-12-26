import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import YOLOComponent from '../../components/dushboard/ML/YOLOComponent';
import ProfilePage from '../UserPage/Profile';
import './DashboardPage.css';

interface DashboardPageProps {
  user: any;
  onLogout: () => void;
}

type DashboardTab = 'home' | 'yolo' | 'profile' | 'analytics' | 'settings';

export const DashboardPage: React.FC<DashboardPageProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const { t } = useTranslation(['dashboard', 'common']);
  const [activeTab, setActiveTab] = useState<DashboardTab>('home');

  // Рендерим активный контент
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="dashboard-content-home">
            <h2>🏠 {t('dashboard:home.welcome')}</h2>
            <p className="welcome-text">
              {t('dashboard:home.greeting')}, <strong>{user?.name || user?.email}</strong>!
            </p>
            
            <div className="quick-stats">
              <div className="stat-card">
                <h3>📊 {t('dashboard:home.totalProjects')}</h3>
                <p className="stat-number">12</p>
              </div>
              <div className="stat-card">
                <h3>✅ {t('dashboard:home.completed')}</h3>
                <p className="stat-number">8</p>
              </div>
              <div className="stat-card">
                <h3>⏳ {t('dashboard:home.inProgress')}</h3>
                <p className="stat-number">4</p>
              </div>
            </div>

            <div className="quick-actions">
              <h3>{t('dashboard:home.quickActions')}</h3>
              <div className="action-buttons">
                <button 
                  className="action-btn"
                  onClick={() => setActiveTab('yolo')}
                >
                  🚀 {t('dashboard:home.startYOLO')}
                </button>
                <button 
                  className="action-btn"
                  onClick={() => setActiveTab('profile')}
                >
                  👤 {t('dashboard:home.editProfile')}
                </button>
              </div>
            </div>
          </div>
        );

      case 'yolo':
        return <YOLOComponent user={user} />;

      case 'profile':
        return <ProfilePage user={user} onLogout={onLogout} />;

      case 'analytics':
        return (
          <div className="dashboard-content-analytics">
            <h2>📊 {t('dashboard:analytics.title')}</h2>
            <p>{t('dashboard:analytics.comingSoon')}</p>
          </div>
        );

      case 'settings':
        return (
          <div className="dashboard-content-settings">
            <h2>⚙️ {t('dashboard:settings.title')}</h2>
            <p>{t('dashboard:settings.comingSoon')}</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Фиксированный сайдбар */}
      <div className="dashboard-sidebar">
        {/* Заголовок сайдбара */}
        <div className="sidebar-header">
          <h2 className="sidebar-title">🚀 Dashboard</h2>
          <div className="user-info">
            <p className="user-email">{user?.email}</p>
            <p className="user-role">{user?.role || 'USER'}</p>
          </div>
        </div>

        {/* Навигация */}
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-text">{t('dashboard:nav.home')}</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'yolo' ? 'active' : ''}`}
            onClick={() => setActiveTab('yolo')}
          >
            <span className="nav-icon">🔍</span>
            <span className="nav-text">{t('dashboard:nav.yolo')}</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <span className="nav-icon">👤</span>
            <span className="nav-text">{t('dashboard:nav.profile')}</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">{t('dashboard:nav.analytics')}</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span className="nav-icon">⚙️</span>
            <span className="nav-text">{t('dashboard:nav.settings')}</span>
          </button>
        </nav>

        {/* Выход */}
        <div className="sidebar-footer">
          <button 
            className="logout-btn"
            onClick={onLogout}
          >
            <span className="logout-icon">🚪</span>
            <span className="logout-text">{t('auth:logout')}</span>
          </button>
        </div>
      </div>

      {/* Основной контент (меняется) */}
      <div className="dashboard-main">
        {/* Шапка контента */}
        <header className="content-header">
          <h1 className="content-title">
            {activeTab === 'home' && t('dashboard:titles.home')}
            {activeTab === 'yolo' && t('dashboard:titles.yolo')}
            {activeTab === 'profile' && t('dashboard:titles.profile')}
            {activeTab === 'analytics' && t('dashboard:titles.analytics')}
            {activeTab === 'settings' && t('dashboard:titles.settings')}
          </h1>
          <div className="content-subtitle">
            {t('dashboard:subtitle')}
          </div>
        </header>

        {/* Контент страницы */}
        <div className="content-wrapper">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;