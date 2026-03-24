import { getAuthUser } from '@/app/actions/authActions';
import DashboardLayoutClient from './DashboardLayoutClient';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser();

  if (!user) {
    redirect('/');
  }

  return <DashboardLayoutClient user={user}>{children}</DashboardLayoutClient>;
}
