import React from 'react';
import { AlertTriangle, ArrowRight, GitPullRequest, Lock } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Surface, SurfaceContent } from '../../components/ui/Surface';

export const LecturerDashboard: React.FC = () => {
  const { state, currentUser, navigate, switchActiveLecturer } = useApp();
  const activeLecId = currentUser?.id ?? state.lecturers[0].id;
  const myCourses = state.courses.filter((c) => c.collaboratorIds.includes(activeLecId));
  const totalStudents = state.classrooms.reduce((s, cls) => s + cls.students.length, 0);
  const allStudents = state.classrooms.flatMap((c) => c.students);
  const avgProgress = allStudents.length > 0 ? Math.round(allStudents.reduce((s, st) => s + st.progressPercent, 0) / allStudents.length) : 0;

  const pendingProposals = state.proposals.filter((p) => p.status === 'pending');
  const adminAlerts = state.courses.flatMap((c) =>
    c.chapters.flatMap((ch) =>
      ch.lessons.filter((l) => l.moderation.status !== 'normal' || l.moderation.warnings.length > 0).map((l) => ({ course: c, chapter: ch, lesson: l })),
    ),
  );

  return (
    <div className="max-w-4xl mx-auto space-y-7">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">Giảng viên</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mt-1">{currentUser?.name}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {state.lecturers.map((lec) => (
            <button
              key={lec.id}
              type="button"
              onClick={() => switchActiveLecturer(lec.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                lec.id === activeLecId
                  ? 'bg-[var(--accent-success-soft)] text-[var(--accent-success-fg)] border-[var(--accent-success)]/40'
                  : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-subtle)]'
              }`}
            >
              {lec.name.split(' ').slice(-2).join(' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Compact single-strip summary */}
      <Surface>
        <SurfaceContent className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-xs text-[var(--text-muted)]">Lớp quản lý</div>
            <div className="text-xl font-mono font-bold text-[var(--text-primary)] mt-0.5">{state.classrooms.length}</div>
          </div>
          <div>
            <div className="text-xs text-[var(--text-muted)]">Khóa học</div>
            <div className="text-xl font-mono font-bold text-[var(--text-primary)] mt-0.5">{myCourses.length}</div>
          </div>
          <div>
            <div className="text-xs text-[var(--text-muted)]">Sinh viên</div>
            <div className="text-xl font-mono font-bold text-[var(--text-primary)] mt-0.5">{totalStudents}</div>
          </div>
          <div>
            <div className="text-xs text-[var(--text-muted)]">Tiến độ TB</div>
            <div className="text-xl font-mono font-bold text-[var(--accent-success)] mt-0.5">{avgProgress}%</div>
          </div>
        </SurfaceContent>
      </Surface>

      {/* Focused Priority Action Queue */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[var(--text-primary)]">Cần xử lý ưu tiên</h2>

        {pendingProposals.map((prop) => {
          const course = state.courses.find((c) => c.id === prop.courseId);
          const totalCollab = course?.collaboratorIds.length ?? 1;
          const approvedCount = Object.values(prop.votes).filter((v) => v.decision === 'approved').length;
          return (
            <Surface key={prop.id} elevated>
              <SurfaceContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge tone="warning" icon={<GitPullRequest className="w-3.5 h-3.5" />}>
                      Chờ đồng thuận ({approvedCount}/{totalCollab})
                    </Badge>
                    <span className="text-xs font-mono text-[var(--text-muted)]">{course?.code}</span>
                  </div>
                  <div className="text-base font-bold text-[var(--text-primary)]">{prop.lessonTitle}</div>
                  <div className="text-xs text-[var(--text-secondary)]">{prop.summary}</div>
                </div>
                <Button size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />} onClick={() => navigate('proposals')}>
                  Biểu quyết ngay
                </Button>
              </SurfaceContent>
            </Surface>
          );
        })}

        {adminAlerts.map(({ course, chapter, lesson }) => (
          <Surface key={lesson.id}>
            <SurfaceContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge
                    tone={lesson.moderation.status === 'locked' ? 'danger' : 'warning'}
                    icon={lesson.moderation.status === 'locked' ? <Lock className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                  >
                    {lesson.moderation.status === 'locked' ? 'Admin đã khóa' : 'Cảnh báo từ Admin'}
                  </Badge>
                  <span className="text-xs font-mono text-[var(--text-muted)]">
                    {course.code} · Chương {chapter.order}
                  </span>
                </div>
                <div className="text-base font-bold text-[var(--text-primary)]">{lesson.title}</div>
                <div className="text-xs text-[var(--text-secondary)]">
                  {lesson.moderation.status === 'locked' ? lesson.moderation.reason : lesson.moderation.warnings[0]?.message}
                </div>
              </div>
              <Button size="sm" variant="secondary" onClick={() => navigate('knowledge')}>
                Kiểm tra bài học
              </Button>
            </SurfaceContent>
          </Surface>
        ))}

        {pendingProposals.length === 0 && adminAlerts.length === 0 && (
          <Surface>
            <SurfaceContent className="p-6 text-center text-sm text-[var(--text-secondary)]">
              Không có yêu cầu biểu quyết hay cảnh báo nào đang chờ xử lý.
            </SurfaceContent>
          </Surface>
        )}
      </section>
    </div>
  );
};
