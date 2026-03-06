import { useNavigate } from 'react-router-dom';
import { getAuth, clearAuth, setAuth } from '../services/auth.js';

export function useAuth() {
  const navigate = useNavigate();
  const { token, user } = getAuth();

  const login = (token, user) => {
    setAuth(token, user);
    const role = user?.role;
    if (role === 'admin') navigate('/admin');
    else if (role === 'doctor') navigate('/doctor');
    else if (role === 'nurse') navigate('/nurse');
    else navigate('/');
  };

  const logout = () => {
    clearAuth();
    navigate('/login');
  };

  return { user, token, isAuth: !!token, login, logout };
}
