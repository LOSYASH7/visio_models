import Auth from '../../components/Auth/Auth';
import styles from './Auth.module.css';

interface AuthPageProps {
  onLogin: (user: any, token: string) => void;
}

export const AuthPage = ({ onLogin }: AuthPageProps) => {
  return (
    <div className={styles.authPage}>
      <Auth onLogin={onLogin} />
    </div>
  );
};

export default AuthPage;