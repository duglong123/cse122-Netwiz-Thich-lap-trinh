import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileText,
  Lock,
  Plus,
  Sparkles,
  StickyNote,
  Swords,
} from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Input, Textarea } from '../../components/ui/FormControls';
import { Modal } from '../../components/ui/Modal';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { MissionPanel } from './MissionPanel';

export const LearningInterface: React.FC = () => {
  const { state, navigate, toggleLessonComplete, createNote, updateNote, addToast } = useApp();
  const course = state.courses.find((c) => c.id === state.activeCourseId) ?? state.courses[0];
  const activeChapter =
    course.chapters.find((ch) => ch.id === state.activeChapterId) ?? course.chapters[0];

  const isMissionMode = state.activeLessonId === `mission:${activeChapter.id}`;
  const activeLesson =
    activeChapter.lessons.find((l) => l.id === state.activeLessonId) ??
    activeChapter.lessons[0];

  const [noteDrawerOpen, setNoteDrawerOpen] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  const chapterTotalSteps = activeChapter.lessons.length + 2; // lessons + mission + boss
  const chapterCompletedLessons = activeChapter.lessons.filter((l) =>
    state.completedLessonIds.includes(l.id),
  ).length;
  const missionDone = state.completedMissionIds.includes(activeChapter.mission.id);
  const bossDone = state.bossProgress[activeChapter.id]?.defeated ?? false;
  const chapterProgress = Math.round(
    ((chapterCompletedLessons + (missionDone ? 1 : 0) + (bossDone ? 1 : 0)) / chapterTotalSteps) *
      100,
  );

  const chapterNotes = state.notes.filter(
    (n) => n.scope === 'chapter' && n.chapterId === activeChapter.id,
  );

  const handleNextStep = () => {
    if (isMissionMode) {
      navigate('boss-battle', { chapterId: activeChapter.id });
      return;
    }
    const idx = activeChapter.lessons.findIndex((l) => l.id === activeLesson?.id);
    if (idx >= 0 && idx < activeChapter.lessons.length - 1) {
      navigate('learning', {
        courseId: course.id,
        chapterId: activeChapter.id,
        lessonId: activeChapter.lessons[idx + 1].id,
      });
    } else {
      navigate('learning', {
        courseId: course.id,
        chapterId: activeChapter.id,
        lessonId: `mission:${activeChapter.id}`,
      });
    }
  };

  const handleSaveQuickNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;
    createNote({
      scope: 'chapter',
      courseId: course.id,
      chapterId: activeChapter.id,
      title: newNoteTitle.trim(),
      content: newNoteContent.trim(),
      tags: [`Chương ${activeChapter.order}`],
      visibility: 'private',
    });
    setNewNoteTitle('');
    setNewNoteContent('');
  };

  return (
    <div className="space-y-5">
      {/* Top Chapter Progress Header */}
      <Card>
        <CardContent className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2 flex-1 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="cobalt">{course.code}</Badge>
              <span className="text-xs font-mono text-slate-400">
                CHƯƠNG {activeChapter.order}: {activeChapter.title}
              </span>
            </div>
            <ProgressBar
              value={chapterProgress}
              label={`Tiến độ Chương ${activeChapter.order}`}
              tone="emerald"
              size="sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<StickyNote className="w-4 h-4" />}
              onClick={() => setNoteDrawerOpen(true)}
            >
              Mở ghi chú ({chapterNotes.length})
            </Button>
            <Button
              size="sm"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={handleNextStep}
            >
              {isMissionMode ? 'Chuyển sang Boss Battle' : 'Nhiệm vụ tiếp theo'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Split: Chapter/Lesson Sidebar + Knowledge/Mission Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Chapter & Lesson Sidebar */}
        <Card className="lg:col-span-4">
          <CardContent className="p-4 space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Danh sách chương & bài học
            </div>

            <div className="space-y-3">
              {course.chapters.map((ch) => {
                const isChActive = ch.id === activeChapter.id;
                const chMissionDone = state.completedMissionIds.includes(ch.mission.id);
                const chBossDone = state.bossProgress[ch.id]?.defeated;
                return (
                  <div
                    key={ch.id}
                    className={`rounded-xl border p-3 space-y-2 ${
                      isChActive ? 'bg-slate-900/90 border-blue-500/40' : 'bg-slate-900/40 border-slate-800/80'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        navigate('learning', {
                          courseId: course.id,
                          chapterId: ch.id,
                          lessonId: ch.lessons[0]?.id,
                        })
                      }
                      className="w-full text-left flex items-center justify-between gap-2 cursor-pointer"
                    >
                      <span className="text-xs font-bold text-slate-100">
                        Chương {ch.order}: {ch.title}
                      </span>
                      {chBossDone && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    </button>

                    <div className="space-y-1 pl-1">
                      {ch.lessons
                        .filter((l) => l.status === 'published')
                        .map((les, idx) => {
                          const selected = !isMissionMode && activeLesson?.id === les.id && isChActive;
                          const done = state.completedLessonIds.includes(les.id);
                          const isLocked = les.moderation.status === 'locked';
                          return (
                            <button
                              key={les.id}
                              type="button"
                              onClick={() =>
                                navigate('learning', {
                                  courseId: course.id,
                                  chapterId: ch.id,
                                  lessonId: les.id,
                                })
                              }
                              className={`w-full px-2.5 py-2 rounded-lg text-left text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                                selected
                                  ? 'bg-blue-600/20 text-blue-200 border border-blue-500/40'
                                  : 'text-slate-300 hover:bg-slate-800/70 border border-transparent'
                              }`}
                            >
                              <span className="flex items-center gap-2 min-w-0">
                                <BookOpen className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                                <span className="truncate">
                                  {ch.order}.{idx + 1} {les.title}
                                </span>
                              </span>
                              {isLocked ? (
                                <Lock className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                              ) : done ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              ) : null}
                            </button>
                          );
                        })}

                      {/* Mission entry */}
                      <button
                        type="button"
                        onClick={() =>
                          navigate('learning', {
                            courseId: course.id,
                            chapterId: ch.id,
                            lessonId: `mission:${ch.id}`,
                          })
                        }
                        className={`w-full px-2.5 py-2 rounded-lg text-left text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                          isMissionMode && isChActive
                            ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                            : 'text-amber-300/90 hover:bg-slate-800/70 border border-transparent'
                        }`}
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          <Sparkles className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">Nhiệm vụ: {ch.mission.title}</span>
                        </span>
                        {chMissionDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                      </button>

                      {/* Boss entry */}
                      <button
                        type="button"
                        onClick={() => navigate('boss-battle', { chapterId: ch.id })}
                        className="w-full px-2.5 py-2 rounded-lg text-left text-xs flex items-center justify-between gap-2 text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          <Swords className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">Boss: {ch.boss.name}</span>
                        </span>
                        {chBossDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-5">
          {isMissionMode ? (
            <MissionPanel
              mission={activeChapter.mission}
              onGoToBoss={() => navigate('boss-battle', { chapterId: activeChapter.id })}
            />
          ) : activeLesson ? (
            <Card>
              <CardContent className="p-6 sm:p-8 space-y-6">
                {activeLesson.moderation.status === 'locked' ? (
                  <div className="p-5 rounded-xl bg-rose-500/10 border border-rose-500/40 space-y-2">
                    <div className="flex items-center gap-2 text-rose-300 font-bold text-base">
                      <Lock className="w-5 h-5" />
                      <span>Nội dung kiến thức này đang bị Quản trị viên tạm khóa</span>
                    </div>
                    <p className="text-sm text-slate-200">
                      Lý do khóa: <strong>{activeLesson.moderation.reason}</strong>
                    </p>
                    <div className="text-xs font-mono text-slate-400">
                      Thực hiện bởi: {activeLesson.moderation.lockedBy} · Lúc: {activeLesson.moderation.lockedAt}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-5">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge tone="cobalt">Phiên bản v{activeLesson.version}</Badge>
                          <Badge tone="slate">{activeLesson.durationMinutes} phút đọc</Badge>
                          {activeLesson.moderation.status === 'warned' && (
                            <Badge tone="amber">Đang rà soát nội dung</Badge>
                          )}
                        </div>
                        <h1 className="text-2xl font-bold text-white">{activeLesson.title}</h1>
                        <p className="text-sm text-slate-400">{activeLesson.summary}</p>
                      </div>
                    </div>

                    <div className="text-sm sm:text-base text-slate-200 whitespace-pre-line leading-relaxed">
                      {activeLesson.content}
                    </div>

                    {activeLesson.keyTakeaways.length > 0 && (
                      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/25 space-y-2">
                        <div className="text-xs font-semibold uppercase tracking-wider text-blue-300">
                          Điểm cốt lõi cần ghi nhớ
                        </div>
                        <ul className="space-y-1.5 text-sm text-slate-200 list-disc list-inside">
                          {activeLesson.keyTakeaways.map((kt, i) => (
                            <li key={i}>{kt}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                      <Button
                        variant={state.completedLessonIds.includes(activeLesson.id) ? 'success' : 'secondary'}
                        leftIcon={<CheckCircle2 className="w-4 h-4" />}
                        onClick={() => {
                          const wasDone = state.completedLessonIds.includes(activeLesson.id);
                          toggleLessonComplete(activeLesson.id);
                          if (!wasDone) {
                            addToast({ type: 'success', title: 'Đã hoàn thành bài học (+25 XP)' });
                          }
                        }}
                      >
                        {state.completedLessonIds.includes(activeLesson.id)
                          ? 'Đã hoàn thành bài học'
                          : 'Đánh dấu hoàn thành (+25 XP)'}
                      </Button>

                      <Button rightIcon={<ArrowRight className="w-4 h-4" />} onClick={handleNextStep}>
                        Chuyển sang bước tiếp theo
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-slate-400">
                Chương này chưa có bài học nào được công bố.
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Chapter Notes Modal / Drawer */}
      <Modal
        open={noteDrawerOpen}
        onClose={() => setNoteDrawerOpen(false)}
        title={`Ghi chú Chương ${activeChapter.order}: ${activeChapter.title}`}
        description="Ghi chú mặc định chỉ mình bạn xem được (Private). Bạn có thể chia sẻ công khai trong Sổ ghi chú."
        size="lg"
      >
        <div className="space-y-6">
          <form onSubmit={handleSaveQuickNote} className="space-y-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-xs font-semibold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Thêm ghi chú nhanh cho chương này
            </div>
            <Input
              placeholder="Tiêu đề ghi chú..."
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
            />
            <Textarea
              rows={3}
              placeholder="Ghi lại ý chính, công thức hoặc lỗi hay gặp..."
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
            />
            <div className="flex justify-end">
              <Button type="submit" size="sm">
                Lưu ghi chú (Riêng tư)
              </Button>
            </div>
          </form>

          <div className="space-y-3">
            {chapterNotes.map((note) => (
              <div key={note.id} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-white">{note.title}</span>
                  <Badge tone={note.visibility === 'public' ? 'emerald' : 'slate'}>
                    {note.visibility === 'public' ? 'Công khai' : 'Riêng tư'}
                  </Badge>
                </div>
                <Textarea
                  rows={3}
                  value={note.content}
                  onChange={(e) => updateNote(note.id, { content: e.target.value })}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Button
              variant="outline"
              leftIcon={<FileText className="w-4 h-4" />}
              onClick={() => {
                setNoteDrawerOpen(false);
                navigate('notes');
              }}
            >
              Mở toàn bộ Sổ ghi chú & Wrong Answers
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
