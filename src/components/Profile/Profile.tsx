import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthAPI from '../../api/auth';
import TokenManager from '../../utils/token';
import styles from './Profile.module.css';

interface UserProfile {
  id: string;
  fio: string;
  username: string;
  email: string;
  companyName: string;
  role: 'CANDIDATE' | 'HR' | 'ADMIN';
  createdAt: string;
  avatar?: string;
}

interface ProfileProps {
  user: any;
  onLogout: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});
  const navigate = useNavigate();
  const { t } = useTranslation(['profile', 'common', 'auth']);

  useEffect(() => {
    if (user) {
      setEditForm({
        fio: user.fio || '',
        username: user.username || '',
        email: user.email || '',
        companyName: user.companyName || '',
        role: user.role || 'CANDIDATE'
      });
    }
  }, [user]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      // В вашем API нет метода обновления профиля, поэтому просто обновляем локальное состояние
      // В реальном приложении здесь был бы вызов API
      // await AuthAPI.updateProfile(editForm);
      
      alert(t('profile:updateFeatureComing'));
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(t('profile:errors.updateError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm(t('profile:confirmLogout'))) {
      try {
        const token = TokenManager.getToken();
        if (token) {
          await AuthAPI.logout(token);
        }
        TokenManager.removeToken();
        onLogout();
        navigate('/');
      } catch (error) {
        console.error('Logout error:', error);
        // Все равно выполняем логаут на клиенте
        TokenManager.removeToken();
        onLogout();
        navigate('/');
      }
    }
  };

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'CANDIDATE': return `👤 ${t('profile:roles.candidate')}`;
      case 'HR': return `💼 ${t('profile:roles.hr')}`;
      case 'ADMIN': return `⚙️ ${t('profile:roles.admin')}`;
      default: return `👤 ${t('profile:roles.user')}`;
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'CANDIDATE': return t('profile:roles.candidate');
      case 'HR': return t('profile:roles.hr');
      case 'ADMIN': return t('profile:roles.admin');
      default: return t('profile:roles.notSpecified');
    }
  };

  if (!user) {
    return (
      <div className={styles.profile}>
        <div className={styles.profileContainer}>
          <div className={styles.error}>{t('profile:notAuthorized')}</div>
          <button 
            onClick={() => navigate('/auth')}
            className={styles.editBtn}
          >
            {t('auth:signIn')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profile}>
      <div className={styles.profileContainer}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t('profile:title')}</h2>
          <p className={styles.subtitle}>{t('profile:subtitle')}</p>
        </div>

        <div className={styles.profileContent}>
          {/* Аватар и основная информация */}
          <div className={styles.avatarSection}>
            <div className={styles.avatar}>
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" className={styles.avatarImage} />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {user.fio ? user.fio.charAt(0) : 'U'}
                </div>
              )}
            </div>
            <div className={styles.userInfo}>
              <h3 className={styles.userName}>{user.fio || t('profile:defaultUserName')}</h3>
              <p className={styles.userRole}>
                {getRoleDisplay(user.role)}
              </p>
              <p className={styles.userSince}>
                {t('profile:accountActive')}
              </p>
            </div>
          </div>

          {/* Форма редактирования/просмотра */}
          <div className={styles.formSection}>
            {isEditing ? (
              <div className={styles.editForm}>
                <div className={styles.inputGroup}>
                  <label htmlFor="fio" className={styles.label}>{t('profile:fullName')} *</label>
                  <input 
                    type="text" 
                    id="fio" 
                    name="fio"
                    className={styles.input}
                    value={editForm.fio || ''}
                    onChange={handleEditChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="username" className={styles.label}>{t('profile:username')} *</label>
                  <input 
                    type="text" 
                    id="username" 
                    name="username"
                    className={styles.input}
                    value={editForm.username || ''}
                    onChange={handleEditChange}
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className={styles.inputGroup}>
                  <label htmlFor="email" className={styles.label}>{t('profile:email')} *</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    className={styles.input}
                    value={editForm.email || ''}
                    onChange={handleEditChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="companyName" className={styles.label}>{t('profile:company')}</label>
                  <input 
                    type="text" 
                    id="companyName" 
                    name="companyName"
                    className={styles.input}
                    value={editForm.companyName || ''}
                    onChange={handleEditChange}
                    disabled={isLoading}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="role" className={styles.label}>{t('profile:role')}</label>
                  <select 
                    id="role" 
                    name="role"
                    className={`${styles.input} ${styles.select}`}
                    value={editForm.role || 'CANDIDATE'}
                    onChange={handleEditChange}
                    disabled={isLoading}
                  >
                    <option value="CANDIDATE">{t('profile:roles.candidate')}</option>
                    <option value="HR">{t('profile:roles.hr')}</option>
                    <option value="ADMIN">{t('profile:roles.admin')}</option>
                  </select>
                </div>

                <div className={styles.formActions}>
                  <button 
                    type="button" 
                    className={styles.cancelBtn}
                    onClick={() => setIsEditing(false)}
                    disabled={isLoading}
                  >
                    {t('common:cancel')}
                  </button>
                  <button 
                    type="button" 
                    className={styles.saveBtn}
                    onClick={handleSave}
                    disabled={isLoading}
                  >
                    {isLoading ? t('profile:saving') : t('common:save')}
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.viewForm}>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>{t('profile:fullName')}:</span>
                    <span className={styles.infoValue}>{user.fio || t('profile:notSpecified')}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>{t('profile:username')}:</span>
                    <span className={styles.infoValue}>@{user.username || t('profile:notSpecified')}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>{t('profile:email')}:</span>
                    <span className={styles.infoValue}>{user.email || t('profile:notSpecified')}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>{t('profile:company')}:</span>
                    <span className={styles.infoValue}>{user.companyName || t('profile:notSpecified')}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>{t('profile:role')}:</span>
                    <span className={styles.infoValue}>
                      {getRoleText(user.role)}
                    </span>
                  </div>
                </div>

                <div className={styles.viewActions}>
                  <button 
                    type="button" 
                    className={styles.editBtn}
                    onClick={() => setIsEditing(true)}
                  >
                    {t('profile:editProfile')}
                  </button>
                  <button 
                    type="button" 
                    className={styles.logoutBtn}
                    onClick={handleLogout}
                  >
                    {t('auth:logout')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;