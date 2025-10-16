const TokenManager = {
  setToken: (token: string) => {
    localStorage.setItem('authToken', token);
  },

  getToken: () => {
    return localStorage.getItem('authToken');
  },

  removeToken: () => {
    localStorage.removeItem('authToken');
  },

  // Проверка валидности токена
  isValid: () => {
    const token = localStorage.getItem('authToken');
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Проверяем срок действия токена (10 минут по документации)
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  },

  // Получение данных пользователя из токена
  getUserFromToken: () => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    
    try {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      
      return {
        id: decodedPayload.sub,
        fio: decodedPayload.fio,
        username: decodedPayload.username,
        email: decodedPayload.email,
        companyName: decodedPayload.companyName,
        role: decodedPayload.role
      };
    } catch {
      return null;
    }
  }
};

export default TokenManager;