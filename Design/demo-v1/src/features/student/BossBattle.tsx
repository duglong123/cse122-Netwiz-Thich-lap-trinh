import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  Backpack,
  BookOpen,
  CheckCircle2,
  RotateCcw,
  Shield,
  Sparkles,
  Swords,
  Trophy,
  XCircle,
} from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { Question } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { HealthBar } from '../../components/ui/ProgressBar';

interface BattleQuestionEntry {
  question: Question;
  sourceTag: 'retained_wrong' | 'swapped_objective' | 'new_challenge';
}

function buildBattleDeck(
  allQuestions: Question[],
  chapterId: string,
  passedIds: string[],
  wrongIds: string[],
): BattleQuestionEntry[] {
  const chapterQuestions = allQuestions.filter((q) => q.chapterId === chapterId);
  const deck: BattleQuestionEntry[] = [];
  const usedIds = new Set<string>();

  // 1. Retain previously wrong questions first so student can overcome them
  for (const wId of wrongIds) {
    const found = chapterQuestions.find((q) => q.id === wId);
    if (found && !usedIds.has(found.id)) {
      deck.push({ question: found, sourceTag: 'retained_wrong' });
      usedIds.add(found.id);
    }
  }

  // 2. For previously passed questions, swap with a DIFFERENT question sharing the same knowledgeObjective
  for (const pId of passedIds) {
    const oldQ = chapterQuestions.find((q) => q.id === pId);
    if (!oldQ) continue;
    const freshSameObjective = chapterQuestions.find(
      (q) =>
        q.knowledgeObjective === oldQ.knowledgeObjective &&
        q.id !== oldQ.id &&
        !usedIds.has(q.id) &&
        !passedIds.includes(q.id),
    );
    if (freshSameObjective) {
      deck.push({ question: freshSameObjective, sourceTag: 'swapped_objective' });
      usedIds.add(freshSameObjective.id);
    }
  }

  // 3. Fill up to 4-5 questions with remaining chapter questions (avoiding passed ones first)
  for (const q of chapterQuestions) {
    if (deck.length >= 5) break;
    if (!usedIds.has(q.id) && !passedIds.includes(q.id)) {
      deck.push({ question: q, sourceTag: 'new_challenge' });
      usedIds.add(q.id);
    }
  }

  // Fallback if all chapter questions were already passed once
  for (const q of chapterQuestions) {
    if (deck.length >= Math.min(4, chapterQuestions.length)) break;
    if (!usedIds.has(q.id)) {
      deck.push({ question: q, sourceTag: 'swapped_objective' });
      usedIds.add(q.id);
    }
  }

  return deck;
}

export const BossBattle: React.FC = () => {
  const { state, navigate, recordBossAttemptResult, addToast } = useApp();
  const course = state.courses.find((c) => c.id === state.activeCourseId) ?? state.courses[0];
  const chapter =
    course.chapters.find((ch) => ch.id === state.activeChapterId) ?? course.chapters[0];
  const boss = chapter.boss;
  const chapterProgress = state.bossProgress[chapter.id] ?? {
    chapterId: chapter.id,
    defeated: false,
    attempts: 0,
    passedQuestionIds: [],
    wrongQuestionIds: [],
    bestAccuracy: 0,
  };

  const [battleSeed, setBattleSeed] = useState(0);
  const deck = useMemo(
    () =>
      buildBattleDeck(
        state.questions,
        chapter.id,
        chapterProgress.passedQuestionIds,
        chapterProgress.wrongQuestionIds,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chapter.id, battleSeed],
  );

  const [heroHp, setHeroHp] = useState(state.hero.maxHp);
  const [bossHp, setBossHp] = useState(boss.maxHp);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [attackBoost, setAttackBoost] = useState(0);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [usedItemIds, setUsedItemIds] = useState<string[]>([]);
  const [passedIdsThisRun, setPassedIdsThisRun] = useState<string[]>([]);
  const [wrongEntriesThisRun, setWrongEntriesThisRun] = useState<
    { questionId: string; selectedIndex: number }[]
  >([]);
  const [outcome, setOutcome] = useState<'playing' | 'victory' | 'defeat'>('playing');

  const resetBattle = (nextChapterId?: string) => {
    const targetCh = nextChapterId
      ? course.chapters.find((c) => c.id === nextChapterId) ?? chapter
      : chapter;
    setHeroHp(state.hero.maxHp);
    setBossHp(targetCh.boss.maxHp);
    setQuestionIdx(0);
    setSelectedOption(null);
    setSubmitted(false);
    setAttackBoost(0);
    setEliminatedOptions([]);
    setUsedItemIds([]);
    setPassedIdsThisRun([]);
    setWrongEntriesThisRun([]);
    setOutcome('playing');
    setBattleSeed((s) => s + 1);
  };

  const currentEntry = deck[questionIdx];
  const ownedItems = state.inventoryCatalog.filter((item) =>
    state.hero.inventoryItemIds.includes(item.id),
  );

  const handleUseItem = (itemId: string) => {
    if (outcome !== 'playing' || submitted || usedItemIds.includes(itemId)) return;
    const item = ownedItems.find((i) => i.id === itemId);
    if (!item) return;

    setUsedItemIds((prev) => [...prev, itemId]);

    if (item.effectType === 'heal') {
      setHeroHp((hp) => Math.min(state.hero.maxHp, hp + item.effectValue));
      addToast({ type: 'success', title: `Dùng ${item.name}`, message: `Hồi phục +${item.effectValue} HP!` });
    } else if (item.effectType === 'boost') {
      setAttackBoost((b) => b + item.effectValue);
      addToast({ type: 'info', title: `Kích hoạt ${item.name}`, message: `+${item.effectValue} sát thương cho câu trả lời đúng!` });
    } else if (item.effectType === 'hint' && currentEntry) {
      const wrongIndices = currentEntry.question.options
        .map((_, idx) => idx)
        .filter((idx) => idx !== currentEntry.question.correctIndex);
      setEliminatedOptions(wrongIndices.slice(0, item.effectValue));
      addToast({ type: 'info', title: `Dùng ${item.name}`, message: `Đã loại bỏ ${item.effectValue} đáp án gây nhiễu.` });
    }
  };

  const handleConfirmAnswer = () => {
    if (!currentEntry || selectedOption === null || submitted) return;
    setSubmitted(true);
    const q = currentEntry.question;
    const isCorrect = selectedOption === q.correctIndex;

    if (isCorrect) {
      const dmg = state.hero.attack + attackBoost;
      setAttackBoost(0);
      const nextBossHp = Math.max(0, bossHp - dmg);
      setBossHp(nextBossHp);
      const nextPassed = [...passedIdsThisRun, q.id];
      setPassedIdsThisRun(nextPassed);

      if (nextBossHp <= 0 || questionIdx === deck.length - 1) {
        const finalDefeat = nextBossHp <= 0 || nextPassed.length >= Math.ceil(deck.length * 0.6);
        const totalAnswered = nextPassed.length + wrongEntriesThisRun.length;
        const acc = totalAnswered > 0 ? Math.round((nextPassed.length / totalAnswered) * 100) : 100;
        if (nextBossHp <= 0) {
          setOutcome('victory');
          recordBossAttemptResult({
            chapterId: chapter.id,
            defeated: true,
            passedIds: nextPassed,
            wrongEntries: wrongEntriesThisRun,
            accuracy: acc,
            xpEarned: 120,
          });
        } else if (questionIdx === deck.length - 1) {
          // If last question finished and boss still alive, victory if >= 60% & boss HP low, otherwise defeat
          setOutcome(finalDefeat ? 'victory' : 'defeat');
          if (finalDefeat) setBossHp(0);
          recordBossAttemptResult({
            chapterId: chapter.id,
            defeated: finalDefeat,
            passedIds: nextPassed,
            wrongEntries: wrongEntriesThisRun,
            accuracy: acc,
            xpEarned: finalDefeat ? 100 : 25,
          });
        }
      }
    } else {
      const dmgToHero = Math.max(34, boss.attackPower);
      const nextHeroHp = Math.max(0, heroHp - dmgToHero);
      setHeroHp(nextHeroHp);
      const nextWrong = [...wrongEntriesThisRun, { questionId: q.id, selectedIndex: selectedOption }];
      setWrongEntriesThisRun(nextWrong);

      if (nextHeroHp <= 0) {
        const totalAnswered = passedIdsThisRun.length + nextWrong.length;
        const acc = totalAnswered > 0 ? Math.round((passedIdsThisRun.length / totalAnswered) * 100) : 0;
        setOutcome('defeat');
        recordBossAttemptResult({
          chapterId: chapter.id,
          defeated: false,
          passedIds: passedIdsThisRun,
          wrongEntries: nextWrong,
          accuracy: acc,
          xpEarned: 20,
        });
      }
    }
  };

  const handleNextQuestion = () => {
    if (outcome !== 'playing') return;
    if (questionIdx + 1 >= deck.length) {
      const totalAnswered = passedIdsThisRun.length + wrongEntriesThisRun.length;
      const acc = totalAnswered > 0 ? Math.round((passedIdsThisRun.length / totalAnswered) * 100) : 0;
      const won = bossHp <= 0 || passedIdsThisRun.length >= Math.ceil(deck.length * 0.6);
      setOutcome(won ? 'victory' : 'defeat');
      recordBossAttemptResult({
        chapterId: chapter.id,
        defeated: won,
        passedIds: passedIdsThisRun,
        wrongEntries: wrongEntriesThisRun,
        accuracy: acc,
        xpEarned: won ? 100 : 20,
      });
      return;
    }
    setQuestionIdx((i) => i + 1);
    setSelectedOption(null);
    setSubmitted(false);
    setEliminatedOptions([]);
  };

  return (
    <div className="space-y-6">
      {/* Boss Chapter Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
            <Swords className="w-7 h-7 text-rose-400" />
            <span>Boss Battle · Chương {chapter.order}</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Trả lời đúng để gây sát thương. Câu trả lời sai luôn đi kèm giải thích và được lưu vào Wrong Answers.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {course.chapters.map((ch) => {
            const active = ch.id === chapter.id;
            const defeated = state.bossProgress[ch.id]?.defeated;
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => {
                  navigate('boss-battle', { chapterId: ch.id });
                  resetBattle(ch.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors cursor-pointer ${
                  active
                    ? 'bg-rose-600/25 border-rose-500 text-rose-200'
                    : defeated
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                CH.{ch.order} {defeated ? '✓' : ''}
              </button>
            );
          })}
        </div>
      </div>

      {/* Arena Stage: Hero vs Boss */}
      <Card className="bg-tactical-grid">
        <CardContent className="p-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-11 gap-5 items-center">
            {/* Hero */}
            <div className="md:col-span-5 p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30 flex items-center gap-4">
              <img
                src={state.hero.avatar}
                alt={state.hero.name}
                className="w-20 h-20 rounded-xl object-cover border border-emerald-500/50 shrink-0"
              />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-white">{state.hero.name}</span>
                  <Badge tone="emerald">ATK {state.hero.attack + attackBoost}</Badge>
                </div>
                <HealthBar label="Hero HP" current={heroHp} max={state.hero.maxHp} variant="hero" />
              </div>
            </div>

            {/* VS Divider */}
            <div className="md:col-span-1 flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center font-mono text-xs font-bold text-amber-400">
                VS
              </div>
              <span className="text-[11px] font-mono text-slate-400 mt-1">
                Lượt {Math.min(questionIdx + 1, deck.length)}/{deck.length}
              </span>
            </div>

            {/* Boss */}
            <div className="md:col-span-5 p-4 rounded-xl bg-slate-900/90 border border-rose-500/30 flex items-center gap-4">
              <img
                src={boss.avatar}
                alt={boss.name}
                className="w-20 h-20 rounded-xl object-cover border border-rose-500/50 shrink-0"
              />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-white truncate">{boss.name}</span>
                  <Badge tone="rose">ATK {boss.attackPower}</Badge>
                </div>
                <HealthBar label="Boss HP" current={bossHp} max={boss.maxHp} variant="boss" />
                <div className="text-[11px] text-slate-400 truncate">Đặc điểm: {boss.trait}</div>
              </div>
            </div>
          </div>

          {/* Rematch status bar */}
          {chapterProgress.attempts > 0 && (
            <div className="mt-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/25 text-xs text-blue-200 flex flex-wrap items-center justify-between gap-2">
              <span>
                <strong>Cơ chế đánh lại (Lần #{chapterProgress.attempts + 1}):</strong>{' '}
                {chapterProgress.wrongQuestionIds.length} câu trả lời sai trước đây được giữ lại để khắc phục; các câu đã trả lời đúng được thay bằng câu mới cùng mục tiêu kiến thức.
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Battle Outcome OR Active Question */}
      {outcome === 'defeat' ? (
        <Card className="border-rose-500/50">
          <CardContent className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/15 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <XCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-2xl font-bold text-white">HP đã về 0 — Trận đấu tạm dừng</h2>
              <p className="text-sm text-slate-300 max-w-xl mx-auto">
                {boss.name} đã đánh bại {state.hero.name}. Các câu trả lời sai đã được lưu vào danh sách{' '}
                <strong>Wrong Answers</strong> kèm lời giải thích chi tiết để bạn ôn luyện trước khi tái đấu.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="outline"
                leftIcon={<BookOpen className="w-4 h-4" />}
                onClick={() => navigate('notes')}
              >
                Quay lại luyện tập & Xem câu sai
              </Button>
              <Button
                variant="danger"
                leftIcon={<RotateCcw className="w-4 h-4" />}
                onClick={() => resetBattle()}
              >
                Đánh Boss lại (Rematch)
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : outcome === 'victory' ? (
        <Card className="border-emerald-500/50">
          <CardContent className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Trophy className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-2xl font-bold text-white">Chiến thắng {boss.name}!</h2>
              <p className="text-sm text-slate-300 max-w-xl mx-auto">
                Bạn đã bảo vệ thành công Chương {chapter.order}: {chapter.title} và nhận được kinh nghiệm cho {state.hero.name}.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button variant="outline" onClick={() => resetBattle()}>
                Đánh lại để luyện thêm (Câu hỏi mới)
              </Button>
              <Button
                variant="success"
                onClick={() => {
                  const nextCh = course.chapters.find((c) => c.order === chapter.order + 1);
                  if (nextCh) {
                    navigate('learning', {
                      courseId: course.id,
                      chapterId: nextCh.id,
                      lessonId: nextCh.lessons[0]?.id,
                    });
                  } else {
                    navigate('student-dashboard');
                  }
                }}
              >
                Tiếp tục chương kế tiếp →
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : currentEntry ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Question Card */}
          <Card className="lg:col-span-8">
            <CardContent className="p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge tone="cobalt">Mục tiêu: {currentEntry.question.knowledgeObjective}</Badge>
                  {currentEntry.sourceTag === 'retained_wrong' && (
                    <Badge tone="rose" icon={<AlertCircle className="w-3.5 h-3.5" />}>
                      Câu sai từ lần trước (Giữ lại)
                    </Badge>
                  )}
                  {currentEntry.sourceTag === 'swapped_objective' && (
                    <Badge tone="emerald" icon={<Sparkles className="w-3.5 h-3.5" />}>
                      Câu mới cùng mục tiêu kiến thức
                    </Badge>
                  )}
                </div>
                <span className="text-xs font-mono text-slate-400">
                  Câu {questionIdx + 1} / {deck.length}
                </span>
              </div>

              <h2 className="text-lg font-bold text-white leading-snug">
                {currentEntry.question.prompt}
              </h2>

              <div className="space-y-2.5">
                {currentEntry.question.options.map((opt, idx) => {
                  const isEliminated = eliminatedOptions.includes(idx);
                  const isSelected = selectedOption === idx;
                  const isCorrectOpt = idx === currentEntry.question.correctIndex;

                  let style = 'bg-slate-900 border-slate-800 hover:border-slate-600 text-slate-200';
                  if (isEliminated) {
                    style = 'bg-slate-900/30 border-slate-800/40 text-slate-600 line-through cursor-not-allowed';
                  } else if (submitted) {
                    if (isCorrectOpt) {
                      style = 'bg-emerald-500/15 border-emerald-500 text-emerald-200';
                    } else if (isSelected) {
                      style = 'bg-rose-500/15 border-rose-500 text-rose-200';
                    }
                  } else if (isSelected) {
                    style = 'bg-blue-600/20 border-blue-400 text-white ring-1 ring-blue-400';
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={submitted || isEliminated}
                      onClick={() => setSelectedOption(idx)}
                      className={`w-full p-4 rounded-xl border text-left text-sm flex items-start gap-3 transition-all ${
                        !submitted && !isEliminated ? 'cursor-pointer' : ''
                      } ${style}`}
                    >
                      <span className="w-6 h-6 rounded-md bg-slate-800 border border-slate-700 font-mono text-xs flex items-center justify-center shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Mandatory Explanation Feedback */}
              {submitted && (
                <div
                  className={`p-4 rounded-xl border space-y-2 ${
                    selectedOption === currentEntry.question.correctIndex
                      ? 'bg-emerald-500/10 border-emerald-500/40'
                      : 'bg-rose-500/10 border-rose-500/40'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {selectedOption === currentEntry.question.correctIndex ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-300">
                          Chính xác! Gây sát thương lên {boss.name}.
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-400" />
                        <span className="text-rose-300">
                          Chưa chính xác! Đã lưu vào Wrong Answers và nhận sát thương phản công.
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    <strong>Giải thích:</strong> {currentEntry.question.explanation}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
                {!submitted ? (
                  <Button
                    disabled={selectedOption === null}
                    leftIcon={<Shield className="w-4 h-4" />}
                    onClick={handleConfirmAnswer}
                  >
                    Tung đòn trả lời
                  </Button>
                ) : (
                  <Button onClick={handleNextQuestion}>
                    {questionIdx + 1 >= deck.length ? 'Xem kết quả trận đấu' : 'Sang câu tiếp theo →'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Inventory Support Panel */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Backpack className="w-4 h-4 text-blue-400" />
                <span>Vật phẩm hỗ trợ chiến đấu</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {ownedItems.map((item) => {
                const used = usedItemIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-white">{item.name}</span>
                      <Badge tone={used ? 'slate' : 'amber'}>{used ? 'Đã dùng' : 'Sẵn sàng'}</Badge>
                    </div>
                    <p className="text-xs text-slate-400">{item.description}</p>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-full"
                      disabled={used || submitted}
                      onClick={() => handleUseItem(item.id)}
                    >
                      {used ? 'Đã kích hoạt' : 'Sử dụng ngay'}
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
};
