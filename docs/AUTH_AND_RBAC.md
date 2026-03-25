# Hệ thống Xác thực & Phân quyền (Auth & RBAC)

Dự án này tuân theo một tiêu chuẩn cực kỳ an toàn cho Single Sign-On dựa trên Edge JWT thay vì lưu trữ Cookie/Session dạng truyền thống hoặc can thiệp bằng thư viện cồng kềnh (như NextAuth).

## 1. Khai sinh JSON Web Token (JWT)
Khi người dùng nhập Form Login, Server Action (`authActions.ts`) sẽ vào DB check `email` và `password`. Nếu đúng:
Hệ thống sử dụng thư viện `jose` (phiên bản chạy trên Edge Runtime siêu mịn) để tạo 1 cục Token (JWT String).
Sau đó mã JWT này được "Bọc lót" bên trong hệ thống `cookies` với format:
- `httpOnly: true` (Tuyệt đối không cấp cho JavaScript phía Front-End quyền đọc Cookie, chống XSS triệt để).
- `secure: true` trên môi trường Production (Chống bắt gói tin MiTM).

## 2. Giải phẫu Middleware (`src/middleware.ts`)
Là lớp tường lửa ở lớp cửa khẩu Request (chạy trước cả khi component React kịp render code).
### Điều lệ 1: Truy cập ẩn danh (Guest)
Bất kể URL nào có prefix `/dashboard/*` mà có Http Request trỏ đến, Middleware sẽ móc vào headers xem Cookie `auth_token` có tồn tại hợp lệ hay không. Nếu Null/Hết hạn -> Điều hướng tóm gáy về '/' - Văng ngược lại trang Login.

### Điều lệ 2: Block Phân quyền (RBAC - Role-Based Access Control)
Admin (Nhà quản trị lớn nhất) có thể vào mọi nơi.
Nhưng Role Editor (Biên tập viên của công ty) tuy có JWT Cookie hợp pháp, nhưng trong Payload jwt báo `role: "editor"`. Khi cố gõ đường link xâm phạm vào `/dashboard/users` (Trang xem hồ sơ và xoá Nhân Sự/Khách Hàng của Cty). Middleware sẽ tóm được rule này và đá văng ngược về `/dashboard`.

## 3. Các hàm Helper (Get Auth User)
Bất kỳ một Server Component (vd Layout của Dashboard) muốn biết có tài khoản nào gọi lên, chỉ cần gọi hàm Async `getAuthUser()` (sẽ bung mã hoá JWT từ Request Headers cookie) để in tên `name` và định dạng ra Layout.
