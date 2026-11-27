# NetWiz // Finalized Style Package (`Design/Style/`)

Thư mục này lưu giữ bộ style CSS chuẩn đã chốt từ phiên bản [`Design/UI-final/`](../UI-final) để tái sử dụng cho ứng dụng Production của **NetWiz**.

## Thành phần

| File | Nội dung |
|---|---|
| [`tokens.css`](./tokens.css) | Toàn bộ biến CSS cho 2 chế độ **Tối (`Soft Slate Midnight`)** và **Sáng (`Daylight Academy Paper`)**, bao gồm bề mặt đọc `--reading-bg`, màu nhấn ngữ nghĩa (`--yellow*`, `--blue*`, `--green*`, `--red*`) và bảng màu 5 chương (`--ch-1`..`--ch-5`). |
| [`cyber-academy.css`](./cyber-academy.css) | Style nền, Calm Mode (`[data-calm="true"]`), nút CTA hard-shadow, `.hero-poster`, `.mission-card`, sơ đồ `.inspector-stage` / `.net-stage-btn` / `.net-wire-seg`, đấu trường `.boss-arena` và `@media (prefers-reduced-motion: reduce)`. |

## Cách tích hợp

1. Nạp Google Fonts (`Barlow Condensed`, `Be Vietnam Pro`, `JetBrains Mono`) trong `<head>`.
2. Gắn thuộc tính `data-theme="dark" | "light"` và `data-calm="false" | "true"` trên `<html>` (nên đọc trước khi mount bằng inline `<script>`).
3. Import `tokens.css` trước `cyber-academy.css`.

Chi tiết quy chuẩn thiết kế xem tại [`docs/technical-knowledge/ui-style-final.md`](../../docs/technical-knowledge/ui-style-final.md).
