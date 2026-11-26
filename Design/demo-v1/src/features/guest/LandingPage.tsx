import React from 'react';
import {
  ArrowRight,
  BookOpen,
  Compass,
  FileText,
  GitPullRequest,
  Lock,
  Shield,
  ShieldCheck,
  Sparkles,
  Swords,
  Users,
} from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';

export const LandingPage: React.FC = () => {
  const { state, navigate, setLoginModalOpen, loginAs } = useApp();
  const mainCourse = state.courses[0];
  const publicNotes = state.notes.filter((n) => n.visibility === 'public');

  return (
    <div className="space-y-12 pb-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#111827] bg-tactical-grid p-6 sm:p-10 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <Badge tone="cobalt" icon={<Shield className="w-3.5 h-3.5" />}>
              PROJECT: SUPERHERO · DEMO V1
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.15]">
              Học Mạng Máy Tính như một{' '}
              <span className="text-blue-400">Network Sentinel</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Nền tảng hỗ trợ giảng dạy và học tập kết hợp hệ thống quản lý kiến thức chuẩn mực với cơ chế
              Gamification chiến thuật: hoàn thành bài học, vượt qua nhiệm vụ tương tác, sở hữu vật phẩm
              và đối đầu Boss đại diện cho từng chương.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => setLoginModalOpen(true)}
              >
                Đăng nhập Demo theo vai trò
              </Button>
              <Button
                variant="secondary"
                size="lg"
                leftIcon={<Compass className="w-4 h-4" />}
                onClick={() => navigate('discovery')}
              >
                Khám phá khóa học
              </Button>
              {publicNotes[0] && (
                <Button
                  variant="outline"
                  size="lg"
                  leftIcon={<FileText className="w-4 h-4" />}
                  onClick={() => navigate('shared-note', { noteId: publicNotes[0].id })}
                >
                  Xem ghi chú công khai
                </Button>
              )}
            </div>
          </div>

          <div className="lg:col-span-5">
            <Card className="bg-[#0B1120]/90 border-slate-700/80 overflow-hidden">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-blue-400">
                    Bản xem trước trận chiến
                  </span>
                  <Badge tone="emerald">Chương 1–5 · CN-101</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 items-center">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <img
                      src={state.hero.avatar}
                      alt={state.hero.name}
                      className="w-20 h-20 mx-auto rounded-xl object-cover border border-emerald-500/40 mb-2"
                    />
                    <div className="text-sm font-bold text-white">{state.hero.name}</div>
                    <div className="text-[11px] font-mono text-emerald-400">HERO · 100 HP</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <img
                      src={mainCourse.chapters[0].boss.avatar}
                      alt={mainCourse.chapters[0].boss.name}
                      className="w-20 h-20 mx-auto rounded-xl object-cover border border-rose-500/40 mb-2"
                    />
                    <div className="text-sm font-bold text-white truncate">
                      {mainCourse.chapters[0].boss.name}
                    </div>
                    <div className="text-[11px] font-mono text-rose-400">BOSS CH.1 · 90 HP</div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  Mỗi câu trả lời sai đều được lưu kèm <strong>lời giải thích chi tiết</strong> tại{' '}
                  <span className="text-amber-300 font-mono">Wrong Answers</span>. Khi tái đấu Boss, câu đã vượt qua được thay bằng câu mới cùng mục tiêu kiến thức.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Superhero Learning Loop */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold text-white">Quy trình học tập qua Superhero</h2>
            <p className="text-sm text-slate-400 mt-1">
              Trò chơi chỉ đóng vai trò hỗ trợ động lực — trải nghiệm học tập và hiểu sâu kiến thức là trung tâm.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">1. Nắm vững kiến thức phân tầng</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Học theo cấu trúc Course → Chapter → Lesson, ghi chú nhanh theo từng chương hoặc Global Notes (mặc định riêng tư, chia sẻ công khai khi cần).
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">2. Nhiệm vụ tương tác giữa chương</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Thực hành ghép cặp giao thức, sắp xếp 7 tầng OSI hoặc bắt tay 3 bước TCP để mở khóa vật phẩm hỗ trợ chiến đấu vào Inventory.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Swords className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">3. Đánh Boss & Khắc phục câu sai</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Mỗi chương có 1 Boss riêng. Sai nhận sát thương + giải thích ngay lập tức; khi đánh lại, câu đúng được đổi sang câu mới cùng mục tiêu kiến thức.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Role Governance Showcase */}
      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold text-white">Phân quyền chặt chẽ cho 3 vai trò vận hành</h2>
          <p className="text-sm text-slate-400 mt-1">
            Chạm vào từng vai trò để vào trực tiếp bản Demo V1 tương tác đầy đủ.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card hoverable className="flex flex-col justify-between">
            <CardContent className="space-y-3">
              <Badge tone="cobalt" icon={<Users className="w-3.5 h-3.5" />}>Student – Sinh viên</Badge>
              <h3 className="text-lg font-bold text-white">Học tập, Boss Battle & Ghi chú</h3>
              <ul className="text-sm text-slate-400 space-y-1.5 list-disc list-inside">
                <li>1 nhân vật duy nhất Aegis-01 với HP & Inventory</li>
                <li>Nhiệm vụ ghép nối, sắp xếp, tình huống</li>
                <li>3 khu vực: Chapter Notes, Global Notes, Wrong Answers</li>
              </ul>
            </CardContent>
            <div className="px-5 pb-5">
              <Button className="w-full" onClick={() => loginAs('student', state.demoStudent.id)}>
                Trải nghiệm vai trò Sinh viên
              </Button>
            </div>
          </Card>

          <Card hoverable className="flex flex-col justify-between">
            <CardContent className="space-y-3">
              <Badge tone="emerald" icon={<GitPullRequest className="w-3.5 h-3.5" />}>Lecturer – Giảng viên</Badge>
              <h3 className="text-lg font-bold text-white">Xây dựng học liệu & Đồng thuận 100%</h3>
              <ul className="text-sm text-slate-400 space-y-1.5 list-disc list-inside">
                <li>Quản lý lớp học, mã tham gia, ngân hàng câu hỏi tách rời</li>
                <li>Đề xuất chỉnh sửa khóa học chung (cần 100% đồng ý)</li>
                <li>Thống kê tiến độ, không xem được ghi chú riêng tư SV</li>
              </ul>
            </CardContent>
            <div className="px-5 pb-5">
              <Button variant="success" className="w-full" onClick={() => loginAs('lecturer', state.lecturers[0].id)}>
                Trải nghiệm vai trò Giảng viên
              </Button>
            </div>
          </Card>

          <Card hoverable className="flex flex-col justify-between">
            <CardContent className="space-y-3">
              <Badge tone="amber" icon={<Lock className="w-3.5 h-3.5" />}>Admin – Quản trị viên</Badge>
              <h3 className="text-lg font-bold text-white">Giám sát & Kiểm duyệt nội dung</h3>
              <ul className="text-sm text-slate-400 space-y-1.5 list-disc list-inside">
                <li>Gửi cảnh báo & nhắc nhở kiểm tra cho giảng viên</li>
                <li>Khóa/mở khóa kiến thức kèm lý do & lịch sử</li>
                <li>Không được phép trực tiếp thêm hoặc sửa kiến thức</li>
              </ul>
            </CardContent>
            <div className="px-5 pb-5">
              <Button variant="secondary" className="w-full" onClick={() => loginAs('admin', state.demoAdmin.id)}>
                Trải nghiệm vai trò Admin
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Public Notes quick preview */}
      <section className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Ghi chú cộng đồng được chia sẻ công khai</h3>
          </div>
          <span className="text-xs text-slate-400">
            Sinh viên có thể bật/tắt công khai bất kỳ lúc nào
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {publicNotes.map((note) => (
            <button
              key={note.id}
              type="button"
              onClick={() => navigate('shared-note', { noteId: note.id })}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 text-left transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <Badge tone="emerald">Công khai</Badge>
                <span className="text-xs font-mono text-slate-500">{note.updatedAt}</span>
              </div>
              <div className="text-sm font-semibold text-white">{note.title}</div>
              <div className="text-xs text-slate-400 mt-1 line-clamp-2">{note.content}</div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
