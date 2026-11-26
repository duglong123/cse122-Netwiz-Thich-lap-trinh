import React, { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Play,
  Shield,
  Swords,
  Users,
} from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

export const CoursePreview: React.FC = () => {
  const { state, navigate, loginAs } = useApp();
  const course = state.courses.find((c) => c.id === state.activeCourseId) ?? state.courses[0];
  const lecturers = state.lecturers.filter((l) => course.collaboratorIds.includes(l.id));
  const [expandedChapterId, setExpandedChapterId] = useState<string>(course.chapters[0]?.id ?? '');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate('discovery')}>
          Quay lại danh sách khóa học
        </Button>
      </div>

      {/* Course Banner */}
      <Card className="bg-tactical-grid">
        <CardContent className="p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="cobalt">{course.code}</Badge>
              <Badge tone="slate">{course.category}</Badge>
              <Badge tone="emerald">{course.level}</Badge>
              {lecturers.length > 1 && (
                <Badge tone="amber" icon={<Users className="w-3.5 h-3.5" />}>
                  Khóa học đồng sở hữu ({lecturers.length} giảng viên)
                </Badge>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{course.title}</h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">{course.subtitle}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
              <span>{course.chapters.length} chương học</span>
              <span>{course.chapters.reduce((s, ch) => s + ch.lessons.length, 0)} bài kiến thức</span>
              <span>{course.chapters.length} Boss Battle</span>
              <span>Cập nhật: {course.updatedAt}</span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col gap-2.5">
            {state.role === 'student' ? (
              <Button
                size="lg"
                leftIcon={<Play className="w-4 h-4" />}
                onClick={() =>
                  navigate('learning', {
                    courseId: course.id,
                    chapterId: course.chapters[0]?.id,
                    lessonId: course.chapters[0]?.lessons[0]?.id,
                  })
                }
              >
                Vào học khóa này
              </Button>
            ) : (
              <Button
                size="lg"
                leftIcon={<Play className="w-4 h-4" />}
                onClick={() => loginAs('student', state.demoStudent.id)}
              >
                Học thử với tài khoản Sinh viên
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Syllabus */}
        <div className="lg:col-span-8 space-y-3">
          <h2 className="text-lg font-bold text-white">Cấu trúc chương & Boss thử thách</h2>
          {course.chapters.map((chapter) => {
            const expanded = expandedChapterId === chapter.id;
            return (
              <Card key={chapter.id}>
                <button
                  type="button"
                  onClick={() => setExpandedChapterId(expanded ? '' : chapter.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-blue-400">CHƯƠNG {chapter.order}</span>
                      <span className="text-xs text-slate-500">· {chapter.lessons.length} bài học</span>
                    </div>
                    <div className="text-base font-bold text-white">{chapter.title}</div>
                    <p className="text-xs text-slate-400">{chapter.summary}</p>
                  </div>
                  {expanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>

                {expanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-800/80 space-y-3">
                    <div className="space-y-2 pt-2">
                      {chapter.lessons.map((lesson, idx) => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between gap-3 p-3 rounded-lg bg-slate-900/70 border border-slate-800/80"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <BookOpen className="w-4 h-4 text-blue-400 shrink-0" />
                            <span className="text-sm text-slate-200 truncate">
                              {chapter.order}.{idx + 1} {lesson.title}
                            </span>
                          </div>
                          <span className="text-xs font-mono text-slate-500 shrink-0">
                            {lesson.durationMinutes} phút
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                        <div className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5" /> Nhiệm vụ giữa chương
                        </div>
                        <div className="text-sm font-medium text-white mt-1">{chapter.mission.title}</div>
                      </div>
                      <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/20 flex items-center gap-3">
                        <img
                          src={chapter.boss.avatar}
                          alt={chapter.boss.name}
                          className="w-11 h-11 rounded-lg object-cover border border-rose-500/30 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                            <Swords className="w-3.5 h-3.5" /> Boss cuối chương
                          </div>
                          <div className="text-sm font-medium text-white truncate">{chapter.boss.name}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Lecturers */}
        <div className="lg:col-span-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <span>Giảng viên phụ trách</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {lecturers.map((lec) => (
                <div key={lec.id} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                  <div className="text-sm font-semibold text-white">{lec.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{lec.title}</div>
                  <div className="text-[11px] font-mono text-slate-500 mt-1">{lec.email}</div>
                </div>
              ))}
              {lecturers.length > 1 && (
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/25 text-xs text-blue-200 leading-relaxed">
                  Mọi chỉnh sửa nội dung công bố của khóa học này đều yêu cầu <strong>100% đồng thuận</strong> từ toàn bộ giảng viên tham gia.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
