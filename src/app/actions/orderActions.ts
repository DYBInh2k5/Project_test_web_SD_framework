'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import nodemailer from 'nodemailer';

export async function updateOrderStatus(orderId: string, newStatus: string) {
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
      include: { user: true } // Lấy tên và email khách hàng
    });

    // Mô phỏng cấu hình máy chủ Email (sử dụng Ethereal Email cho Dev)
    // Trong thực tế, bạn sẽ dùng smtp.gmail.com hoặc Resend API
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'mylene.lubowitz31@ethereal.email', // Cấu hình mẫu giả lập
        pass: 'E5R3cTQQ2S7yqV4MwP'
      }
    });

    const vietnameseStatus: Record<string, string> = {
      pending: 'Chờ xử lý', processing: 'Đang xử lý', shipped: 'Đang giao hàng', 
      delivered: 'Giao hàng thành công', cancelled: 'Đã hủy'
    };

    const mailOptions = {
      from: '"AdminPro E-commerce" <noreply@adminpro.com>',
      to: updatedOrder.user.email,
      subject: `[AdminPro] Cập nhật tiến độ đơn hàng #${updatedOrder.id.slice(0, 8).toUpperCase()}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
          <h2 style="color: #2563eb;">Xin chào ${updatedOrder.user.name},</h2>
          <p>Đơn hàng <strong>#${updatedOrder.id.slice(0, 8).toUpperCase()}</strong> của bạn vừa được cập nhật trạng thái mới.</p>
          <p style="background-color: #f3f4f6; display: inline-block; padding: 8px 16px; border-radius: 8px; font-weight: bold; font-size: 16px;">
            Trạng thái hiện tại: <span style="color: #ea580c;">${vietnameseStatus[newStatus] || newStatus}</span>
          </p>
          <p>Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi!</p>
          <br/>
          <p style="font-size: 12px; color: #9ca3af;">Email được tạo tự động bởi hệ thống AdminPro.</p>
        </div>
      `,
    };

    // Thực hiện gửi mail
    const info = await transporter.sendMail(mailOptions);
    console.log("==> ✅ Đã gửi Mail thành công! Xem thư tại URL: %s", nodemailer.getTestMessageUrl(info));

    revalidatePath('/dashboard/orders');
    return { success: true };
  } catch (error) {
    console.error('Error updating status:', error);
    return { success: false, error: 'Cannot update order status' };
  }
}

