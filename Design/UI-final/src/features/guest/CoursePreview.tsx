import React, { useState } from 'react';
import { ArrowLeft, BookOpen, ChevronDown, ChevronUp, Play, Swords } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Eyebrow, Panel, PanelContent } from '../../components/ui/Panel';

export const CoursePreview: React.FC = () => {
  const { state, navigate, loginAs } = useApp();
  const course = state.courses.find((c) => c.id === state.activeCourseId) ?? state.courses[0];
  const lecturers = state.lecturers.filter((l) => course.collaboratorIds.includes(l.id));
  const [expandedId, setExpandedId] = useState(course.chapters[0]?.id ?? '');

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate('discovery')}>
        Quay lại danh mục
      </Button>

      <Panel accent="var(--yellow)">
        <PanelContent className="p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <Eyebrow>{course.code} · {course.category}</Eyebrow>
            <h1 className="display-font text-4xl sm:text-5xl font-extrabold text-[var(--text)]">{course.title}</h1>
            <p className="text-sm sm:text-base text-[var(--text-body)] max-w-2xl">{course.subtitle}</p>
            <div className="flex flex-wrap gap-2">
              <Badge tone="green">{course.level}</Badge>
              {lecturers.map((l) => (
                <Badge key={l.id} tone="muted">{l.name}</Badge>
              ))}
            </div>
          </div>
          {state.role === 'student' ? (
            <Button
              size="lg"
              leftIcon={<Play className="w-4 h-4" />}
              onClick={() => navigate('learning', { courseId: course.id, chapterId: course.chapters[0]?.id, lessonId: course.chapters[0]?.lessons[0]?.id })}
            >
              Vào học ngay
            </Button>
          ) : (
            <Button size="lg" leftIcon={<Play className="w-4 h-4" />} onClick={() => loginAs('student', state.demoStudent.id)}>
              Học thử (Sinh viên)
            </Button>
          )}
        </PanelContent>
      </Panel>

      <div className="space-y-3">
        {course.chapters.map((ch) => {
          const open = expandedId === ch.id;
          return (
            <Panel key={ch.id}>
              <button
                type="button"
                onClick={() => setExpandedId(open ? '' : ch.id)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <div>
                  <div className="text-[10px] font-black mono text-[var(--yellow-fg)]">CHƯƠNG {ch.order}</div>
                  <div className="display-font text-2xl font-extrabold text-[var(--text)]">{ch.title}</div>
                  <div className="text-xs text-[var(--muted)] mt-0.5">{ch.summary}</div>
                </div>
                {open ? <ChevronUp className="w-5 h-5 text-[var(--muted)]" /> : <ChevronDown className="w-5 h-5 text-[var(--muted)]" />}
              </button>
              {open && (
                <div className="px-5 pb-5 pt-2 border-t border-[var(--line)] space-y-2">
                  {ch.lessons.map((l, idx) => (
                    <div key={l.id} className="p-3 rounded-lg bg-[var(--panel-deep)] border border-[var(--line)] flex items-center justify-between text-xs">
                      <span className="inline-flex items-center gap-2 text-[var(--text)]">
                        <BookOpen className="w-4 h-4 text-[var(--yellow-fg)]" /> {ch.order}.{idx + 1} {l.title}
                      </span>
                      <span className="mono text-[var(--muted)]">{l.durationMinutes}m</span>
                    </div>
                  ))}
                  <div className="p-3 rounded-lg bg-[var(--red-soft)] border border-[var(--red-border)] flex items-center gap-3">
                    <img src={ch.boss.avatar} alt={ch.boss.name} className="w-11 h-11 rounded-lg object-cover" />
                    <div>
                      <div className="text-xs font-extrabold text-[var(--red-fg)] inline-flex items-center gap-1.5">
                        <Swords className="w-3.5 h-3.5" /> Boss: {ch.boss.name}
                      </div>
                      <div className="text-xs text-[var(--text-body)]">{ch.boss.trait}</div>
                    </div>
                  </div>
                </div>
              )}
            </Panel>
          );
        })}
      </div>
    </div>
  );
};
