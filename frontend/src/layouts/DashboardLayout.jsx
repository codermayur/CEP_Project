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
      <div className="flex flex-1 flex-col">
        <Navbar title={title} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
