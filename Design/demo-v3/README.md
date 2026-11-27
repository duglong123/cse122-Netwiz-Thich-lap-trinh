# NetWiz // Superhero Academy (UI/UX Demo V3)

Phiên bản **Demo V3** trích xuất phong cách thị giác từ [`Design/css-dc-academy.html`](../css-dc-academy.html) (nền Midnight Navy `#080c16`, nhấn Vàng `#f4d35e`, Đỏ `#ef4444`, Xanh `#4da3ff` / `#45d483`, nút comic hard-shadow, tiêu đề condensed `Barlow Condensed`, bộ mô phỏng mạng trực quan theo từng chuyên đề và đấu trường Boss Arena giàu hiệu ứng tương tác) áp dụng cho dữ liệu môn **Computer Networking** đầy đủ 4 vai trò (Guest, Student, Lecturer, Admin).

## Điểm nổi bật trên Demo V3

- **Trích xuất ngôn ngữ thiết kế DC Academy**:
  - Header 78px với logo cắt chéo vàng, thanh tiến độ hạ Boss ngay trên header, nút chuyển **Sáng / Tối** (`Daylight Paper` / `Soft Slate Midnight`, lưu vào `netwiz_v3_theme`) và nút **Dịu mắt (Calm Mode)** giảm kích thích thị giác khi đọc bài hoặc ghi chú lâu.
  - **Network Lab trực quan theo từng chương** trong bài học (`NetworkInspector`): 5 mô hình chuyên biệt cho Mạng máy tính gồm *Packet Switching Pipeline* (Ch.1), *Interactive Topology Schematic* (Ch.2), *OSI Encapsulation + Wire Frame Dissector* (Ch.3), *TCP 3-Way Sequence & IPv4 `/26` CIDR* (Ch.4) và *Defense-in-Depth Security Gateway* (Ch.5), kết hợp console telemetry & lệnh CLI/Wireshark thực tế.
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
