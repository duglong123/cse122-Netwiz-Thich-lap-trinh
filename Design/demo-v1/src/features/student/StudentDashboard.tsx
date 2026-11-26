import React from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { HealthBar, ProgressBar } from '../../components/ui/ProgressBar';

export const StudentDashboard: React.FC = () => {
  const { state, navigate } = useApp();
  const course = state.courses.find((c) => c.id === state.activeCourseId) ?? state.courses[0];
  const currentChapter =
    course.chapters.find((ch) => ch.id === state.activeChapterId) ?? course.chapters[0];

  const allLessons = course.chapters.flatMap((ch) => ch.lessons);
  const completedLessonsCount = allLessons.filter((l) =>
    state.completedLessonIds.includes(l.id),
  ).length;
  const courseProgress =
    allLessons.length > 0 ? Math.round((completedLessonsCount / allLessons.length) * 100) : 0;

  const pendingMissions = course.chapters.filter(
    (ch) => !state.completedMissionIds.includes(ch.mission.id),
  );
  const needsReviewWrong = state.wrongAnswers.filter((w) => w.status === 'needs_review');
  const ownedItems = state.inventoryCatalog.filter((item) =>
    state.hero.inventoryItemIds.includes(item.id),
  );
  const globalNotesCount = state.notes.filter((n) => n.scope === 'global').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Xin chào, {state.demoStudent.name}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Tiếp tục hành trình bảo vệ hệ thống mạng cùng <strong className="text-blue-400">{state.hero.name}</strong>.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            leftIcon={<FileText className="w-4 h-4" />}
            onClick={() => navigate('notes')}
          >
            Global Notes ({globalNotesCount})
          </Button>
          <Button
            leftIcon={<BookOpen className="w-4 h-4" />}
            onClick={() =>
              navigate('learning', {
                courseId: course.id,
                chapterId: currentChapter.id,
                lessonId: currentChapter.lessons[0]?.id,
              })
            }
          >
            Tiếp tục Chương {currentChapter.order}
          </Button>
        </div>
      </div>

      {/* Top Grid: Course Progress + Single Hero Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <Card className="lg:col-span-7 bg-tactical-grid">
          <CardContent className="p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Badge tone="cobalt">{course.code} · Khóa học đang tham gia</Badge>
              <span className="text-xs font-mono text-slate-400">
                {completedLessonsCount}/{allLessons.length} bài học hoàn thành
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">{course.title}</h2>
              <p className="text-sm text-slate-400 mt-1">{course.subtitle}</p>
            </div>

            <ProgressBar
              value={courseProgress}
              label={`Tiến độ tổng thể · Đang học Chương ${currentChapter.order}: ${currentChapter.title}`}
              tone="cobalt"
            />

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-1">
              {course.chapters.map((ch) => {
                const bossProg = state.bossProgress[ch.id];
                const isCurrent = ch.id === currentChapter.id;
                const isDone = bossProg?.defeated;
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() =>
                      navigate('learning', {
                        courseId: course.id,
                        chapterId: ch.id,
                        lessonId: ch.lessons[0]?.id,
                      })
                    }
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-blue-600/20 border-blue-500/50 text-white'
                        : isDone
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                          : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span>CH.{ch.order}</span>
                      {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <div className="text-xs font-medium mt-1 line-clamp-1">{ch.title}</div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Single Hero Card (no hero selection) */}
        <Card className="lg:col-span-5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Nhân vật chính · {state.hero.name}</span>
            </CardTitle>
            <Badge tone="emerald">Level {state.hero.level}</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={state.hero.avatar}
                alt={state.hero.name}
                className="w-20 h-20 rounded-xl object-cover border border-blue-500/40 shrink-0"
              />
              <div className="flex-1 min-w-0 space-y-2.5">
                <HealthBar
                  label="Hero HP"
                  current={state.hero.hp}
                  max={state.hero.maxHp}
                  variant="hero"
                />
                <ProgressBar
                  value={state.hero.xp}
                  max={state.hero.nextLevelXp}
                  label={`Kinh nghiệm (${state.hero.xp}/${state.hero.nextLevelXp} XP)`}
                  tone="amber"
                  size="sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-[11px] text-slate-400">ATK (Sát thương)</div>
                <div className="text-base font-mono font-bold text-blue-400">{state.hero.attack}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-[11px] text-slate-400">DEF (Giáp)</div>
                <div className="text-base font-mono font-bold text-emerald-400">{state.hero.defense}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-[11px] text-slate-400">Boss đã hạ</div>
                <div className="text-base font-mono font-bold text-amber-400">
                  {Object.values(state.bossProgress).filter((b) => b.defeated).length}/{course.chapters.length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Middle Grid: Pending Missions & Boss + Inventory + Wrong Answers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Pending Missions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Nhiệm vụ & Boss cần hoàn thành</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingMissions.length === 0 ? (
              <div className="text-sm text-emerald-300">
                Bạn đã hoàn thành toàn bộ nhiệm vụ giữa chương!
              </div>
            ) : (
              pendingMissions.slice(0, 3).map((ch) => (
                <div
                  key={ch.id}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-[11px] font-mono text-amber-400">CHƯƠNG {ch.order} · NHIỆM VỤ</div>
                    <div className="text-sm font-medium text-white truncate">{ch.mission.title}</div>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      navigate('learning', {
                        courseId: course.id,
                        chapterId: ch.id,
                        lessonId: `mission:${ch.id}`,
                      })
                    }
                  >
                    Làm ngay
                  </Button>
                </div>
              ))
            )}

            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[11px] font-mono text-rose-300">BOSS HIỆN TẠI · CHƯƠNG {currentChapter.order}</div>
                <div className="text-sm font-semibold text-white truncate">{currentChapter.boss.name}</div>
              </div>
              <Button
                size="sm"
                variant="danger"
                leftIcon={<Swords className="w-3.5 h-3.5" />}
                onClick={() => navigate('boss-battle', { chapterId: currentChapter.id })}
              >
                Đánh Boss
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Inventory */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2">
              <Backpack className="w-4 h-4 text-blue-400" />
              <span>Vật phẩm đang sở hữu</span>
            </CardTitle>
            <Badge tone="cobalt">{ownedItems.length} vật phẩm</Badge>
          </CardHeader>
          <CardContent className="space-y-2.5 max-h-72 overflow-y-auto">
            {ownedItems.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-white">{item.name}</span>
                  <Badge
                    tone={item.rarity === 'epic' ? 'amber' : item.rarity === 'rare' ? 'cobalt' : 'slate'}
                  >
                    {item.rarity}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400">{item.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Wrong Answers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>Câu hỏi trả lời sai</span>
            </CardTitle>
            <Badge tone={needsReviewWrong.length > 0 ? 'rose' : 'emerald'}>
              {needsReviewWrong.length} cần ôn
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {needsReviewWrong.length === 0 ? (
              <div className="text-sm text-emerald-300">
                Tuyệt vời! Bạn đã khắc phục tất cả câu hỏi từng trả lời sai.
              </div>
            ) : (
              needsReviewWrong.slice(0, 2).map((wa) => {
                const q = state.questions.find((item) => item.id === wa.questionId);
                if (!q) return null;
                return (
                  <div key={wa.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                    <div className="text-xs font-mono text-rose-300">
                      {q.chapterId.toUpperCase()} · {q.knowledgeObjective}
                    </div>
                    <div className="text-xs text-slate-200 line-clamp-2">{q.prompt}</div>
                  </div>
                );
              })
            )}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              onClick={() => navigate('notes')}
            >
              Mở danh sách Wrong Answers & Giải thích
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Learning History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Lịch sử học tập gần đây</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-slate-800/80 p-0">
          {state.studentHistory.slice(0, 5).map((item) => (
            <div key={item.id} className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="text-sm font-medium text-white">{item.action}</div>
                <div className="text-xs text-slate-400">{item.detail}</div>
              </div>
              <span className="text-xs font-mono text-slate-500 shrink-0">{item.timestamp}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
