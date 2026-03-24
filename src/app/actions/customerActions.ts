'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createCustomerOrder(productId: string, price: number, method: string) {
  try {
    // Để cho demo đơn giản, ta sẽ lấy "customer" cứng (hoặc tạo mới nếu muốn).
    // Ở hệ thống thực tế sẽ lấy từ User Session đang đăng nhập.
    const demoCustomerEmail = 'khachhang@example.com';
    let user = await prisma.user.findUnique({ where: { email: demoCustomerEmail }});
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: demoCustomerEmail,
          name: 'Khách hàng (Tự động)',
          password: '123',
          role: 'user',
        }
      });
    }

    // Tạo Order và Mapple OrderItem
    await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount: price, // Giả sử mua 1 món
        status: 'pending', // Luôn pending lúc đầu
        paymentMethod: method === 'vnpay' || method === 'card' ? 'online' : 'cod',
        orderItems: {
          create: [{ productId, quantity: 1, price }]
        }
      }
    });

    revalidatePath('/dashboard/orders');
    return { success: true };
  } catch (error) {
    console.error('Customer order error:', error);
    return { success: false, error: 'Failed to process checkout' };
  }
}
