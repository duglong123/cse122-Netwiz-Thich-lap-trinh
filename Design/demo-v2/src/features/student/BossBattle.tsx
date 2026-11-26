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
import { Select } from '../../components/ui/FormControls';
import { SlideDrawer } from '../../components/ui/Modal';
import { HealthBar } from '../../components/ui/ProgressBar';
import { Surface, SurfaceContent } from '../../components/ui/Surface';

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

  for (const wId of wrongIds) {
    const found = chapterQuestions.find((q) => q.id === wId);
    if (found && !usedIds.has(found.id)) {
      deck.push({ question: found, sourceTag: 'retained_wrong' });
      usedIds.add(found.id);
    }
  }

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

  for (const q of chapterQuestions) {
    if (deck.length >= 5) break;
    if (!usedIds.has(q.id) && !passedIds.includes(q.id)) {
      deck.push({ question: q, sourceTag: 'new_challenge' });
      usedIds.add(q.id);
    }
  }

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
  const chapter = course.chapters.find((ch) => ch.id === state.activeChapterId) ?? course.chapters[0];
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
    () => buildBattleDeck(state.questions, chapter.id, chapterProgress.passedQuestionIds, chapterProgress.wrongQuestionIds),
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
  const [wrongEntriesThisRun, setWrongEntriesThisRun] = useState<{ questionId: string; selectedIndex: number }[]>([]);
  const [outcome, setOutcome] = useState<'playing' | 'victory' | 'defeat'>('playing');
  const [itemsDrawerOpen, setItemsDrawerOpen] = useState(false);

  const resetBattle = (nextChapterId?: string) => {
    const targetCh = nextChapterId ? course.chapters.find((c) => c.id === nextChapterId) ?? chapter : chapter;
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
  const ownedItems = state.inventoryCatalog.filter((item) => state.hero.inventoryItemIds.includes(item.id));

  const handleUseItem = (itemId: string) => {
    if (outcome !== 'playing' || submitted || usedItemIds.includes(itemId)) return;
    const item = ownedItems.find((i) => i.id === itemId);
    if (!item) return;

    setUsedItemIds((prev) => [...prev, itemId]);
    setItemsDrawerOpen(false);

    if (item.effectType === 'heal') {
      setHeroHp((hp) => Math.min(state.hero.maxHp, hp + item.effectValue));
      addToast({ type: 'success', title: `Dùng ${item.name}`, message: `Hồi +${item.effectValue} HP` });
    } else if (item.effectType === 'boost') {
      setAttackBoost((b) => b + item.effectValue);
      addToast({ type: 'info', title: `Kích hoạt ${item.name}`, message: `+${item.effectValue} ATK lượt này` });
    } else if (item.effectType === 'hint' && currentEntry) {
      const wrongs = currentEntry.question.options.map((_, idx) => idx).filter((idx) => idx !== currentEntry.question.correctIndex);
      setEliminatedOptions(wrongs.slice(0, item.effectValue));
      addToast({ type: 'info', title: `Dùng ${item.name}`, message: `Đã ẩn ${item.effectValue} đáp án sai` });
    }
  };

  const handleConfirmAnswer = () => {
    if (!currentEntry || selectedOption === null || submitted) return;
    setSubmitted(true);
    const q = currentEntry.question;

    if (selectedOption === q.correctIndex) {
      const dmg = state.hero.attack + attackBoost;
      setAttackBoost(0);
      const nextBossHp = Math.max(0, bossHp - dmg);
      setBossHp(nextBossHp);
      const nextPassed = [...passedIdsThisRun, q.id];
      setPassedIdsThisRun(nextPassed);

      if (nextBossHp <= 0 || questionIdx === deck.length - 1) {
        const won = nextBossHp <= 0 || nextPassed.length >= Math.ceil(deck.length * 0.6);
        const total = nextPassed.length + wrongEntriesThisRun.length;
        const acc = total > 0 ? Math.round((nextPassed.length / total) * 100) : 100;
        if (won) setBossHp(0);
        setOutcome(won ? 'victory' : 'defeat');
        recordBossAttemptResult({
          chapterId: chapter.id,
          defeated: won,
          passedIds: nextPassed,
          wrongEntries: wrongEntriesThisRun,
          accuracy: acc,
          xpEarned: won ? 120 : 25,
        });
      }
    } else {
      const dmgToHero = Math.max(34, boss.attackPower);
      const nextHeroHp = Math.max(0, heroHp - dmgToHero);
      setHeroHp(nextHeroHp);
      const nextWrong = [...wrongEntriesThisRun, { questionId: q.id, selectedIndex: selectedOption }];
      setWrongEntriesThisRun(nextWrong);

      if (nextHeroHp <= 0) {
        const total = passedIdsThisRun.length + nextWrong.length;
        const acc = total > 0 ? Math.round((passedIdsThisRun.length / total) * 100) : 0;
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

  const handleNext = () => {
    if (outcome !== 'playing') return;
    if (questionIdx + 1 >= deck.length) {
      const total = passedIdsThisRun.length + wrongEntriesThisRun.length;
      const acc = total > 0 ? Math.round((passedIdsThisRun.length / total) * 100) : 0;
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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header + Chapter Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Swords className="w-6 h-6 text-[var(--accent-danger)]" />
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Boss Battle</h1>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={chapter.id}
            onChange={(e) => {
              navigate('boss-battle', { chapterId: e.target.value });
              resetBattle(e.target.value);
            }}
            className="w-64"
          >
            {course.chapters.map((ch) => (
              <option key={ch.id} value={ch.id}>
                Chương {ch.order}: {ch.boss.name} {state.bossProgress[ch.id]?.defeated ? '(Đã hạ)' : ''}
              </option>
            ))}
          </Select>
          <Button size="sm" variant="secondary" leftIcon={<Backpack className="w-4 h-4" />} onClick={() => setItemsDrawerOpen(true)}>
            Túi đồ ({ownedItems.length - usedItemIds.length})
          </Button>
        </div>
      </div>

      {/* Compact Versus HUD */}
      <Surface>
        <SurfaceContent className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <img src={state.hero.avatar} alt={state.hero.name} className="w-14 h-14 rounded-xl object-cover border border-[var(--border-strong)]" />
              <div className="flex-1 min-w-0">
                <HealthBar label={`${state.hero.name} (ATK ${state.hero.attack + attackBoost})`} current={heroHp} max={state.hero.maxHp} variant="hero" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <img src={boss.avatar} alt={boss.name} className="w-14 h-14 rounded-xl object-cover border border-[var(--border-strong)]" />
              <div className="flex-1 min-w-0">
                <HealthBar label={`${boss.name} (ATK ${boss.attackPower})`} current={bossHp} max={boss.maxHp} variant="boss" />
              </div>
            </div>
          </div>

          {chapterProgress.attempts > 0 && (
            <div className="text-xs px-3 py-2 rounded-lg bg-[var(--accent-primary-soft)] text-[var(--accent-primary-fg)]">
              <strong>Tái đấu lần #{chapterProgress.attempts + 1}:</strong> Giữ lại {chapterProgress.wrongQuestionIds.length} câu sai để khắc phục; câu đã vượt qua được thay bằng câu mới cùng mục tiêu kiến thức.
            </div>
          )}
        </SurfaceContent>
      </Surface>

      {/* Main Battle Card */}
      {outcome === 'defeat' ? (
        <Surface elevated>
          <SurfaceContent className="p-8 text-center space-y-4">
            <XCircle className="w-12 h-12 mx-auto text-[var(--accent-danger)]" />
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">HP đã về 0 — Cần luyện tập lại</h2>
            <p className="text-sm text-[var(--text-secondary)] max-w-lg mx-auto">
              Các câu trả lời sai đã được lưu vào danh sách <strong>Wrong Answers</strong> kèm lời giải thích đầy đủ.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Button variant="outline" leftIcon={<BookOpen className="w-4 h-4" />} onClick={() => navigate('notes')}>
                Xem câu sai & Ôn tập
              </Button>
              <Button variant="danger" leftIcon={<RotateCcw className="w-4 h-4" />} onClick={() => resetBattle()}>
                Đánh Boss lại (Rematch)
              </Button>
            </div>
          </SurfaceContent>
        </Surface>
      ) : outcome === 'victory' ? (
        <Surface elevated>
          <SurfaceContent className="p-8 text-center space-y-4">
            <Trophy className="w-12 h-12 mx-auto text-[var(--accent-success)]" />
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Đã hạ gục {boss.name}!</h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Chương {chapter.order} đã được giải cứu hoàn toàn.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Button variant="outline" onClick={() => resetBattle()}>Đánh lại để luyện câu mới</Button>
              <Button variant="success" onClick={() => navigate('student-dashboard')}>Về Dashboard</Button>
            </div>
          </SurfaceContent>
        </Surface>
      ) : currentEntry ? (
        <Surface elevated>
          <SurfaceContent className="p-6 sm:p-8 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="primary">Mục tiêu: {currentEntry.question.knowledgeObjective}</Badge>
                {currentEntry.sourceTag === 'retained_wrong' && (
                  <Badge tone="danger" icon={<AlertCircle className="w-3.5 h-3.5" />}>Câu sai trước đó</Badge>
                )}
                {currentEntry.sourceTag === 'swapped_objective' && (
                  <Badge tone="success" icon={<Sparkles className="w-3.5 h-3.5" />}>Câu mới cùng mục tiêu</Badge>
                )}
              </div>
              <span className="text-xs font-mono text-[var(--text-muted)]">
                Câu {questionIdx + 1} / {deck.length}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] leading-snug">
              {currentEntry.question.prompt}
            </h2>

            <div className="space-y-2.5">
              {currentEntry.question.options.map((opt, idx) => {
                const isEliminated = eliminatedOptions.includes(idx);
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentEntry.question.correctIndex;

                let cls = 'bg-[var(--bg-subtle)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--border-strong)]';
                if (isEliminated) {
                  cls = 'bg-[var(--bg-subtle)]/40 border-[var(--border-subtle)] text-[var(--text-muted)] line-through cursor-not-allowed';
                } else if (submitted) {
                  if (isCorrect) cls = 'bg-[var(--accent-success-soft)] border-[var(--accent-success)] text-[var(--accent-success-fg)] font-semibold';
                  else if (isSelected) cls = 'bg-[var(--accent-danger-soft)] border-[var(--accent-danger)] text-[var(--accent-danger-fg)]';
                } else if (isSelected) {
                  cls = 'bg-[var(--accent-primary-soft)] border-[var(--accent-primary)] text-[var(--accent-primary-fg)] font-semibold';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={submitted || isEliminated}
                    onClick={() => setSelectedOption(idx)}
                    className={`w-full p-4 rounded-xl border text-left text-sm sm:text-base flex items-start gap-3 transition-colors ${!submitted && !isEliminated ? 'cursor-pointer' : ''} ${cls}`}
                  >
                    <span className="w-6 h-6 rounded-md bg-[var(--bg-surface)] border border-[var(--border-strong)] font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1">{opt}</span>
                  </button>
                );
              })}
            </div>

            {submitted && (
              <div
                className={`p-4 rounded-xl border space-y-1.5 ${
                  selectedOption === currentEntry.question.correctIndex
                    ? 'bg-[var(--accent-success-soft)] border-[var(--accent-success)]/40 text-[var(--accent-success-fg)]'
                    : 'bg-[var(--accent-danger-soft)] border-[var(--accent-danger)]/40 text-[var(--accent-danger-fg)]'
                }`}
              >
                <div className="font-bold text-sm flex items-center gap-1.5">
                  {selectedOption === currentEntry.question.correctIndex ? (
                    <><CheckCircle2 className="w-4 h-4" /> Chính xác! Gây sát thương lên {boss.name}.</>
                  ) : (
                    <><XCircle className="w-4 h-4" /> Sai rồi! Đã lưu vào Wrong Answers.</>
                  )}
                </div>
                <p className="text-sm text-[var(--text-primary)]">
                  <strong>Giải thích:</strong> {currentEntry.question.explanation}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
              {!submitted ? (
                <Button disabled={selectedOption === null} leftIcon={<Shield className="w-4 h-4" />} onClick={handleConfirmAnswer}>
                  Xác nhận tấn công
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  {questionIdx + 1 >= deck.length ? 'Xem kết quả' : 'Câu tiếp theo →'}
                </Button>
              )}
            </div>
          </SurfaceContent>
        </Surface>
      ) : null}

      <SlideDrawer
        open={itemsDrawerOpen}
        onClose={() => setItemsDrawerOpen(false)}
        title="Túi đồ chiến đấu"
        subtitle="Sử dụng trước khi xác nhận đáp án"
      >
        <div className="space-y-3">
          {ownedItems.map((item) => {
            const used = usedItemIds.includes(item.id);
            return (
              <div key={item.id} className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-sm text-[var(--text-primary)]">{item.name}</span>
                  <Badge tone={used ? 'neutral' : 'warning'}>{used ? 'Đã dùng' : 'Sẵn sàng'}</Badge>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">{item.description}</p>
                <Button size="sm" variant="secondary" className="w-full" disabled={used || submitted} onClick={() => handleUseItem(item.id)}>
                  {used ? 'Đã kích hoạt' : 'Sử dụng vật phẩm'}
                </Button>
              </div>
            );
          })}
        </div>
      </SlideDrawer>
    </div>
  );
};
