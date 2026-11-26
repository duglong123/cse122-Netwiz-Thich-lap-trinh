import React, { useMemo, useState } from 'react';
import { BookOpen, Layers, Search, Users } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/DataFeedback';
import { Input, Select } from '../../components/ui/FormControls';
import { Surface, SurfaceContent } from '../../components/ui/Surface';

export const CourseDiscovery: React.FC = () => {
  const { state, navigate } = useApp();
  const [query, setQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');

  const publicCourses = useMemo(() => state.courses.filter((c) => c.isPublic), [state.courses]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return publicCourses.filter((c) => {
      const matchQ = !q || c.title.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.subtitle.toLowerCase().includes(q);
      const matchL = levelFilter === 'all' || c.level === levelFilter;
      return matchQ && matchL;
    });
  }, [publicCourses, query, levelFilter]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Khám phá khóa học công khai</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Tìm kiếm và xem trước nội dung từng chương.</p>
      </div>

      <Surface>
        <SurfaceContent className="p-4 grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Input
              placeholder="Tìm tên khóa học hoặc mã môn (CN-101, OSI, Security)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3 pointer-events-none" />
          </div>
          <div className="sm:col-span-4">
            <Select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
              <option value="all">Mọi cấp độ</option>
              <option value="Cơ bản">Cơ bản</option>
              <option value="Trung cấp">Trung cấp</option>
              <option value="Nâng cao">Nâng cao</option>
            </Select>
          </div>
        </SurfaceContent>
      </Surface>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="w-6 h-6" />}
          title="Không tìm thấy khóa học phù hợp"
          description="Hãy thử từ khóa khác hoặc đặt lại bộ lọc."
          action={<Button variant="outline" onClick={() => { setQuery(''); setLevelFilter('all'); }}>Xóa bộ lọc</Button>}
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((course) => {
            const totalLessons = course.chapters.reduce((s, ch) => s + ch.lessons.length, 0);
            const lecturers = state.lecturers.filter((l) => course.collaboratorIds.includes(l.id));
            return (
              <Surface key={course.id} elevated>
                <SurfaceContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="primary">{course.code}</Badge>
                      <Badge tone={course.level === 'Cơ bản' ? 'success' : course.level === 'Trung cấp' ? 'warning' : 'danger'}>
                        {course.level}
                      </Badge>
                      <span className="text-xs text-[var(--text-muted)]">{course.category}</span>
                    </div>
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">{course.title}</h2>
                    <p className="text-sm text-[var(--text-secondary)]">{course.subtitle}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--text-muted)] pt-1">
                      <span className="inline-flex items-center gap-1"><Layers className="w-3.5 h-3.5" /> {course.chapters.length} chương · {totalLessons} bài</span>
                      <span className="inline-flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {course.enrolledCount} SV</span>
                      <span>GV: {lecturers.map((l) => l.name).join(', ')}</span>
                    </div>
                  </div>
                  <Button className="shrink-0" onClick={() => navigate('course-preview', { courseId: course.id })}>
                    Xem chi tiết
                  </Button>
                </SurfaceContent>
              </Surface>
            );
          })}
        </div>
      )}
    </div>
  );
};
