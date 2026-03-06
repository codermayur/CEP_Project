import { useTranslation } from 'react-i18next';
import { Stethoscope, LogOut } from 'lucide-react';
import { Button } from './ui/Button.jsx';
import { LanguageSwitcher } from './LanguageSwitcher.jsx';
import { useAuth } from '../hooks/useAuth.jsx';

export function Navbar({ title }) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200/80 bg-white/95 px-6 py-4 backdrop-blur-sm shadow-navbar md:px-8">
      <div className="flex min-w-0 items-center gap-4">
        <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-soft sm:flex">
          <Stethoscope className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold text-slate-800 md:text-xl">{title}</h1>
          {user && (
            <p className="text-xs text-slate-500 md:text-sm">
              {user.name} · {t(user.role)}
            </p>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <LanguageSwitcher />
        {user && (
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="flex items-center gap-2 text-slate-600"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">{t('logout')}</span>
          </Button>
        )}
      </div>
    </header>
  );
}
