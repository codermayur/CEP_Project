import { useTranslation } from 'react-i18next';

const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'mr', label: 'मराठी' },
];

export function LanguageSwitcher({ className }) {
  const { i18n } = useTranslation();

  return (
    <div className={`flex gap-2 ${className || ''}`}>
      {LANGS.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => {
            i18n.changeLanguage(code);
            localStorage.setItem('lang', code);
          }}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
            i18n.language === code
              ? 'bg-primary text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
