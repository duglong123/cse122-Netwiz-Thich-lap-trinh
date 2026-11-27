# Bài học Thực tế (Lessons Learned)

Tài liệu này chỉ ghi nhận các bài học có cơ sở thực tế từ quá trình khảo sát, phát triển và kiểm tra dự án **NetWiz**. Không ghi các giả định hoặc kinh nghiệm chưa từng xảy ra trong repository.

---

## LL-001: Dùng `npm.cmd` / `npx.cmd` và dấu `;` trên Windows PowerShell

- **ID:** `LL-001`
- **Ngày ghi nhận:** `2026-11-27`
- **Ngữ cảnh:** Chạy cài đặt gói, kiểm tra TypeScript (`tsc --noEmit`) và build Vite cho `Design/demo-v1`, `Design/demo-v2`, `Design/demo-v3` trên môi trường Windows PowerShell.
- **Vấn đề gặp phải:** Chính sách thực thi script trên Windows chặn file `.ps1` (`npm.ps1`, `npx.ps1`), đồng thời cú pháp nối lệnh `&&` không tương thích nhất quán trên các phiên bản PowerShell cũ.
- **Nguyên nhân:** PowerShell mặc định ưu tiên shim `.ps1` thay vì `.cmd` khi gọi `npm` hoặc `npx` trực tiếp.
- **Giải pháp:** Luôn gọi tường minh `npm.cmd` và `npx.cmd`, đồng thời dùng `;` hoặc kiểm tra `$LASTEXITCODE` (ví dụ `npx.cmd tsc --noEmit; if ($LASTEXITCODE -eq 0) { npm.cmd run build }`).
- **Bài học rút ra:** Ghi rõ quy ước lệnh Windows ngay trong README và tài liệu hướng dẫn giúp các phiên làm việc và AI Agent tiếp theo tránh lỗi môi trường lặp lại.
- **Phạm vi áp dụng:** Mọi thao tác CLI trong `Design/demo-v1`, `Design/demo-v2`, `Design/demo-v3` và các gói Node/Vite tương lai trên Windows.

---

## LL-002: Giao diện Game UI cần cơ chế đọc dài hạn và tách biệt khỏi typography trang trí

- **ID:** `LL-002`
- **Ngày ghi nhận:** `2026-11-27`
- **Ngữ cảnh:** Đánh giá khả năng sử dụng lâu dài của `Design/demo-v3` (lấy phong cách từ `Design/css-dc-academy.html`).
- **Vấn đề gặp phải:** Giao diện mặc định thiên về trình diễn (film-grain overlay, cột đọc bài giảng hẹp ~323–420px, chữ giải thích 11–12px, tiêu đề ghi chú người dùng dùng font cô đặc viết hoa `Barlow Condensed`, modal ghi chú che mất nội dung bài học, thiếu nút quay lại bài trước).
- **Nguyên nhân:** Áp trực tiếp phong cách showcase/landing page vào màn hình học tập và ghi chú chuyên sâu mà chưa tách chế độ đọc.
- **Giải pháp:** Bổ sung chế độ **Dịu mắt (Calm Mode)** tắt grain và chuyển động nền; thêm nút thu gọn mục lục (`Thu gọn mục lục`) để mở rộng cột đọc `max-w-[68ch]`; thay modal ghi chú bằng panel song song (`lg:grid-cols-[..._340px]`); bỏ `.display-font` khỏi tiêu đề ghi chú người dùng và nâng kích thước chữ nội dung/giải thích lên `text-sm leading-relaxed`.
- **Bài học rút ra:** Phong cách Game/Comic chỉ nên đóng vai trò điểm nhấn điều hướng và chiến đấu; vùng đọc kiến thức và ghi chú phải ưu tiên độ rộng chuẩn đọc, cỡ chữ thoải mái và tùy chọn giảm kích thích thị giác.
- **Phạm vi áp dụng:** `Design/demo-v3` (`LearningInterface.tsx`, `NotesHub.tsx`, `index.css`, `AcademyShell.tsx`) và thiết kế sản phẩm chính thức sau này.

---

## LL-003: Cô lập hiệu ứng Boss Battle khỏi vùng câu hỏi và giải thích

- **ID:** `LL-003`
- **Ngày ghi nhận:** `2026-11-27`
- **Ngữ cảnh:** Tinh chỉnh màn hình `BossBattle.tsx` trong `Design/demo-v3`.
- **Vấn đề gặp phải:** Hiệu ứng nhấp nháy toàn đấu trường (`.arena-flash`) phủ lên cả phần giải thích kiến thức sau khi trả lời sai/đúng, làm giảm khả năng đọc lời giải thích — vốn là mục tiêu giáo dục cốt lõi.
- **Nguyên nhân:** Lớp phủ flash đặt ở container cha toàn màn hình đấu thay vì giới hạn trong khu vực hiển thị Boss.
- **Giải pháp:** Khoanh vùng `.arena-flash` vào `.boss-side` (`z-10`) và giữ cột câu hỏi/giải thích bên phải ở lớp tĩnh (`z-20`), đồng thời bổ sung thông tin biến động HP và hiệu ứng riêng cho Boss cuối Chương 5 (`Zero-Day Phantom`).
- **Bài học rút ra:** Hiệu ứng game hóa phải làm nổi bật phản hồi chiến đấu (sát thương, combo, enrage) mà không làm nhiễu nội dung sư phạm cần đọc ngay sau đó.
- **Phạm vi áp dụng:** `Design/demo-v3/src/features/student/BossBattle.tsx` và các màn hình gamification tương tác.

---

## LL-004: Khởi tạo `data-theme` / `data-calm` bằng inline script trước khi React mount

- **ID:** `LL-004`
- **Ngày ghi nhận:** `2026-11-27`
- **Ngữ cảnh:** Hỗ trợ lưu lựa chọn chế độ Sáng/Tối ở `Design/demo-v2` (`netwiz_v2_theme`) và Dịu mắt ở `Design/demo-v3` (`netwiz_v3_calm_mode`).
- **Vấn đề gặp phải:** Nếu chỉ đọc `localStorage` trong `useEffect` hoặc React state sau render đầu tiên, trình duyệt có thể nháy giao diện mặc định (FOUC) trước khi chuyển sang chế độ người dùng đã lưu.
- **Nguyên nhân:** DOM ban đầu chưa có thuộc tính `data-theme` hoặc `data-calm` trước khi bundle JS chạy.
- **Giải pháp:** Đặt đoạn `<script>` đồng bộ nhỏ trong `<head>` của `index.html` để đọc `localStorage` và gắn `data-theme` / `data-calm` lên `document.documentElement` trước khi paint.
- **Bài học rút ra:** Các thiết lập giao diện toàn cục ảnh hưởng màu nền nên được đọc đồng bộ trước render đầu tiên.
- **Phạm vi áp dụng:** `Design/demo-v2/index.html`, `Design/demo-v3/index.html` và ứng dụng Production tương lai.

---

## LL-005: Tách biệt 3 bản Demo giúp thử nghiệm UI nhanh nhưng nhân bản `types` và `mockData`

- **ID:** `LL-005`
- **Ngày ghi nhận:** `2026-11-27`
- **Ngữ cảnh:** Khảo sát `Design/demo-v1`, `Design/demo-v2` và `Design/demo-v3`.
- **Vấn đề gặp phải:** Ba thư mục demo chứa bản sao giống hệt nhau của `src/types/index.ts` (5.977B) và `src/data/mockData.ts` (80.534B), cùng phần lớn logic `AppContext.tsx` (~41–44KB mỗi bản).
- **Nguyên nhân:** Mỗi bản demo được dựng thành một ứng dụng Vite độc lập để thử nghiệm nhanh 3 hướng UI khác nhau mà không cấu hình monorepo/shared package.
- **Bài học rút ra:** Cách làm này phù hợp ở giai đoạn prototype UI, nhưng khi chuyển sang xây dựng ứng dụng chính thức cần hợp nhất một nguồn `types`, `services` và Design System duy nhất để tránh lệch logic và nhân ba chi phí bảo trì.
- **Phạm vi áp dụng:** Giai đoạn chuyển tiếp từ `Design/demo-*` sang kiến trúc sản phẩm chính thức.

---

## LL-006: Tách Ngân hàng câu hỏi khỏi Bài học qua `knowledgeObjective` giúp tái đấu Boss linh hoạt

- **ID:** `LL-006`
- **Ngày ghi nhận:** `2026-11-27`
- **Ngữ cảnh:** Triển khai quy tắc nghiệp vụ "khi đánh Boss lại, câu đúng được thay bằng câu mới cùng mục tiêu kiến thức, câu sai được giữ lại".
- **Vấn đề gặp phải:** Nếu nhúng cứng câu hỏi vào từng bài học hoặc từng lượt đánh Boss cố định, hệ thống không thể tìm câu thay thế tương đương khi sinh viên đánh lại.
- **Nguyên nhân:** Thiếu khóa liên kết theo mục tiêu kiến thức giữa các câu hỏi trong ngân hàng đề.
- **Giải pháp:** Tách `Question[]` thành thực thể độc lập với trường `knowledgeObjective`, cho phép `buildBattleDeck` trong `BossBattle.tsx` giữ lại `wrongIds` và tìm câu hỏi mới cùng `knowledgeObjective` nhưng khác `id` cho các câu đã vượt qua.
- **Bài học rút ra:** Tách rời `Question` bank và gắn `knowledgeObjective` là cấu trúc đúng đắn cần giữ nguyên khi thiết kế Database Backend sau này.
- **Phạm vi áp dụng:** `src/types/index.ts`, `src/data/mockData.ts`, `BossBattle.tsx` và thiết kế API/Database tương lai.

---

## Tổng hợp: Nên tiếp tục vs Cần tránh

| Nên tiếp tục sử dụng | Cần tránh |
|---|---|
| Giữ `Question` tách khỏi `Lesson` và gắn `knowledgeObjective`. | Nhúng cứng danh sách câu hỏi vào bên trong `Lesson` hoặc `Boss`. |
| Cô lập hiệu ứng Game UI khỏi vùng đọc bài giảng và giải thích câu sai. | Đặt flash/animation phủ đè lên văn bản giải thích hoặc ép dùng font trang trí cho ghi chú dài. |
| Dùng pre-paint `<script>` cho theme/calm mode và lưu tách key `localStorage` theo từng bản demo. | Chỉnh sửa nhầm dữ liệu hoặc `localStorage` key giữa các bản demo. |
| Luôn dùng `npm.cmd` / `npx.cmd` trên Windows PowerShell và ghi đúng kết quả thực tế sau kiểm tra. | Khẳng định "đã test/đã kiểm tra" khi chưa chạy `tsc`, `build` hoặc chưa kiểm tra thực tế trên trình duyệt. |
