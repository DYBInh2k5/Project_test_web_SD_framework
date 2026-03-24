import { prisma } from '@/lib/prisma';
import UsersClient from './UsersClient';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            Quản lý Người dùng
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Chỉ Admin mới có quyền truy cập trang này.
          </p>
        </div>
      </div>

      <UsersClient initialUsers={users} />
    </div>
  );
}
