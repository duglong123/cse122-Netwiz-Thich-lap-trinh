import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Lock,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Shield,
  Sparkles,
  StickyNote,
  Swords,
  X,
} from 'lucide-react';
import { CHAPTER_THEMES } from '../../data/inspectorData';
import { useApp } from '../../store/AppContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/FormControls';
import { Panel, PanelContent } from '../../components/ui/Panel';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { MissionPanel } from './MissionPanel';
import { NetworkInspector } from './NetworkInspector';

export const LearningInterface: React.FC = () => {
  const { state, navigate, toggleLessonComplete, createNote, updateNote, addToast } = useApp();
  const course = state.courses.find((c) => c.id === state.activeCourseId) ?? state.courses[0];
  const activeChapter = course.chapters.find((ch) => ch.id === state.activeChapterId) ?? course.chapters[0];
  const theme = CHAPTER_THEMES[activeChapter.id] ?? CHAPTER_THEMES['ch-1'];

  const isMissionMode = state.activeLessonId === `mission:${activeChapter.id}`;
  const publishedLessons = activeChapter.lessons.filter((l) => l.status === 'published');
  const activeLesson =
    publishedLessons.find((l) => l.id === state.activeLessonId) ?? publishedLessons[0];

  const [focusReading, setFocusReading] = useState(false);
  const [notesSideOpen, setNotesSideOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const chapterTotal = activeChapter.lessons.length + 2;
  const lessonsDone = activeChapter.lessons.filter((l) => state.completedLessonIds.includes(l.id)).length;
  const missionDone = state.completedMissionIds.includes(activeChapter.mission.id);
  const bossDone = state.bossProgress[activeChapter.id]?.defeated ?? false;
  const chPct = Math.round(((lessonsDone + (missionDone ? 1 : 0) + (bossDone ? 1 : 0)) / chapterTotal) * 100);
  const chapterNotes = state.notes.filter((n) => n.scope === 'chapter' && n.chapterId === activeChapter.id);

  const currentLessonIdx = publishedLessons.findIndex((l) => l.id === activeLesson?.id);
  const hasPrev = isMissionMode ? publishedLessons.length > 0 : currentLessonIdx > 0;
  const nextLabel = isMissionMode
    ? 'Vào Boss Arena'
    : currentLessonIdx >= 0 && currentLessonIdx < publishedLessons.length - 1
      ? 'Bài học tiếp theo'
      : 'Vào nhiệm vụ chương';

  const handlePrev = () => {
    if (isMissionMode && publishedLessons.length > 0) {
      navigate('learning', {
        courseId: course.id,
        chapterId: activeChapter.id,
        lessonId: publishedLessons[publishedLessons.length - 1].id,
      });
      return;
    }
    if (currentLessonIdx > 0) {
      navigate('learning', {
        courseId: course.id,
        chapterId: activeChapter.id,
        lessonId: publishedLessons[currentLessonIdx - 1].id,
      });
    }
  };

  const handleNext = () => {
    if (isMissionMode) {
      navigate('boss-battle', { chapterId: activeChapter.id });
      return;
    }
    if (currentLessonIdx >= 0 && currentLessonIdx < publishedLessons.length - 1) {
      navigate('learning', {
        courseId: course.id,
        chapterId: activeChapter.id,
        lessonId: publishedLessons[currentLessonIdx + 1].id,
      });
    } else {
      navigate('learning', {
        courseId: course.id,
        chapterId: activeChapter.id,
        lessonId: `mission:${activeChapter.id}`,
      });
    }
  };

  const mainColumnsClass =
    focusReading && notesSideOpen
      ? 'grid-cols-1 lg:grid-cols-[1fr_340px]'
      : focusReading
        ? 'grid-cols-1'
        : notesSideOpen
          ? 'grid-cols-1 lg:grid-cols-[260px_1fr_320px]'
          : 'grid-cols-1 lg:grid-cols-[280px_1fr]';

  return (
    <div className="space-y-6">
      {/* Chapter Progress & Ergonomic Controls */}
      <Panel>
        <PanelContent className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1 max-w-2xl space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="yellow">{course.code}</Badge>
              <span className="text-xs mono text-[var(--muted)]">
                CHƯƠNG {activeChapter.order}: {activeChapter.title}
              </span>
            </div>
            <ProgressBar value={chPct} label={`Tiến độ Chương ${activeChapter.order}`} color={theme.color} size="sm" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="ghost"
              leftIcon={focusReading ? <PanelLeftOpen className="w-3.5 h-3.5" /> : <PanelLeftClose className="w-3.5 h-3.5" />}
              onClick={() => setFocusReading((v) => !v)}
            >
              {focusReading ? 'Hiện mục lục' : 'Thu gọn mục lục'}
            </Button>
            <Button
              size="sm"
              variant={notesSideOpen ? 'outline' : 'secondary'}
              leftIcon={<StickyNote className="w-3.5 h-3.5" />}
              onClick={() => setNotesSideOpen((v) => !v)}
            >
              Ghi chú song song ({chapterNotes.length})
            </Button>
            <Button size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />} onClick={handleNext}>
              {nextLabel}
            </Button>
          </div>
        </PanelContent>
      </Panel>

      {/* Main Split Grid with Collapsible Sidebar & Non-blocking Side Notes */}
      <div className={`grid gap-6 items-start ${mainColumnsClass}`}>
        {!focusReading && (
          <Panel>
            <PanelContent className="p-4 space-y-3">
              <div className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--muted)]">
                Mục lục chương
              </div>
              {course.chapters.map((ch) => {
                const isCh = ch.id === activeChapter.id;
                const cTheme = CHAPTER_THEMES[ch.id] ?? CHAPTER_THEMES['ch-1'];
                return (
                  <div
                    key={ch.id}
                    className="p-3 rounded-xl border space-y-1.5"
                    style={{
                      background: isCh ? 'var(--panel-deep)' : 'var(--panel)',
                      borderColor: isCh ? cTheme.color : 'var(--line)',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => navigate('learning', { courseId: course.id, chapterId: ch.id, lessonId: ch.lessons[0]?.id })}
                      className="w-full text-left text-xs font-extrabold text-[var(--text)] flex items-center justify-between cursor-pointer"
                    >
                      <span>{cTheme.number}. {ch.title}</span>
                      {state.bossProgress[ch.id]?.defeated && <CheckCircle2 className="w-3.5 h-3.5 text-[var(--green-fg)]" />}
                    </button>
                    <div className="space-y-1 pl-1">
                      {ch.lessons.filter((l) => l.status === 'published').map((les, idx) => {
                        const active = !isMissionMode && activeLesson?.id === les.id && isCh;
                        const done = state.completedLessonIds.includes(les.id);
                        return (
                          <button
                            key={les.id}
                            type="button"
                            title={les.title}
                            onClick={() => navigate('learning', { courseId: course.id, chapterId: ch.id, lessonId: les.id })}
                            className={`w-full px-2.5 py-1.5 rounded-lg text-left text-xs flex items-center justify-between gap-2 cursor-pointer ${
                              active ? 'bg-[var(--yellow-soft)] text-[var(--yellow-fg)] font-bold' : 'text-[var(--text-body)] hover:bg-[var(--panel-2)]'
                            }`}
                          >
                            <span className="inline-flex items-center gap-1.5 truncate">
                              <BookOpen className="w-3 h-3 shrink-0" />
                              <span className="truncate">{ch.order}.{idx + 1} {les.title}</span>
                            </span>
                            {les.moderation.status === 'locked' ? (
                              <Lock className="w-3 h-3 text-[var(--red-fg)] shrink-0" />
                            ) : done ? (
                              <CheckCircle2 className="w-3 h-3 text-[var(--green-fg)] shrink-0" />
                            ) : null}
                          </button>
                        );
                      })}
                      <button
                        type="button"
                        onClick={() => navigate('learning', { courseId: course.id, chapterId: ch.id, lessonId: `mission:${ch.id}` })}
                        className={`w-full px-2.5 py-1.5 rounded-lg text-left text-xs flex items-center gap-1.5 cursor-pointer ${
                          isMissionMode && isCh ? 'bg-[var(--yellow)] text-[var(--yellow-on)] font-extrabold' : 'text-[var(--yellow-fg)] hover:bg-[var(--panel-2)]'
                        }`}
                      >
                        <Sparkles className="w-3 h-3 shrink-0" />
                        <span className="truncate">Nhiệm vụ: {ch.mission.title}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate('boss-battle', { chapterId: ch.id })}
                        className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs text-[var(--red-fg)] hover:bg-[var(--red-soft)] flex items-center gap-1.5 cursor-pointer"
                      >
                        <Swords className="w-3 h-3 shrink-0" />
                        <span className="truncate">Boss: {ch.boss.name}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </PanelContent>
          </Panel>
        )}

        {/* Primary Lesson Reading / Mission Column */}
        <div className="min-w-0 space-y-6">
          {isMissionMode ? (
            <MissionPanel mission={activeChapter.mission} onGoToBoss={() => navigate('boss-battle', { chapterId: activeChapter.id })} />
          ) : activeLesson ? (
            <article
              className="overflow-hidden rounded-[20px] border bg-[var(--reading-bg)]"
              style={{
                borderColor: `rgba(${theme.rgb}, 0.28)`,
                background: `linear-gradient(180deg, rgba(${theme.rgb}, 0.03), transparent 28%), var(--reading-bg)`,
              }}
            >
              <header
                className="relative grid grid-cols-[68px_1fr] sm:grid-cols-[92px_1fr_auto] items-center gap-5 p-6 sm:p-8 border-b overflow-hidden"
                style={{
                  borderColor: `rgba(${theme.rgb}, 0.24)`,
                  background: `linear-gradient(110deg, rgba(${theme.rgb}, 0.11), transparent 70%)`,
                }}
              >
                <div
                  className="w-16 h-16 sm:w-22 sm:h-22 grid place-items-center border bg-[var(--panel-deep)]"
                  style={{ color: theme.color, borderColor: `rgba(${theme.rgb}, 0.35)` }}
                >
                  <Shield className="w-9 h-9 sm:w-11 sm:h-11" />
                </div>
                <div>
                  <span className="text-[10px] font-black tracking-[0.2em] uppercase block" style={{ color: theme.color }}>
                    Mission {theme.number} // {theme.alias}
                  </span>
                  <h1 className="display-font text-2xl sm:text-4xl font-extrabold text-[var(--text)] mt-1 leading-[1.15]">
                    {activeLesson.title}
                  </h1>
                  <p className="text-sm text-[var(--text-body)] mt-1.5 m-0">{activeLesson.summary}</p>
                </div>
                <span className="hidden sm:block display-font text-6xl leading-none" style={{ color: `rgba(${theme.rgb}, 0.24)` }}>
                  {theme.number}
                </span>
              </header>

              <div className="p-6 sm:p-8 space-y-6">
                {activeLesson.moderation.status === 'locked' ? (
                  <div className="p-5 rounded-xl bg-[var(--red-soft)] border border-[var(--red-border)] space-y-2">
                    <div className="flex items-center gap-2 text-[var(--red-fg)] font-extrabold text-sm">
                      <Lock className="w-5 h-5" /> Nội dung này đang bị Quản trị viên tạm khóa
                    </div>
                    <p className="text-sm text-[var(--text)]">Lý do: <strong>{activeLesson.moderation.reason}</strong></p>
                    <p className="text-xs mono text-[var(--muted)]">
                      {activeLesson.moderation.lockedBy} · {activeLesson.moderation.lockedAt}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Comfortable 68ch Reading Column */}
                    <div className="space-y-6">
                      <div className="max-w-[68ch] text-[15px] sm:text-[16px] text-[var(--text-body)] whitespace-pre-line leading-[1.82]">
                        {activeLesson.content}
                      </div>

                      <aside className="max-w-[68ch] p-5 rounded-xl border border-[var(--line)] bg-[var(--panel-deep)] space-y-3">
                        <h3 className="text-xs font-black tracking-[0.12em] uppercase text-[var(--text)]">
                          Năng lực mở khóa
                        </h3>
                        <ul className="space-y-2 text-sm text-[var(--text-body)] leading-relaxed m-0 p-0 list-none">
                          {activeLesson.keyTakeaways.map((kt, idx) => (
                            <li key={idx} className="flex gap-2.5">
                              <span className="font-bold" style={{ color: theme.color }}>✓</span>
                              <span>{kt}</span>
                            </li>
                          ))}
                        </ul>
                      </aside>
                    </div>

                    {/* Interactive 4-Layer Network Inspector */}
                    <NetworkInspector chapterId={activeChapter.id} />

                    <div className="pt-5 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {hasPrev && (
                          <Button variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={handlePrev}>
                            Bài trước
                          </Button>
                        )}
                        <Button
                          variant={state.completedLessonIds.includes(activeLesson.id) ? 'success' : 'secondary'}
                          leftIcon={<CheckCircle2 className="w-4 h-4" />}
                          onClick={() => {
                            const done = state.completedLessonIds.includes(activeLesson.id);
                            toggleLessonComplete(activeLesson.id);
                            if (!done) addToast({ type: 'success', title: 'Hoàn thành bài học (+25 XP)' });
                          }}
                        >
                          {state.completedLessonIds.includes(activeLesson.id) ? 'Đã hoàn thành' : 'Hoàn thành bài (+25 XP)'}
                        </Button>
                      </div>
                      <Button rightIcon={<ArrowRight className="w-4 h-4" />} onClick={handleNext}>
                        {nextLabel}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </article>
          ) : null}
        </div>

        {/* Non-blocking Side-by-Side Chapter Notes Panel */}
        {notesSideOpen && (
          <Panel accent="var(--yellow)" className="lg:sticky lg:top-[96px]">
            <PanelContent className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-[var(--line)]">
                <div>
                  <div className="text-xs font-extrabold uppercase text-[var(--yellow-fg)]">
                    Ghi chú Chương {activeChapter.order}
                  </div>
                  <div className="text-[11px] text-[var(--muted)]">Mặc định Riêng tư · Đọc & ghi song song</div>
                </div>
                <button
                  type="button"
                  onClick={() => setNotesSideOpen(false)}
                  aria-label="Đóng ghi chú"
                  className="p-1 rounded text-[var(--muted)] hover:text-[var(--yellow-fg)] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newTitle.trim() || !newContent.trim()) return;
                  createNote({
                    scope: 'chapter',
                    courseId: course.id,
                    chapterId: activeChapter.id,
                    title: newTitle.trim(),
                    content: newContent.trim(),
                    tags: [`Chương ${activeChapter.order}`],
                    visibility: 'private',
                  });
                  setNewTitle('');
                  setNewContent('');
                }}
                className="p-3 rounded-xl bg-[var(--panel-deep)] border border-[var(--line)] space-y-2.5"
              >
                <div className="text-[11px] font-extrabold text-[var(--yellow-fg)] flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Thêm ghi chú mới
                </div>
                <Input placeholder="Tiêu đề..." value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                <Textarea rows={3} placeholder="Nội dung ghi nhớ..." value={newContent} onChange={(e) => setNewContent(e.target.value)} />
                <Button type="submit" size="sm" className="w-full">Lưu ghi chú (Riêng tư)</Button>
              </form>

              <div className="space-y-3">
                {chapterNotes.map((note) => (
                  <div key={note.id} className="p-3 rounded-xl bg-[var(--panel-deep)] border border-[var(--line)] space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <strong className="text-xs text-[var(--text)]">{note.title}</strong>
                      <Badge tone={note.visibility === 'public' ? 'green' : 'muted'}>
                        {note.visibility === 'public' ? 'Công khai' : 'Riêng tư'}
                      </Badge>
                    </div>
                    <Textarea rows={3} value={note.content} onChange={(e) => updateNote(note.id, { content: e.target.value })} />
                  </div>
                ))}
              </div>
            </PanelContent>
          </Panel>
        )}
      </div>
    </div>
  );
};
