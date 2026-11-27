import React from 'react';
import { AlertTriangle, BookOpen, History, Lock, Shield, ShieldAlert, Users } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Eyebrow, Panel, PanelContent, PanelHeader, PanelTitle } from '../../components/ui/Panel';

export const AdminDashboard: React.FC = () => {
  const { state, navigate } = useApp();
  const totalStudents = state.classrooms.reduce((s, cls) => s + cls.students.length, 0);
  const totalUsers = totalStudents + state.lecturers.length + 1;
  const allLessons = state.courses.flatMap((c) => c.chapters.flatMap((ch) => ch.lessons.map((l) => ({ course: c, chapter: ch, lesson: l }))));
  const warned = allLessons.filter((x) => x.lesson.moderation.status === 'warned');
  const locked = allLessons.filter((x) => x.lesson.moderation.status === 'locked');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <Eyebrow color="#4da3ff">Admin Governance</Eyebrow>
          <h1 className="display-font text-4xl font-extrabold text-[#f3f6fc] mt-2">Quản trị & Giám sát</h1>
        </div>
        <Button leftIcon={<ShieldAlert className="w-4 h-4" />} onClick={() => navigate('moderation')}>Trung tâm kiểm duyệt</Button>
      </div>

      <div className="p-4 rounded-xl bg-[#4da3ff]/10 border border-[#4da3ff]/35 text-xs text-[#71b7ff] flex items-start gap-2.5">
        <Shield className="w-4 h-4 shrink-0 mt-0.5" />
        <span><strong>Phân quyền Admin:</strong> Có quyền gửi cảnh báo, nhắc nhở, khóa/mở khóa học liệu — <strong>không được trực tiếp thêm hoặc sửa kiến thức</strong>.</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Panel><PanelContent className="p-5 flex justify-between"><div><div className="text-xs text-[#98a7bd]">Người dùng</div><div className="display-font text-3xl text-[#f3f6fc]">{totalUsers}</div></div><Users className="w-5 h-5 text-[#4da3ff]" /></PanelContent></Panel>
        <Panel><PanelContent className="p-5 flex justify-between"><div><div className="text-xs text-[#98a7bd]">Khóa học / Lớp</div><div className="display-font text-3xl text-[#f3f6fc]">{state.courses.length} / {state.classrooms.length}</div></div><BookOpen className="w-5 h-5 text-[#45d483]" /></PanelContent></Panel>
        <Panel><PanelContent className="p-5 flex justify-between"><div><div className="text-xs text-[#98a7bd]">Cảnh báo / Khóa</div><div className="display-font text-3xl text-[#ef4444]">{warned.length} / {locked.length}</div></div><AlertTriangle className="w-5 h-5 text-[#f4d35e]" /></PanelContent></Panel>
        <Panel><PanelContent className="p-5 flex justify-between"><div><div className="text-xs text-[#98a7bd]">Nhật ký xử lý</div><div className="display-font text-3xl text-[#f4d35e]">{state.moderationLogs.length}</div></div><History className="w-5 h-5 text-[#98a7bd]" /></PanelContent></Panel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Panel>
          <PanelHeader><PanelTitle>Nội dung đang cảnh báo / khóa</PanelTitle></PanelHeader>
          <PanelContent className="space-y-3">
            {[...locked, ...warned].map(({ course, chapter, lesson }) => (
              <div key={lesson.id} className="p-4 rounded-xl bg-[#0a111e] border border-[#26334a] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs mono text-[#98a7bd]">{course.code} · Ch.{chapter.order}</span>
                  <Badge tone={lesson.moderation.status === 'locked' ? 'red' : 'yellow'} icon={lesson.moderation.status === 'locked' ? <Lock className="w-3 h-3" /> : undefined}>
                    {lesson.moderation.status === 'locked' ? 'Đã khóa' : 'Cảnh báo'}
                  </Badge>
                </div>
                <div className="text-sm font-bold text-[#f3f6fc]">{lesson.title}</div>
                <div className="text-xs text-[#c5d1e2]">{lesson.moderation.status === 'locked' ? lesson.moderation.reason : lesson.moderation.warnings[0]?.message}</div>
              </div>
            ))}
          </PanelContent>
        </Panel>

        <Panel>
          <PanelHeader><PanelTitle>Hoạt động gần đây</PanelTitle></PanelHeader>
          <PanelContent className="space-y-2.5">
            {state.moderationLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="p-3.5 rounded-xl bg-[#0a111e] border border-[#26334a] space-y-1">
                <div className="flex justify-between">
                  <Badge tone={log.action === 'lock' ? 'red' : log.action === 'unlock' ? 'green' : 'yellow'}>{log.action.toUpperCase()}</Badge>
                  <span className="text-[11px] mono text-[#98a7bd]">{log.timestamp}</span>
                </div>
                <div className="text-xs font-bold text-[#f3f6fc]">{log.targetLabel}</div>
                <div className="text-[11px] text-[#98a7bd]">{log.reason}</div>
              </div>
            ))}
          </PanelContent>
        </Panel>
      </div>
    </div>
  );
};
