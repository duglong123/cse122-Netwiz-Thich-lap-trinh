# Nhật ký Lỗi và Khắc phục (Bug and Fix Log)

Tài liệu này là nhật ký lỗi dài hạn của dự án **NetWiz**.

## Quy tắc ghi nhật ký lỗi
1. **Không ghi nguyên nhân suy đoán thành nguyên nhân đã xác định.** Nếu chưa xác minh, giữ trạng thái `Investigating` hoặc ghi rõ giả thuyết.
2. **Không đánh dấu `Resolved` nếu chưa kiểm tra lại sau khi sửa.** Ghi rõ phương thức kiểm tra đã thực hiện (ví dụ: `tsc`, `vite build`, kiểm tra HTTP, hoặc kiểm tra trình duyệt).
3. **Không xóa lỗi cũ sau khi đã xử lý.** Giữ lại lịch sử để các AI Agent sau học hỏi.
4. **Nếu giải pháp cũ không còn phù hợp**, cập nhật trạng thái và bổ sung ghi chú lịch sử thay vì ghi đè mất dấu vết.

### Mẫu chuẩn
```markdown
## BUG-XXX: [Tên lỗi]

- Status: Resolved / Open / Investigating
- Date: YYYY-MM-DD
- Severity: Critical / High / Medium / Low
- Affected modules: ...

### Symptoms
...
### Reproduction Steps
...
### Root Cause
...
### Solution
...
### Verification
...
### Prevention
...
### Related Files
...
```

---

## BUG-001: Hiệu ứng `.arena-flash` nháy ngược và che vùng giải thích câu hỏi trong BossBattle (Demo V3)

- Status: Resolved
- Date: 2026-11-27
- Severity: Medium
- Affected modules: `Design/demo-v3` (`BossBattle.tsx`, `index.css`)

### Symptoms
Khi người học trả lời câu hỏi trong Boss Battle ở Demo V3:
1. Lớp phủ `.arena-flash` nháy về `opacity: 1` ở cuối animation trước khi biến mất (nháy ngược).
2. Lớp phủ flash và rung phủ lên cả cột câu hỏi/giải thích bên phải, làm chói và khó đọc lời giải thích ngay sau khi trả lời.

### Reproduction Steps
1. Mở Demo V3 (`Design/demo-v3`), đăng nhập vai trò Student và vào **Trận Boss**.
2. Bắt đầu trận đấu và chọn một đáp án bất kỳ.
3. Quan sát màn hình đấu trường ngay khi hiện hộp giải thích đáp án.

### Root Cause
1. Quy tắc CSS `.arena-flash.red` và `.arena-flash.yellow` trong `Design/demo-v3/src/index.css` thiếu `animation-fill-mode: forwards`, khiến animation quay lại trạng thái mặc định trước khi state reset.
2. Phần tử `.arena-flash` được đặt ở container `.boss-arena` bao trùm cả cột câu hỏi bên phải.

### Solution
1. Bổ sung `forwards` cho `.arena-flash.red` (`flash 0.45s ease forwards`) và `.arena-flash.yellow` (`flash 0.42s ease forwards`) trong `Design/demo-v3/src/index.css`.
2. Di chuyển `.arena-flash` vào bên trong `.boss-side` (`z-10`) và giữ cột câu hỏi/giải thích bên phải ở `z-20` trong `Design/demo-v3/src/features/student/BossBattle.tsx`.

### Verification
- Đã kiểm tra mã CSS/TSX sau chỉnh sửa.
- Chạy `npx.cmd tsc --noEmit` và `npm.cmd run build` trong `Design/demo-v3/` -> thoát mã `0` (`✓ built in 1.63s`).
- **Lưu ý chưa kiểm tra:** Chưa mở trình duyệt thật qua Chrome DevTools để xác minh trực quan khung hình animation (do môi trường Chrome remote debugging không sẵn).

### Prevention
Mọi hiệu ứng flash/shake trong màn hình học tập phải khoanh vùng trong khung nhân vật/Boss và không được giảm độ tương phản của vùng đọc giải thích.

### Related Files
- `Design/demo-v3/src/index.css`
- `Design/demo-v3/src/features/student/BossBattle.tsx`

---

## BUG-002: Confetti cố định `640px` và chế độ Dịu mắt / `prefers-reduced-motion` chưa tắt hết nhiễu động (Demo V3)

- Status: Resolved
- Date: 2026-11-27
- Severity: Medium
- Affected modules: `Design/demo-v3` (`index.css`, `AcademyShell.tsx`)

### Symptoms
1. Khi chiến thắng Boss trên màn hình có chiều cao lớn, hiệu ứng `.confetti-piece` chỉ rơi đến khoảng `640px` rồi dừng/biến mất giữa màn hình.
2. Khi bật chế độ **Dịu mắt (`data-calm="true"`)** hoặc `prefers-reduced-motion: reduce`, lớp grain overlay (`body::before`) và một số hiệu ứng chiến đấu (`.arena-flash`, `.confetti-piece`, `.enrage-ring`, `.combo-pop`) chưa được triệt tiêu hoàn toàn.

### Reproduction Steps
1. Bật chế độ Dịu mắt trên thanh header của Demo V3 và quan sát nền + thực hiện trận Boss.
2. Hoặc đánh thắng Boss trên viewport cao hơn `700px`.

### Root Cause
Keyframes `confettiFall` dùng giá trị pixel cố định thay vì `vh`, và selector `[data-calm="true"]` / `@media (prefers-reduced-motion: reduce)` chưa bao phủ đủ các lớp hiệu ứng mới thêm vào.

### Solution
1. Cập nhật `@keyframes confettiFall` thành `translateY(110vh) rotate(680deg); opacity: 0`.
2. Bổ sung `[data-calm="true"] body::before { content: none !important; }`, ẩn `.arena-flash` và `.confetti-piece` ở cả `[data-calm="true"]` và `@media (prefers-reduced-motion: reduce)`, đồng thời dừng các animation `.enrage-ring`, `.combo-pop`, `.hover-lift`, `.hero-poster`.

### Verification
- Đã kiểm tra trực tiếp `Design/demo-v3/src/index.css`.
- Chạy `npx.cmd tsc --noEmit` và `npm.cmd run build` trong `Design/demo-v3/` -> thoát mã `0` (`✓ built in 1.63s`).
- **Lưu ý chưa kiểm tra:** Chưa kiểm tra trực quan trên trình duyệt thật.

### Prevention
Mỗi khi thêm keyframe hoặc hiệu ứng trang trí mới trong CSS, bắt buộc bổ sung quy tắc tắt tương ứng trong khối `[data-calm="true"]` và `@media (prefers-reduced-motion: reduce)`.

### Related Files
- `Design/demo-v3/src/index.css`
- `Design/demo-v3/src/components/ui/AcademyShell.tsx`

---

## BUG-003: Dọn timer chưa triệt để, thiếu guard deck rỗng và sai câu chữ tái đấu khi 0 câu sai (Demo V3)

- Status: Resolved
- Date: 2026-11-27
- Severity: Low
- Affected modules: `Design/demo-v3` (`BossBattle.tsx`)

### Symptoms
1. Các `window.setTimeout` tạo hiệu ứng trong trận Boss không được hủy khi người dùng thoát trang hoặc bắt đầu trận mới giữa chừng.
2. Nếu một chương mới tạo chưa có câu hỏi trong ngân hàng đề, trận Boss có thể rơi vào trạng thái deck rỗng không có thông báo rõ ràng.
3. Khi tái đấu với `0` câu sai trước đó, câu chữ hiển thị có thể gây hiểu nhầm trạng thái câu hỏi cần ôn.

### Reproduction Steps
1. Trả lời một câu trong `BossBattle.tsx` rồi chuyển trang ngay trước khi hết timeout hiệu ứng.
2. Hoặc tạo chương mới chưa có câu hỏi ở vai trò Giảng viên và mở màn hình Boss Battle của chương đó.

### Root Cause
`BossBattle.tsx` dùng `setTimeout` rời rạc không lưu timer ID để cleanup, thiếu nhánh render bảo vệ khi `deck.length === 0`, và logic hiển thị mô tả rematch chưa xử lý riêng trường hợp `wrongQuestionIds.length === 0`.

### Solution
1. Lưu toàn bộ timer qua `timersRef` (`scheduleTimer` / `clearAllTimers`) và dọn sạch khi kết thúc/unmount.
2. Thêm guard xử lý khi `deck.length === 0` và chuẩn hóa bộ đếm vòng (`padStart(2, '0')`) cùng thông điệp rematch khi có `0` câu sai.

### Verification
- Chạy `npx.cmd tsc --noEmit` và `npm.cmd run build` trong `Design/demo-v3/` -> thoát mã `0` (`✓ built in 1.63s`).

### Prevention
Mọi hiệu ứng dựa trên `setTimeout` trong React component phải đăng ký vào `useRef` để cleanup khi unmount hoặc reset state; luôn kiểm tra trạng thái rỗng (`deck.length === 0`) cho dữ liệu động do người dùng tạo.

### Related Files
- `Design/demo-v3/src/features/student/BossBattle.tsx`

---

## BUG-004: Quy tắc đồng thuận 100% khóa học chung mới chỉ áp dụng khi sửa bài học `published` đã có

- Status: Open
- Date: 2026-11-27
- Severity: High
- Affected modules: `Design/demo-v1`, `Design/demo-v2`, `Design/demo-v3` (`src/store/AppContext.tsx`)

### Symptoms
Trên khóa học dùng chung (`collaboratorIds.length > 1`, ví dụ `CN-101` có 3 giảng viên), khi một giảng viên thực hiện các thao tác như: thêm bài học mới ở trạng thái `published`, xóa/lưu trữ bài học, đổi thứ tự bài học, chuyển chương, thêm chương, chỉnh sửa câu hỏi hoặc cấu hình Boss — hệ thống cập nhật trực tiếp vào khóa học mà không tạo `ChangeProposal` chờ đồng thuận 100%.

### Reproduction Steps
1. Đăng nhập vai trò **Lecturer** trên bất kỳ bản demo nào (`demo-v1`, `demo-v2`, hoặc `demo-v3`).
2. Mở mục **Quản lý kiến thức** với khóa học `CN-101` (có 3 giảng viên đồng sở hữu).
3. Thực hiện đổi thứ tự bài học, lưu trữ bài học hoặc sửa câu hỏi / Boss.
4. Quan sát: thay đổi có hiệu lực ngay lập tức thay vì sinh đề xuất ở mục **Biểu quyết / Đồng thuận**.

### Root Cause
Trong `src/store/AppContext.tsx` (dòng 668–670 ở V3), điều kiện tạo đề xuất là:
`const isSharedPublishedEdit = Boolean(course && course.collaboratorIds.length > 1) && Boolean(existingLesson && existingLesson.status === 'published' && status === 'published');`
Các hàm `addChapter`, `reorderLesson`, `moveLessonToChapter`, `archiveOrDeleteLesson`, `upsertQuestion`, `deleteQuestion`, `updateBossConfig` đều cập nhật thẳng `state` mà không kiểm tra `collaboratorIds.length > 1`.

### Solution
Chưa sửa (giữ nguyên mã nguồn demo trong phạm vi nhiệm vụ tài liệu). Cần thống nhất phạm vi quy tắc đồng thuận (chỉ áp dụng cho `Lesson` đã công bố hay cho toàn bộ cấu trúc chương/câu hỏi/Boss) trước khi sửa ở bản sản phẩm chính thức.

### Verification
Đã xác minh trực tiếp qua đọc `Design/demo-v3/src/store/AppContext.tsx` (dòng 605–838).

### Prevention
Khi chuyển sang Backend hoặc hoàn thiện logic sản phẩm, cần thiết kế lớp kiểm tra quyền và quy trình đề xuất tập trung cho mọi thao tác làm thay đổi nội dung dùng chung đã công bố.

### Related Files
- `Design/demo-v1/src/store/AppContext.tsx`
- `Design/demo-v2/src/store/AppContext.tsx`
- `Design/demo-v3/src/store/AppContext.tsx`

---

## BUG-005: Sai lệch nhỏ ở `.gitignore` và lệnh `cd` trong `Design/demo-v1/README.md`

- Status: Open
- Date: 2026-11-27
- Severity: Low
- Affected modules: `.gitignore`, `Design/demo-v1/README.md`

### Symptoms
1. File `.gitignore` (5 dòng) liệt kê chính `.gitignore` ở dòng 5.
2. File `Design/demo-v1/README.md` dòng 10 vẫn ghi `cd demo-v1` (từ trước khi thư mục được di chuyển vào `Design/demo-v1`).

### Reproduction Steps
1. Đọc `.gitignore` dòng 1–5.
2. Đọc `Design/demo-v1/README.md` dòng 10 và thử chạy lệnh từ thư mục gốc repository.

### Root Cause
Khi di chuyển `demo-v1` vào thư mục `Design/` ở commit `42a390c`, phần hướng dẫn chạy bên trong `Design/demo-v1/README.md` chưa được cập nhật đường dẫn.

### Solution
Chưa sửa để bảo toàn nguyên trạng các file trong `Design/demo-v1/` và `.gitignore` ở nhiệm vụ hiện tại; README gốc của dự án đã ghi đúng `cd Design/demo-v1`.

### Verification
Đã xác minh trực tiếp khi đọc `.gitignore` và `Design/demo-v1/README.md`.

### Prevention
Khi di chuyển thư mục dự án, cần rà soát các lệnh `cd` và đường dẫn tương đối trong README cục bộ của thư mục đó.

### Related Files
- `.gitignore`
- `Design/demo-v1/README.md`
