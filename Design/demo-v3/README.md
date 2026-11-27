# NetWiz // Superhero Academy (UI/UX Demo V3)

Phiên bản **Demo V3** trích xuất phong cách thị giác từ [`Design/css-dc-academy.html`](../css-dc-academy.html) (nền Midnight Navy `#080c16`, nhấn Vàng `#f4d35e`, Đỏ `#ef4444`, Xanh `#4da3ff` / `#45d483`, nút comic hard-shadow, tiêu đề condensed `Barlow Condensed`, Network Inspector 4 lớp lồng nhau và đấu trường Boss Arena giàu hiệu ứng tương tác) áp dụng cho dữ liệu môn **Computer Networking** đầy đủ 4 vai trò (Guest, Student, Lecturer, Admin).

## Điểm nổi bật trên Demo V3

- **Trích xuất ngôn ngữ thiết kế DC Academy**:
  - Header 78px với logo cắt chéo vàng `#f4d35e`, thanh tiến độ hạ Boss ngay trên header và nút bật/tắt **Dịu mắt (Calm Mode)** cho phiên học kéo dài.
  - **Network Inspector 4 lớp** trong bài học (`LearningInterface`): nhấp hoặc dùng phím `Tab` để kiểm tra từng lớp giao thức và mã cấu hình trực quan.
  - **Boss Arena** (`BossBattle`): bố cục bất đối xứng với thanh máu vát chéo 5 phân đoạn, hiệu ứng phản đòn + rung màn hình, đòn đánh + số sát thương bay (`CRIT`), Combo Streak, trạng thái Enrage dưới 50% HP, Confetti & Huy hiệu xếp hạng khi chiến thắng, cùng cơ chế đổi câu khi tái đấu và giải thích bắt buộc.

## Cài đặt & Chạy Demo V3

```bash
cd Design/demo-v3
npm.cmd install
npm.cmd run dev -- --port 5175
```

Kiểm tra build:

```bash
npx.cmd tsc --noEmit
npm.cmd run build
```
