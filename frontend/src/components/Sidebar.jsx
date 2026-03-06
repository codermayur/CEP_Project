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
    <aside className="w-56 shrink-0 border-r border-slate-200 bg-white p-4">
      <nav className="flex flex-col gap-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition',
                isActive ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100'
              )
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
