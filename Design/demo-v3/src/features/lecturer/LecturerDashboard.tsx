import React from 'react';
import { AlertTriangle, ArrowRight, BarChart3, BookOpen, GitPullRequest, GraduationCap, Lock, Users } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Eyebrow, Panel, PanelContent, PanelHeader, PanelTitle } from '../../components/ui/Panel';
import { ProgressBar } from '../../components/ui/ProgressBar';

export const LecturerDashboard: React.FC = () => {
  const { state, currentUser, navigate, switchActiveLecturer } = useApp();
  const activeLecId = currentUser?.id ?? state.lecturers[0].id;
  const myCourses = state.courses.filter((c) => c.collaboratorIds.includes(activeLecId));
  const totalStudents = state.classrooms.reduce((s, cls) => s + cls.students.length, 0);
  const allStudents = state.classrooms.flatMap((c) => c.students);
  const avgProgress = allStudents.length > 0 ? Math.round(allStudents.reduce((s, st) => s + st.progressPercent, 0) / allStudents.length) : 0;
  const pendingProposals = state.proposals.filter((p) => p.status === 'pending');
  const adminAlerts = state.courses.flatMap((c) =>
    c.chapters.flatMap((ch) => ch.lessons.filter((l) => l.moderation.status !== 'normal' || l.moderation.warnings.length > 0).map((l) => ({ course: c, chapter: ch, lesson: l }))),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <Eyebrow color="#45d483">Lecturer Command // {currentUser?.code}</Eyebrow>
          <h1 className="display-font text-4xl font-extrabold text-[#f3f6fc] mt-2">{currentUser?.name}</h1>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {state.lecturers.map((lec) => (
            <button
              key={lec.id}
              type="button"
              onClick={() => switchActiveLecturer(lec.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                lec.id === activeLecId ? 'bg-[#45d483] text-[#08120c] border-[#45d483]' : 'bg-[#0e1523] text-[#c5d1e2] border-[#26334a]'
              }`}
            >
              {lec.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Panel><PanelContent className="p-5 flex items-center justify-between"><div><div className="text-xs text-[#98a7bd]">Lớp quản lý</div><div className="display-font text-3xl text-[#f3f6fc] mt-1">{state.classrooms.length}</div></div><Users className="w-5 h-5 text-[#4da3ff]" /></PanelContent></Panel>
        <Panel><PanelContent className="p-5 flex items-center justify-between"><div><div className="text-xs text-[#98a7bd]">Khóa học</div><div className="display-font text-3xl text-[#f3f6fc] mt-1">{myCourses.length}</div></div><BookOpen className="w-5 h-5 text-[#45d483]" /></PanelContent></Panel>
        <Panel><PanelContent className="p-5 flex items-center justify-between"><div><div className="text-xs text-[#98a7bd]">Sinh viên</div><div className="display-font text-3xl text-[#f3f6fc] mt-1">{totalStudents}</div></div><GraduationCap className="w-5 h-5 text-[#f4d35e]" /></PanelContent></Panel>
        <Panel><PanelContent className="p-5"><ProgressBar value={avgProgress} label="Tiến độ tổng quan" color="#45d483" /></PanelContent></Panel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Panel accent="#f4d35e">
          <PanelHeader className="flex items-center justify-between">
            <PanelTitle className="flex items-center gap-2"><GitPullRequest className="w-4 h-4 text-[#f4d35e]" /> Biểu quyết đang chờ</PanelTitle>
            <Badge tone="yellow">{pendingProposals.length} Pending</Badge>
          </PanelHeader>
          <PanelContent className="space-y-3">
            {pendingProposals.map((prop) => {
              const course = state.courses.find((c) => c.id === prop.courseId);
              const approvedCount = Object.values(prop.votes).filter((v) => v.decision === 'approved').length;
              return (
                <div key={prop.id} className="p-4 rounded-xl bg-[#0a111e] border border-[#26334a] space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge tone="blue">{course?.code}</Badge>
                    <span className="text-xs mono text-[#f4d35e]">{approvedCount}/{course?.collaboratorIds.length} đồng ý</span>
                  </div>
                  <div className="text-sm font-bold text-[#f3f6fc]">{prop.lessonTitle}</div>
                  <div className="text-xs text-[#98a7bd]">{prop.summary}</div>
                  <Button size="sm" onClick={() => navigate('proposals')}>Xem & Biểu quyết</Button>
                </div>
              );
            })}
          </PanelContent>
        </Panel>

        <Panel accent="#ef4444">
          <PanelHeader className="flex items-center justify-between">
            <PanelTitle className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-[#ef4444]" /> Cảnh báo từ Admin</PanelTitle>
            <Badge tone={adminAlerts.length > 0 ? 'red' : 'green'}>{adminAlerts.length} mục</Badge>
          </PanelHeader>
          <PanelContent className="space-y-3">
            {adminAlerts.map(({ course, chapter, lesson }) => (
              <div key={lesson.id} className="p-4 rounded-xl bg-[#0a111e] border border-[#ef4444]/35 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs mono text-[#98a7bd]">{course.code} · Ch.{chapter.order}</span>
                  <Badge tone={lesson.moderation.status === 'locked' ? 'red' : 'yellow'} icon={lesson.moderation.status === 'locked' ? <Lock className="w-3 h-3" /> : undefined}>
                    {lesson.moderation.status === 'locked' ? 'Đã khóa' : 'Cảnh báo'}
                  </Badge>
                </div>
                <div className="text-sm font-bold text-[#f3f6fc]">{lesson.title}</div>
                <p className="text-xs text-[#c5d1e2] m-0">{lesson.moderation.status === 'locked' ? lesson.moderation.reason : lesson.moderation.warnings[0]?.message}</p>
              </div>
            ))}
          </PanelContent>
        </Panel>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Button variant="secondary" rightIcon={<ArrowRight className="w-4 h-4" />} onClick={() => navigate('classrooms')}>Quản lý lớp học</Button>
        <Button variant="secondary" rightIcon={<ArrowRight className="w-4 h-4" />} onClick={() => navigate('knowledge')}>Quản lý kiến thức</Button>
        <Button variant="secondary" rightIcon={<ArrowRight className="w-4 h-4" />} onClick={() => navigate('analytics')}><BarChart3 className="w-4 h-4" /> Thống kê</Button>
      </div>
    </div>
  );
};
