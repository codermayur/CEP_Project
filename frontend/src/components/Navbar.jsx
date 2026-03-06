import { useTranslation } from 'react-i18next';
import { Stethoscope, LogOut } from 'lucide-react';
import { Button } from './ui/Button.jsx';
import { LanguageSwitcher } from './LanguageSwitcher.jsx';
import { useAuth } from '../hooks/useAuth.jsx';

export function Navbar({ title }) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
          <Stethoscope className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">{title}</h1>
          {user && (
            <p className="text-sm text-slate-500">
              {user.name} · {t(user.role)}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        {user && (
          <Button variant="ghost" size="sm" onClick={logout} className="flex items-center gap-2">
            <LogOut className="h-5 w-5" />
            {t('logout')}
          </Button>
        )}
      </div>
    </header>
  );
}
