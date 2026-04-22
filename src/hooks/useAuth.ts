import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: number;
  role: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        // Предполагаем, что в токене есть поля id и role
        setUser({ id: decoded.id, role: decoded.role || 'USER' });
      } catch (e) {
        console.error('Invalid token', e);
        setUser(null);
      }
    }
  }, []);

  return { user };
};