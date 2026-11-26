import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  List,
  Lock,
  Plus,
  Sparkles,
  StickyNote,
  Swords,
} from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/FormControls';
import { SlideDrawer } from '../../components/ui/Modal';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Surface, SurfaceContent } from '../../components/ui/Surface';
import { MissionPanel } from './MissionPanel';

export const LearningInterface: React.FC = () => {
  const { state, navigate, toggleLessonComplete, createNote, updateNote, addToast } = useApp();
  const course = state.courses.find((c) => c.id === state.activeCourseId) ?? state.courses[0];
  const activeChapter = course.chapters.find((ch) => ch.id === state.activeChapterId) ?? course.chapters[0];

  const isMissionMode = state.activeLessonId === `mission:${activeChapter.id}`;
  const activeLesson =
    activeChapter.lessons.find((l) => l.id === state.activeLessonId) ?? activeChapter.lessons[0];

  const [syllabusOpen, setSyllabusOpen] = useState(false);
  const [notesDrawerOpen, setNotesDrawerOpen] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  const chapterTotalSteps = activeChapter.lessons.length + 2;
  const chapterCompletedLessons = activeChapter.lessons.filter((l) => state.completedLessonIds.includes(l.id)).length;
  const missionDone = state.completedMissionIds.includes(activeChapter.mission.id);
  const bossDone = state.bossProgress[activeChapter.id]?.defeated ?? false;
  const chapterProgress = Math.round(
    ((chapterCompletedLessons + (missionDone ? 1 : 0) + (bossDone ? 1 : 0)) / chapterTotalSteps) * 100,
  );

  const chapterNotes = state.notes.filter((n) => n.scope === 'chapter' && n.chapterId === activeChapter.id);

  const handleNextStep = () => {
    if (isMissionMode) {
      navigate('boss-battle', { chapterId: activeChapter.id });
      return;
    }
    const idx = activeChapter.lessons.findIndex((l) => l.id === activeLesson?.id);
    if (idx >= 0 && idx < activeChapter.lessons.length - 1) {
      navigate('learning', { courseId: course.id, chapterId: activeChapter.id, lessonId: activeChapter.lessons[idx + 1].id });
    } else {
      navigate('learning', { courseId: course.id, chapterId: activeChapter.id, lessonId: `mission:${activeChapter.id}` });
    }
  };

  const handleQuickNote = (e: React.FormEvent) => {
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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Focused Sticky Utility Bar (NO permanent sidebar!) */}
      <Surface>
        <SurfaceContent className="p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary" leftIcon={<List className="w-4 h-4" />} onClick={() => setSyllabusOpen(true)}>
                Mục lục ({course.chapters.length} chương)
              </Button>
              <span className="text-xs font-mono text-[var(--text-muted)]">
                CHƯƠNG {activeChapter.order}: {activeChapter.title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" leftIcon={<StickyNote className="w-4 h-4" />} onClick={() => setNotesDrawerOpen(true)}>
                Ghi chú ({chapterNotes.length})
              </Button>
              <Button size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />} onClick={handleNextStep}>
                {isMissionMode ? 'Đánh Boss' : 'Tiếp theo'}
              </Button>
            </div>
          </div>

          <ProgressBar value={chapterProgress} label={`Tiến độ Chương ${activeChapter.order}`} tone="success" size="sm" />
        </SurfaceContent>
      </Surface>

      {/* Single Distraction-Free Reading / Mission Canvas */}
      {isMissionMode ? (
        <MissionPanel mission={activeChapter.mission} onGoToBoss={() => navigate('boss-battle', { chapterId: activeChapter.id })} />
      ) : activeLesson ? (
        <Surface elevated>
          <SurfaceContent className="p-7 sm:p-10 space-y-6">
            {activeLesson.moderation.status === 'locked' ? (
              <div className="p-5 rounded-xl bg-[var(--accent-danger-soft)] border border-[var(--accent-danger)]/40 space-y-2">
                <div className="flex items-center gap-2 font-bold text-[var(--accent-danger-fg)]">
                  <Lock className="w-5 h-5" />
                  <span>Bài học này đang bị Quản trị viên tạm khóa</span>
                </div>
                <p className="text-sm text-[var(--text-primary)]">Lý do: <strong>{activeLesson.moderation.reason}</strong></p>
                <p className="text-xs font-mono text-[var(--text-secondary)]">
                  {activeLesson.moderation.lockedBy} · {activeLesson.moderation.lockedAt}
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-3 pb-5 border-b border-[var(--border-subtle)]">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="primary">Phiên bản v{activeLesson.version}</Badge>
                    <Badge tone="neutral">{activeLesson.durationMinutes} phút đọc</Badge>
                    {activeLesson.moderation.status === 'warned' && <Badge tone="warning">Đang rà soát</Badge>}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] leading-snug">
                    {activeLesson.title}
                  </h1>
                  <p className="text-sm sm:text-base text-[var(--text-secondary)]">{activeLesson.summary}</p>
                </div>

                <div className="text-[16px] sm:text-[17px] text-[var(--text-primary)] whitespace-pre-line leading-[1.82]">
                  {activeLesson.content}
                </div>

                {activeLesson.keyTakeaways.length > 0 && (
                  <div className="p-5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)]">
                      Điểm cốt lõi cần nhớ
                    </div>
                    <ul className="space-y-1.5 text-sm text-[var(--text-primary)] list-disc list-inside">
                      {activeLesson.keyTakeaways.map((kt, idx) => (
                        <li key={idx}>{kt}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-5 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3">
                  <Button
                    variant={state.completedLessonIds.includes(activeLesson.id) ? 'success' : 'secondary'}
                    leftIcon={<CheckCircle2 className="w-4 h-4" />}
                    onClick={() => {
                      const done = state.completedLessonIds.includes(activeLesson.id);
                      toggleLessonComplete(activeLesson.id);
                      if (!done) addToast({ type: 'success', title: 'Hoàn thành bài học (+25 XP)' });
                    }}
                  >
                    {state.completedLessonIds.includes(activeLesson.id) ? 'Đã hoàn thành' : 'Đánh dấu hoàn thành'}
                  </Button>
                  <Button rightIcon={<ArrowRight className="w-4 h-4" />} onClick={handleNextStep}>
                    Bước tiếp theo
                  </Button>
                </div>
              </>
            )}
          </SurfaceContent>
        </Surface>
      ) : null}

      {/* Left SlideDrawer: Full Syllabus */}
      <SlideDrawer
        open={syllabusOpen}
        onClose={() => setSyllabusOpen(false)}
        side="left"
        title={course.title}
        subtitle="Chọn bài học, nhiệm vụ hoặc Boss cuối chương"
      >
        <div className="space-y-4">
          {course.chapters.map((ch) => (
            <div key={ch.id} className="space-y-1.5">
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)]">
                Chương {ch.order}: {ch.title}
              </div>
              {ch.lessons
                .filter((l) => l.status === 'published')
                .map((les, i) => {
                  const selected = !isMissionMode && activeLesson?.id === les.id && ch.id === activeChapter.id;
                  const done = state.completedLessonIds.includes(les.id);
                  return (
                    <button
                      key={les.id}
                      type="button"
                      onClick={() => {
                        navigate('learning', { courseId: course.id, chapterId: ch.id, lessonId: les.id });
                        setSyllabusOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded-lg text-left text-xs font-medium flex items-center justify-between gap-2 cursor-pointer ${
                        selected
                          ? 'bg-[var(--accent-primary-soft)] text-[var(--accent-primary-fg)] font-bold'
                          : 'text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
                      }`}
                    >
                      <span className="inline-flex items-center gap-2 truncate">
                        <BookOpen className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{ch.order}.{i + 1} {les.title}</span>
                      </span>
                      {les.moderation.status === 'locked' ? (
                        <Lock className="w-3.5 h-3.5 text-[var(--accent-danger)] shrink-0" />
                      ) : done ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent-success)] shrink-0" />
                      ) : null}
                    </button>
                  );
                })}
              <button
                type="button"
                onClick={() => {
                  navigate('learning', { courseId: course.id, chapterId: ch.id, lessonId: `mission:${ch.id}` });
                  setSyllabusOpen(false);
                }}
                className="w-full px-3 py-2 rounded-lg text-left text-xs font-semibold text-[var(--accent-warning)] hover:bg-[var(--bg-subtle)] flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" /> Nhiệm vụ: {ch.mission.title}
              </button>
              <button
                type="button"
                onClick={() => {
                  navigate('boss-battle', { chapterId: ch.id });
                  setSyllabusOpen(false);
                }}
                className="w-full px-3 py-2 rounded-lg text-left text-xs font-semibold text-[var(--accent-danger)] hover:bg-[var(--bg-subtle)] flex items-center gap-2 cursor-pointer"
              >
                <Swords className="w-3.5 h-3.5" /> Boss: {ch.boss.name}
              </button>
            </div>
          ))}
        </div>
      </SlideDrawer>

      {/* Right SlideDrawer: Chapter Notes */}
      <SlideDrawer
        open={notesDrawerOpen}
        onClose={() => setNotesDrawerOpen(false)}
        title={`Ghi chú Chương ${activeChapter.order}`}
        subtitle="Mặc định Riêng tư · Giảng viên không thể xem"
      >
        <form onSubmit={handleQuickNote} className="space-y-3 p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
          <div className="text-xs font-bold text-[var(--accent-primary)] flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Tạo ghi chú nhanh
          </div>
          <Input placeholder="Tiêu đề..." value={newNoteTitle} onChange={(e) => setNewNoteTitle(e.target.value)} />
          <Textarea rows={3} placeholder="Nội dung ghi nhớ..." value={newNoteContent} onChange={(e) => setNewNoteContent(e.target.value)} />
          <Button type="submit" size="sm">Lưu ghi chú (Riêng tư)</Button>
        </form>

        <div className="space-y-3">
          {chapterNotes.map((note) => (
            <div key={note.id} className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-[var(--text-primary)]">{note.title}</span>
                <Badge tone={note.visibility === 'public' ? 'success' : 'neutral'}>
                  {note.visibility === 'public' ? 'Công khai' : 'Riêng tư'}
                </Badge>
              </div>
              <Textarea rows={3} value={note.content} onChange={(e) => updateNote(note.id, { content: e.target.value })} />
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setNotesDrawerOpen(false);
            navigate('notes');
          }}
        >
          Mở toàn bộ Sổ ghi chú & Wrong Answers
        </Button>
      </SlideDrawer>
    </div>
  );
};
