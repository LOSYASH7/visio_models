import Register from '../../components/Auth/Register';
import styles from './Register.module.css';

interface RegisterPageProps {
  onLogin: (user: any, token: string) => void;
}

export const RegisterPage = ({ onLogin }: RegisterPageProps) => {
    return (
        <div className={styles.registerPage}>
            <Register onLogin={onLogin} />
        </div>
    )
}

export default RegisterPage;