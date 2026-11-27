import React from 'react';
import { AlertCircle, ArrowRight, Backpack, Clock, FileText, Swords } from 'lucide-react';
import { CHAPTER_THEMES } from '../../data/inspectorData';
import { useApp } from '../../store/AppContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Eyebrow, Panel, PanelContent, PanelHeader, PanelTitle } from '../../components/ui/Panel';
import { HeroHealthBar, ProgressBar } from '../../components/ui/ProgressBar';

export const StudentDashboard: React.FC = () => {
  const { state, navigate } = useApp();
  const course = state.courses.find((c) => c.id === state.activeCourseId) ?? state.courses[0];
  const currentChapter = course.chapters.find((ch) => ch.id === state.activeChapterId) ?? course.chapters[0];
  const allLessons = course.chapters.flatMap((ch) => ch.lessons);
  const completedCount = allLessons.filter((l) => state.completedLessonIds.includes(l.id)).length;
  const pct = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;

  const ownedItems = state.inventoryCatalog.filter((item) => state.hero.inventoryItemIds.includes(item.id));
  const needsReviewWrong = state.wrongAnswers.filter((w) => w.status === 'needs_review');

  return (
    <div className="space-y-8">
      {/* Hero & Course Banner */}
      <Panel accent="var(--yellow)">
        <PanelContent className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-4">
            <Eyebrow>Học viên {state.demoStudent.name} // {course.code}</Eyebrow>
            <h1 className="display-font text-4xl sm:text-5xl font-extrabold text-[var(--text)] leading-[1.12]">
              {course.title}
            </h1>
            <p className="text-sm text-[var(--text-body)]">
              Đang học <strong className="text-[var(--yellow-fg)]">Chương {currentChapter.order}: {currentChapter.title}</strong> — hoàn thành bài học & Network Inspector để mở khóa toàn bộ sức mạnh trước khi vào Boss Arena.
            </p>
            <ProgressBar value={pct} label={`Tiến độ khóa học (${completedCount}/${allLessons.length} bài)`} color="var(--yellow-fg)" />
            <div className="flex flex-wrap gap-3 pt-1">
              <Button
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => navigate('learning', { courseId: course.id, chapterId: currentChapter.id, lessonId: currentChapter.lessons[0]?.id })}
              >
                Vào Chương {currentChapter.order}
              </Button>
              <Button variant="danger" leftIcon={<Swords className="w-4 h-4" />} onClick={() => navigate('boss-battle', { chapterId: currentChapter.id })}>
                Đánh Boss {currentChapter.boss.name}
              </Button>
              <Button variant="secondary" leftIcon={<FileText className="w-4 h-4" />} onClick={() => navigate('notes')}>
                Global Notes
              </Button>
            </div>
          </div>

          {/* Single Hero Status Panel */}
          <div className="lg:col-span-5 p-5 rounded-xl bg-[var(--panel-deep)] border border-[var(--line)] space-y-4">
            <div className="flex items-center gap-4">
              <img src={state.hero.avatar} alt={state.hero.name} className="w-18 h-18 object-cover hex-avatar shrink-0" />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="display-font text-xl font-extrabold text-[var(--text)]">{state.hero.name}</span>
                  <Badge tone="yellow">LV.{state.hero.level}</Badge>
                </div>
                <HeroHealthBar current={state.hero.hp} max={state.hero.maxHp} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-[var(--panel)] border border-[var(--line)]">
                <div className="text-[var(--muted)] text-[10px] uppercase">ATK</div>
                <div className="mono font-bold text-[var(--yellow-fg)] text-base">{state.hero.attack}</div>
              </div>
              <div className="p-2 rounded-lg bg-[var(--panel)] border border-[var(--line)]">
                <div className="text-[var(--muted)] text-[10px] uppercase">DEF</div>
                <div className="mono font-bold text-[var(--green-fg)] text-base">{state.hero.defense}</div>
              </div>
              <div className="p-2 rounded-lg bg-[var(--panel)] border border-[var(--line)]">
                <div className="text-[var(--muted)] text-[10px] uppercase">XP</div>
                <div className="mono font-bold text-[var(--blue-fg)] text-base">{state.hero.xp}</div>
              </div>
            </div>
          </div>
        </PanelContent>
      </Panel>

      {/* 5-Chapter DC Mission Map */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="display-font text-3xl font-extrabold text-[var(--text)]">Bản đồ 5 nhiệm vụ chương</h2>
          <span className="text-xs text-[var(--muted)]">Chọn bất kỳ chương nào để học, làm nhiệm vụ hoặc tái đấu Boss</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
          {course.chapters.map((ch) => {
            const theme = CHAPTER_THEMES[ch.id] ?? CHAPTER_THEMES['ch-1'];
            const bossDone = state.bossProgress[ch.id]?.defeated;
            const missionDone = state.completedMissionIds.includes(ch.mission.id);
            const isCurrent = ch.id === currentChapter.id;

            return (
              <div
                key={ch.id}
                className="mission-card rounded-2xl p-5 flex flex-col justify-between min-h-[240px]"
                style={{ '--hero': theme.color, '--hero-rgb': theme.rgb, borderColor: isCurrent ? theme.color : undefined } as React.CSSProperties}
              >
                <span className="display-font absolute top-1 right-3 text-5xl leading-none" style={{ color: `rgba(${theme.rgb}, 0.14)` }}>
                  {theme.number}
                </span>
                <div className="space-y-2 relative z-10">
                  <span className="block text-[9px] font-black uppercase tracking-[0.18em]" style={{ color: theme.color }}>
                    Mission {theme.number}
                  </span>
                  <h3 className="display-font text-xl font-extrabold text-[var(--text)] leading-[1.15]">{ch.title}</h3>
                  <div className="text-[11px] text-[var(--muted)]">
                    {missionDone ? '✓ Đã xong nhiệm vụ' : '• Chưa làm nhiệm vụ'}
                  </div>
                </div>
                <div className="space-y-2 pt-3 relative z-10">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase">
                    <span className={bossDone ? 'text-[var(--green-fg)]' : 'text-[var(--muted)]'}>
                      {bossDone ? '✓ Boss đã hạ' : `Boss: ${ch.boss.name}`}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => navigate('learning', { courseId: course.id, chapterId: ch.id, lessonId: ch.lessons[0]?.id })}
                      className="px-2 py-1.5 rounded bg-[var(--panel-deep)] border border-[var(--line)] hover:border-[var(--yellow)] text-[10px] font-extrabold uppercase text-[var(--text)] cursor-pointer"
                    >
                      Học bài
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('boss-battle', { chapterId: ch.id })}
                      className="px-2 py-1.5 rounded bg-[var(--red-soft)] border border-[var(--red-border)] hover:bg-[var(--red)]/30 text-[10px] font-extrabold uppercase text-[var(--red-fg)] cursor-pointer"
                    >
                      Boss
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom 3-panel summary: Inventory, Wrong Answers, Learning History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Panel>
          <PanelHeader className="flex items-center justify-between">
            <PanelTitle className="flex items-center gap-2"><Backpack className="w-4 h-4 text-[var(--yellow-fg)]" /> Túi đồ ({ownedItems.length})</PanelTitle>
          </PanelHeader>
          <PanelContent className="space-y-2.5">
            {ownedItems.map((item) => (
              <div key={item.id} className="p-3 rounded-xl bg-[var(--panel-deep)] border border-[var(--line)]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[var(--text)]">{item.name}</span>
                  <Badge tone={item.rarity === 'epic' ? 'yellow' : item.rarity === 'rare' ? 'blue' : 'muted'}>{item.rarity}</Badge>
                </div>
                <p className="text-[11px] text-[var(--muted)] mt-1">{item.description}</p>
              </div>
            ))}
          </PanelContent>
        </Panel>

        <Panel>
          <PanelHeader className="flex items-center justify-between">
            <PanelTitle className="flex items-center gap-2"><AlertCircle className="w-4 h-4 text-[var(--red-fg)]" /> Câu sai ({needsReviewWrong.length})</PanelTitle>
          </PanelHeader>
          <PanelContent className="space-y-3">
            {needsReviewWrong.slice(0, 2).map((wa) => {
              const q = state.questions.find((item) => item.id === wa.questionId);
              return q ? (
                <div key={wa.id} className="p-3 rounded-xl bg-[var(--panel-deep)] border border-[var(--red-border)] space-y-1">
                  <div className="text-[10px] mono text-[var(--red-fg)]">{q.knowledgeObjective}</div>
                  <div className="text-xs text-[var(--text)] line-clamp-2">{q.prompt}</div>
                </div>
              ) : null;
            })}
            <Button size="sm" variant="outline" className="w-full" onClick={() => navigate('notes')}>
              Xem Wrong Answers & Giải thích
            </Button>
          </PanelContent>
        </Panel>

        <Panel>
          <PanelHeader>
            <PanelTitle className="flex items-center gap-2"><Clock className="w-4 h-4 text-[var(--blue-fg)]" /> Nhật ký chiến đấu & học tập</PanelTitle>
          </PanelHeader>
          <PanelContent className="space-y-2.5">
            {state.studentHistory.slice(0, 4).map((h) => (
              <div key={h.id} className="p-3 rounded-xl bg-[var(--panel-deep)] border border-[var(--line)] flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs font-bold text-[var(--text)]">{h.action}</div>
                  <div className="text-[11px] text-[var(--muted)]">{h.detail}</div>
                </div>
                <span className="text-[10px] mono text-[var(--muted)] shrink-0">{h.timestamp}</span>
              </div>
            ))}
          </PanelContent>
        </Panel>
      </div>
    </div>
  );
};
