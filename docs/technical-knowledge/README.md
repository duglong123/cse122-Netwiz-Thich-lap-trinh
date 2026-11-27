# Kiến thức Kỹ thuật & Nghiệp vụ (`docs/technical-knowledge/`)

Thư mục này là nguồn tham chiếu chuẩn xác về sản phẩm, quy tắc nghiệp vụ, kiến trúc, dữ liệu, công nghệ và hệ thống giao diện của dự án **NetWiz (Project: Superhero)**.

---

## 1. Danh sách tài liệu và mục đích

| Tài liệu | Mục đích | Trạng thái trọng tâm |
|---|---|---|
| [`product-overview.md`](./product-overview.md) | Mô tả sản phẩm NetWiz, 4 nhóm người dùng, các module chính, hiện trạng Demo vs kế hoạch Production. | `CONFIRMED` / `IMPLEMENTED` (Demo) / `PLANNED` (Prod) |
| [`business-rules.md`](./business-rules.md) | Đặc tả quy tắc nghiệp vụ cho User Roles, Classroom, Shared Course, Knowledge Management, Admin, Notes, Game System và các **OPEN QUESTION**. | `CONFIRMED` / `IMPLEMENTED` / `UNKNOWN` |
| [`architecture.md`](./architecture.md) | Kiến trúc thực tế của 3 bản SPA Demo trong `Design/` và danh sách thành phần Backend/API/DB/Auth chưa triển khai. | `CONFIRMED` / `IMPLEMENTED` / `PLANNED` |
| [`data-model.md`](./data-model.md) | Đặc tả **Existing Data Model** trong `src/types/index.ts` & `inspectorData.ts`, và **Proposed Data Model** cho Backend tương lai. | `IMPLEMENTED` (Frontend) / `PLANNED` (Backend) |
| [`tech-stack.md`](./tech-stack.md) | Thống kê công nghệ, phiên bản gói và môi trường build thực tế từ `package.json` và `package-lock.json`. | `CONFIRMED` |
| [`ui-ux-design-system.md`](./ui-ux-design-system.md) | So sánh và đặc tả riêng 3 Design System đang tồn tại (`demo-v1`, `demo-v2`, `demo-v3`) cùng quyết định chưa chốt cho bản chính thức. | `IMPLEMENTED` (3 Demos) / `UNKNOWN` (Prod choice) |

---

## 2. Thứ tự đọc khuyến nghị

1. [`product-overview.md`](./product-overview.md) — Hiểu mục tiêu giáo dục, 4 vai trò và phạm vi hiện tại.
2. [`business-rules.md`](./business-rules.md) — Nắm ranh giới quyền hạn, đồng thuận 100%, quyền riêng tư ghi chú và luật Boss Battle.
3. [`architecture.md`](./architecture.md) — Biết chính xác code đang chạy ở đâu và phần nào chưa tồn tại.
4. [`data-model.md`](./data-model.md) — Hiểu kiểu dữ liệu thực tế (`PersistedDemoState`, `Course`, `Question`, `Note`, `ChangeProposal`, `ModerationLogEntry`).
5. [`tech-stack.md`](./tech-stack.md) — Kiểm tra phiên bản React, Tailwind, TypeScript, Vite và quy ước CLI.
6. [`ui-ux-design-system.md`](./ui-ux-design-system.md) — Nắm token và component của đúng phiên bản UI đang thao tác.

---

## 3. Quy ước đánh dấu trạng thái

- **`CONFIRMED`**: Đã xác minh trực tiếp từ mã nguồn, file cấu hình hoặc tài liệu yêu cầu gốc ([`Prompt UI.txt`](../Prompt/Prompt%20UI.txt)).
- **`IMPLEMENTED`**: Đã có mã nguồn chạy thực tế trong repository (hiện tại là mô phỏng Frontend ở `Design/demo-v1`, `Design/demo-v2`, `Design/demo-v3`).
- **`PLANNED`**: Thuộc phạm vi định hướng sản phẩm hoặc giai đoạn tiếp theo, chưa có mã nguồn triển khai.
- **`UNKNOWN`**: Chưa đủ thông tin hoặc chưa có quyết định chốt để kết luận.
