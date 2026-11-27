# Hệ thống Thiết kế UI/UX (UI/UX Design System)

Dự án **NetWiz** đã hoàn tất giai đoạn thử nghiệm giao diện (V1, V2, V3) và **chốt chính thức một Design System duy nhất**: **Cyber Academy (`UI-final`)** kết hợp chế độ đọc dịu mắt và chuyển đổi Sáng / Tối.

- **Ứng dụng tham chiếu chuẩn:** [`Design/UI-final/`](../../Design/UI-final)
- **Gói CSS độc lập để tái sử dụng:** [`Design/Style/`](../../Design/Style/README.md) (`tokens.css`, `cyber-academy.css`)
- **Đặc tả chi tiết bộ Style đã chốt:** [`ui-style-final.md`](./ui-style-final.md)

*(Các bản thử nghiệm cũ `demo-v1`, `demo-v2` và file tham chiếu `css-dc-academy.html` đã được dọn khỏi thư mục làm việc; lịch sử mã nguồn vẫn lưu trong Git ở các commit `42a390c` và `f6f8a2b`.)*

---

## 1. Nguyên tắc thiết kế cốt lõi (`CONFIRMED`)

1. **Giáo dục làm trọng tâm:** Giữ rõ nội dung bài giảng (`max-w-[68ch]`), giải thích đáp án và phân tách quyền của 4 vai trò (**Guest, Student, Lecturer, Admin**).
2. **Dịu mắt cho học tập dài hạn:** Dùng bề mặt đọc `--reading-bg` riêng, bảng màu Soft Slate (Tối) / Daylight Paper (Sáng) và tùy chọn **Dịu mắt (Calm Mode)** tắt hạt nhiễu & hoạt ảnh.
3. **Không dùng văn bản giữ chỗ vô nghĩa:** Toàn bộ giao diện dùng dữ liệu chủ đề **Computer Networking** tiếng Việt kèm thuật ngữ mạng tiếng Anh chuẩn.
4. **Responsive & Tiếp cận:** Hỗ trợ Desktop, Tablet, Mobile, phím `Tab`, vòng focus rõ nét (`3px solid var(--yellow-fg)`) và `@media (prefers-reduced-motion: reduce)`.

---

## 2. Tổng quan Hệ thống UI Final (`IMPLEMENTED`)

| Thành phần | Quy chuẩn đã chốt |
|---|---|
| **Chế độ màu** | **Tối (`Soft Slate Midnight`)** mặc định & **Sáng (`Daylight Academy Paper`)** qua nút icon đơn gộp trên header (`netwiz_v3_theme`). |
| **Shell & Header** | `AcademyShell.tsx`: Header 78px, nhóm điều hướng nằm trong khung bo viền (`whitespace-nowrap`), thanh tiến độ Boss, 1 nút icon gộp Sáng/Tối + Dịu mắt. |
| **Typography** | `Barlow Condensed` (Display/Title lớn), `Be Vietnam Pro` (Nội dung, ghi chú, giải thích), `JetBrains Mono` (CLI, IP/MAC, thông số). |
| **UI Primitives (`src/components/ui/`)** | `AcademyShell`, `Panel`/`Eyebrow`, `Button`, `Badge`, `DataTable`/`EmptyState`/`ToastContainer`, `Dropdown`, `Input`/`Textarea`/`Select`, `Modal`/`ConfirmDialog`, `ProgressBar`/`BossHealthBar`/`HeroHealthBar`, `Tabs`. |
| **Module trực quan đặc trưng** | `NetworkInspector.tsx` (5 mô hình mạng theo chương) và `BossBattle.tsx` (Boss Arena phân tách vùng hiệu ứng & vùng giải thích). |

Chi tiết toàn bộ bảng token màu, quy tắc sử dụng và cấu trúc CSS xem tại [`ui-style-final.md`](./ui-style-final.md).
