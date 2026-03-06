import { Navigate, useLocation } from 'react-router-dom';
import { getAuth } from '../services/auth.js';

export function ProtectedRoute({ children, allowedRoles }) {
  const { token, user } = getAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    const redirect = user.role === 'admin' ? '/admin' : user.role === 'doctor' ? '/doctor' : '/nurse';
    return <Navigate to={redirect} replace />;
  }
  return children;
}
