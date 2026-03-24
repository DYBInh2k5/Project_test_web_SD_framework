import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'a-very-secure-jwt-secret-for-this-demo-app'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  // Nếu truy cập vào /dashboard
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      // Nhảy về trang Đăng nhập
      return NextResponse.redirect(new URL('/', request.url));
    }

    try {
      // Decode JWT và kiểm tra Role Middleware
      const verified = await jwtVerify(token, JWT_SECRET);
      const user = verified.payload as { role: string };

      // [YÊU CẦU MÔN HỌC]: Role Editor không được truy cập trang Users
      if (pathname.startsWith('/dashboard/users') && user.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      return NextResponse.next();
    } catch (e) {
      // Token lỗi hoặc hết hạn
      const response = NextResponse.redirect(new URL('/', request.url));
      response.cookies.delete('auth_token');
      return response;
    }
  }

  // Nếu đã đăng nhập mà vẫn cắm đầu vào trang Login (Root)
  if (pathname === '/') {
    if (token) {
      try {
        await jwtVerify(token, JWT_SECRET);
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } catch (e) {
        // Token lỗi --> xóa 
        const response = NextResponse.next();
        response.cookies.delete('auth_token');
        return response;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*'],
};
