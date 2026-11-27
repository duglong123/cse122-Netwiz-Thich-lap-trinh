# Quy tắc Nghiệp vụ (Business Rules)

Tài liệu này là nguồn tham chiếu chính về quy tắc nghiệp vụ của dự án **NetWiz**, tổng hợp từ đặc tả gốc [`docs/Prompt/Prompt UI.txt`](../Prompt/Prompt%20UI.txt) và đối chiếu trực tiếp với mã nguồn thực tế trong `Design/demo-v1`, `Design/demo-v2`, `Design/demo-v3`.

---

## 1. User Roles (`CONFIRMED` / `IMPLEMENTED` mô phỏng Frontend)

Hệ thống phân định 4 vai trò (`Role = 'guest' | 'student' | 'lecturer' | 'admin'`):
- **Guest:** Chỉ khám phá trang giới thiệu, danh sách khóa học công khai (`isPublic: true`), xem trước khóa học và xem các ghi chú có `visibility === 'public'`.
- **Student:** Học bài, làm nhiệm vụ giữa chương, đánh Boss, ôn luyện `WrongAnswers` và quản lý `Notes` cá nhân.
- **Lecturer:** Quản lý lớp học, biên soạn kiến thức/câu hỏi/Boss, biểu quyết khóa học chung và xem thống kê học tập của sinh viên.
- **Admin:** Giám sát hoạt động, gửi cảnh báo/nhắc nhở và khóa/mở khóa nội dung kiến thức.

> **Lưu ý hiện trạng:** Phân quyền hiện tại mới thực thi ở tầng giao diện điều hướng Frontend (`AppContext.tsx`). Chưa có cơ chế xác thực và phân quyền phía Backend (`PLANNED`).

---

## 2. Classroom (`CONFIRMED` / `IMPLEMENTED` một phần)

- **BR-CLS-01 (`IMPLEMENTED`):** Giảng viên có thể tạo lớp học mới (`createClassroom`), chỉnh sửa thông tin lớp (`updateClassroom`) và xem tiến độ chi tiết từng sinh viên trong lớp.
- **BR-CLS-02 (`IMPLEMENTED` một phần):** Mỗi lớp có mã tham gia (`joinCode`, định dạng `NW-XXXX`, ví dụ `NW-2026-K22`). Trong bản Demo, `enrollStudentToClass` kiểm tra khớp `joinCode` khi **Giảng viên** nhập thông tin thêm sinh viên vào lớp từ màn hình `ClassroomManagement`.
  - Chưa có màn hình để **Sinh viên** tự nhập `joinCode` xin vào lớp (`PLANNED`).

---

## 3. Shared Course & 100% Consensus (`CONFIRMED` / `IMPLEMENTED` một phần)

- **BR-SHR-01 (`CONFIRMED`):** Một khóa học có thể được nhiều giảng viên cùng sử dụng (`collaboratorIds`, ví dụ `CN-101` có 3 giảng viên `lec-01`, `lec-02`, `lec-03`).
- **BR-SHR-02 (`IMPLEMENTED` khi sửa bài đã công bố):** Khi chỉnh sửa một `Lesson` có `status === 'published'` và giữ `status === 'published'` trên khóa học có `collaboratorIds.length > 1`, `saveLessonOrPropose` **không ghi đè trực tiếp** mà tạo một `ChangeProposal` ở trạng thái `pending` với người đề xuất tự động bỏ phiếu `approved`.
- **BR-SHR-03 (`IMPLEMENTED`):** Giao diện `SharedProposals` hiển thị nội dung trước/sau (`beforeContent` vs `afterContent`), danh sách giảng viên tham gia, trạng thái biểu quyết (`Pending`, `Approved`, `Rejected`) và người đã/chưa biểu quyết.
- **BR-SHR-04 (`IMPLEMENTED`):** Trong `voteProposal`:
  - Nếu có bất kỳ phiếu `rejected` -> đề xuất chuyển ngay sang `rejected` và giữ nguyên nội dung gốc.
  - Chỉ khi **100% giảng viên trong `collaboratorIds`** đều bỏ phiếu `approved` -> trạng thái chuyển sang `approved`, nội dung mới được áp dụng vào `Lesson` và tăng `version` trong `versionHistory`.
- **Lỗ hổng đã ghi nhận (`BUG-004`):** Các thao tác khác trên khóa học chung (thêm bài mới công bố ngay, xóa/lưu trữ bài, đổi thứ tự, chuyển chương, thêm chương, sửa ngân hàng câu hỏi, sửa Boss) hiện vẫn cập nhật trực tiếp mà chưa qua quy trình đề xuất.

---

## 4. Knowledge Management (`CONFIRMED` / `IMPLEMENTED`)

- **BR-KNO-01 (`CONFIRMED`):** Chỉ Giảng viên có quyền thêm, sửa, xóa, lưu trữ và sắp xếp nội dung kiến thức.
- **BR-KNO-02 (`IMPLEMENTED`):** Cấu trúc phân cấp: `Course -> Chapter -> Lesson` (chứa nội dung kiến thức, `summary`, `keyTakeaways`), đi kèm `InteractiveMission` và `Boss` theo từng chương.
- **BR-KNO-03 (`IMPLEMENTED`):** Hỗ trợ trạng thái bài học `draft` (nháp), `published` (công bố) và `archived` (lưu trữ), sắp xếp thứ tự (`reorderLesson`), chuyển bài sang chương khác (`moveLessonToChapter`) và lưu lịch sử phiên bản (`versionHistory`).
- **BR-KNO-04 (`IMPLEMENTED`):** Ngân hàng câu hỏi (`Question[]`) được tách độc lập khỏi `Lesson`, gắn `courseId`, `chapterId` và `knowledgeObjective` để tái sử dụng.

---

## 5. Admin (`CONFIRMED` / `IMPLEMENTED`)

- **BR-ADM-01 (`IMPLEMENTED`):** Admin có quyền gửi cảnh báo (`warning`) hoặc nhắc nhở (`reminder`) tới giảng viên, khóa (`lock`) hoặc mở khóa (`unlock`) từng `Lesson` và xem lịch sử kiểm duyệt (`moderationLogs`).
- **BR-ADM-02 (`IMPLEMENTED`):** Khi khóa nội dung (`lockLessonContent`), hệ thống bắt buộc nhập lý do (`reason`), lưu người thực hiện (`lockedBy`), thời gian (`lockedAt`), **giữ nguyên toàn bộ nội dung và `versionHistory`**, đồng thời hiển thị trạng thái khóa cho cả Student và Lecturer.
- **BR-ADM-03 (`IMPLEMENTED`):** Admin **không có quyền** trực tiếp thêm hoặc sửa nội dung kiến thức (màn hình `ContentModeration` chỉ cho phép xem ở chế độ chỉ đọc).

---

## 6. Notes & Privacy (`CONFIRMED` / `IMPLEMENTED` Frontend)

- **BR-NOT-01 (`IMPLEMENTED`):** Hệ thống ghi chú gồm 3 khu vực trong `NotesHub`: **Chapter Notes** (`scope: 'chapter'`), **Global Notes** (`scope: 'global'`) và **Wrong Answers**.
- **BR-NOT-02 (`IMPLEMENTED`):** Ghi chú mới tạo mặc định có `visibility: 'private'`. Sinh viên có thể chuyển đổi qua lại giữa `private` và `public` cho từng ghi chú.
- **BR-NOT-03 (`IMPLEMENTED`):** Ghi chú `public` có thể xem qua màn hình `SharedNoteView` (`#/shared-note/:noteId`). Nếu ghi chú đang là `private`, `SharedNoteView` từ chối hiển thị nội dung.
- **BR-NOT-04 (`IMPLEMENTED` Frontend):** Giao diện Giảng viên (`LearningAnalytics`, `ClassroomManagement`) và Admin không truy cập hay hiển thị ghi chú riêng tư của sinh viên.

---

## 7. Game System (`CONFIRMED` / `IMPLEMENTED`)

- **BR-GAM-01 (`IMPLEMENTED`):** Người học chỉ có **một Hero chính duy nhất** (`Aegis-01` / `hero-aegis-01`), có các chỉ số `level`, `xp`, `nextLevelXp`, `hp`, `maxHp`, `attack`, `defense` và `inventoryItemIds`. Không có tính năng chọn/mua nhiều Hero.
- **BR-GAM-02 (`IMPLEMENTED`):** Mỗi chương có một `InteractiveMission` (`match` ghép cặp, `order` sắp xếp, `scenario` tình huống); hoàn thành nhiệm vụ sẽ nhận vật phẩm thưởng (`rewardItemId`) vào Inventory và cộng XP.
- **BR-GAM-03 (`IMPLEMENTED`):** Mỗi chương có một `Boss` riêng (hình ảnh, tên, `maxHp`, `attackPower`, `trait`). Trả lời đúng gây sát thương cho Boss; trả lời sai Boss phản công trừ HP Hero và ghi nhận vào `wrongAnswers` kèm lời giải thích (`explanation`).
- **BR-GAM-04 (`IMPLEMENTED`):** Khi HP của Hero về `0`, trận đấu kết thúc ở trạng thái thất bại (`defeat`) và hướng dẫn người học quay lại ôn tập bài học / danh sách câu sai trước khi tái đấu.
- **BR-GAM-05 (`IMPLEMENTED`):** Cơ chế bộ câu hỏi khi đánh lại (`buildBattleDeck` trong `BossBattle.tsx`):
  1. Giữ lại các câu hỏi đã trả lời sai của chương (`wrongQuestionIds`).
  2. Đối với các câu đã trả lời đúng (`passedQuestionIds`), tìm câu hỏi **mới** khác `id` trong ngân hàng đề của chương có **cùng `knowledgeObjective`** để thay thế.
  3. Bù thêm câu chưa làm (hoặc lặp lại nếu ngân hàng đề chương chưa đủ số câu mục tiêu) để đủ bộ câu hỏi trận đấu.
- **BR-GAM-06 (`IMPLEMENTED`):** Khi câu hỏi sai được trả lời đúng lại (trong trận Boss hoặc trong mục luyện tập ở `Wrong Answers`), trạng thái trong `WrongAnswerRecord` được cập nhật thành `resolved`.

---

## 8. OPEN QUESTIONS (Quy tắc chưa được xác định đầy đủ)

Các điểm dưới đây chưa được làm rõ trong tài liệu gốc hoặc còn chưa thống nhất giữa nghiệp vụ và bản Demo — **Agent không được tự ý quyết định khi chưa có xác nhận**:

1. **Phạm vi đồng thuận khóa học chung:** Quy tắc đồng thuận 100% có áp dụng cho việc *thêm bài học mới công khai ngay*, *xóa/lưu trữ bài*, *chuyển chương*, *chỉnh sửa ngân hàng câu hỏi* và *cấu hình Boss* của khóa học dùng chung hay chỉ áp dụng cho sửa nội dung `Lesson` đã công bố? (Liên quan [`BUG-004`](../project-experience/bug-and-fix-log.md#bug-004)).
2. **Cơ chế tham gia lớp của Sinh viên:** Ở sản phẩm chính thức, sinh viên sẽ tự nhập `joinCode` để tham gia lớp hay giảng viên nhập thủ công như trong Demo hiện tại, hay hỗ trợ cả hai?
3. **Tác động của việc Admin khóa bài học lên Boss Battle:** Khi Admin khóa (`locked`) một hoặc nhiều `Lesson` trong chương, sinh viên có bị chặn đánh Boss của chương đó hay vẫn được đánh bình thường?
4. **Phạm vi kiểm duyệt của Admin:** Admin hiện mới kiểm duyệt `Lesson`. Trong tương lai Admin có quyền cảnh báo/khóa ở cấp `Course`, `Question` hoặc `Note` đang để chế độ `public` hay không?
5. **Quy trình mở lại đề xuất bị `Rejected`:** Khi một giảng viên bấm `Rejected`, đề xuất kết thúc ngay; giảng viên đề xuất có thể chỉnh sửa lại trên đề xuất cũ hay phải tạo đề xuất mới hoàn toàn?
6. **Quyền chỉnh sửa khi khóa học có đề xuất `Pending`:** Có cho phép tạo nhiều `ChangeProposal` song song trên cùng một `Lesson` không, và xử lý xung đột nội dung (merge conflict) như thế nào nếu đề xuất trước được duyệt?
7. **Điều kiện mở khóa chương và tiêu hao vật phẩm:** Sinh viên có bắt buộc hoàn thành mọi `Lesson` và `Mission` mới được đánh Boss không (hiện Demo cho vào đánh trực tiếp), và vật phẩm loại `heal` / `hint` / `boost` có bị tiêu hao vĩnh viễn khỏi `inventoryItemIds` sau trận đấu hay tái sử dụng theo mỗi trận?
