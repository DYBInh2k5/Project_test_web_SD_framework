'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateUser(id: string, data: any) {
  try {
    await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        role: data.role,
        // (Trong hệ thống thật cần cẩn thận phần đổi mật khẩu)
        ...(data.password ? { password: data.password } : {})
      }
    });

    revalidatePath('/dashboard/users');
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Lỗi cập nhật user' };
  }
}

export async function deleteUser(id: string) {
  try {
    // Để an toàn, trong hệ thống thật không nên xoá cứng user đã có order, 
    // nhưng đây là Project môn học nên ta cho phép delete.
    await prisma.user.delete({ where: { id } });
    revalidatePath('/dashboard/users');
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Tài khoản này có thể đang dính với dữ liệu khác (vd đơn hàng)' };
  }
}
