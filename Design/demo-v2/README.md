# NetWiz – Project: Superhero (UI/UX Demo V2 · Focus Studio)

Phiên bản **Demo V2** được thiết kế lại hoàn toàn so với V1 theo hướng **Focus-First & Bảo vệ thị lực (Eye-Comfort High Contrast)**:

- **Widget tập trung theo tác vụ**: Loại bỏ thanh bên cố định và các bảng tổng hợp nhiều widget gây phân tâm. Mỗi màn hình tập trung vào một vùng làm việc chính (`max-w-3xl` / `max-w-4xl`), các công cụ phụ (Hero & Túi đồ, Mục lục chương, Ghi chú chương, Lịch sử, Chi tiết sinh viên, Kiểm duyệt chỉ đọc) mở bằng **SlideDrawer** theo nhu cầu.
- **Tăng cường độ tương phản & màu nền dịu mắt**:
  - **Chế độ Sáng (Warm Paper)**: Nền giấy ấm `#F6F4EE` + thẻ `#FFFFFF`, chữ than `#161614` (độ tương phản > 15:1), không lóa trắng gắt.
  - **Chế độ Tối (Warm Charcoal Ink)**: Nền than ấm `#161614` + thẻ `#1F1F1C`, chữ ngà `#F5F3EC` (độ tương phản > 14.5:1), không ánh sáng xanh lạnh.
  - Nút chuyển đổi **Sáng / Tối** ngay trên thanh điều hướng trên cùng, lưu bền vững vào `localStorage` (`netwiz_v2_theme`).
- **Đầy đủ chức năng 4 vai trò**: Guest, Student (1 Hero `Aegis-01`, Learning Studio, Nhiệm vụ tương tác, Boss Battle cơ chế đổi câu cùng mục tiêu khi tái đấu, 3 khu vực Ghi chú & Wrong Answers), Lecturer (Lớp học, Kiến thức & Ngân hàng đề tách rời, Đồng thuận 100%, Thống kê ẩn ghi chú riêng tư SV), Admin (Chỉ đọc kiến thức, Cảnh báo, Khóa/Mở khóa kèm lý do & log).

## Chạy Demo V2

```bash
cd Design/demo-v2
npm.cmd install
npm.cmd run dev -- --port 5174
```

Kiểm tra build:

```bash
npx.cmd tsc --noEmit
npm.cmd run build
```
