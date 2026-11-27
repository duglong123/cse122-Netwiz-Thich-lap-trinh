# NetWiz // Superhero Academy (`Design/UI-final`)

Phiên bản **UI Final** (được chốt chính thức từ Demo V3) với phong cách **Cyber Academy** cho nền tảng học tập môn **Computer Networking**, đầy đủ 4 vai trò (**Guest, Student, Lecturer, Admin**), bộ style chuẩn lưu tại [`Design/Style/`](../Style/README.md).

## Điểm nổi bật trên UI Final

- **Header đóng khung & Điều khiển hiển thị gộp:**
  - Thanh điều hướng website nằm trong khung bo viền tách bạch (`whitespace-nowrap` không xuống dòng).
  - Một nút icon duy nhất trên header mở popover chỉnh nhanh cả **Giao diện Sáng / Tối** (`Daylight Paper` / `Soft Slate Midnight`, lưu vào `netwiz_v3_theme`) và **Chế độ Dịu mắt / Hiệu ứng** (`netwiz_v3_calm_mode`).
- **Network Lab trực quan theo từng chương** trong bài học (`NetworkInspector`): 5 mô hình chuyên biệt cho Mạng máy tính gồm *Packet Switching Pipeline* (Ch.1), *Interactive Topology Schematic* (Ch.2), *OSI Encapsulation + Wire Frame Dissector* (Ch.3), *TCP 3-Way Sequence & IPv4 `/26` CIDR* (Ch.4) và *Defense-in-Depth Security Gateway* (Ch.5), kết hợp console telemetry & lệnh CLI/Wireshark thực tế.
- **Boss Arena** (`BossBattle`): thanh máu vát chéo 5 phân đoạn, hiệu ứng phản đòn, Combo Streak, Phase-2 Enrage dưới 50% HP, cao trào Final Boss Chương 5 (`Zero-Day Phantom`), bảng xếp hạng `S / A / B`, cùng cơ chế đổi câu khi tái đấu và giải thích bắt buộc.

## Cài đặt & Chạy UI Final

```powershell
cd Design/UI-final
npm.cmd install
npm.cmd run dev -- --port 5175
```

Kiểm tra TypeScript và build production:

```powershell
npx.cmd tsc --noEmit; if ($LASTEXITCODE -eq 0) { npm.cmd run build }
```
