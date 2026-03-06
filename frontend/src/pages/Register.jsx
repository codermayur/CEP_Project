import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserPlus, Stethoscope } from 'lucide-react';
import { LanguageSwitcher } from '../components/LanguageSwitcher.jsx';
import { cn } from '../lib/utils.js';

export function Register() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="absolute right-4 top-4">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-8 shadow-card md:p-10">
        <div className="mb-8 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <UserPlus className="h-9 w-9" />
          </div>
        </div>
        <h1 className="mb-2 text-center text-2xl font-bold text-slate-800">{t('register')}</h1>
        <p className="mb-6 text-center text-sm text-slate-500">{t('register_help')}</p>
        <div className="space-y-4 rounded-2xl bg-slate-50/80 p-5 text-sm text-slate-600">
          <p>{t('register_help_staff')}</p>
          <p>{t('register_help_contact')}</p>
        </div>
        <div className="mt-6">
          <Link
            to="/login"
            className={cn(
              'flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-soft transition-all hover:bg-primary-hover active:scale-[0.98]'
            )}
          >
            <Stethoscope className="h-5 w-5" />
            {t('back_to_login')}
          </Link>
        </div>
      </div>
    </div>
  );
}
