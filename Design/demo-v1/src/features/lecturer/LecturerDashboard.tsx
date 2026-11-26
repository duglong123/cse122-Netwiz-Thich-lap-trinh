import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookOpen,
  GitPullRequest,
  GraduationCap,
  Lock,
  Users,
} from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';

export const LecturerDashboard: React.FC = () => {
  const { state, currentUser, navigate, switchActiveLecturer } = useApp();
  const activeLecId = currentUser?.id ?? state.lecturers[0].id;

  const myCourses = state.courses.filter((c) => c.collaboratorIds.includes(activeLecId));
  const totalStudents = state.classrooms.reduce((s, cls) => s + cls.students.length, 0);
  const allStudents = state.classrooms.flatMap((c) => c.students);
  const avgProgress =
    allStudents.length > 0
      ? Math.round(allStudents.reduce((s, st) => s + st.progressPercent, 0) / allStudents.length)
      : 0;

  const pendingProposals = state.proposals.filter((p) => p.status === 'pending');

  const adminAlerts = state.courses.flatMap((c) =>
    c.chapters.flatMap((ch) =>
      ch.lessons
        .filter((l) => l.moderation.status !== 'normal' || l.moderation.warnings.length > 0)
        .map((l) => ({ course: c, chapter: ch, lesson: l })),
    ),
  );

  return (
    <div className="space-y-6">
      {/* Header + Quick Lecturer Switch */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Không gian Giảng viên · {currentUser?.name}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Quản lý lớp học, biên soạn học liệu phân tầng, biểu quyết đồng thuận và theo dõi tiến độ sinh viên.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400">Chuyển nhanh tài khoản GV:</span>
          {state.lecturers.map((lec) => (
            <button
              key={lec.id}
              type="button"
              onClick={() => switchActiveLecturer(lec.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                lec.id === activeLecId
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {lec.name}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">Lớp học đang quản lý</div>
              <div className="text-2xl font-mono font-bold text-white mt-1">{state.classrooms.length}</div>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/15 text-blue-400">
              <Users className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">Khóa học tham gia</div>
              <div className="text-2xl font-mono font-bold text-white mt-1">{myCourses.length}</div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">Tổng sinh viên lớp</div>
              <div className="text-2xl font-mono font-bold text-white mt-1">{totalStudents}</div>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/15 text-amber-400">
              <GraduationCap className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Tiến độ tổng quan</span>
              <span className="font-mono text-white font-bold">{avgProgress}%</span>
            </div>
            <ProgressBar value={avgProgress} showPercent={false} tone="emerald" />
          </CardContent>
        </Card>
      </div>

      {/* Pending Proposals & Admin Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2">
              <GitPullRequest className="w-4 h-4 text-blue-400" />
              <span>Yêu cầu biểu quyết đang chờ (100% đồng thuận)</span>
            </CardTitle>
            <Badge tone={pendingProposals.length > 0 ? 'amber' : 'emerald'}>
              {pendingProposals.length} Pending
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingProposals.length === 0 ? (
              <div className="text-sm text-slate-400">Không có đề xuất chỉnh sửa nào đang chờ biểu quyết.</div>
            ) : (
              pendingProposals.map((prop) => {
                const course = state.courses.find((c) => c.id === prop.courseId);
                const totalCollab = course?.collaboratorIds.length ?? 1;
                const approvedCount = Object.values(prop.votes).filter((v) => v.decision === 'approved').length;
                const myVote = prop.votes[activeLecId];
                return (
                  <div key={prop.id} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Badge tone="cobalt">{course?.code}</Badge>
                      <span className="text-xs font-mono text-amber-300">
                        {approvedCount}/{totalCollab} đã đồng ý
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white">{prop.lessonTitle}</div>
                    <div className="text-xs text-slate-400">{prop.summary}</div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-slate-400">
                        Trạng thái của bạn:{' '}
                        <strong className={myVote ? 'text-emerald-300' : 'text-amber-300'}>
                          {myVote ? (myVote.decision === 'approved' ? 'Đã đồng ý' : 'Đã từ chối') : 'Chưa biểu quyết'}
                        </strong>
                      </span>
                      <Button size="sm" onClick={() => navigate('proposals')}>
                        Xem & Biểu quyết
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Cảnh báo & Trạng thái từ Quản trị viên</span>
            </CardTitle>
            <Badge tone={adminAlerts.length > 0 ? 'rose' : 'emerald'}>{adminAlerts.length} mục</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {adminAlerts.length === 0 ? (
              <div className="text-sm text-emerald-300">Tất cả học liệu đang ở trạng thái bình thường.</div>
            ) : (
              adminAlerts.map(({ course, chapter, lesson }) => (
                <div
                  key={lesson.id}
                  className={`p-4 rounded-xl border space-y-2 ${
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
                      {lesson.moderation.status === 'locked' ? 'Đã bị Admin khóa' : 'Đang cảnh báo'}
                    </Badge>
                  </div>
                  <div className="text-sm font-bold text-white">{lesson.title}</div>
                  <p className="text-xs text-slate-300">
                    {lesson.moderation.status === 'locked'
                      ? `Lý do khóa: ${lesson.moderation.reason}`
                      : lesson.moderation.warnings[0]?.message}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Button
          variant="secondary"
          className="h-auto py-4 justify-between"
          rightIcon={<ArrowRight className="w-4 h-4" />}
          onClick={() => navigate('classrooms')}
        >
          <span className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" /> Quản lý lớp học & Sinh viên
          </span>
        </Button>
        <Button
          variant="secondary"
          className="h-auto py-4 justify-between"
          rightIcon={<ArrowRight className="w-4 h-4" />}
          onClick={() => navigate('knowledge')}
        >
          <span className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" /> Biên soạn kiến thức & Ngân hàng đề
          </span>
        </Button>
        <Button
          variant="secondary"
          className="h-auto py-4 justify-between"
          rightIcon={<ArrowRight className="w-4 h-4" />}
          onClick={() => navigate('analytics')}
        >
          <span className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-amber-400" /> Xem thống kê học tập
          </span>
        </Button>
      </div>
    </div>
  );
};
