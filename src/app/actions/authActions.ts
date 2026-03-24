'use server';

import { prisma } from '@/lib/prisma';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'a-very-secure-jwt-secret-for-this-demo-app'
);

export async function loginAction(email: string, password: string) {
  try {
    // 1. Tìm người dùng trong DB
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return { success: false, error: 'Tài khoản không tồn tại!' };
    }

    // 2. Kiểm tra mật khẩu (thực tế nên dùng bcrypt, đây là demo nên kiểm tra plaintext theo seed)
    if (user.password !== password) {
      return { success: false, error: 'Mật khẩu không chính xác!' };
    }

    if (user.role === 'user') {
      return { success: false, error: 'Tài khoản khách hàng không được truy cập Admin Portal!' };
    }

    // 3. Tạo JWT Token
    const jwt = await new SignJWT({ 
      id: user.id, 
      email: user.email, 
      role: user.role, 
      name: user.name 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('2h')
      .sign(JWT_SECRET);

    // 4. Lưu vào HttpOnly Cookie
    const cookieStore = await cookies();
    cookieStore.set('auth_token', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7200, // 2 giờ
      path: '/'
    });

    return { success: true };
  } catch (error) {
    console.error('Login Error:', error);
    return { success: false, error: 'Co lỗi xảy ra. Hãy thử lại!' };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
  redirect('/');
}

// Hàm dùng chung cho các Server Components để lấy thông tin Auth User
export async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) return null;

  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload;
  } catch (error) {
    return null;
  }
}
