# Kinh nghiệm Dự án (`docs/project-experience/`)

Thư mục này lưu giữ trí nhớ thực chiến của dự án **NetWiz** nhằm giúp AI Agent và kỹ sư không lặp lại sai lầm cũ, tuân thủ quy ước đã kiểm chứng và thực hiện đầy đủ các bước kiểm tra an toàn trước khi bàn giao.

---

## 1. Phân biệt nội dung từng tài liệu

| Tài liệu | Mục đích | Nội dung cốt lõi |
|---|---|---|
| [`implementation-guidelines.md`](./implementation-guidelines.md) | **Kinh nghiệm triển khai** | Quy trình chuẩn **Before / During / After Coding** áp dụng riêng cho cấu trúc và ràng buộc của NetWiz. |
| [`bug-and-fix-log.md`](./bug-and-fix-log.md) | **Các lỗi từng gặp, nguyên nhân gốc rễ & giải pháp** | Nhật ký dài hạn ghi lại biểu hiện, cách tái hiện, nguyên nhân đã xác minh, giải pháp, kết quả kiểm tra và biện pháp phòng tránh. |
| [`lessons-learned.md`](./lessons-learned.md) | **Bài học thực tế** | Đúc kết các phương pháp **nên tiếp tục sử dụng** và **những cách làm cần tránh** từ quá trình xây dựng và rà soát dự án. |
| [`error-prevention-checklist.md`](./error-prevention-checklist.md) | **Checklist phòng ngừa lỗi** | Danh sách kiểm tra bắt buộc trước và sau mọi thay đổi đáng kể. |

---

## 2. Cách sử dụng thư mục này trong một phiên làm việc

1. **Trước khi code:**
   - Đọc [`implementation-guidelines.md`](./implementation-guidelines.md) để nắm ranh giới nghiệp vụ và cấu trúc code.
   - Rà soát [`bug-and-fix-log.md`](./bug-and-fix-log.md) (đặc biệt các lỗi `Open` hoặc liên quan đến module sắp sửa) và [`lessons-learned.md`](./lessons-learned.md).
2. **Khi gặp lỗi hoặc hành vi bất thường:**
   - Tra cứu [`bug-and-fix-log.md`](./bug-and-fix-log.md) xem lỗi có trùng lặp hoặc liên quan không.
   - Chỉ ghi nhận nguyên nhân gốc rễ sau khi kiểm tra trực tiếp mã nguồn hoặc log lỗi; không ghi suy đoán thành kết luận.
3. **Sau khi hoàn thành thay đổi:**
   - Đối chiếu từng mục trong [`error-prevention-checklist.md`](./error-prevention-checklist.md). Chỉ đánh dấu `[x]` nếu thực sự đã kiểm tra.
   - Nếu có lỗi mới có giá trị tái sử dụng hoặc rút ra bài học mới, cập nhật ngay vào `bug-and-fix-log.md` và `lessons-learned.md`, đồng thời cập nhật [`PROJECT_PROGRESS.md`](../../PROJECT_PROGRESS.md).

---

## 3. Nguyên tắc cốt lõi

- **Chỉ ghi nhận sự thật đã xác minh:** Không tự tạo lịch sử lỗi giả định hay bài học từ tính năng chưa tồn tại.
- **Giữ tính truy vết:** Lỗi đã `Resolved` không bị xóa khỏi nhật ký; nếu giải pháp cũ không còn phù hợp, cập nhật trạng thái và ghi chú lịch sử thay đổi.
