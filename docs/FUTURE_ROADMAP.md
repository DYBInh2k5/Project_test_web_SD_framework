# Lộ Trình Mở Rộng Hệ Thống Tương Lai (Future Roadmap)

Bộ công cụ Quản trị Khách hàng/Hóa Đơn hiện tại đã hoạt động vượt qua định mức của một Đồ án môn học Web Framwork Đại học. Nhưng với hệ kiến trúc thiết lập sẵn Next.js 15 Server-Actions mạnh mẽ, tương lai hoàn toàn có thể thương mại hoá. 

Những tính năng có thể code thêm vào trong những tuần dự án tiếp theo:

### 1. Phân mảnh Cơ sở dữ liệu sản phẩm (Product Variants & Inventory)
- **Tồn kho (Inventory Tracking):** Thêm trường `stock` vào bảng `Product`, trừ dần số lượng ngay tại nút Transaction của `customerActions.ts` lúc người mua bấm Order thanh toán.
- **Biến thể (Product Variants):** Một cái "iPhone 15" sẽ có 2 tuỳ biến màu (Trắng/Đen) và 3 tuỳ biến Dung lượng ổ (256/512/1TB). Cần phải tách thành bảng `Product_Attributes_Values`.

### 2. Live Webhook Cổng Thanh Toán Trực Tuyến
Hiện tại đường dẫn thanh toán `/checkout` đóng vai trò Demo giả lập trạng thái chờ thẻ tiến trình ảo để tạo Hóa đơn (Order status online).
Khi triển khai thương mại:
- **Tích hợp VNPay:** Thay thế `handlePayment` thành API redirect bắn mã Hash tới VNPay.
- Gắn **Route handler API** `src/app/api/vnpay/ipn/route.ts` để đón Webhook VNPay bắn về server nhằm set `status="processing"` thay vì hardcode.

### 3. Tối ưu Công nghệ Gửi Email
Thay thế Test Sandbox _(Ethereal Email)_ đang cấu hình SMTP trong phần đổi trạng thái Đơn Hàng bằng **Resend API** (Bộ dịch vụ email quốc dân cho React/Next.js). Đồng thời thiết kế E-mail Template xịn xò thông quan nền tảng `React-Email`.

### 4. Bảng biểu Thống kê Charts
Trang Dashboard hiện tại mới hiển thị con số Text String. Chúng ta sẽ gắn thư viện `Recharts` hoặc `Tremor` để query DB ra các biểu đồ Line/Bar theo Doanh thu các tháng trong năm (Vô cùng thích mắt cho đồ án báo cáo thực tế).

### 5. Dịch vụ Cloud (PostgreSQL / AWS S3)
Xóa file Database `dev.db` (do SQLite dính vào đĩa vật lý local máy), cài lại Prisma connect String sang một `pooler` PostgreSQL chạy trên nền tảng Supabase / Vercel KV làm nền móng Cloud siêu tốc độ. Lưu hình ảnh sản phẩm (Upload Files gốc) đẩy lên AWS S3 Bukcet thay vì gõ tay URL từ web thứ 3 tĩnh.
