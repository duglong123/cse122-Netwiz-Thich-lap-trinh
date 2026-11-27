# Công nghệ Sử dụng (Tech Stack)

Thông tin dưới đây được xác minh trực tiếp từ `package.json`, `package-lock.json`, `tsconfig.json`, `vite.config.ts` và môi trường chạy thực tế của repository **NetWiz**.

---

## 1. Tech Stack Hiện tại của các bản UI/UX Demo (`CONFIRMED`)

Cả ba bản demo (`Design/demo-v1`, `Design/demo-v2`, `Design/demo-v3`) sử dụng **cùng một nền tảng công nghệ**:

| Nhóm | Công nghệ | Khai báo (`package.json`) | Phiên bản cài thực tế (`package-lock.json`) |
|---|---|---|---|
| **Ngôn ngữ chính** | TypeScript + TSX, HTML5, CSS3 | `typescript: ^5.6.3` | `5.9.3` |
| **UI Framework** | React & React DOM | `react: ^18.3.1`, `react-dom: ^18.3.1` | `18.3.1` |
| **Icon Library** | Lucide React | `lucide-react: ^0.468.0` | `0.468.0` |
| **Styling** | Tailwind CSS v4 + `@tailwindcss/vite` | `tailwindcss: ^4.0.0`, `@tailwindcss/vite: ^4.0.0` | `4.3.5` |
| **Build Tool / Dev Server** | Vite + `@vitejs/plugin-react` | `vite: ^6.0.3`, `@vitejs/plugin-react: ^4.3.4` | `vite 6.4.6`, plugin `4.7.0` |
| **Type Definitions** | `@types/react`, `@types/react-dom` | `^18.3.11`, `^18.3.1` | — |
| **Package Manager** | npm (`package-lock.json`) | `"type": "module"` | `npm 11.20.0` |

---

## 2. Cấu hình Trình biên dịch & Build (`CONFIRMED`)

- **TypeScript (`tsconfig.json` — giống hệt ở V1, V2, V3):**
  - `target: "ES2020"`, `module: "ESNext"`, `moduleResolution: "bundler"`, `jsx: "react-jsx"`
  - Bật kiểm tra nghiêm ngặt: `strict: true`, `noUnusedLocals: true`, `noUnusedParameters: true`, `noFallthroughCasesInSwitch: true`, `noEmit: true`.
- **Vite (`vite.config.ts` — giống hệt ở V1, V2, V3):**
  - Sử dụng hai plugin: `react()` và `tailwindcss()`.
- **Scripts trong `package.json`:**
  - `dev`: `vite` (cổng mặc định `5173` cho V1; truyền `-- --port 5174` cho V2 và `-- --port 5175` cho V3)
  - `build`: `tsc && vite build`
  - `preview`: `vite preview`

---

## 3. Môi trường Phát triển & Quy ước CLI (`CONFIRMED`)

- **Runtime đã quan sát:** Node.js `v26.13.1`, npm `11.20.0`, hệ điều hành Windows (PowerShell).
- **Ràng buộc Windows PowerShell:** Chính sách thực thi script chặn `npm.ps1` và `npx.ps1`. Luôn chạy bằng `npm.cmd` và `npx.cmd` (ví dụ: `npx.cmd tsc --noEmit; npm.cmd run build`).

---

## 4. Các thành phần Chưa có / Chưa quyết định (`NOT IMPLEMENTED` / `UNKNOWN`)

| Hạng mục | Trạng thái | Ghi chú |
|---|---|---|
| **Linter / Formatter (ESLint, Prettier)** | `NOT IMPLEMENTED` | Chưa có cấu hình hoặc script lint/format trong `package.json`. |
| **Testing Framework (Vitest, Jest, Playwright)** | `NOT IMPLEMENTED` | Chưa có bộ test tự động nào trong repository. |
| **Backend Framework & Runtime** | `UNKNOWN` / `PLANNED` | Chưa lựa chọn (Node/NestJS/FastAPI/Go... chưa quyết định). |
| **Database & ORM** | `UNKNOWN` / `PLANNED` | Chưa lựa chọn (PostgreSQL/MySQL/MongoDB... chưa quyết định). |
| **CI/CD Pipeline** | `NOT IMPLEMENTED` | Không có `.github/workflows/` hay cấu hình CI nào. |
