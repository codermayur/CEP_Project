import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Users,
  Calendar,
  UserPlus,
  CalendarPlus,
  UserCog,
  BarChart3,
  Stethoscope,
} from 'lucide-react';
import { cn } from '../lib/utils.js';

export function Sidebar({ role }) {
  const { t } = useTranslation();

  const adminLinks = [
    { to: '/admin', icon: LayoutDashboard, label: t('dashboard') },
    { to: '/admin/doctors', icon: UserCog, label: t('manage_doctors') },
    { to: '/admin/nurses', icon: Users, label: t('manage_nurses') },
    { to: '/admin/analytics', icon: BarChart3, label: t('analytics') },
  ];

  const doctorLinks = [
    { to: '/doctor', icon: LayoutDashboard, label: t('dashboard') },
    { to: '/doctor/queue', icon: Users, label: t('doctor_queue') },
    { to: '/doctor/availability', icon: Calendar, label: t('availability') },
  ];

  const nurseLinks = [
    { to: '/nurse', icon: LayoutDashboard, label: t('dashboard') },
    { to: '/nurse/register-patient', icon: UserPlus, label: t('register_patient') },
    { to: '/nurse/appointments', icon: CalendarPlus, label: t('create_appointment') },
    { to: '/nurse/patients', icon: Users, label: t('patients') },
  ];

  const links =
    role === 'admin' ? adminLinks : role === 'doctor' ? doctorLinks : role === 'nurse' ? nurseLinks : [];

  return (
    <aside className="fixed left-0 top-0 z-20 flex h-screen w-[260px] flex-col border-r border-slate-200/80 bg-white shadow-sidebar">
      <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-soft">
          <Stethoscope className="h-5 w-5" />
        </div>
        <span className="truncate text-sm font-semibold text-slate-800">Healthcare</span>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-4">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary/10 text-primary shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              )
            }
          >
            <Icon className="h-5 w-5 shrink-0 opacity-90" />
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
