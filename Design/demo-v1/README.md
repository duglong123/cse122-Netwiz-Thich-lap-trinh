# NetWiz – Project: Superhero (UI/UX Demo V1)

Phiên bản giao diện **Demo V1** cho nền tảng hỗ trợ giảng dạy và học tập môn **Mạng máy tính** kết hợp **Gamification** chiến thuật (React + TypeScript + Tailwind CSS + LocalStorage).

## Cài đặt và chạy dự án

> Lưu ý trên Windows nếu PowerShell chặn `npm.ps1`, hãy dùng `npm.cmd`:

```bash
cd demo-v1
npm.cmd install
npm.cmd run dev
```

Mở trình duyệt tại địa chỉ hiển thị trên terminal (mặc định `http://localhost:5173`).

Để kiểm tra TypeScript và build production:

```bash
npx.cmd tsc --noEmit
npm.cmd run build
```

## Kiến trúc thư mục

- `src/types/index.ts`: Toàn bộ định nghĩa kiểu dữ liệu (Course, Chapter, Lesson, Question Bank, Hero, Boss, Notes, Proposals, Moderation).
- `src/data/mockData.ts`: Mock Data chủ đề **Computer Networking** gồm 5 chương, 1 Hero (`Aegis-01`), 5 Boss, nhiệm vụ tương tác (ghép cặp, sắp xếp, tình huống), ngân hàng câu hỏi tách rời kèm giải thích, 1 lớp học 10 sinh viên, 3 giảng viên đồng sở hữu và dữ liệu kiểm duyệt mẫu.
- `src/store/AppContext.tsx`: Quản lý Frontend State tập trung, lưu bền vững vào `localStorage` (`netwiz_superhero_demo_v1_state`), hỗ trợ reset dữ liệu demo.
- `src/components/ui/`: Bộ Design System chuẩn Command Cobalt (Sidebar, TopNav, Breadcrumbs, Card, Modal, ConfirmDialog, Tabs, Dropdown, HealthBar, ProgressBar, DataTable, Badge, Toast, FormControls).
- `src/features/`:
  - `guest/`: Landing Page, Course Discovery, Course Preview, Shared Public Note, Demo Login/Register.
  - `student/`: Student Dashboard, Learning Interface + Interactive Missions, Boss Battle (cơ chế thay câu đúng khi tái đấu & giữ câu sai kèm giải thích), Notes Hub (Chapter Notes, Global Notes, Wrong Answers).
  - `lecturer/`: Lecturer Dashboard, Classroom Management, Knowledge Management & Question Bank, Shared Course 100% Consensus Proposals, Learning Analytics (ẩn ghi chú riêng tư SV).
  - `admin/`: Admin Dashboard, Content Moderation (chỉ đọc kiến thức, cảnh báo, khóa/mở khóa và lưu lịch sử kiểm duyệt).

## Hướng dẫn trải nghiệm nhanh 4 vai trò

1. **Guest (Khách)**: Xem Landing Page, tìm kiếm/lọc khóa học ở *Khám phá khóa học*, mở chi tiết *CN-101*, và xem *Ghi chú công khai*.
2. **Student (Sinh viên – Nguyễn Minh Anh)**: Mở *Learning Interface*, làm nhiệm vụ Chương 3 để nhận vật phẩm `OSI Prism Core`, vào *Boss Battle* đánh `OSI Leviathan`, thử trả lời sai để xem giải thích & thua về 0 HP rồi bấm **Đánh Boss lại (Rematch)** để thấy câu đúng được đổi sang câu mới cùng mục tiêu kiến thức còn câu sai được giữ lại. Mở *Notes* để chuyển ghi chú từ Riêng tư sang Công khai.
3. **Lecturer (3 Giảng viên đồng sở hữu CN-101)**: Tạo lớp học mới, xem tiến độ sinh viên (không có ghi chú riêng tư), sửa bài học đã công bố để tạo *Đề xuất chỉnh sửa*, chuyển nhanh qua tài khoản **ThS. Lê Hoàng Nam** ở góc trên để bấm *Đồng ý chỉnh sửa* đạt **100% đồng thuận** và tự động công bố phiên bản mới.
4. **Admin (Phạm Quốc Bảo)**: Xem *Nội dung đang bị cảnh báo*, gửi cảnh báo mới hoặc **Khóa** một bài học kèm lý do (kiểm tra sang tab Sinh viên/Giảng viên để thấy trạng thái khóa nhưng lịch sử phiên bản vẫn giữ nguyên), sau đó **Mở khóa** và kiểm tra *Lịch sử kiểm duyệt*.
