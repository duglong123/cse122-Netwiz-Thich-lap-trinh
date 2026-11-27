# Checklist Phòng ngừa Lỗi (Error Prevention Checklist)

Mọi AI Agent và kỹ sư phải rà soát checklist này **trước và sau mỗi thay đổi đáng kể**.

> **Quy tắc bắt buộc:** Không đánh dấu `[x]` vào bất kỳ mục nào nếu thực tế chưa kiểm tra hoặc chưa chạy lệnh xác minh.

---

## A. Trước khi sửa mã nguồn (Pre-Change)

- [ ] Đã đọc [`PROJECT_PROGRESS.md`](../../PROJECT_PROGRESS.md) để nắm trạng thái hiện tại và các đầu việc đang mở.
- [ ] Đã đọc [`docs/technical-knowledge/business-rules.md`](../technical-knowledge/business-rules.md) liên quan đến tính năng sắp sửa.
- [ ] Đã đọc [`docs/project-experience/bug-and-fix-log.md`](./bug-and-fix-log.md) và [`lessons-learned.md`](./lessons-learned.md) để kiểm tra lỗi cũ liên quan.
- [ ] Đã đọc trực tiếp các file sẽ sửa và các caller/module phụ thuộc liên quan.
- [ ] Đã kiểm tra component, helper hoặc type hiện có để tái sử dụng, không tạo bản trùng lặp.
- [ ] Đã xác định đúng phạm vi thư mục cần sửa (không sửa nhầm giữa `demo-v1`, `demo-v2`, `demo-v3` hoặc mã nguồn chính thức).

---

## B. Trong khi triển khai (During Implementation)

- [ ] Không tạo logic hoặc UI component trùng lặp trong cùng ứng dụng.
- [ ] Không vi phạm quy tắc nghiệp vụ:
  - [ ] Admin không có nút hoặc luồng sửa trực tiếp nội dung kiến thức.
  - [ ] Ghi chú sinh viên mặc định `private`, không rò rỉ sang màn hình Giảng viên/Admin.
  - [ ] Khóa học chung giữ cơ chế đồng thuận 100% khi chỉnh sửa nội dung đã công bố.
  - [ ] Boss Battle có giải thích đáp án và cơ chế tái đấu giữ câu sai / đổi câu đúng theo `knowledgeObjective`.
- [ ] Đã xử lý đầy đủ trạng thái `null`, `undefined`, danh sách rỗng (`EmptyState`), deck câu hỏi rỗng và lỗi nhập liệu.
- [ ] Đã dọn dẹp timer/listener (`clearTimeout`, `removeEventListener`) khi component unmount hoặc reset.
- [ ] Không để lại code chết, `console.log` debug, `TODO` giả, hoặc dữ liệu nhạy cảm/secrets.

---

## C. Kiểm tra Giao diện & Trải nghiệm (UI/UX — nếu có thay đổi giao diện)

- [ ] Đã tuân thủ đúng hệ màu, typography và component của bản Design System đang sửa (xem [`ui-ux-design-system.md`](../technical-knowledge/ui-ux-design-system.md)).
- [ ] Đã kiểm tra bố cục responsive trên Desktop, Tablet và Mobile.
- [ ] Nếu sửa `demo-v2`: đã kiểm tra cả 2 chế độ **Sáng (Warm Paper)** và **Tối (Warm Charcoal)**.
- [ ] Nếu sửa `demo-v3`: đã kiểm tra chế độ **Dịu mắt (`data-calm="true"`)** và `@media (prefers-reduced-motion: reduce)` để đảm bảo không còn nhiễu/animation ngoài ý muốn.
- [ ] Vùng đọc bài giảng, ghi chú và giải thích đáp án đảm bảo độ tương phản và không bị che bởi hiệu ứng/modal không cần thiết.

---

## D. Sau khi sửa & Kiểm chứng (Post-Change Verification)

- [ ] Đã kiểm tra `git status` / `git diff` để chắc chắn không sửa nhầm file ngoài phạm vi.
- [ ] Đã chạy kiểm tra TypeScript và build thực tế (trên Windows dùng `npx.cmd tsc --noEmit` và `npm.cmd run build`) và ghi lại đúng kết quả.
- [ ] Đã kiểm tra ảnh hưởng đến các vai trò hoặc luồng nghiệp vụ liên quan.
- [ ] Đã cập nhật tài liệu kỹ thuật bị ảnh hưởng trong [`docs/technical-knowledge/`](../technical-knowledge/README.md) (nếu có).
- [ ] Đã cập nhật [`bug-and-fix-log.md`](./bug-and-fix-log.md) / [`lessons-learned.md`](./lessons-learned.md) (nếu phát hiện lỗi hoặc bài học mới).
- [ ] Đã cập nhật [`PROJECT_PROGRESS.md`](../../PROJECT_PROGRESS.md) với bằng chứng kiểm tra thực tế và bước tiếp theo.
