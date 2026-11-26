import React from 'react';
import { ArrowRight, Lock, Shield, ShieldAlert } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Surface, SurfaceContent } from '../../components/ui/Surface';

export const AdminDashboard: React.FC = () => {
  const { state, navigate } = useApp();
  const totalStudents = state.classrooms.reduce((s, cls) => s + cls.students.length, 0);
  const totalUsers = totalStudents + state.lecturers.length + 1;
  const allLessons = state.courses.flatMap((c) => c.chapters.flatMap((ch) => ch.lessons.map((l) => ({ course: c, chapter: ch, lesson: l }))));
  const flagged = allLessons.filter((x) => x.lesson.moderation.status !== 'normal');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Quản trị & Giám sát</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Theo dõi hệ thống và kiểm duyệt nội dung (chỉ đọc kiến thức).</p>
        </div>
        <Button leftIcon={<ShieldAlert className="w-4 h-4" />} onClick={() => navigate('moderation')}>
          Trung tâm kiểm duyệt
        </Button>
      </div>

      <div className="p-4 rounded-xl bg-[var(--accent-warning-soft)] text-[var(--accent-warning-fg)] text-sm flex items-start gap-2.5">
        <Shield className="w-5 h-5 shrink-0 mt-0.5" />
        <span><strong>Phân quyền Admin:</strong> Được gửi cảnh báo, nhắc nhở, khóa/mở khóa học liệu — <strong>không thể trực tiếp thêm hoặc sửa kiến thức</strong>.</span>
      </div>

      <Surface>
        <SurfaceContent className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-xs text-[var(--text-muted)]">Người dùng</div>
            <div className="text-xl font-mono font-bold text-[var(--text-primary)]">{totalUsers}</div>
          </div>
          <div>
            <div className="text-xs text-[var(--text-muted)]">Khóa học / Lớp</div>
            <div className="text-xl font-mono font-bold text-[var(--text-primary)]">{state.courses.length} / {state.classrooms.length}</div>
          </div>
          <div>
            <div className="text-xs text-[var(--text-muted)]">Đang cảnh báo/khóa</div>
            <div className="text-xl font-mono font-bold text-[var(--accent-danger)]">{flagged.length}</div>
          </div>
          <div>
            <div className="text-xs text-[var(--text-muted)]">Log kiểm duyệt</div>
            <div className="text-xl font-mono font-bold text-[var(--text-primary)]">{state.moderationLogs.length}</div>
          </div>
        </SurfaceContent>
      </Surface>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Nội dung cần chú ý</h2>
          <Button size="sm" variant="ghost" rightIcon={<ArrowRight className="w-3.5 h-3.5" />} onClick={() => navigate('moderation')}>Xem tất cả</Button>
        </div>
        {flagged.length === 0 ? (
          <Surface><SurfaceContent className="p-6 text-center text-sm text-[var(--accent-success)]">Tất cả nội dung đang bình thường.</SurfaceContent></Surface>
        ) : (
          flagged.map(({ course, chapter, lesson }) => (
            <Surface key={lesson.id}>
              <SurfaceContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge tone="primary">{course.code} · Ch.{chapter.order}</Badge>
                    <Badge tone={lesson.moderation.status === 'locked' ? 'danger' : 'warning'} icon={lesson.moderation.status === 'locked' ? <Lock className="w-3 h-3" /> : undefined}>
                      {lesson.moderation.status === 'locked' ? 'Đã khóa' : 'Đang cảnh báo'}
                    </Badge>
                  </div>
                  <div className="font-bold text-[var(--text-primary)]">{lesson.title}</div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    {lesson.moderation.status === 'locked' ? lesson.moderation.reason : lesson.moderation.warnings[0]?.message}
                  </div>
                </div>
                <Button size="sm" variant="secondary" onClick={() => navigate('moderation')}>Xử lý</Button>
              </SurfaceContent>
            </Surface>
          ))
        )}
      </section>
    </div>
  );
};
