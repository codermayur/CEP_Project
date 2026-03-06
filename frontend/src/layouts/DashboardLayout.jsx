import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar.jsx';
import { Sidebar } from '../components/Sidebar.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { useTranslation } from 'react-i18next';

export function DashboardLayout({ titleKey = 'dashboard' }) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const title = t(titleKey);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role={user?.role} />
      <div className="ml-[260px] flex flex-1 flex-col min-w-0">
        <Navbar title={title} />
        <main className="flex-1 p-6 md:p-8 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
