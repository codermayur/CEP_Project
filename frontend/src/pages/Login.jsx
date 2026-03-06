import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Stethoscope } from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';
import { authApi } from '../services/api.js';
import { useAuth } from '../hooks/useAuth.jsx';
import { LanguageSwitcher } from '../components/LanguageSwitcher.jsx';

export function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login(email, password);
      login(res.token, res.user);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="absolute right-4 top-4">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-8 shadow-card md:p-10">
        <div className="mb-8 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-soft">
            <Stethoscope className="h-9 w-9" />
          </div>
        </div>
        <h1 className="mb-2 text-center text-2xl font-bold text-slate-800">
          {t('welcome')} — Healthcare
        </h1>
        <p className="mb-6 text-center text-sm text-slate-500">Sign in to continue</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label={t('email')}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@hospital.com"
            required
          />
          <Input
            label={t('password')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? '...' : t('login')}
          </Button>
          <p className="text-center text-sm text-slate-500">
            {t('dont_have_account')}{' '}
            <Link to="/register" className="font-medium text-primary hover:underline">
              {t('register')}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
