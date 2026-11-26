import React, { useState } from 'react';
import { ArrowLeft, BookOpen, ChevronDown, ChevronUp, Play, Swords } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Surface, SurfaceContent } from '../../components/ui/Surface';

export const CoursePreview: React.FC = () => {
  const { state, navigate, loginAs } = useApp();
  const course = state.courses.find((c) => c.id === state.activeCourseId) ?? state.courses[0];
  const lecturers = state.lecturers.filter((l) => course.collaboratorIds.includes(l.id));
  const [expandedId, setExpandedId] = useState(course.chapters[0]?.id ?? '');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate('discovery')}>
        Quay lại danh sách khóa học
      </Button>

      <Surface elevated>
        <SurfaceContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="primary">{course.code}</Badge>
            <Badge tone="neutral">{course.level}</Badge>
            {lecturers.length > 1 && <Badge tone="warning">Đồng sở hữu ({lecturers.length} GV)</Badge>}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">{course.title}</h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">{course.subtitle}</p>
          <div className="text-xs text-[var(--text-muted)]">
            Giảng viên phụ trách: <strong className="text-[var(--text-primary)]">{lecturers.map((l) => l.name).join(', ')}</strong>
          </div>
          <div className="pt-2">
            {state.role === 'student' ? (
              <Button
                leftIcon={<Play className="w-4 h-4" />}
                onClick={() => navigate('learning', { courseId: course.id, chapterId: course.chapters[0]?.id, lessonId: course.chapters[0]?.lessons[0]?.id })}
              >
                Vào học khóa này
              </Button>
            ) : (
              <Button leftIcon={<Play className="w-4 h-4" />} onClick={() => loginAs('student', state.demoStudent.id)}>
                Học thử với tài khoản Sinh viên
              </Button>
            )}
          </div>
        </SurfaceContent>
      </Surface>

      <div className="space-y-3">
        <h2 className="text-lg font-bold text-[var(--text-primary)]">Danh sách chương</h2>
        {course.chapters.map((ch) => {
          const open = expandedId === ch.id;
          return (
            <Surface key={ch.id}>
              <button
                type="button"
                onClick={() => setExpandedId(open ? '' : ch.id)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <div>
                  <div className="text-xs font-mono text-[var(--accent-primary)]">CHƯƠNG {ch.order}</div>
                  <div className="text-base font-bold text-[var(--text-primary)] mt-0.5">{ch.title}</div>
                  <div className="text-xs text-[var(--text-secondary)] mt-0.5">{ch.summary}</div>
                </div>
                {open ? <ChevronUp className="w-5 h-5 text-[var(--text-muted)]" /> : <ChevronDown className="w-5 h-5 text-[var(--text-muted)]" />}
              </button>
              {open && (
                <div className="px-5 pb-5 pt-2 border-t border-[var(--border-subtle)] space-y-2">
                  {ch.lessons.map((l, i) => (
                    <div key={l.id} className="p-3 rounded-xl bg-[var(--bg-subtle)] flex items-center justify-between text-sm">
                      <span className="inline-flex items-center gap-2 text-[var(--text-primary)]">
                        <BookOpen className="w-4 h-4 text-[var(--accent-primary)]" /> {ch.order}.{i + 1} {l.title}
                      </span>
                      <span className="text-xs font-mono text-[var(--text-muted)]">{l.durationMinutes}p</span>
                    </div>
                  ))}
                  <div className="p-3 rounded-xl bg-[var(--accent-danger-soft)] flex items-center gap-3">
                    <img src={ch.boss.avatar} alt={ch.boss.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <div className="text-xs font-bold text-[var(--accent-danger-fg)] inline-flex items-center gap-1">
                        <Swords className="w-3.5 h-3.5" /> Boss: {ch.boss.name}
                      </div>
                      <div className="text-xs text-[var(--text-secondary)]">{ch.boss.trait}</div>
                    </div>
                  </div>
                </div>
              )}
            </Surface>
          );
        })}
      </div>
    </div>
  );
};
