# Hệ thống Tài liệu Dự án NetWiz (`docs/`)

Hệ thống tài liệu này là **bộ nhớ dài hạn** của dự án **NetWiz (Project: Superhero)** — nền tảng hỗ trợ giảng dạy và học tập môn **Mạng máy tính** kết hợp Gamification. Mục tiêu của thư mục `docs/` là giúp mọi kỹ sư và AI Agent tiếp nhận dự án nhanh chóng, hiểu đúng kiến trúc và quy tắc nghiệp vụ hiện hành, học từ các lỗi đã xảy ra, và duy trì sự nhất quán giữa tài liệu với mã nguồn thực tế.

---

## 1. Vai trò của từng thư mục

| Thư mục / File | Vai trò chính |
|---|---|
| [`docs/technical-knowledge/`](./technical-knowledge/README.md) | Lưu trữ kiến thức kỹ thuật và nghiệp vụ đã xác minh: tổng quan sản phẩm, quy tắc nghiệp vụ, kiến trúc thực tế, mô hình dữ liệu, tech stack và các design system. |
| [`docs/project-experience/`](./project-experience/README.md) | Lưu trữ kinh nghiệm triển khai thực tế, nhật ký lỗi và cách sửa, nguyên tắc viết code và checklist phòng ngừa lỗi lặp lại. |
| [`docs/Prompt/Prompt UI.txt`](./Prompt/Prompt%20UI.txt) | Tài liệu đặc tả yêu cầu gốc cho UI/UX Demo V1 (428 dòng). Đây là nguồn tham chiếu nghiệp vụ ban đầu cho toàn bộ các bản demo. |
| [`PROJECT_PROGRESS.md`](../PROJECT_PROGRESS.md) | Nguồn theo dõi tiến trình chính thức của dự án: trạng thái tác vụ, cột mốc, lịch sử hoạt động gần đây và các vấn đề đang mở. |
| [`README.md`](../README.md) | Trang giới thiệu tổng quan, hướng dẫn cài đặt và chạy các bản Demo UI/UX hiện tại. |

---

## 2. Danh mục tài liệu quan trọng

### Nhóm Kiến thức Kỹ thuật & Nghiệp vụ (`technical-knowledge/`)
- [`technical-knowledge/README.md`](./technical-knowledge/README.md) — Chỉ mục và quy tắc đọc nhóm tài liệu kỹ thuật.
- [`technical-knowledge/product-overview.md`](./technical-knowledge/product-overview.md) — Tầm nhìn sản phẩm, 4 vai trò người dùng, tính năng đã triển khai vs dự kiến.
- [`technical-knowledge/business-rules.md`](./technical-knowledge/business-rules.md) — Quy tắc nghiệp vụ bắt buộc (Classroom, Shared Course 100% consensus, Admin read-only, Notes privacy, Game System) và các câu hỏi mở.
- [`technical-knowledge/architecture.md`](./technical-knowledge/architecture.md) — Kiến trúc thực tế của 3 bản Demo SPA và các thành phần Backend/API/DB chưa triển khai.
- [`technical-knowledge/data-model.md`](./technical-knowledge/data-model.md) — Mô hình dữ liệu hiện có (`src/types/index.ts`, `inspectorData.ts`) và đề xuất mô hình Backend tương lai.
- [`technical-knowledge/tech-stack.md`](./technical-knowledge/tech-stack.md) — Công nghệ, phiên bản gói và môi trường build thực tế từ `package.json` / `package-lock.json`.
- [`technical-knowledge/ui-ux-design-system.md`](./technical-knowledge/ui-ux-design-system.md) — Đặc tả riêng biệt 3 hệ thống thiết kế: Demo V1 (Dark Command Cobalt), Demo V2 (Focus Studio) và Demo V3 (Cyber Academy).

### Nhóm Kinh nghiệm Dự án (`project-experience/`)
- [`project-experience/README.md`](./project-experience/README.md) — Hướng dẫn sử dụng thư mục kinh nghiệm dự án.
- [`project-experience/lessons-learned.md`](./project-experience/lessons-learned.md) — Các bài học thực tế rút ra trong quá trình xây dựng và kiểm tra dự án.
- [`project-experience/bug-and-fix-log.md`](./project-experience/bug-and-fix-log.md) — Nhật ký lỗi dài hạn (đã xử lý và đang mở).
- [`project-experience/implementation-guidelines.md`](./project-experience/implementation-guidelines.md) — Quy trình triển khai Before / During / After Coding cho NetWiz.
- [`project-experience/error-prevention-checklist.md`](./project-experience/error-prevention-checklist.md) — Checklist bắt buộc kiểm tra trước và sau mỗi thay đổi đáng kể.

---

## 3. Thứ tự đọc bắt buộc khi bắt đầu một nhiệm vụ

Mọi AI Agent trước khi chỉnh sửa mã nguồn hoặc đề xuất thay đổi phải đọc theo thứ tự sau:

1. Đọc [`technical-knowledge/product-overview.md`](./technical-knowledge/product-overview.md) để hiểu mục tiêu sản phẩm, phạm vi và sự khác biệt giữa bản Demo hiện tại với sản phẩm Production tương lai.
2. Đọc [`technical-knowledge/business-rules.md`](./technical-knowledge/business-rules.md) để nắm các quy tắc nghiệp vụ không được phép vi phạm.
3. Đọc [`technical-knowledge/architecture.md`](./technical-knowledge/architecture.md) và [`technical-knowledge/data-model.md`](./technical-knowledge/data-model.md) trước khi thay đổi cấu trúc hệ thống, luồng dữ liệu hoặc thêm module mới.
4. Đọc toàn bộ [`project-experience/`](./project-experience/README.md) (đặc biệt là `bug-and-fix-log.md`, `lessons-learned.md`, `implementation-guidelines.md` và `error-prevention-checklist.md`) trước khi triển khai hoặc sửa lỗi.
5. Đọc [`PROJECT_PROGRESS.md`](../PROJECT_PROGRESS.md) để biết trạng thái công việc gần nhất, các lỗi đang mở và bước tiếp theo.

---

## 4. Quy ước phân loại thông tin

Tất cả tài liệu trong hệ thống phải phân biệt rõ 4 trạng thái thông tin:

| Nhãn | Ý nghĩa |
|---|---|
| `CONFIRMED` | Thông tin đã được xác minh trực tiếp từ mã nguồn, cấu hình hoặc tài liệu gốc đáng tin cậy. |
| `IMPLEMENTED` | Tính năng hoặc cơ chế đã được viết code và hoạt động trong repository hiện tại (kèm bằng chứng đường dẫn file). |
| `PLANNED` | Yêu cầu đã được xác định trong đặc tả hoặc định hướng sản phẩm nhưng chưa có code triển khai thực tế. |
| `UNKNOWN` | Chưa đủ thông tin từ mã nguồn hoặc chưa có quyết định kỹ thuật để kết luận. |

---

## 5. Quy tắc bảo trì tài liệu (Documentation Maintenance Rules)

1. **Read Before Work:** Không bắt đầu sửa code khi chưa đọc tiến trình, quy tắc nghiệp vụ, kiến trúc và nhật ký lỗi liên quan.
2. **Learn From Previous Errors:** Khi gặp lỗi, kiểm tra `bug-and-fix-log.md` xem lỗi đã từng xuất hiện chưa; không lặp lại giải pháp đã thất bại.
3. **Update Documentation Alongside Code:** Chỉ cập nhật những tài liệu thực sự bị ảnh hưởng bởi thay đổi:
   - Thay đổi nghiệp vụ -> [`business-rules.md`](./technical-knowledge/business-rules.md)
   - Thay đổi kiến trúc -> [`architecture.md`](./technical-knowledge/architecture.md)
   - Thay đổi cấu trúc dữ liệu -> [`data-model.md`](./technical-knowledge/data-model.md)
   - Thay đổi thư viện / build -> [`tech-stack.md`](./technical-knowledge/tech-stack.md)
   - Thay đổi giao diện / token -> [`ui-ux-design-system.md`](./technical-knowledge/ui-ux-design-system.md)
   - Phát sinh / xử lý lỗi -> [`bug-and-fix-log.md`](./project-experience/bug-and-fix-log.md)
   - Rút ra kinh nghiệm mới -> [`lessons-learned.md`](./project-experience/lessons-learned.md)
   - Sau mỗi nhiệm vụ đáng kể -> [`PROJECT_PROGRESS.md`](../PROJECT_PROGRESS.md)
4. **Evidence-Based Documentation:** Tuyệt đối không tự bịa trạng thái hoàn thành, nguyên nhân lỗi, API, database schema hoặc kết quả kiểm thử chưa chạy.
5. **Preserve History:** Không xóa nhật ký lỗi cũ hay lịch sử tiến trình. Khi một kết luận thay đổi, ghi rõ ngày cập nhật và lý do thay đổi.
