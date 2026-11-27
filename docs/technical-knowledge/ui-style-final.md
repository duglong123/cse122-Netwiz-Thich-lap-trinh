# Quy chuẩn Style Chính thức — Cyber Academy (`UI Final`)

Tài liệu này chốt chính thức hệ thống thiết kế giao diện của dự án **NetWiz** sau giai đoạn thử nghiệm V1–V3. Phiên bản cài đặt hoàn chỉnh nằm tại [`Design/UI-final/`](../../Design/UI-final) và bộ CSS độc lập được đóng gói tại [`Design/Style/`](../../Design/Style/README.md).

---

## 1. Nguồn tệp Style chuẩn (`CONFIRMED`)

| Thành phần | Đường dẫn | Vai trò |
|---|---|---|
| **Token màu Sáng/Tối** | [`Design/Style/tokens.css`](../../Design/Style/tokens.css) | Toàn bộ CSS Custom Properties cho Dark (`Soft Slate Midnight`) và Light (`Daylight Academy Paper`), gồm bề mặt đọc `--reading-bg` và màu 5 chương `--ch-1`..`--ch-5`. |
| **Component & Motion CSS** | [`Design/Style/cyber-academy.css`](../../Design/Style/cyber-academy.css) | Lớp nền, nút CTA hard-shadow, `.hero-poster`, `.mission-card`, `.inspector-stage`, `.boss-arena`, Calm Mode và `@media (prefers-reduced-motion: reduce)`. |
| **Ứng dụng UI chuẩn** | [`Design/UI-final/src/index.css`](../../Design/UI-final/src/index.css) | Bản tích hợp Tailwind CSS v4 + bộ component chuẩn trong `Design/UI-final/src/components/ui/`. |

---

## 2. Bảng màu Chính thức (Sáng / Tối Dịu mắt)

### A. Chế độ Tối — `Soft Slate Midnight` (`[data-theme="dark"]`, mặc định)
- **Bề mặt:** `--bg: #111824`, `--panel: #172030`, `--panel-2: #1f2b3e`, `--panel-deep: #131b29`, **vùng đọc bài/ghi chú `--reading-bg: #151e2c`**, `--code-bg: #0e1522`.
- **Chữ & Viền:** `--text: #e4eaf4`, `--text-body: #c7d2e2`, `--muted: #94a4ba`, `--line: #2a374d`, `--line-strong: #3b4c68`.
- **Màu nhấn:** `--yellow: #e8c65a` (`--yellow-fg: #f0d372`, `--yellow-on: #111824`), `--blue: #58a6ff`, `--green: #3ecf8e`, `--red: #e55353`.

### B. Chế độ Sáng — `Daylight Academy Paper` (`[data-theme="light"]`)
- **Bề mặt:** `--bg: #f2efe9`, `--panel: #faf8f4`, `--panel-2: #ebe6dc`, `--panel-deep: #ece7dd`, **vùng đọc `--reading-bg: #fdfbf7`**, khối mã CLI giữ tối `--code-bg: #182234`.
- **Chữ & Viền:** `--text: #1a2232`, `--text-body: #2d394d`, `--muted: #596579`, `--line: #d6cfc2`, `--line-strong: #b4aa98`.
- **Màu nhấn tương phản cao trên giấy sáng:** `--yellow-fg: #946500` (nền nút `--yellow: #eab938`, chữ `--yellow-on: #1a2232`), `--blue-fg: #1d4ed8`, `--green-fg: #117a46`, `--red-fg: #b91c1c`.

### C. Bảng màu 5 Chương (`--ch-1`..`--ch-5`)
Mỗi chương giữ một sắc thái nhận diện riêng trong cả 2 chế độ (tự động tối ưu độ tương phản ở Light Mode):
- **Chương 1 (Physical Edge):** `--ch-1` Vàng chiến thuật (`#e8c65a` tối / `#b57f00` sáng)
- **Chương 2 (Structural Grid):** `--ch-2` Xanh dương (`#58a6ff` tối / `#1d64d8` sáng)
- **Chương 3 (OSI Core):** `--ch-3` Xanh ngọc (`#3fd0b8` tối / `#0f8776` sáng)
- **Chương 4 (TCP/IP Grid):** `--ch-4` Đỏ san hô (`#f06868` tối / `#cc3434` sáng)
- **Chương 5 (Cyber Citadel):** `--ch-5` Xanh lá (`#42ce7d` tối / `#168449` sáng)

---

## 3. Quy chuẩn Shell, Header & Tiện ích Đọc lâu

1. **Thanh điều hướng đóng khung (`AcademyShell.tsx`):**
   - Các tab chuyển trang nằm trong khung bo viền (`border-[var(--line)] bg-[var(--panel-deep)] rounded-xl p-1`), mỗi mục dùng `whitespace-nowrap shrink-0` để không bị gãy 2 dòng.
   - Mục đang chọn nổi bật bằng pill `--yellow` / `--yellow-on`.
2. **Nút điều khiển hiển thị gộp (1 icon duy nhất):**
   - Nằm cạnh thanh tiến độ Boss (`w-9 h-9`, không chữ), hiển thị icon `Sun` (đang ở Tối) hoặc `Moon` (đang ở Sáng) kèm chấm xanh lá nhỏ khi bật **Dịu mắt**.
   - Nhấp vào mở popover chỉnh nhanh cả **Giao diện (Tối / Sáng)** (`netwiz_v3_theme`) và **Chế độ đọc (Hiệu ứng / Dịu mắt)** (`netwiz_v3_calm_mode`).
3. **Typography:**
   - Tiêu đề lớn/Display: `Barlow Condensed` (`.display-font`). **Không dùng** `.display-font` cho tiêu đề ghi chú người dùng hoặc văn bản dài.
   - Nội dung bài giảng, ghi chú & giải thích: `Be Vietnam Pro`, cột đọc giới hạn `max-w-[68ch]`, cho phép thu gọn mục lục và mở ghi chú song song.
   - Thông số mạng, cổng, IP/MAC, CLI: `JetBrains Mono` (`.mono`).
4. **Thành phần đặc trưng giữ nguyên:**
   - **Network Lab (`NetworkInspector.tsx`):** 5 mô hình mạng theo chương (`pipeline`, `topology`, `encapsulation` + Wire Frame Dissector, `handshake-cidr`, `security-perimeter`) + Protocol Telemetry & CLI Console.
   - **Boss Arena (`BossBattle.tsx`):** `.boss-side` giữ nền tối kịch tính bảo toàn tương phản chân dung Boss, còn khung câu hỏi/giải thích dùng nền đọc thích ứng Sáng/Tối và khoanh vùng hiệu ứng flash để không che lời giải thích.
