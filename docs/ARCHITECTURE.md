# Kiến trúc Hệ thống (System Architecture)

Dự án được xây dựng dựa trên kiến trúc tiên tiến nhất của hệ sinh thái React: **Next.js App Router**.

## 1. Thành phần Công nghệ cốt lõi
- **Framework:** Next.js 15+ (React 19)
- **Styling:** Tailwind CSS tích hợp cùng Shadcn UI. Tái sử dụng các thẻ biến Tailwind (utility classes) để thiết kế giao diện Glassmorphism độc đáo.
- **ORM & Cơ sở dữ liệu:** Prisma ORM đóng vai trò tương tác trực tiếp xuống Database. Sử dụng SQLite làm Database tĩnh cục bộ (nhằm giúp dự án môn học dễ dàng di chuyển và thiết lập cho giáo viên chấm điểm mà không cần cài server rời như XAMPP/MySQL).
- **Authentication:** Mã hóa Json Web Token (JWT) qua thư viện `jose` và lưu trên định dạng `HttpOnly Cookie`.

## 2. Luồng truy xuất dữ liệu (Data Fetching Flow)
Sử dụng mô hình **Server Components** kết hợp với **Server Actions** - không dùng Redux hay API Routes thông thường:
- **Server Component (`page.tsx`):** Thực thi lệnh kết nối thẳng vào database (thông qua Prisma), truy vấn dữ liệu theo dạng SSR (Server-Side Rendering) và ném trực tiếp Data vào cho các Client Component (`*Client.tsx`). Quá trình này giúp trang web load tức thời, SEO hoàn hảo và cực kỳ bảo mật (không lộ API cho client).
- **Client Component (`*Client.tsx`):** Sẽ render các UI có tính tương tác cao (Nút bấm, Input form, Hoạt ảnh `Framer Motion`). 
- **Server Actions (`actions/*.ts`):** Rất khác biệt so với kỹ thuật fetch API truyền thống. Server Action là các hàm Async chạy trên Server. Khi giao diện Client cần Cập nhật/Thêm/Xóa dữ liệu, nó sẽ gọi trực tiếp các Server Action thay vì tạo lập fetch HTTP rườm rà.

## 3. Cấu trúc Thư mục trọng tâm
```
src/
├── app/
│   ├── actions/        # Các Server Actions tương tác với Prisma DB (auth, orders, products, users)
│   ├── checkout/       # Trang Cửa hàng thanh toán (UI Client hướng khách)
│   ├── dashboard/      # Toàn bộ Layout và view của Admin Portal
│   ├── shop/           # Storefront hiển thị sản phẩm real-time cho User mua
│   ├── layout.tsx      # Entry HTML chính, định nghĩa thẻ body
│   └── page.tsx        # Trang form đăng nhập tĩnh
├── components/         # Chứa những mảnh ghép linh kiện UI nhỏ lẻ (vd: Chatbot.tsx)
├── lib/
│   ├── prisma.ts       # Nơi khai báo connection Prisma (Singleton Pattern)
│   └── utils.ts        # Hàm merge nối chuỗi Tailwind (`cn`)
└── middleware.ts       # Bảo vệ Route, chặn các request truy cập không được uỷ quyền
```
