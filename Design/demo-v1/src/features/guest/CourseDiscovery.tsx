import React, { useMemo, useState } from 'react';
import { BookOpen, Layers, Search, Users } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardFooter } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/DataFeedback';
import { Input, Select } from '../../components/ui/FormControls';

export const CourseDiscovery: React.FC = () => {
  const { state, navigate } = useApp();
  const [query, setQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const publicCourses = useMemo(
    () => state.courses.filter((c) => c.isPublic),
    [state.courses],
  );

  const categories = useMemo(
    () => Array.from(new Set(publicCourses.map((c) => c.category))),
    [publicCourses],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return publicCourses.filter((c) => {
      const matchQuery =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.subtitle.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q);
      const matchLevel = levelFilter === 'all' || c.level === levelFilter;
      const matchCategory = categoryFilter === 'all' || c.category === categoryFilter;
      return matchQuery && matchLevel && matchCategory;
    });
  }, [publicCourses, query, levelFilter, categoryFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Khám phá khóa học công khai</h1>
          <p className="text-sm text-slate-400 mt-1">
            Tìm kiếm và xem trước lộ trình học tập theo từng chương cùng hệ thống Boss thử thách.
          </p>
        </div>
        <Badge tone="cobalt">{publicCourses.length} khóa học đang mở</Badge>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4">
          <div className="md:col-span-6 relative">
            <Input
              placeholder="Tìm theo tên khóa học, mã môn (ví dụ: CN-101, OSI, Security)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
          </div>
          <div className="md:col-span-3">
            <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="all">Tất cả lĩnh vực</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
          </div>
          <div className="md:col-span-3">
            <Select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
              <option value="all">Mọi cấp độ</option>
              <option value="Cơ bản">Cơ bản</option>
              <option value="Trung cấp">Trung cấp</option>
              <option value="Nâng cao">Nâng cao</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="w-6 h-6" />}
          title="Không tìm thấy khóa học phù hợp"
          description="Thử xóa bớt bộ lọc hoặc tìm kiếm với từ khóa khác."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setQuery('');
                setLevelFilter('all');
                setCategoryFilter('all');
              }}
            >
              Xóa bộ lọc
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((course) => {
            const totalLessons = course.chapters.reduce((s, ch) => s + ch.lessons.length, 0);
            const lecturers = state.lecturers.filter((l) => course.collaboratorIds.includes(l.id));
            return (
              <Card key={course.id} hoverable className="flex flex-col justify-between">
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-blue-500/15 text-blue-300 border border-blue-500/30">
                      {course.code}
                    </span>
                    <Badge tone={course.level === 'Cơ bản' ? 'emerald' : course.level === 'Trung cấp' ? 'amber' : 'rose'}>
                      {course.level}
                    </Badge>
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-white">{course.title}</h2>
                    <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">{course.subtitle}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-blue-400" />
                      <span>{course.chapters.length} chương · {totalLessons} bài</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{course.enrolledCount} sinh viên</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400">
                    Giảng viên:{' '}
                    <span className="text-slate-200">
                      {lecturers.map((l) => l.name).join(', ')}
                    </span>
                  </div>
                </CardContent>

                <CardFooter>
                  <span className="text-xs text-slate-500">{course.category}</span>
                  <Button
                    size="sm"
                    onClick={() => navigate('course-preview', { courseId: course.id })}
                  >
                    Xem chi tiết
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
