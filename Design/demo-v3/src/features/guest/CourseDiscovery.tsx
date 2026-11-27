import React, { useMemo, useState } from 'react';
import { BookOpen, Layers, Search, Users } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/DataFeedback';
import { Input, Select } from '../../components/ui/FormControls';
import { Eyebrow, Panel, PanelContent } from '../../components/ui/Panel';

export const CourseDiscovery: React.FC = () => {
  const { state, navigate } = useApp();
  const [query, setQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');

  const publicCourses = useMemo(() => state.courses.filter((c) => c.isPublic), [state.courses]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return publicCourses.filter((c) => {
      const mQ = !q || c.title.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.subtitle.toLowerCase().includes(q);
      const mL = levelFilter === 'all' || c.level === levelFilter;
      return mQ && mL;
    });
  }, [publicCourses, query, levelFilter]);

  return (
    <div className="space-y-6">
      <div>
        <Eyebrow>Public Catalog</Eyebrow>
        <h1 className="display-font text-4xl font-extrabold text-[#f3f6fc] mt-2">Khám phá khóa học</h1>
      </div>

      <Panel>
        <PanelContent className="p-4 grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Input
              placeholder="Tìm tên khóa học, mã môn (CN-101, OSI, Security)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="w-4 h-4 text-[#98a7bd] absolute left-3.5 top-3 pointer-events-none" />
          </div>
          <div className="sm:col-span-4">
            <Select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
              <option value="all">Mọi cấp độ</option>
              <option value="Cơ bản">Cơ bản</option>
              <option value="Trung cấp">Trung cấp</option>
              <option value="Nâng cao">Nâng cao</option>
            </Select>
          </div>
        </PanelContent>
      </Panel>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="w-6 h-6" />}
          title="Không tìm thấy khóa học"
          description="Thử từ khóa khác hoặc xóa bộ lọc."
          action={<Button variant="outline" onClick={() => { setQuery(''); setLevelFilter('all'); }}>Xóa bộ lọc</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filtered.map((course) => {
            const totalLessons = course.chapters.reduce((s, ch) => s + ch.lessons.length, 0);
            const lecturers = state.lecturers.filter((l) => course.collaboratorIds.includes(l.id));
            return (
              <Panel key={course.id} className="flex flex-col justify-between">
                <PanelContent className="space-y-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <Badge tone="yellow">{course.code}</Badge>
                    <Badge tone={course.level === 'Cơ bản' ? 'green' : course.level === 'Trung cấp' ? 'blue' : 'red'}>
                      {course.level}
                    </Badge>
                  </div>
                  <h2 className="display-font text-2xl font-extrabold text-[#f3f6fc]">{course.title}</h2>
                  <p className="text-xs text-[#98a7bd] leading-relaxed">{course.subtitle}</p>
                  <div className="flex items-center justify-between text-xs text-[#c5d1e2] pt-2 border-t border-[#26334a]">
                    <span className="inline-flex items-center gap-1"><Layers className="w-3.5 h-3.5 text-[#f4d35e]" /> {course.chapters.length} ch · {totalLessons} bài</span>
                    <span className="inline-flex items-center gap-1"><Users className="w-3.5 h-3.5 text-[#45d483]" /> {course.enrolledCount} SV</span>
                  </div>
                  <div className="text-[11px] text-[#98a7bd]">GV: {lecturers.map((l) => l.name).join(', ')}</div>
                  <Button size="sm" className="w-full" onClick={() => navigate('course-preview', { courseId: course.id })}>
                    Xem chi tiết
                  </Button>
                </PanelContent>
              </Panel>
            );
          })}
        </div>
      )}
    </div>
  );
};
