import React from 'react';
import { ArrowRight, Compass, FileText, GraduationCap, ShieldAlert, Swords, User } from 'lucide-react';
import { CHAPTER_THEMES } from '../../data/inspectorData';
import { useApp } from '../../store/AppContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Eyebrow, Panel, PanelContent } from '../../components/ui/Panel';

const TICKER_ITEMS = [
  'Packet Switching',
  'Bandwidth & Delay',
  'Star & Spine-Leaf',
  'OSI 7 Layers',
  'MAC vs IP Routing',
  'TCP 3-Way Handshake',
  'IPv4 CIDR Subnetting',
  'CIA Triad & TLS',
  'Boss Battle Arena',
];

export const LandingPage: React.FC = () => {
  const { state, navigate, setLoginModalOpen, loginAs } = useApp();
  const mainCourse = state.courses[0];
  const publicNotes = state.notes.filter((n) => n.visibility === 'public');

  return (
    <div className="space-y-20 pb-8">
      {/* Split Hero matching css-dc-academy.html */}
      <section className="relative pt-4 sm:pt-8 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <Eyebrow>NetWiz Universe × Superhero Academy</Eyebrow>
            <h1 className="display-font text-[46px] sm:text-[68px] lg:text-[84px] font-extrabold leading-[0.94] text-[var(--text)]">
              Mạng máy tính không chỉ{' '}
              <span className="outline-headline">là lý thuyết.</span>{' '}
              <span className="text-[var(--yellow-fg)] block mt-1">Đó là sức mạnh.</span>
            </h1>
            <p className="text-[var(--text-body)] text-base sm:text-lg leading-[1.75] max-w-xl">
              Bước vào học viện dành cho những người muốn{' '}
              <strong className="text-[var(--text)]">làm chủ hạ tầng mạng như siêu anh hùng</strong>.
              Thực hành mô phỏng gói tin, sơ đồ mạng & OSI trong Network Lab, hoàn thành nhiệm vụ giữa chương và hạ 5 Boss bằng kiến thức thật.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />} onClick={() => setLoginModalOpen(true)}>
                Bắt đầu nhiệm vụ
              </Button>
              <Button size="lg" variant="secondary" leftIcon={<Compass className="w-4 h-4" />} onClick={() => navigate('discovery')}>
                Xem danh mục khóa học
              </Button>
            </div>
            <div className="flex flex-wrap gap-7 pt-4">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full border border-[var(--line-strong)] grid place-items-center text-[var(--yellow-fg)] font-black mono">5</span>
                <div>
                  <strong className="block text-lg leading-none">Nhiệm vụ</strong>
                  <span className="block mt-1 text-[var(--muted)] text-[10px] font-extrabold tracking-[0.11em] uppercase">
                    Chương Computer Networking
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full border border-[var(--line-strong)] grid place-items-center text-[var(--yellow-fg)] font-black mono">1</span>
                <div>
                  <strong className="block text-lg leading-none">Hero Aegis-01</strong>
                  <span className="block mt-1 text-[var(--muted)] text-[10px] font-extrabold tracking-[0.11em] uppercase">
                    HP • Inventory • XP
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full border border-[var(--line-strong)] grid place-items-center text-[var(--red-fg)] font-black mono">5</span>
                <div>
                  <strong className="block text-lg leading-none">Boss Chương</strong>
                  <span className="block mt-1 text-[var(--muted)] text-[10px] font-extrabold tracking-[0.11em] uppercase">
                    Giải thích & Đổi câu khi tái đấu
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tilted Hero Poster */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[420px]">
              <div className="hero-poster rounded-2xl aspect-[4/5] p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between text-[#e8c65a] text-[9px] font-black tracking-[0.18em] uppercase z-10">
                  <span>Sector 01 // NetWiz</span>
                  <span>CN-101 // V3</span>
                </div>

                <div className="relative flex-1 flex items-center justify-center">
                  <div className="w-[74%] aspect-square rounded-full border border-[#e8c65a]/25 flex items-center justify-center">
                    <div className="w-[78%] aspect-square rounded-full border border-[#e8c65a]/15 flex items-center justify-center">
                      <img
                        src={state.hero.avatar}
                        alt={state.hero.name}
                        className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl object-cover border-2 border-[#e8c65a] poster-float shadow-2xl"
                      />
                    </div>
                  </div>
                </div>

                <div className="text-center z-10 space-y-1.5">
                  <strong className="display-font block text-2xl sm:text-3xl text-[#f3f6fc] leading-none">
                    Sentinel Aegis-01
                  </strong>
                  <span className="block text-[#e8c65a] text-[9px] font-extrabold tracking-[0.24em] uppercase">
                    OSI • TCP/IP • Cyber Defense
                  </span>
                </div>
              </div>

              <div className="code-float mono hidden sm:block absolute -left-6 top-[24%] -rotate-3 z-20">
                <b className="text-[var(--yellow-fg)]">TCP [SYN] :443</b> → TTL=64 · 2.0ms
              </div>
              <div className="code-float mono hidden sm:block absolute -right-4 bottom-[22%] rotate-3 z-20">
                <b className="text-[var(--yellow-fg)]">OSI WIRE</b> MAC | IP | TCP | TLS
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ticker strip */}
      <div className="ticker -mx-3 sm:-mx-6" aria-hidden="true">
        <div className="ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>
      </div>

      {/* 5-Chapter Mission Map matching .mission-grid */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <Eyebrow>Computer Networking // 5 Chương</Eyebrow>
            <h2 className="display-font text-4xl sm:text-5xl font-extrabold text-[var(--text)] mt-3 leading-[0.98]">
              Chọn chương học.<br />Mở khóa sức mạnh.
            </h2>
          </div>
          <p className="max-w-md text-sm text-[var(--muted)] m-0">
            Mỗi chương kết hợp bài giảng lý thuyết, mô phỏng mạng tương tác theo chuyên đề, nhiệm vụ giữa chương và trận chiến Boss cuối chương.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mainCourse.chapters.map((ch) => {
            const theme = CHAPTER_THEMES[ch.id] ?? CHAPTER_THEMES['ch-1'];
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => loginAs('student', state.demoStudent.id)}
                className="mission-card rounded-2xl p-6 text-left min-h-[260px] flex flex-col justify-between cursor-pointer"
                style={{ '--hero': theme.color, '--hero-rgb': theme.rgb } as React.CSSProperties}
              >
                <span
                  className="display-font absolute top-2 right-5 text-6xl leading-none pointer-events-none"
                  style={{ color: `rgba(${theme.rgb}, 0.14)` }}
                >
                  {theme.number}
                </span>

                <div className="space-y-3 relative z-10">
                  <span className="block text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: theme.color }}>
                    {theme.sector}
                  </span>
                  <h3 className="display-font text-2xl font-extrabold text-[var(--text)] leading-tight">
                    {ch.title}
                  </h3>
                  <p className="text-xs text-[var(--text-body)] leading-relaxed">{ch.summary}</p>
                </div>

                <div className="flex items-center justify-between pt-4 relative z-10 border-t border-white/5">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-[var(--muted)]">
                    Boss: {ch.boss.name}
                  </span>
                  <span className="text-xl font-bold" style={{ color: theme.color }}>→</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Arsenal Quick Reference (3 columns matching .arsenal-grid) */}
      <section className="rounded-2xl border border-[var(--yellow-border)] bg-[var(--panel-deep)] p-6 sm:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <Eyebrow>Sổ tay trước khi vào trận</Eyebrow>
            <h2 className="display-font text-3xl sm:text-5xl font-extrabold text-[var(--text)] mt-3">
              Ba mảnh ghép mạng máy tính.
            </h2>
          </div>
          <p className="max-w-md text-sm text-[var(--muted)] m-0">
            Tóm tắt nhanh các đơn vị PDU, công thức Subnetting và giao thức phòng thủ trước khi đối đầu 5 Boss.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative p-6 border border-[var(--line)] bg-[var(--panel)] rounded-xl overflow-hidden">
            <span className="display-font absolute right-4 top-2 text-6xl text-[var(--yellow-fg)]/10 leading-none">01</span>
            <h3 className="display-font text-2xl font-extrabold text-[var(--text)] mb-4">7 Tầng OSI</h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between gap-2"><code className="mono text-[var(--yellow-fg)]">L7 Application</code><span className="text-[var(--muted)]">HTTP, DNS, SMTP</span></div>
              <div className="flex justify-between gap-2"><code className="mono text-[var(--yellow-fg)]">L4 Transport</code><span className="text-[var(--muted)]">Segment • TCP/UDP</span></div>
              <div className="flex justify-between gap-2"><code className="mono text-[var(--yellow-fg)]">L3 Network</code><span className="text-[var(--muted)]">Packet • IP Router</span></div>
              <div className="flex justify-between gap-2"><code className="mono text-[var(--yellow-fg)]">L2 Data Link</code><span className="text-[var(--muted)]">Frame • MAC Switch</span></div>
            </div>
          </div>

          <div className="relative p-6 border border-[var(--line)] bg-[var(--panel)] rounded-xl overflow-hidden">
            <span className="display-font absolute right-4 top-2 text-6xl text-[var(--blue-fg)]/10 leading-none">02</span>
            <h3 className="display-font text-2xl font-extrabold text-[var(--text)] mb-4">TCP/IP & CIDR</h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between gap-2"><code className="mono text-[var(--blue-fg)]">3-Way Handshake</code><span className="text-[var(--muted)]">SYN → SYN-ACK → ACK</span></div>
              <div className="flex justify-between gap-2"><code className="mono text-[var(--blue-fg)]">Usable Hosts</code><span className="text-[var(--muted)]">2^(32 - prefix) - 2</span></div>
              <div className="flex justify-between gap-2"><code className="mono text-[var(--blue-fg)]">/26 Mask</code><span className="text-[var(--muted)]">255.255.255.192 (62)</span></div>
              <div className="flex justify-between gap-2"><code className="mono text-[var(--blue-fg)]">HTTPS / DNS</code><span className="text-[var(--muted)]">Port 443 / Port 53</span></div>
            </div>
          </div>

          <div className="relative p-6 border border-[var(--line)] bg-[var(--panel)] rounded-xl overflow-hidden">
            <span className="display-font absolute right-4 top-2 text-6xl text-[var(--green-fg)]/10 leading-none">03</span>
            <h3 className="display-font text-2xl font-extrabold text-[var(--text)] mb-4">Security & CIA</h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between gap-2"><code className="mono text-[var(--green-fg)]">Confidentiality</code><span className="text-[var(--muted)]">Mã hóa AES, TLS</span></div>
              <div className="flex justify-between gap-2"><code className="mono text-[var(--green-fg)]">Integrity</code><span className="text-[var(--muted)]">HMAC, SHA-256</span></div>
              <div className="flex justify-between gap-2"><code className="mono text-[var(--green-fg)]">Availability</code><span className="text-[var(--muted)]">Chống DDoS</span></div>
              <div className="flex justify-between gap-2"><code className="mono text-[var(--green-fg)]">ARP Guard</code><span className="text-[var(--muted)]">DAI + DHCP Snooping</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Launch + Public Notes */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Panel accent="var(--yellow)">
          <PanelContent className="space-y-3">
            <Badge tone="yellow" icon={<User className="w-3 h-3" />}>Student</Badge>
            <h3 className="display-font text-2xl font-extrabold">Học tập & Boss Arena</h3>
            <p className="text-xs text-[var(--muted)]">1 Hero Aegis-01, mô phỏng mạng trực quan theo từng chương, Boss Battle & ghi chú riêng tư.</p>
            <Button className="w-full" size="sm" onClick={() => loginAs('student', state.demoStudent.id)}>Vào vai Sinh viên</Button>
          </PanelContent>
        </Panel>

        <Panel accent="var(--green)">
          <PanelContent className="space-y-3">
            <Badge tone="green" icon={<GraduationCap className="w-3 h-3" />}>Lecturer</Badge>
            <h3 className="display-font text-2xl font-extrabold">Lớp học & Đồng thuận</h3>
            <p className="text-xs text-[var(--muted)]">Tạo lớp, ngân hàng câu hỏi tách rời, biểu quyết 100% đồng thuận và thống kê bảo mật ghi chú SV.</p>
            <Button className="w-full" size="sm" variant="success" onClick={() => loginAs('lecturer', state.lecturers[0].id)}>Vào vai Giảng viên</Button>
          </PanelContent>
        </Panel>

        <Panel accent="var(--blue)">
          <PanelContent className="space-y-3">
            <Badge tone="blue" icon={<ShieldAlert className="w-3 h-3" />}>Admin</Badge>
            <h3 className="display-font text-2xl font-extrabold">Giám sát & Kiểm duyệt</h3>
            <p className="text-xs text-[var(--muted)]">Chỉ đọc kiến thức, gửi cảnh báo, khóa/mở khóa học liệu kèm lý do và lịch sử phiên bản.</p>
            <Button className="w-full" size="sm" variant="secondary" onClick={() => loginAs('admin', state.demoAdmin.id)}>Vào vai Admin</Button>
          </PanelContent>
        </Panel>
      </section>

      {publicNotes.length > 0 && (
        <Panel>
          <PanelContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-[var(--yellow-fg)]" />
              <div>
                <div className="text-sm font-bold text-[var(--text)]">Ghi chú công khai từ cộng đồng</div>
                <div className="text-xs text-[var(--muted)]">{publicNotes[0].title} — bởi {publicNotes[0].authorName}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => navigate('shared-note', { noteId: publicNotes[0].id })}>
                Đọc ghi chú công khai
              </Button>
              <Button size="sm" variant="danger" leftIcon={<Swords className="w-3.5 h-3.5" />} onClick={() => loginAs('student', state.demoStudent.id)}>
                Thử đánh Boss
              </Button>
            </div>
          </PanelContent>
        </Panel>
      )}
    </div>
  );
};
