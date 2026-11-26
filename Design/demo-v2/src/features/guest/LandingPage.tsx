import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Compass,
  FileText,
  Shield,
  Sparkles,
  Swords,
} from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Surface, SurfaceContent } from '../../components/ui/Surface';

const HERO_STEPS = [
  {
    id: 1,
    icon: <BookOpen className="w-5 h-5" />,
    title: 'Bước 1 · Đọc kiến thức tập trung',
    summary: 'Không gian đọc sạch sẽ, phân tách rõ Course → Chapter → Lesson, hỗ trợ ghi chú riêng tư ngay cạnh bài giảng.',
    detail: 'Chế độ Sáng (Warm Paper) & Tối (Warm Charcoal) được tối ưu độ tương phản để bảo vệ mắt khi học lâu.',
  },
  {
    id: 2,
    icon: <Sparkles className="w-5 h-5" />,
    title: 'Bước 2 · Nhiệm vụ tương tác giữa chương',
    summary: 'Giải các thử thách ghép cặp giao thức, sắp xếp 7 tầng OSI hoặc bắt tay TCP để nhận vật phẩm chiến đấu.',
    detail: 'Mỗi nhiệm vụ hoàn thành bổ sung trang bị thật vào Inventory của Hero Aegis-01.',
  },
  {
    id: 3,
    icon: <Swords className="w-5 h-5" />,
    title: 'Bước 3 · Đánh Boss & Khắc phục lỗ hổng',
    summary: 'Trả lời câu hỏi để hạ Boss từng chương. Mọi câu sai đều có giải thích chi tiết và được lưu vào Wrong Answers.',
    detail: 'Khi tái đấu Boss, câu đã trả lời đúng được thay bằng câu mới cùng mục tiêu kiến thức; câu sai được giữ lại để kiểm chứng đã hiểu thật sự.',
  },
];

export const LandingPage: React.FC = () => {
  const { state, navigate, setLoginModalOpen, loginAs } = useApp();
  const [activeStep, setActiveStep] = useState(1);
  const publicNotes = state.notes.filter((n) => n.visibility === 'public');
  const currentStep = HERO_STEPS.find((s) => s.id === activeStep) ?? HERO_STEPS[0];

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-8">
      {/* Editorial Focus Hero */}
      <section className="space-y-6 pt-2">
        <Badge tone="primary" icon={<Shield className="w-3.5 h-3.5" />}>
          PROJECT: SUPERHERO · DEMO V2 (FOCUS STUDIO)
        </Badge>

        <h1 className="text-3xl sm:text-5xl font-bold text-[var(--text-primary)] leading-[1.18]">
          Học Mạng Máy Tính sâu sắc, tập trung và không mỏi mắt.
        </h1>

        <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl">
          NetWiz V2 đặt trải nghiệm đọc hiểu kiến thức làm trung tâm. Mọi công cụ phụ trợ chỉ xuất hiện khi bạn cần, kết hợp nhiệm vụ thực hành và Boss Battle cuối chương.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />} onClick={() => setLoginModalOpen(true)}>
            Đăng nhập Demo theo vai trò
          </Button>
          <Button variant="outline" size="lg" leftIcon={<Compass className="w-4 h-4" />} onClick={() => navigate('discovery')}>
            Khám phá khóa học
          </Button>
          {publicNotes[0] && (
            <Button
              variant="ghost"
              size="lg"
              leftIcon={<FileText className="w-4 h-4" />}
              onClick={() => navigate('shared-note', { noteId: publicNotes[0].id })}
            >
              Xem ghi chú công khai
            </Button>
          )}
        </div>
      </section>

      {/* Interactive 3-Step Focus Widget (1 step at a time) */}
      <Surface elevated>
        <SurfaceContent className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
              Quy trình học tập qua Superhero
            </span>
            <div className="flex items-center gap-1.5">
              {HERO_STEPS.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setActiveStep(st.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    activeStep === st.id
                      ? 'bg-[var(--accent-primary)] text-[var(--accent-primary-text)]'
                      : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]'
                  }`}
                >
                  Bước {st.id}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-2.5">
            <div className="flex items-center gap-2.5 text-[var(--accent-primary)] font-bold text-base">
              {currentStep.icon}
              <span>{currentStep.title}</span>
            </div>
            <p className="text-sm sm:text-base text-[var(--text-primary)] leading-relaxed">
              {currentStep.summary}
            </p>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">{currentStep.detail}</p>
          </div>
        </SurfaceContent>
      </Surface>

      {/* Streamlined Role Quick-Start */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">
          Trải nghiệm trực tiếp từng vai trò
        </h2>
        <div className="divide-y divide-[var(--border-subtle)] rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden">
          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge tone="primary">Student</Badge>
                <span className="font-bold text-[var(--text-primary)]">{state.demoStudent.name}</span>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">
                Không gian đọc tập trung, nhiệm vụ tương tác, Boss Battle (Aegis-01) và 3 khu vực ghi chú.
              </p>
            </div>
            <Button onClick={() => loginAs('student', state.demoStudent.id)} className="shrink-0">
              Vào góc Sinh viên
            </Button>
          </div>

          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge tone="success">Lecturer</Badge>
                <span className="font-bold text-[var(--text-primary)]">{state.lecturers[0].name}</span>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">
                Quản lý lớp, kiến thức, ngân hàng câu hỏi tách rời, đồng thuận 100% và thống kê.
              </p>
            </div>
            <Button variant="success" onClick={() => loginAs('lecturer', state.lecturers[0].id)} className="shrink-0">
              Vào góc Giảng viên
            </Button>
          </div>

          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge tone="warning">Admin</Badge>
                <span className="font-bold text-[var(--text-primary)]">{state.demoAdmin.name}</span>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">
                Giám sát, gửi cảnh báo, khóa/mở khóa học liệu (không sửa kiến thức).
              </p>
            </div>
            <Button variant="secondary" onClick={() => loginAs('admin', state.demoAdmin.id)} className="shrink-0">
              Vào góc Quản trị
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
