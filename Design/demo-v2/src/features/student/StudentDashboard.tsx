import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Backpack,
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  Shield,
  Sparkles,
  Swords,
} from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { SlideDrawer } from '../../components/ui/Modal';
import { HealthBar, ProgressBar } from '../../components/ui/ProgressBar';
import { Surface, SurfaceContent } from '../../components/ui/Surface';

export const StudentDashboard: React.FC = () => {
  const { state, navigate } = useApp();
  const [heroDrawerOpen, setHeroDrawerOpen] = useState(false);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);

  const course = state.courses.find((c) => c.id === state.activeCourseId) ?? state.courses[0];
  const currentChapter = course.chapters.find((ch) => ch.id === state.activeChapterId) ?? course.chapters[0];

  const allLessons = course.chapters.flatMap((ch) => ch.lessons);
  const completedCount = allLessons.filter((l) => state.completedLessonIds.includes(l.id)).length;
  const courseProgress = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;

  const needsReviewWrong = state.wrongAnswers.filter((w) => w.status === 'needs_review');
  const ownedItems = state.inventoryCatalog.filter((item) => state.hero.inventoryItemIds.includes(item.id));
  const pendingMissionsCount = course.chapters.filter((ch) => !state.completedMissionIds.includes(ch.mission.id)).length;

  return (
    <div className="max-w-4xl mx-auto space-y-7">
      {/* Focused Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
            {course.code} · {course.title}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mt-1">
            Chào {state.demoStudent.name}
          </h1>
        </div>

        {/* Compact on-demand drawers & shortcuts (replaces 6 simultaneous dashboard boxes!) */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            leftIcon={<Shield className="w-3.5 h-3.5 text-[var(--accent-success)]" />}
            onClick={() => setHeroDrawerOpen(true)}
          >
            {state.hero.name} · Lv.{state.hero.level} ({ownedItems.length} vật phẩm)
          </Button>
          <Button
            size="sm"
            variant="secondary"
            leftIcon={<AlertCircle className="w-3.5 h-3.5 text-[var(--accent-danger)]" />}
            onClick={() => navigate('notes')}
          >
            Câu sai ({needsReviewWrong.length})
          </Button>
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<Clock className="w-3.5 h-3.5" />}
            onClick={() => setHistoryDrawerOpen(true)}
          >
            Lịch sử
          </Button>
        </div>
      </div>

      {/* SINGLE PRIMARY FOCUS CARD */}
      <Surface elevated>
        <SurfaceContent className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge tone="primary">Đang học · Chương {currentChapter.order}</Badge>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              {completedCount}/{allLessons.length} bài hoàn thành · {pendingMissionsCount} nhiệm vụ còn lại
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              {currentChapter.title}
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              {currentChapter.summary}
            </p>
          </div>

          <ProgressBar value={courseProgress} label="Tiến độ toàn khóa học" tone="primary" />

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() =>
                navigate('learning', {
                  courseId: course.id,
                  chapterId: currentChapter.id,
                  lessonId: currentChapter.lessons[0]?.id,
                })
              }
            >
              Tiếp tục học bài
            </Button>
            <Button
              size="lg"
              variant="danger"
              leftIcon={<Swords className="w-4 h-4" />}
              onClick={() => navigate('boss-battle', { chapterId: currentChapter.id })}
            >
              Đánh Boss {currentChapter.boss.name}
            </Button>
            <Button
              size="lg"
              variant="outline"
              leftIcon={<FileText className="w-4 h-4" />}
              onClick={() => navigate('notes')}
            >
              Global Notes
            </Button>
          </div>
        </SurfaceContent>
      </Surface>

      {/* Focused Sequential 5-Chapter Roadmap */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">
          Lộ trình 5 chương
        </h3>
        <div className="divide-y divide-[var(--border-subtle)] rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden">
          {course.chapters.map((ch) => {
            const chLessonsDone = ch.lessons.filter((l) => state.completedLessonIds.includes(l.id)).length;
            const missionDone = state.completedMissionIds.includes(ch.mission.id);
            const bossDone = state.bossProgress[ch.id]?.defeated;
            const isCurrent = ch.id === currentChapter.id;

            return (
              <div
                key={ch.id}
                className={`p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isCurrent ? 'bg-[var(--accent-primary-soft)]/35' : ''
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[var(--accent-primary)]">
                      CHƯƠNG {ch.order}
                    </span>
                    <span className="font-bold text-[var(--text-primary)]">{ch.title}</span>
                    {bossDone && (
                      <Badge tone="success" icon={<CheckCircle2 className="w-3 h-3" />}>
                        Đã hạ Boss
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)] flex flex-wrap gap-3">
                    <span>Bài học: {chLessonsDone}/{ch.lessons.length}</span>
                    <span>Nhiệm vụ: {missionDone ? 'Hoàn thành' : 'Chưa làm'}</span>
                    <span>Boss: {ch.boss.name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="secondary"
                    leftIcon={<BookOpen className="w-3.5 h-3.5" />}
                    onClick={() =>
                      navigate('learning', {
                        courseId: course.id,
                        chapterId: ch.id,
                        lessonId: ch.lessons[0]?.id,
                      })
                    }
                  >
                    Học
                  </Button>
                  <Button
                    size="sm"
                    variant={missionDone ? 'ghost' : 'outline'}
                    leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                    onClick={() =>
                      navigate('learning', {
                        courseId: course.id,
                        chapterId: ch.id,
                        lessonId: `mission:${ch.id}`,
                      })
                    }
                  >
                    Nhiệm vụ
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Slide-Over Drawer: Single Hero & Inventory */}
      <SlideDrawer
        open={heroDrawerOpen}
        onClose={() => setHeroDrawerOpen(false)}
        title={`Nhân vật chính · ${state.hero.name}`}
        subtitle={`${state.hero.title} · Level ${state.hero.level}`}
      >
        <div className="flex items-center gap-4">
          <img
            src={state.hero.avatar}
            alt={state.hero.name}
            className="w-20 h-20 rounded-xl object-cover border border-[var(--border-strong)]"
          />
          <div className="flex-1 space-y-2.5">
            <HealthBar label="Hero HP" current={state.hero.hp} max={state.hero.maxHp} variant="hero" />
            <ProgressBar
              value={state.hero.xp}
              max={state.hero.nextLevelXp}
              label={`XP: ${state.hero.xp}/${state.hero.nextLevelXp}`}
              tone="warning"
              size="sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
            <div className="text-xs text-[var(--text-muted)]">Sát thương (ATK)</div>
            <div className="text-lg font-mono font-bold text-[var(--text-primary)]">{state.hero.attack}</div>
          </div>
          <div className="p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
            <div className="text-xs text-[var(--text-muted)]">Giáp (DEF)</div>
            <div className="text-lg font-mono font-bold text-[var(--text-primary)]">{state.hero.defense}</div>
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
            <Backpack className="w-4 h-4" /> Vật phẩm đang sở hữu ({ownedItems.length})
          </div>
          {ownedItems.map((item) => (
            <div key={item.id} className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-[var(--text-primary)]">{item.name}</span>
                <Badge tone={item.rarity === 'epic' ? 'warning' : item.rarity === 'rare' ? 'primary' : 'neutral'}>
                  {item.rarity}
                </Badge>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">{item.description}</p>
            </div>
          ))}
        </div>
      </SlideDrawer>

      {/* Slide-Over Drawer: Learning History */}
      <SlideDrawer
        open={historyDrawerOpen}
        onClose={() => setHistoryDrawerOpen(false)}
        title="Lịch sử học tập gần đây"
      >
        <div className="space-y-2.5">
          {state.studentHistory.map((item) => (
            <div key={item.id} className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-[var(--text-primary)]">{item.action}</span>
                <span className="text-[11px] font-mono text-[var(--text-muted)]">{item.timestamp}</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-1">{item.detail}</p>
            </div>
          ))}
        </div>
      </SlideDrawer>
    </div>
  );
};
