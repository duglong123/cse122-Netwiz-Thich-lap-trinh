# Hệ thống Thiết kế UI/UX (UI/UX Design Systems)

Repository **NetWiz** hiện chứa **3 bản UI/UX Demo sử dụng 3 Design System hoàn toàn khác nhau** trong thư mục `Design/`. Không được xem 3 bản Demo là cùng một hệ thống giao diện khi chỉnh sửa hoặc trích xuất component.

---

## 1. Nguyên tắc thiết kế chung (`CONFIRMED`)

1. **Giáo dục làm trọng tâm:** Mọi biến thể giao diện đều phải giữ rõ nội dung bài giảng, giải thích đáp án và phân tách rõ quyền của 4 vai trò (**Guest, Student, Lecturer, Admin**).
2. **Không dùng dữ liệu giả vô nghĩa:** Dùng dữ liệu chủ đề **Computer Networking** tiếng Việt kèm thuật ngữ mạng tiếng Anh chuẩn; không dùng văn bản giữ chỗ vô nghĩa.
3. **Responsive:** Hỗ trợ Desktop, Tablet và Mobile thông qua Tailwind CSS v4 grid/flex và menu di động trên Shell.
4. **Duy trì trạng thái tương tác đầy đủ:** Tất cả nút bấm và điều khiển chính đều gắn hành động thật trên Frontend State (`AppContext.tsx`).

---

## 2. So sánh 3 Design System hiện có (`IMPLEMENTED`)

| Tiêu chí | Demo V1 (`Dark Command Cobalt`) | Demo V2 (`Focus Studio`) | Demo V3 (`Cyber Academy`) |
|---|---|---|---|
| **Thư mục** | [`Design/demo-v1/`](../../Design/demo-v1) | [`Design/demo-v2/`](../../Design/demo-v2) | [`Design/demo-v3/`](../../Design/demo-v3) |
| **Nguồn cảm hứng** | Đặc tả `Prompt UI.txt` | Tối giản widget & bảo vệ thị lực | Trích xuất từ [`Design/css-dc-academy.html`](../../Design/css-dc-academy.html) |
| **Chế độ màu** | Chỉ Dark Mode | **Light (`Warm Paper`) & Dark (`Warm Charcoal`)** | Dark Midnight Navy + **Dịu mắt (`Calm Mode`)** |
| **Bố cục Shell** | `AppShell`: Sidebar cố định + TopNav + Breadcrumbs | `TopShell`: Chỉ TopNav + SlideDrawer theo tác vụ | `AcademyShell`: Header 78px + thanh tiến độ Boss + nút Dịu mắt |
| **Typography** | `Plus Jakarta Sans`, `Be Vietnam Pro`, `JetBrains Mono` | `Lora` (editorial), `Be Vietnam Pro`, `JetBrains Mono` | `Barlow Condensed` (display), `Be Vietnam Pro`, `JetBrains Mono` |
| **Thẻ nội dung** | `Card` | `Surface` | `Panel` + `Eyebrow` |

---

## 3. Đặc tả chi tiết từng phiên bản

### A. Demo V1 — Dark Command Cobalt (`Design/demo-v1/src/index.css`)
- **Bảng màu:**
  - Nền chính `--bg-canvas: #0B1120`, bề mặt `--bg-surface: #111827`, `--bg-surface-alt: #162032`, `--bg-elevated: #1E293B`
  - Viền `--border-subtle: #263349`, `--border-strong: #334155`
  - Nhấn: `--accent-cobalt: #3B82F6`, `--accent-emerald: #10B981`, `--accent-amber: #F59E0B`, `--accent-rose: #F43F5E`
  - Nền lưới chiến thuật `.bg-tactical-grid` (`32px × 32px`).
- **Component UI (`src/components/ui/`):** `AppShell`, `Badge`, `Button`, `Card`, `DataTable`, `EmptyState`, `LoadingState`, `ToastContainer`, `Dropdown`, `Input`/`Textarea`/`Select`, `Modal`/`ConfirmDialog`, `ProgressBar`, `HealthBar`, `Tabs`. *(Lưu ý: `LoadingState` hiện chỉ tồn tại trong `demo-v1`.)*

### B. Demo V2 — Focus Studio (`Design/demo-v2/src/index.css`)
- **Triết lý:** Loại bỏ sidebar cố định và dashboard nhiều widget gây phân tâm; mỗi màn hình tập trung một vùng làm việc chính (`max-w-3xl` / `max-w-4xl`), công cụ phụ mở qua `SlideDrawer`.
- **Bảng màu độ tương phản cao:**
  - **Light (`[data-theme="light"]`):** Nền `--bg-canvas: #F6F4EE`, thẻ `--bg-surface: #FFFFFF`, chữ `--text-primary: #161614`, nhấn `--accent-primary: #1D4ED8`.
  - **Dark (`[data-theme="dark"]`):** Nền `--bg-canvas: #161614`, thẻ `--bg-surface: #1F1F1C`, chữ `--text-primary: #F5F3EC`, nhấn `--accent-primary: #60A5FA`.
- **Cơ chế chống chớp giao diện:** Inline `<script>` trong `Design/demo-v2/index.html` đọc `netwiz_v2_theme` từ `localStorage` trước khi React mount.

### C. Demo V3 — Cyber Academy / Comic-Tactical (`Design/demo-v3/src/index.css`)
- **Bảng màu & Token:**
  - Nền `--bg: #080c16`, `--panel: #0e1523`, `--panel-2: #121c2d`, `--panel-deep: #0a111e`, viền `--line: #26334a`
  - Chữ `--text: #f3f6fc`, `--text-body: #c5d1e2`, `--muted: #98a7bd`
  - Nhấn: `--yellow: #f4d35e` (bóng cứng `--yellow-shadow: #6e5c1e`), `--red: #ef4444`, `--blue: #4da3ff`, `--green: #45d483`.
- **Thành phần & Tương tác đặc trưng:**
  - `NetworkInspector.tsx`: Mô hình hộp lồng 4 lớp tương tác cho 5 chương (`CHAPTER_THEMES`).
  - `BossBattle.tsx`: Thanh máu vát chéo 5 phân đoạn (`BossHealthBar`), `HeroHealthBar`, `Combo ×N`, `Phase 2 Enrage` dưới 50% HP (`+25% ATK`, `.enrage-ring`), `Boss` Chương 5 (`Zero-Day Phantom`) có hào quang riêng và bộ 6 câu tổng hợp, bảng xếp hạng `S / A / B` theo độ chính xác & HP.
  - **Khả năng đọc lâu & Tiếp cận:**
    - Chế độ **Dịu mắt (`[data-calm="true"]`, key `netwiz_v3_calm_mode`)**: tắt lớp grain `body::before`, dịu `--text: #e6ecf5`, vô hiệu hóa flash/shake/confetti/hover-tilt.
    - Hỗ trợ `@media (prefers-reduced-motion: reduce)` và vòng focus `3px solid var(--yellow)`.
    - `LearningInterface.tsx` hỗ trợ thu gọn mục lục (`max-w-[68ch]`) và panel ghi chú song song không che bài đọc.

---

## 4. Quyết định còn mở (`UNKNOWN`)

- **Design System cho bản Production chính thức:** Chưa có quyết định chọn hẳn V1, V2, V3 hay kết hợp (ví dụ kết hợp Focus Reading của V2 với Inspector/Boss Arena của V3). Cần ghi thành ADR khi bước vào giai đoạn xây dựng ứng dụng chính thức.
