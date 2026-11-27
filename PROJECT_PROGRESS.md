# Tiến trình Dự án NetWiz (PROJECT_PROGRESS)

Đây là nguồn thông tin trung tâm để theo dõi trạng thái triển khai, cột mốc, hoạt động gần đây và các vấn đề đang mở của **NetWiz (Project: Superhero)** qua nhiều phiên làm việc và nhiều AI Agent.

---

## 1. Project Summary

| Thuộc tính | Giá trị hiện tại (`CONFIRMED`) |
|---|---|
| **Tên dự án** | NetWiz – Project: Superhero (Gamified Learning Platform for Computer Networking) |
| **Mục tiêu** | Nền tảng hỗ trợ giảng dạy và học tập môn Mạng máy tính cho 4 vai trò (**Guest, Student, Lecturer, Admin**), kết hợp quản lý học liệu, lớp học, đồng thuận khóa học chung và Gamification (Hero, Nhiệm vụ, Boss Battle). |
| **Giai đoạn hiện tại** | **Phase 1: UI/UX Prototyping (V1–V3) & Documentation Foundation** |
| **Trạng thái tổng thể** | Đã hoàn thiện 3 bản UI/UX Demo Frontend tương tác đầy đủ bằng Mock Data + `localStorage`; **chưa bắt đầu** ứng dụng Production, Backend, API, Database và Automated Testing. |
| **Các module chính (Frontend Demo)** | `guest` (Landing, Discovery, Preview, Shared Note), `student` (Dashboard, Learning + Missions + Inspector V3, Boss Battle, Notes & Wrong Answers), `lecturer` (Dashboard, Classrooms, Knowledge & Question Bank, Shared Proposals, Analytics), `admin` (Dashboard, Read-Only Content Moderation). |

---

## 2. Development Status

> Quy ước trạng thái: `NOT_STARTED` | `IN_PROGRESS` | `BLOCKED` | `REVIEW` | `COMPLETED`

| Task ID | Task | Status | Evidence | Last Updated |
|---|---|---|---|---|
| `TASK-001` | Khởi tạo repository & placeholder gốc | `COMPLETED` | Commit `eeea5f1` (`2026-11-25`), `assets/images/Boss demo.jpg`, `.gitignore` | `2026-11-25` |
| `TASK-002` | Đặc tả yêu cầu gốc UI/UX Demo V1 | `COMPLETED` | Commit `81ed09b` (`2026-11-27`), [`docs/Prompt/Prompt UI.txt`](./docs/Prompt/Prompt%20UI.txt) (428 dòng) | `2026-11-27` |
| `TASK-003` | UI/UX Demo V1 (`Dark Command Cobalt`) | `COMPLETED` | Commit `42a390c`, [`Design/demo-v1/`](./Design/demo-v1); `npx.cmd tsc --noEmit` thoát mã `0` (`2026-11-27`) | `2026-11-27` |
| `TASK-004` | UI/UX Demo V2 (`Focus Studio`) | `COMPLETED` | Commit `f6f8a2b`, [`Design/demo-v2/`](./Design/demo-v2); `npx.cmd tsc --noEmit` thoát mã `0` (`2026-11-27`) | `2026-11-27` |
| `TASK-005` | UI/UX Demo V3 (`Cyber Academy`) + Audit Ergonomics & Boss Effects | `REVIEW` | [`Design/demo-v3/`](./Design/demo-v3); `npx.cmd tsc --noEmit` & `npm.cmd run build` thoát mã `0` (`1.63s`), HTTP `200` trên `:5175`; chưa commit Git và chưa kiểm tra trực quan bằng Chrome DevTools | `2026-11-27` |
| `TASK-006` | Hệ thống Tài liệu Dự án & Theo dõi Tiến trình (`docs/`, `README.md`, `PROJECT_PROGRESS.md`) | `COMPLETED` | Đã tạo & cập nhật 15/15 file bắt buộc; kiểm tra tự động 104/104 liên kết nội bộ hợp lệ, 0 lỗi (`2026-11-27`) | `2026-11-27` |
| `TASK-007` | Chốt Design System Production & viết ADR kiến trúc chính thức | `NOT_STARTED` | Chưa có quyết định chọn V1/V2/V3 hoặc kết hợp cho bản chính thức | `2026-11-27` |
| `TASK-008` | Khởi tạo ứng dụng Frontend Production tại gốc (hoặc workspace thống nhất) | `NOT_STARTED` | `index.html`, `js/main.js`, `style/Style.css` hiện 0 byte | `2026-11-27` |
| `TASK-009` | Xây dựng Backend API, Database & Real Authentication / RBAC | `NOT_STARTED` | Chưa có thư mục server, API hay database schema | `2026-11-27` |
| `TASK-010` | Thiết lập Linter, Automated Tests (Unit/E2E) & CI/CD | `NOT_STARTED` | `package.json` hiện chưa có `lint` hoặc `test` scripts | `2026-11-27` |

---

## 3. Milestones

| Milestone | Mục tiêu | Công việc chính | Trạng thái | Điều kiện hoàn thành | Phụ thuộc |
|---|---|---|---|---|---|
| **M0: Discovery & Spec** | Chuẩn hóa yêu cầu ban đầu | Khởi tạo repo, lưu đặc tả `Prompt UI.txt` | `COMPLETED` | Có tài liệu yêu cầu và cấu trúc repo ban đầu | — |
| **M1: UI/UX Prototypes (V1–V3)** | Thử nghiệm 3 hướng UI/UX tương tác đầy đủ | Xây dựng `demo-v1`, `demo-v2`, `demo-v3` với Mock Data + `localStorage` | `REVIEW` | Cả 3 bản pass `tsc` + `build`, kiểm tra trực quan V3 và commit V3 lên Git | M0 |
| **M2: Documentation & Agent Memory** | Tạo hệ thống tài liệu & nhật ký tiến trình | Hoàn thiện `README.md`, `PROJECT_PROGRESS.md`, `docs/project-experience/`, `docs/technical-knowledge/` | `COMPLETED` | Tất cả 15/15 file tồn tại, không rỗng, 104/104 link nội bộ hợp lệ | M0, M1 |
| **M3: Architecture & Production Frontend** | Chốt kiến trúc & dựng codebase chính thức | Quyết định UI system, hợp nhất `types`, tách API client, thiết lập lint/test | `NOT_STARTED` | Có ADR kiến trúc, codebase gốc build & test xanh | M1, M2 |
| **M4: Backend, DB & Auth/RBAC** | Triển khai lưu trữ thật & phân quyền phía server | Xây dựng API, DB schema chuẩn hóa, Auth/RBAC, đồng thuận & quyền riêng tư thật | `NOT_STARTED` | Mọi quy tắc trong `business-rules.md` được thực thi phía server | M3 |
| **M5: QA & Launch Readiness** | Kiểm thử toàn diện trước phát hành | E2E tests cho 4 vai trò, kiểm tra bảo mật/hiệu năng, CI/CD | `NOT_STARTED` | Pass 100% bộ test chính và checklist phát hành | M4 |

---

## 4. Recent Activity

## 2026-11-25

### Completed
- Khởi tạo repository NetWiz (`eeea5f1`) với file placeholder gốc, `.gitignore`, `assets/images/Boss demo.jpg`.
- Tạo `README.md` ban đầu cho dự án (`b7e0360`).

### Modified Files
- `README.md`, `.gitignore`, `index.html`, `js/main.js`, `style/Style.css`, `assets/images/Boss demo.jpg`

### Verification
- Đã xác minh qua `git log` (`eeea5f1`, `b7e0360`).

### Issues
- Chưa có mã nguồn ứng dụng ở thư mục gốc.

### Next Steps
- Xây dựng đặc tả và các bản UI/UX Demo.

---

## 2026-11-27

### Completed
- Hoàn thành và commit `Design/demo-v1` (`42a390c`), `Design/demo-v2` (`f6f8a2b`) và đặc tả `docs/Prompt/Prompt UI.txt` (`81ed09b`).
- Xây dựng `Design/demo-v3` (trích xuất phong cách `Design/css-dc-academy.html`), chạy đánh giá workflow về **tính tiện dụng dài hạn** và **hiệu ứng Boss cuối**, và áp dụng các tinh chỉnh (Calm Mode toàn diện, thu gọn mục lục, panel ghi chú song song, cô lập `.arena-flash`, Phase-2 Enrage & cao trào Boss Chương 5 `Zero-Day Phantom`).
- Xây dựng hệ thống tài liệu dự án tại `docs/README.md`, `docs/project-experience/*`, `docs/technical-knowledge/*`, `PROJECT_PROGRESS.md` và chuẩn hóa `README.md`.
- Thiết kế lại `NetworkInspector.tsx` và `inspectorData.ts` (cùng chip telemetry trên `LandingPage.tsx`) của `Design/demo-v3` từ mô hình hộp CSS lồng nhau sang 5 mô hình trực quan chuyên biệt cho Mạng máy tính (`pipeline`, `topology`, `encapsulation` + Wire Frame Dissector, `handshake-cidr`, `security-perimeter`) kèm Protocol Telemetry & CLI Console.
- Nâng cấp bảng màu dịu mắt cho đọc bài/ghi chú và bổ sung tùy chỉnh **Sáng (`Daylight Paper`) / Tối (`Soft Slate Midnight`)** cho toàn bộ `Design/demo-v3` (`netwiz_v3_theme` + CSS tokens).

### Modified Files
- `README.md`, `PROJECT_PROGRESS.md`, `docs/README.md`
- `docs/project-experience/README.md`, `lessons-learned.md`, `bug-and-fix-log.md`, `implementation-guidelines.md`, `error-prevention-checklist.md`
- `docs/technical-knowledge/README.md`, `product-overview.md`, `business-rules.md`, `architecture.md`, `data-model.md`, `tech-stack.md`, `ui-ux-design-system.md`
- *(Từ phiên trước chưa commit)* `Design/css-dc-academy.html`, `Design/demo-v3/**`

### Verification
- `Design/demo-v1`: `npx.cmd tsc --noEmit` -> thoát mã `0`.
- `Design/demo-v2`: `npx.cmd tsc --noEmit` -> thoát mã `0`.
- `Design/demo-v3`: `npx.cmd tsc --noEmit` và `npm.cmd run build` -> thoát mã `0` (`✓ built in 1.63s`); kiểm tra HTTP `200` trên `http://localhost:5175/`, `/images/hero-sentinel.jpg`, `/images/boss-1.jpg`, `/images/boss-5.jpg`.
- Hệ thống tài liệu (`validate_docs.js`): `15/15` file bắt buộc đạt chuẩn, `104/104` liên kết nội bộ hợp lệ, `0` lỗi; `git status --short` xác nhận không sửa đổi ngoài phạm vi `Design/`, `docs/Prompt/`, `assets/` hoặc `.gitignore`.

### Issues
- Chưa kiểm tra trực quan `Design/demo-v3` trên trình duyệt thật (Chrome DevTools remote debugging không sẵn).
- Còn `BUG-004` (phạm vi đồng thuận khóa học chung), `BUG-005` (`.gitignore` & `cd` trong `demo-v1/README.md`) và các **OPEN QUESTION** trong `business-rules.md`.
- `Design/demo-v3`, `Design/css-dc-academy.html` và hệ thống `docs/` mới chưa được commit lên Git.

### Next Steps
- Chạy script kiểm tra toàn bộ file tài liệu và liên kết nội bộ; cập nhật `TASK-006` thành `COMPLETED` nếu đạt 100%.
- Kiểm tra trực quan `Design/demo-v3` trên trình duyệt thật (đặc biệt Boss Battle Chương 5 và Calm Mode).
- Chốt các câu hỏi mở về nghiệp vụ và quyết định Design System + Backend stack trước khi khởi tạo ứng dụng Production.

---

## 5. Open Issues

### Bugs chưa xử lý
- **`BUG-004` (High):** `saveLessonOrPropose` mới kích hoạt quy tắc đồng thuận 100% khi sửa `Lesson` `published` đã có; các thao tác sửa cấu trúc/câu hỏi/Boss khác trên khóa học chung vẫn ghi trực tiếp.
- **`BUG-005` (Low):** `.gitignore` tự liệt kê chính `.gitignore`; `Design/demo-v1/README.md` còn ghi `cd demo-v1`.

### Task chưa hoàn tất kiểm chứng / chưa commit
- Kiểm tra runtime/pixel bằng trình duyệt thật cho `Design/demo-v3` (hiện mới kiểm tra bằng `tsc`, `vite build` và HTTP `200`).
- Thay đổi của `Design/demo-v3`, `Design/css-dc-academy.html` và bộ tài liệu mới chưa được commit/push lên Git.

### Technical Debt
- Nhân bản `src/types/index.ts`, `src/data/mockData.ts` và phần lớn `src/store/AppContext.tsx` trên cả 3 thư mục `demo-v1`, `demo-v2`, `demo-v3`.
- Chưa có ESLint, Prettier, Vitest/Jest, Playwright hay CI/CD.
- Các file placeholder rỗng ở thư mục gốc (`index.html`, `js/main.js`, `style/Style.css`, `Pages/`).

### Unresolved Decisions & Risks
- Chưa chốt Design System chính thức (V1 vs V2 vs V3 vs kết hợp) và chưa chốt stack Backend/Database/Auth.
- 7 **OPEN QUESTION** trong [`docs/technical-knowledge/business-rules.md`](./docs/technical-knowledge/business-rules.md#8-open-questions-quy-tắc-chưa-được-xác-định-đầy-đủ) cần thống nhất trước khi code Backend.
- **Rủi ro:** Nếu tiếp tục phát triển tính năng mới trực tiếp trên cả 3 bản Demo mà không chốt codebase chính thức, chi phí đồng bộ sẽ tăng gấp ba.

---

## 6. Quy tắc cập nhật tiến trình

1. Cập nhật `PROJECT_PROGRESS.md` sau mỗi nhiệm vụ đáng kể.
2. **Không xóa lịch sử hoạt động cũ** trong mục *Recent Activity*.
3. **Không đánh dấu `COMPLETED`** nếu chưa có bằng chứng kiểm tra thực tế (lệnh đã chạy, kết quả thực tế).
4. Luôn cập nhật mục **Next Steps** và **Open Issues** phản ánh đúng hiện trạng.
5. Nếu phát hiện sai lệch giữa tài liệu và mã nguồn, ghi nhận và xử lý ngay trong phiên làm việc.
