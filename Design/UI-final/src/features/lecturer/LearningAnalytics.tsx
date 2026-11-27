import React from 'react';
import { AlertCircle, BarChart3, ShieldCheck, Swords, Users } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { Badge } from '../../components/ui/Badge';
import { Eyebrow, Panel, PanelContent, PanelHeader, PanelTitle } from '../../components/ui/Panel';
import { ProgressBar } from '../../components/ui/ProgressBar';

export const LearningAnalytics: React.FC = () => {
  const { state } = useApp();
  const mainCourse = state.courses[0];
  const allStudents = state.classrooms.flatMap((c) => c.students);
  const avgAccuracy = allStudents.length > 0 ? Math.round(allStudents.reduce((s, st) => s + st.accuracyRate, 0) / allStudents.length) : 0;

  const topicCounts: Record<string, number> = {};
  for (const st of allStudents) {
    for (const t of st.difficultTopics) topicCounts[t] = (topicCounts[t] || 0) + 1;
  }
  const topDifficult = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <Eyebrow color="var(--green-fg)">Learning Telemetry</Eyebrow>
          <h1 className="display-font text-4xl font-extrabold text-[var(--text)] mt-2">Thống kê học tập</h1>
        </div>
        <Badge tone="green" icon={<ShieldCheck className="w-3.5 h-3.5" />}>Ẩn hoàn toàn ghi chú cá nhân SV</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Panel><PanelContent className="p-5 flex items-center justify-between"><div><div className="text-xs text-[var(--muted)]">Tỷ lệ đúng TB</div><div className="display-font text-3xl text-[var(--green-fg)]">{avgAccuracy}%</div></div><BarChart3 className="w-6 h-6 text-[var(--green-fg)]" /></PanelContent></Panel>
        <Panel><PanelContent className="p-5 flex items-center justify-between"><div><div className="text-xs text-[var(--muted)]">Sinh viên theo dõi</div><div className="display-font text-3xl text-[var(--text)]">{allStudents.length}</div></div><Users className="w-6 h-6 text-[var(--blue-fg)]" /></PanelContent></Panel>
        <Panel><PanelContent className="p-5 flex items-center justify-between"><div><div className="text-xs text-[var(--muted)]">Tổng Boss đã hạ</div><div className="display-font text-3xl text-[var(--yellow-fg)]">{allStudents.reduce((s, st) => s + st.bossesDefeated, 0)}</div></div><Swords className="w-6 h-6 text-[var(--red-fg)]" /></PanelContent></Panel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <Panel className="lg:col-span-7">
          <PanelHeader><PanelTitle>Hoàn thành chương & Boss Battle</PanelTitle></PanelHeader>
          <PanelContent className="space-y-4">
            {mainCourse.chapters.map((ch) => {
              const completed = allStudents.filter((s) => s.completedChapters >= ch.order).length;
              const bossDone = allStudents.filter((s) => s.bossesDefeated >= ch.order).length;
              const pct = allStudents.length > 0 ? Math.round((completed / allStudents.length) * 100) : 0;
              return (
                <div key={ch.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-[var(--text)]">Ch.{ch.order}: {ch.title}</span>
                    <span className="mono text-[var(--muted)]">Hạ Boss: {bossDone}/{allStudents.length}</span>
                  </div>
                  <ProgressBar value={pct} color={pct >= 70 ? 'var(--green)' : 'var(--yellow)'} />
                </div>
              );
            })}
          </PanelContent>
        </Panel>

        <Panel className="lg:col-span-5">
          <PanelHeader><PanelTitle className="flex items-center gap-2"><AlertCircle className="w-4 h-4 text-[var(--red-fg)]" /> Kiến thức khó</PanelTitle></PanelHeader>
          <PanelContent className="space-y-2.5">
            {topDifficult.map(([topic, count]) => (
              <div key={topic} className="p-3 rounded-xl bg-[var(--panel-deep)] border border-[var(--line)] flex items-center justify-between text-xs">
                <span className="text-[var(--text)]">{topic}</span>
                <Badge tone="red">{count} SV</Badge>
              </div>
            ))}
          </PanelContent>
        </Panel>
      </div>
    </div>
  );
};
