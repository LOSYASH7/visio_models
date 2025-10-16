const API_BASE_URL = 'http://localhost:8080/api/auth';

export interface UserData {
  fio: string;
  username: string;
  email: string;
  password: string;
  companyName?: string;
  role: 'CANDIDATE' | 'HR' | 'ADMIN';
}

export interface Credentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  description: string;
  token?: string;
}

class AuthAPI {
  async signup(userData: UserData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      return await response.json();
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  async signin(credentials: Credentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      return await response.json();
    } catch (error) {
      console.error('Signin error:', error);
      throw error;
    }
  }

  async logout(token: string): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      return await response.text();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
}

export default new AuthAPI();