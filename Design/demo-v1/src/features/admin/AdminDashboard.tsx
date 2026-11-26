import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  History,
  Lock,
  Shield,
  ShieldAlert,
  Users,
} from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

export const AdminDashboard: React.FC = () => {
  const { state, navigate } = useApp();

  const totalStudents = state.classrooms.reduce((s, cls) => s + cls.students.length, 0);
  const totalUsers = totalStudents + state.lecturers.length + 1; // +1 admin

  const allLessons = state.courses.flatMap((c) =>
    c.chapters.flatMap((ch) =>
      ch.lessons.map((l) => ({ course: c, chapter: ch, lesson: l })),
    ),
  );

  const warnedLessons = allLessons.filter((x) => x.lesson.moderation.status === 'warned');
  const lockedLessons = allLessons.filter((x) => x.lesson.moderation.status === 'locked');
  const pendingProposals = state.proposals.filter((p) => p.status === 'pending');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Bảng điều khiển Quản trị viên</h1>
          <p className="text-sm text-slate-400 mt-1">
            Giám sát hoạt động nền tảng và kiểm duyệt chất lượng học liệu. Quản trị viên không được phép tự ý sửa nội dung kiến thức.
          </p>
        </div>
        <Button
          leftIcon={<ShieldAlert className="w-4 h-4" />}
          onClick={() => navigate('moderation')}
        >
          Mở trung tâm kiểm duyệt
        </Button>
      </div>

      {/* Read-only policy banner */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-sm text-amber-200">
        <Shield className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong>Nguyên tắc phân quyền (Admin):</strong> Bạn có quyền giám sát, gửi cảnh báo/nhắc nhở cho giảng viên, khóa hoặc mở khóa nội dung vi phạm —{' '}
          <strong>không có quyền thêm mới hoặc chỉnh sửa trực tiếp nội dung bài giảng</strong>.
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">Tổng số người dùng</div>
              <div className="text-2xl font-mono font-bold text-white mt-1">{totalUsers}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {totalStudents} SV · {state.lecturers.length} GV · 1 Admin
              </div>
            </div>
            <Users className="w-5 h-5 text-blue-400" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">Tổng số khóa học / Lớp</div>
              <div className="text-2xl font-mono font-bold text-white mt-1">
                {state.courses.length} / {state.classrooms.length}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">{allLessons.length} bài kiến thức</div>
            </div>
            <BookOpen className="w-5 h-5 text-emerald-400" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">Nội dung cảnh báo / Khóa</div>
              <div className="text-2xl font-mono font-bold text-rose-400 mt-1">
                {warnedLessons.length} / {lockedLessons.length}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Cần theo dõi xử lý</div>
            </div>
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">Yêu cầu đồng thuận chờ</div>
              <div className="text-2xl font-mono font-bold text-amber-400 mt-1">{pendingProposals.length}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Biểu quyết giảng viên</div>
            </div>
            <History className="w-5 h-5 text-slate-400" />
          </CardContent>
        </Card>
      </div>

      {/* Warned & Locked items + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Nội dung đang bị cảnh báo hoặc khóa</CardTitle>
            <Button size="sm" variant="ghost" rightIcon={<ArrowRight className="w-3.5 h-3.5" />} onClick={() => navigate('moderation')}>
              Xử lý
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {[...lockedLessons, ...warnedLessons].length === 0 ? (
              <div className="text-sm text-emerald-300">Không có nội dung nào đang bị cảnh báo hoặc khóa.</div>
            ) : (
              [...lockedLessons, ...warnedLessons].map(({ course, chapter, lesson }) => (
                <div
                  key={lesson.id}
                  className={`p-4 rounded-xl border space-y-1.5 ${
                    lesson.moderation.status === 'locked'
                      ? 'bg-rose-500/10 border-rose-500/40'
                      : 'bg-amber-500/10 border-amber-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono text-slate-300">
                      {course.code} · Chương {chapter.order}
                    </span>
                    <Badge
                      tone={lesson.moderation.status === 'locked' ? 'rose' : 'amber'}
                      icon={lesson.moderation.status === 'locked' ? <Lock className="w-3 h-3" /> : undefined}
                    >
                      {lesson.moderation.status === 'locked' ? 'Đã khóa' : 'Đang cảnh báo'}
                    </Badge>
                  </div>
                  <div className="text-sm font-bold text-white">{lesson.title}</div>
                  <p className="text-xs text-slate-300">
                    {lesson.moderation.status === 'locked'
                      ? lesson.moderation.reason
                      : lesson.moderation.warnings[0]?.message}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hoạt động kiểm duyệt gần đây</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-slate-800/80 p-0">
            {state.moderationLogs.slice(0, 6).map((log) => (
              <div key={log.id} className="px-5 py-3.5 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <Badge
                    tone={
                      log.action === 'lock'
                        ? 'rose'
                        : log.action === 'unlock'
                          ? 'emerald'
                          : 'amber'
                    }
                  >
                    {log.action.toUpperCase()}
                  </Badge>
                  <span className="text-xs font-mono text-slate-500">{log.timestamp}</span>
                </div>
                <div className="text-xs font-semibold text-white">{log.targetLabel}</div>
                <div className="text-xs text-slate-400">{log.reason}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
