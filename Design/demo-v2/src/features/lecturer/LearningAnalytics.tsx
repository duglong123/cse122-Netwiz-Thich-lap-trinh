import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Surface, SurfaceContent } from '../../components/ui/Surface';
import { Tabs } from '../../components/ui/Tabs';

export const LearningAnalytics: React.FC = () => {
  const { state } = useApp();
  const [lens, setLens] = useState<'chapters' | 'difficult' | 'students'>('chapters');
  const mainCourse = state.courses[0];
  const allStudents = state.classrooms.flatMap((c) => c.students);
  const avgAcc = allStudents.length > 0 ? Math.round(allStudents.reduce((s, st) => s + st.accuracyRate, 0) / allStudents.length) : 0;

  const topicCounts: Record<string, number> = {};
  for (const st of allStudents) {
    for (const t of st.difficultTopics) topicCounts[t] = (topicCounts[t] || 0) + 1;
  }
  const topDifficult = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Thống kê học tập</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Tỷ lệ đúng trung bình toàn lớp: <strong className="font-mono">{avgAcc}%</strong> (Sai: {100 - avgAcc}%).
          </p>
        </div>
        <Badge tone="success" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
          Không hiển thị ghi chú riêng tư SV
        </Badge>
      </div>

      {/* Focused 1-dataset-at-a-time lens switcher */}
      <Tabs
        activeTab={lens}
        onChange={(t) => setLens(t as typeof lens)}
        tabs={[
          { id: 'chapters', label: 'Theo chương & Boss' },
          { id: 'difficult', label: 'Kiến thức hay sai' },
          { id: 'students', label: 'Từng sinh viên' },
        ]}
      />

      {lens === 'chapters' && (
        <Surface elevated>
          <SurfaceContent className="space-y-4">
            {mainCourse.chapters.map((ch) => {
              const completed = allStudents.filter((s) => s.completedChapters >= ch.order).length;
              const bossCount = allStudents.filter((s) => s.bossesDefeated >= ch.order).length;
              const pct = allStudents.length > 0 ? Math.round((completed / allStudents.length) * 100) : 0;
              return (
                <div key={ch.id} className="space-y-1.5">
                  <div className="flex flex-wrap justify-between text-xs">
                    <span className="font-bold text-[var(--text-primary)]">Chương {ch.order}: {ch.title}</span>
                    <span className="font-mono text-[var(--text-muted)]">Hạ Boss {ch.boss.name}: {bossCount}/{allStudents.length}</span>
                  </div>
                  <ProgressBar value={pct} tone={pct >= 70 ? 'success' : 'primary'} />
                </div>
              );
            })}
          </SurfaceContent>
        </Surface>
      )}

      {lens === 'difficult' && (
        <Surface elevated>
          <SurfaceContent className="space-y-3">
            {topDifficult.map(([topic, count]) => (
              <div key={topic} className="p-3.5 rounded-xl bg-[var(--bg-subtle)] flex items-center justify-between">
                <span className="font-medium text-sm text-[var(--text-primary)]">{topic}</span>
                <Badge tone="danger">{count} sinh viên gặp khó khăn</Badge>
              </div>
            ))}
          </SurfaceContent>
        </Surface>
      )}

      {lens === 'students' && (
        <Surface elevated>
          <SurfaceContent className="divide-y divide-[var(--border-subtle)] p-0">
            {allStudents.map((st) => (
              <div key={st.id} className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-sm text-[var(--text-primary)]">{st.name} <span className="font-mono text-xs text-[var(--text-muted)]">({st.studentCode})</span></div>
                  <div className="text-xs text-[var(--text-secondary)]">{st.learningHistory[0]?.action ?? 'Đang học'} · {st.lastActive}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-28"><ProgressBar value={st.progressPercent} size="sm" /></div>
                  <Badge tone="primary">Boss {st.bossesDefeated}/5</Badge>
                  <Badge tone={st.accuracyRate >= 80 ? 'success' : 'warning'}>{st.accuracyRate}%</Badge>
                </div>
              </div>
            ))}
          </SurfaceContent>
        </Surface>
      )}
    </div>
  );
};
