# Tổng quan Sản phẩm (Product Overview)

## 1. NetWiz là gì? (`CONFIRMED`)

**NetWiz (Project: Superhero)** là nền tảng hỗ trợ giảng dạy và học tập môn **Mạng máy tính (Computer Networking)**, kết hợp hệ thống quản lý học liệu, lớp học và kiến thức theo chương với **Gamification**.

- **Chủ đề cốt lõi:** Người học vào vai một anh hùng (`Aegis-01`) thực hiện nhiệm vụ bảo vệ thế giới mạng thông qua việc học kiến thức, giải quyết thử thách giữa chương và chiến đấu với các Boss đại diện cho từng chương học.
- **Nguyên tắc sư phạm:** Đây là nền tảng giáo dục, **không phải trò chơi thuần túy**. Game hóa đóng vai trò hỗ trợ động lực học tập; mọi trận đánh Boss đều gắn với mục tiêu kiến thức và bắt buộc có lời giải thích đáp án.

---

## 2. Mục tiêu sản phẩm & Đối tượng sử dụng (`CONFIRMED`)

| Đối tượng | Mục tiêu sử dụng chính |
|---|---|
| **Khách (Guest)** | Tìm hiểu nền tảng, khám phá các khóa học công khai, xem cấu trúc chương và đọc các ghi chú được sinh viên chia sẻ công khai. |
| **Sinh viên (Student)** | Theo dõi tiến độ học tập, học bài theo chương, làm nhiệm vụ tương tác nhận vật phẩm, chiến đấu với Boss, ôn lại câu hỏi sai và quản lý ghi chú cá nhân. |
| **Giảng viên (Lecturer)** | Tạo và quản lý lớp học, biên soạn cấu trúc khóa học/bài học/ngân hàng câu hỏi/Boss, biểu quyết đồng thuận trên khóa học dùng chung và theo dõi thống kê học tập. |
| **Quản trị viên (Admin)** | Giám sát tổng quan nền tảng và kiểm duyệt nội dung (gửi cảnh báo, nhắc nhở, khóa/mở khóa học liệu) mà không can thiệp sửa trực tiếp kiến thức. |

---

## 3. Các module & Luồng hoạt động chính (`IMPLEMENTED` dưới dạng Frontend Demo)

Dựa trên đặc tả [`docs/Prompt/Prompt UI.txt`](../Prompt/Prompt%20UI.txt) và mã nguồn [`Design/UI-final/`](../../Design/UI-final), nền tảng gồm 4 khu vực tương ứng 15 màn hình (`RoutePage`):

1. **Khu vực Guest:**
   - `landing` (Landing Page giới thiệu nền tảng & 4 vai trò)
   - `discovery` (Tìm kiếm & lọc khóa học công khai)
   - `course-preview` (Xem thông tin khóa học, danh sách chương, giảng viên phụ trách)
   - `shared-note` (Xem ghi chú công khai qua đường dẫn `#/shared-note/:noteId`)
2. **Khu vực Student:**
   - `student-dashboard` (Tổng quan khóa học, tiến độ, nhiệm vụ, lịch sử, câu sai, túi đồ Hero, lối tắt Global Notes)
   - `learning` (Giao diện học tập: danh sách chương/bài học, nội dung kiến thức, thanh tiến độ, nhiệm vụ tương tác ghép cặp/sắp xếp/tình huống, ghi chú nhanh; riêng Demo V3 có thêm `NetworkInspector` 4 lớp)
   - `boss-battle` (Đấu trường Boss: dùng vật phẩm từ Inventory, trả lời câu hỏi gây sát thương, thua về 0 HP chuyển luyện tập, tái đấu đổi câu đúng sang câu mới cùng `knowledgeObjective` và giữ câu sai)
   - `notes` (3 tab: Chapter Notes, Global Notes, Wrong Answers kèm chế độ luyện tập khắc phục câu sai)
3. **Khu vực Lecturer:**
   - `lecturer-dashboard` (Tổng quan lớp học, khóa học, đề xuất chờ duyệt, cảnh báo từ Admin)
   - `classrooms` (Tạo/sửa lớp học, thêm sinh viên bằng `joinCode`, xem chi tiết tiến độ sinh viên)
   - `knowledge` (Tạo khóa học, chương, bài học nháp/công bố, sắp xếp/di chuyển bài học, ngân hàng câu hỏi tách rời, cấu hình Boss)
   - `proposals` (Xem diff trước/sau và biểu quyết đề xuất chỉnh sửa khóa học dùng chung)
   - `analytics` (Tỷ lệ đúng, hoàn thành chương, kết quả Boss, kiến thức sinh viên hay sai — ẩn hoàn toàn ghi chú cá nhân SV)
4. **Khu vực Admin:**
   - `admin-dashboard` (Tổng quan người dùng, khóa học, lớp học, nội dung bị cảnh báo, nhật ký gần đây)
   - `moderation` (Xem chỉ đọc nội dung & lịch sử phiên bản, gửi cảnh báo/nhắc nhở, khóa/mở khóa bài học, xem lịch sử xử lý)

---

## 4. Hiện trạng Triển khai vs Định hướng Tương lai

| Hạng mục | Trạng thái hiện tại | Chi tiết xác minh |
|---|---|---|
| **Giao diện chính thức `Design/UI-final` (+ `Design/Style/`)** | `IMPLEMENTED` (Frontend Simulation) | Chạy đầy đủ luồng tương tác bằng React state, Mock Data (`src/data/mockData.ts`) và `localStorage`; chốt style Cyber Academy. |
| **Bộ dữ liệu mẫu Mạng máy tính** | `IMPLEMENTED` (Mock Data) | 3 khóa học (`CN-101` 5 chương, `NS-204`, `RS-202`), 13 bài học, 32 câu hỏi, 1 Hero (`Aegis-01`), 7 Boss, 1 lớp học 10 SV, 3 giảng viên, 1 admin. |
| **Ứng dụng Production tại thư mục gốc** | `PLANNED` | Các file gốc (`index.html`, `js/main.js`, `style/Style.css`, `Pages/`) hiện đều rỗng (0 byte từ `init commit`). |
| **Backend API, Database & Auth thực tế** | `PLANNED` (Not Implemented) | Chưa có máy chủ, cơ sở dữ liệu, JWT/OAuth hay kiểm soát quyền phía server. |
| **Đồng bộ dữ liệu đa người dùng thực** | `PLANNED` (Not Implemented) | Hiện các vai trò chuyển đổi trên cùng trình duyệt thông qua `LoginModal` và `switchActiveLecturer`. |
| **Kiểm thử tự động (Unit / E2E Tests)** | `PLANNED` (Not Implemented) | Chưa có Jest, Vitest hay Playwright; mới kiểm tra bằng `tsc --noEmit` và `vite build`. |
