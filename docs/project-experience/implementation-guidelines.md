# Hướng dẫn Triển khai cho AI Agent (Implementation Guidelines)

Tài liệu này quy định các nguyên tắc bắt buộc khi AI Agent hoặc lập trình viên thực hiện thay đổi trên repository **NetWiz**.

---

## 1. Before Coding (Trước khi viết code)

1. **Đọc tài liệu nền tảng theo thứ tự:**
   - [`PROJECT_PROGRESS.md`](../../PROJECT_PROGRESS.md) để nắm trạng thái hiện tại và việc đang mở.
   - [`docs/technical-knowledge/business-rules.md`](../technical-knowledge/business-rules.md) để không vi phạm quy tắc nghiệp vụ.
   - [`docs/technical-knowledge/architecture.md`](../technical-knowledge/architecture.md) và [`docs/technical-knowledge/data-model.md`](../technical-knowledge/data-model.md) để hiểu cấu trúc thực tế.
   - [`docs/project-experience/bug-and-fix-log.md`](./bug-and-fix-log.md) và [`docs/project-experience/lessons-learned.md`](./lessons-learned.md) để tránh lặp lại lỗi cũ.
2. **Đọc trực tiếp các file liên quan:** Không đoán tên hàm, props, CSS token hoặc state chỉ dựa vào tên file.
3. **Tìm component và logic đã tồn tại:** Kiểm tra `src/components/ui/`, `src/store/AppContext.tsx` và `src/types/index.ts` trong đúng phiên bản demo (hoặc codebase chính thức) đang thao tác.
4. **Xác định phạm vi thay đổi:** Nêu rõ những file cần sửa và những thư mục tuyệt đối không đụng tới (ví dụ: không sửa nhầm sang `demo-v1`/`demo-v2` khi chỉ sửa `demo-v3`).

---

## 2. During Coding (Trong quá trình viết code)

1. **Tái sử dụng trước khi tạo mới:** Dùng lại các UI primitive có sẵn (`Button`, `Badge`, `Modal`, `Tabs`, `ProgressBar`, `DataFeedback`, `FormControls`) thay vì tạo component trùng lặp.
2. **Tôn trọng thiết kế riêng của từng bản Demo:**
   - V1 (`Dark Command Cobalt`), V2 (`Focus Studio`), V3 (`Cyber Academy`) là **3 Design System khác nhau**. Không trộn lẫn token hay component giữa các bản demo.
3. **Giữ ranh giới vai trò & quy tắc nghiệp vụ:**
   - **Admin:** Chỉ xem (read-only) nội dung kiến thức, gửi cảnh báo/nhắc nhở, khóa/mở khóa kèm lý do và bảo toàn `versionHistory`. Không tự sửa kiến thức.
   - **Notes:** Ghi chú mặc định `visibility: 'private'`; không hiển thị ghi chú riêng tư của sinh viên trong giao diện Giảng viên/Admin.
   - **Shared Course:** Giữ quy tắc đồng thuận 100% đối với chỉnh sửa nội dung dùng chung; không cho phép ghi đè đơn phương bài học đã công bố trên khóa có nhiều giảng viên.
   - **Game System:** Chỉ có 1 Hero chính (`Aegis-01`); câu hỏi trong Boss Battle phải có `explanation` và hỗ trợ cơ chế tái đấu giữ câu sai, đổi câu đúng theo `knowledgeObjective`.
4. **Tách Mock Data khỏi UI Components:** Dữ liệu mẫu đặt trong `src/data/`, không hard-code trực tiếp vào JSX của màn hình. Không đưa dữ liệu giả vào logic production ngoài khu vực demo/mock đã xác định.
5. **Xử lý đầy đủ trạng thái biên:** Kiểm tra null/undefined, danh sách rỗng (`EmptyState`), dữ liệu động có 0 phần tử (ví dụ chương mới chưa có câu hỏi), và cleanup timer/listener khi unmount.
6. **Không để lộ secrets:** Không ghi token, mật khẩu thật, API key hoặc dữ liệu cá nhân thật vào code hoặc tài liệu.

---

## 3. After Coding (Sau khi viết code)

1. **Kiểm tra diff & file thay đổi:** Đảm bảo không sửa nhầm file ngoài phạm vi.
2. **Chạy lệnh kiểm tra thực tế cho từng thư mục đã sửa:**
   - Trên Windows PowerShell, luôn dùng `npx.cmd` và `npm.cmd`:
     ```powershell
     npx.cmd tsc --noEmit; if ($LASTEXITCODE -eq 0) { npm.cmd run build }
     ```
   - Lưu ý hiện tại repository **chưa có** script lint hay automated test (`vitest`/`jest`/`playwright`). Không được báo cáo "tests passed" nếu dự án chưa có test thực tế.
3. **Kiểm tra luồng liên quan:** Kiểm tra tác động chéo giữa 4 vai trò (ví dụ: Admin khóa bài -> Student và Lecturer đều thấy trạng thái khóa; GV biểu quyết đủ 100% -> phiên bản mới tự động công bố).
4. **Cập nhật tài liệu đồng bộ:**
   - Cập nhật [`bug-and-fix-log.md`](./bug-and-fix-log.md) nếu phát hiện hoặc xử lý lỗi mới.
   - Cập nhật [`lessons-learned.md`](./lessons-learned.md) nếu có bài học tái sử dụng.
   - Cập nhật [`docs/technical-knowledge/`](../technical-knowledge/README.md) nếu thay đổi kiến trúc, mô hình dữ liệu, tech stack hoặc quy tắc nghiệp vụ.
   - Cập nhật [`PROJECT_PROGRESS.md`](../../PROJECT_PROGRESS.md) với bằng chứng lệnh chạy thực tế, vấn đề còn tồn tại và bước tiếp theo.
