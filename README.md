# NetWiz – Hệ thống hỗ trợ giảng dạy và học tập môn Mạng máy tính

## 1. Giới thiệu dự án (Project Introduction)

**NetWiz (Project: Superhero)** là nền tảng hỗ trợ giảng dạy và học tập môn **Mạng máy tính (Computer Networking)**, kết hợp hệ thống quản lý học liệu theo chương, lớp học và cộng tác giảng viên với các hoạt động học tập được **game hóa**.

> **Trạng thái hiện tại:** Repository hiện chứa **3 bản UI/UX Demo Frontend** (`Design/demo-v1`, `Design/demo-v2`, `Design/demo-v3`) chạy hoàn toàn bằng Mock Data và `localStorage`. **Chưa có Backend, Database, API hoặc xác thực thực tế.** Vui lòng xem [`PROJECT_PROGRESS.md`](./PROJECT_PROGRESS.md) để theo dõi trạng thái chi tiết.

---

## 2. Tầm nhìn sản phẩm (Product Vision)

NetWiz giúp sinh viên tiếp cận kiến thức Mạng máy tính thông qua bài giảng theo chương, nhiệm vụ tương tác giữa chương và thử thách Boss Battle cuối chương. Gamification đóng vai trò thúc đẩy động lực; trọng tâm vẫn là hiểu bản chất kiến thức thông qua lời giải thích chi tiết và cơ chế ôn tập câu trả lời sai.

---

## 3. Các nhóm người dùng (User Roles)

| Vai trò | Trách nhiệm chính |
|---|---|
| **Guest** | Khám phá nền tảng, tìm kiếm/lọc khóa học công khai, xem trước chương trình và đọc ghi chú được chia sẻ công khai. |
| **Student** | Tham gia lớp học, học kiến thức theo chương, làm nhiệm vụ nhận vật phẩm cho Hero (`Aegis-01`), đánh Boss, ôn luyện câu sai và quản lý ghi chú. |
| **Lecturer** | Tạo và quản lý lớp học, biên soạn bài học/ngân hàng câu hỏi/Boss, biểu quyết đồng thuận khóa học dùng chung và xem thống kê học tập. |
| **Admin** | Giám sát tổng quan nền tảng, gửi cảnh báo/nhắc nhở và khóa hoặc mở khóa phần kiến thức (chỉ đọc, không trực tiếp sửa nội dung). |

---

## 4. Tính năng cốt lõi (Core Features)

- **Đã triển khai dưới dạng Frontend Demo (`IMPLEMENTED` trong `Design/demo-v1..v3`):**
  - Đầy đủ 15 màn hình mô phỏng cho 4 vai trò với dữ liệu chủ đề *Computer Networking* (`CN-101`, 5 chương, 32 câu hỏi, 1 Hero, 7 Boss, 1 lớp học 10 SV, 3 giảng viên).
  - Nhiệm vụ tương tác giữa chương (ghép cặp, sắp xếp, tình huống) và đấu trường Boss Battle (dùng vật phẩm, đổi câu đúng sang câu mới cùng mục tiêu kiến thức khi tái đấu, giữ lại câu sai kèm giải thích).
  - Hệ thống ghi chú 3 khu vực (`Chapter Notes`, `Global Notes`, `Wrong Answers`) và trang xem ghi chú công khai `#/shared-note/:noteId`.
  - Quản lý lớp học, ngân hàng đề tách rời bài học, luồng biểu quyết đồng thuận khóa học chung và kiểm duyệt nội dung chỉ đọc của Admin.
- **Dự kiến cho giai đoạn tiếp theo (`PLANNED`):**
  - Ứng dụng Production thống nhất tại gốc, Backend API, Database chuẩn hóa, Authentication/RBAC thực tế, đồng bộ đa người dùng và bộ kiểm thử tự động.

---

## 5. Tóm tắt quy tắc nghiệp vụ (Business Rules Summary)

- Một khóa học có thể được nhiều giảng viên cùng sử dụng; thay đổi nội dung dùng chung đã công bố chỉ áp dụng khi **100% giảng viên tham gia đồng ý**.
- Chỉ **Giảng viên** có quyền thêm và sửa nội dung kiến thức; **Admin** chỉ có quyền cảnh báo, nhắc nhở và khóa/mở khóa (bảo toàn lịch sử phiên bản).
- **Ghi chú của sinh viên** mặc định là riêng tư (`private`), sinh viên chủ động công khai từng ghi chú và giảng viên không được xem ghi chú riêng tư.
- **Game System** chỉ có 1 Hero chính; câu hỏi khi đánh Boss lại thay thế câu đã trả lời đúng bằng câu mới cùng `knowledgeObjective` và giữ lại câu sai kèm giải thích.

Chi tiết đầy đủ và các câu hỏi mở xem tại [`docs/technical-knowledge/business-rules.md`](./docs/technical-knowledge/business-rules.md).

---

## 6. Các phiên bản UI/UX Demo hiện tại

| Phiên bản | Thư mục | Định hướng thiết kế | Cổng dev mặc định |
|---|---|---|---|
| **Demo V1** | [`Design/demo-v1/`](./Design/demo-v1) | *Dark Command Cobalt* — Sidebar cố định, TopNav, Breadcrumbs, dashboard đa khối | `5173` |
| **Demo V2** | [`Design/demo-v2/`](./Design/demo-v2) | *Focus Studio* — Tối giản widget, dùng `SlideDrawer`, hỗ trợ Sáng (*Warm Paper*) / Tối (*Warm Charcoal*) | `5174` |
| **Demo V3** | [`Design/demo-v3/`](./Design/demo-v3) | *Cyber Academy* — Trích xuất từ [`Design/css-dc-academy.html`](./Design/css-dc-academy.html), có Network Lab trực quan theo từng chương, Boss Arena, chuyển đổi **Sáng / Tối** và chế độ **Dịu mắt** | `5175` |

---

## 7. Cài đặt (Installation)

- **Yêu cầu môi trường:** Node.js (đã xác minh trên `v26.13.1`) và npm (`11.20.0`).
- **Lưu ý trên Windows PowerShell:** Chính sách thực thi có thể chặn `npm.ps1` / `npx.ps1`; hãy dùng `npm.cmd` và `npx.cmd` thay thế, và dùng dấu `;` để nối lệnh.

Cài đặt dependencies cho phiên bản muốn chạy (ví dụ Demo V3):

```powershell
cd Design/demo-v3
npm.cmd install
```

---

## 8. Chạy và kiểm tra dự án (Running the Project)

```powershell
# Demo V1 (mặc định http://localhost:5173)
cd Design/demo-v1; npm.cmd install; npm.cmd run dev

# Demo V2 (http://localhost:5174)
cd Design/demo-v2; npm.cmd install; npm.cmd run dev -- --port 5174

# Demo V3 (http://localhost:5175)
cd Design/demo-v3; npm.cmd install; npm.cmd run dev -- --port 5175
```

Kiểm tra TypeScript và build production trong từng thư mục demo:

```powershell
npx.cmd tsc --noEmit; if ($LASTEXITCODE -eq 0) { npm.cmd run build }
```

*(Lưu ý: Repository hiện chưa cấu hình script `lint` hoặc `test` tự động.)*

---

## 9. Cấu trúc thư mục dự án (Project Directory Structure)

```text
NetWiz/
├── README.md                              # Tài liệu giới thiệu & hướng dẫn bắt đầu
├── PROJECT_PROGRESS.md                    # Theo dõi trạng thái, milestone & open issues
├── .gitignore
├── index.html, js/main.js, style/Style.css# Placeholder rỗng (0B) từ commit khởi tạo
├── Pages/                                 # Thư mục placeholder rỗng từ commit khởi tạo
├── assets/images/                         # Tài nguyên ảnh gốc (Boss demo.jpg)
├── Design/
│   ├── css-dc-academy.html                # Bản mẫu CSS/HTML tham chiếu cho Demo V3
│   ├── demo-v1/                           # UI/UX Demo V1 (Dark Command Cobalt)
│   ├── demo-v2/                           # UI/UX Demo V2 (Focus Studio)
│   └── demo-v3/                           # UI/UX Demo V3 (Cyber Academy)
└── docs/
    ├── README.md                          # Chỉ mục hệ thống tài liệu
    ├── Prompt/Prompt UI.txt               # Đặc tả yêu cầu gốc cho UI Demo V1
    ├── project-experience/                # Kinh nghiệm triển khai, bug log, lessons, checklist
    └── technical-knowledge/               # Sản phẩm, nghiệp vụ, kiến trúc, data model, stack, UI
```

---

## 10. Hướng dẫn tài liệu (Documentation Guide)

Hệ thống tài liệu chi tiết được lưu trong [`docs/`](./docs/README.md):

- **Kiến thức kỹ thuật & nghiệp vụ:** [`docs/technical-knowledge/README.md`](./docs/technical-knowledge/README.md) (`product-overview.md`, `business-rules.md`, `architecture.md`, `data-model.md`, `tech-stack.md`, `ui-ux-design-system.md`).
- **Kinh nghiệm dự án:** [`docs/project-experience/README.md`](./docs/project-experience/README.md) (`lessons-learned.md`, `bug-and-fix-log.md`, `implementation-guidelines.md`, `error-prevention-checklist.md`).

---

## 11. Nguyên tắc phát triển (Development Guidelines)

1. Đọc [`PROJECT_PROGRESS.md`](./PROJECT_PROGRESS.md), [`docs/README.md`](./docs/README.md) và [`docs/project-experience/`](./docs/project-experience/README.md) trước khi sửa mã nguồn.
2. Phân biệt rõ trạng thái `CONFIRMED`, `IMPLEMENTED`, `PLANNED`, `UNKNOWN`; không trình bày tính năng dự kiến như đã hoàn thiện.
3. Tuân thủ [`implementation-guidelines.md`](./docs/project-experience/implementation-guidelines.md) và rà soát [`error-prevention-checklist.md`](./docs/project-experience/error-prevention-checklist.md) trước/sau khi thay đổi.
4. Cập nhật tài liệu bị ảnh hưởng song song với mã nguồn và chạy `tsc`/`build` xác minh thực tế.

---

## 12. Theo dõi tiến trình (Project Progress Reference)

Xem trạng thái từng tác vụ, lịch sử hoạt động gần đây, lỗi đang mở và bước tiếp theo tại [`PROJECT_PROGRESS.md`](./PROJECT_PROGRESS.md).
