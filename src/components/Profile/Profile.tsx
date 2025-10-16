import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
      
      alert('Функция обновления профиля будет доступна в будущем');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Ошибка обновления профиля');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Вы уверены, что хотите выйти?')) {
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

  if (!user) {
    return (
      <div className={styles.profile}>
        <div className={styles.profileContainer}>
          <div className={styles.error}>Пользователь не авторизован</div>
          <button 
            onClick={() => navigate('/auth')}
            className={styles.editBtn}
          >
            Войти
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profile}>
      <div className={styles.profileContainer}>
        <div className={styles.header}>
          <h2 className={styles.title}>Профиль пользователя</h2>
          <p className={styles.subtitle}>Управление вашей учетной записью</p>
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
              <h3 className={styles.userName}>{user.fio || 'Пользователь'}</h3>
              <p className={styles.userRole}>
                {user.role === 'CANDIDATE' && '👤 Кандидат'}
                {user.role === 'HR' && '💼 HR-специалист'}
                {user.role === 'ADMIN' && '⚙️ Администратор'}
                {!user.role && '👤 Пользователь'}
              </p>
              <p className={styles.userSince}>
                Аккаунт активен
              </p>
            </div>
          </div>

          {/* Форма редактирования/просмотра */}
          <div className={styles.formSection}>
            {isEditing ? (
              <div className={styles.editForm}>
                <div className={styles.inputGroup}>
                  <label htmlFor="fio" className={styles.label}>ФИО *</label>
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
                  <label htmlFor="username" className={styles.label}>Имя пользователя *</label>
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
                  <label htmlFor="email" className={styles.label}>Email *</label>
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
                  <label htmlFor="companyName" className={styles.label}>Компания</label>
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
                  <label htmlFor="role" className={styles.label}>Роль</label>
                  <select 
                    id="role" 
                    name="role"
                    className={`${styles.input} ${styles.select}`}
                    value={editForm.role || 'CANDIDATE'}
                    onChange={handleEditChange}
                    disabled={isLoading}
                  >
                    <option value="CANDIDATE">Кандидат</option>
                    <option value="HR">HR</option>
                    <option value="ADMIN">Администратор</option>
                  </select>
                </div>

                <div className={styles.formActions}>
                  <button 
                    type="button" 
                    className={styles.cancelBtn}
                    onClick={() => setIsEditing(false)}
                    disabled={isLoading}
                  >
                    Отмена
                  </button>
                  <button 
                    type="button" 
                    className={styles.saveBtn}
                    onClick={handleSave}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Сохранение...' : 'Сохранить'}
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.viewForm}>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>ФИО:</span>
                    <span className={styles.infoValue}>{user.fio || 'Не указано'}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Имя пользователя:</span>
                    <span className={styles.infoValue}>@{user.username || 'Не указано'}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Email:</span>
                    <span className={styles.infoValue}>{user.email || 'Не указано'}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Компания:</span>
                    <span className={styles.infoValue}>{user.companyName || 'Не указана'}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Роль:</span>
                    <span className={styles.infoValue}>
                      {user.role === 'CANDIDATE' && 'Кандидат'}
                      {user.role === 'HR' && 'HR-специалист'}
                      {user.role === 'ADMIN' && 'Администратор'}
                      {!user.role && 'Не указана'}
                    </span>
                  </div>
                </div>

                <div className={styles.viewActions}>
                  <button 
                    type="button" 
                    className={styles.editBtn}
                    onClick={() => setIsEditing(true)}
                  >
                    Редактировать профиль
                  </button>
                  <button 
                    type="button" 
                    className={styles.logoutBtn}
                    onClick={handleLogout}
                  >
                    Выйти
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