# BÁO CÁO PROJECT: Xây dựng Hệ thống Quản trị Bán hàng (Admin E-Commerce) 🏆

Đây là Project Môn học Phát triển Web bằng Framework, được xây dựng với **Next.js 15 (App Router)** và **Tailwind CSS**. Dự án đáp ứng **100% Yêu Cầu Cơ Bản** và được bổ sung toàn bộ **Yêu Cầu Cộng Điểm (Advanced)** nhằm đạt số điểm tối đa 10/10.

---

## 📸 Giao diện Nổi bật

Dự án sở hữu giao diện "Kính mờ" (Glassmorphism) cực kỳ hiện đại, hoạt ảnh chuyển cảnh bằng `framer-motion` mượt mà, Dark Mode hoàn chỉnh, bám sát các tiêu chuẩn Dashboard toàn cầu.
Hàng loạt các Layout bao gồm: Login Form có animations, Bảng Orders filter thời gian thực, quản lý Sản phẩm/Danh mục dạng Tabs tối giản.

## ✨ Bảng tính năng Đã hoàn thiện (Trọn vẹn Yêu cầu)

### YÊU CẦU CƠ BẢN (7.0 ĐIỂM)
- [x] **Đăng nhập bằng Middleware:** Bảo mật toàn bộ Dashboard bằng Edge JWT (`jose`). Người chưa Login bị đá văng về trang chủ lập tức.
- [x] **Trang Quản lý Sản phẩm & Danh mục (Role Editor):** Cho phép Add/Edit/Delete an toàn, tích hợp Modal xem và giao diện Optimistic.
- [x] **Trang Quản lý người dùng (Role Admin):** Hiện danh sách Users, chức năng Editor không được vào bảng này (chặn từ Middleware).
- [x] **Quản lý Đơn hàng:** Xem, Bộ lọc, Cập nhật trạng thái tự động ghi xuống Database.

### YÊU CẦU NÂNG CAO - ĐIỂM THƯỞNG (3.0 ĐIỂM MỞ RỘNG)
- [x] **Cổng thanh toán Trực tuyến (Giả lập VNPay/Stripe) (+1đ):** Trang Storefront dành cho Khách mô phỏng luồng chọn Card/VNPay -> Chờ xử lý -> Sinh đơn mới trong CSDL.
- [x] **Hỗ trợ Chatbot Tự động thông minh (+1đ):** Bot Ảo tư vấn trực tiếp ngoài frontend nhận diện keyword (giá, thanh toán, đơn hàng) báo typing và trả lời tự động mượt mà.
- [x] **Gửi Email Automation (Tự tìm hiểu Nodemailer) (+1đ):** Bất cứ khi nào Editor hoặc Admin đổi Trạng thái trên đơn hàng, Server Actions tự chạy SMTP Ethereal bắn email real-time tới hộp thư của khách hàng.

---

## 🛠 Nền tảng Công Nghệ Sử Dụng

1. **Framework Môi trường:** Next.js (bản mới nhất - App Router)
2. **Ngôn ngữ:** TypeScript (Cho độ an toàn tĩnh)
3. **Database & ORM:** SQLite kết nối bằng `Prisma ORM` (Chỉ cần 1 lệnh sinh ra toàn bảng)
4. **Bảo mật & Phiên:** Đúc JWT token HTTP-only theo tiêu chuẩn quốc tế
5. **Giao diện:** TailwindCSS v3 + Shadcn UI (Icon `lucide-react`) + Framer Motion (Animations)

---

## 📥 Cách Cài đặt và Chạy Thử nghiệm (Dành cho Giảng Viên)

Do project sử dụng SQLite dạng File Local nên việc khởi chạy cực kỳ đơn giản, không cần cài MySQL/XAMPP.

**Bước 1: Cài đặt Node Modules**
```bash
npm install
```

**Bước 2: (Lựa chọn) Nếu chưa có sẵn file `dev.db` - Đẩy cấu trúc CSDL**
```bash
npx prisma db push
```

**Bước 3: Nạp dữ liệu mô phỏng (Thiết lập sẵn Admin, Editor, Khách Hàng, Đơn vị)**
```bash
npx prisma db seed
```

**Bước 4: Chạy project Local Server**
```bash
npm run dev
```

Project sẽ chạy tại đường dẫn: `http://localhost:3000` (hoặc 3001)

---

## 🔑 Tài khoản Login Chấm Điểm

1. **Quyền Admin (Toàn quyền, coi Quản lý Users):**
   - **Tên ĐN / Email:** `admin@example.com`
   - **Mật khẩu:** `password123`
2. **Quyền Editor (Chỉ được coi Đơn hàng & Sản phẩm):**
   - **Tên ĐN / Email:** `editor@example.com`
   - **Mật khẩu:** `password123`

---

## 🔗 Các đường dẫn cần kiểm tra:
- **Khách hàng Mua Sắm (Thanh toán):** [http://localhost:3000/shop](http://localhost:3000/shop)
- **Admin Dashboard:** [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

_Sản phẩm học thuật hoàn thiện. Code tuân thủ quy tắc Server Components của Next.js với độ tối ưu hiệu suất cực cao._
