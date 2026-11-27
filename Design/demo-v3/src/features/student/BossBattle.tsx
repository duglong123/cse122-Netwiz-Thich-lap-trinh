import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  Backpack,
  BookOpen,
  Flame,
  RotateCcw,
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
import { Eyebrow } from '../../components/ui/Panel';
import { BossHealthBar, HeroHealthBar } from '../../components/ui/ProgressBar';

interface BattleQuestionEntry {
  question: Question;
  sourceTag: 'retained_wrong' | 'swapped_objective' | 'new_challenge';
}

function buildBattleDeck(
  allQuestions: Question[],
  chapterId: string,
  passedIds: string[],
  wrongIds: string[],
  isFinalBoss: boolean,
): BattleQuestionEntry[] {
  const chapterQuestions = allQuestions.filter((q) => q.chapterId === chapterId);
  const targetSize = isFinalBoss ? Math.min(6, chapterQuestions.length) : Math.min(5, chapterQuestions.length);
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
    if (deck.length >= targetSize) break;
    if (!usedIds.has(q.id) && !passedIds.includes(q.id)) {
      deck.push({ question: q, sourceTag: 'new_challenge' });
      usedIds.add(q.id);
    }
  }

  for (const q of chapterQuestions) {
    if (deck.length >= Math.min(targetSize, chapterQuestions.length)) break;
    if (!usedIds.has(q.id)) {
      deck.push({ question: q, sourceTag: 'swapped_objective' });
      usedIds.add(q.id);
    }
  }

  return deck;
}

const CONFETTI_COLORS = ['#f4d35e', '#4da3ff', '#45d483', '#ef6262', '#ffffff'];

export const BossBattle: React.FC = () => {
  const { state, navigate, recordBossAttemptResult, addToast } = useApp();
  const course = state.courses.find((c) => c.id === state.activeCourseId) ?? state.courses[0];
  const chapter = course.chapters.find((ch) => ch.id === state.activeChapterId) ?? course.chapters[0];
  const boss = chapter.boss;
  const isFinalBoss = chapter.order === 5;
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
        isFinalBoss,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chapter.id, battleSeed, state.questions, isFinalBoss],
  );

  const [phase, setPhase] = useState<'intro' | 'fighting' | 'victory' | 'defeat'>('intro');
  const [heroHp, setHeroHp] = useState(state.hero.maxHp);
  const [bossHp, setBossHp] = useState(boss.maxHp);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [combo, setCombo] = useState(0);
  const [attackBoost, setAttackBoost] = useState(0);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [usedItemIds, setUsedItemIds] = useState<string[]>([]);
  const [passedIdsThisRun, setPassedIdsThisRun] = useState<string[]>([]);
  const [wrongEntriesThisRun, setWrongEntriesThisRun] = useState<{ questionId: string; selectedIndex: number }[]>([]);
  const [lastHpImpact, setLastHpImpact] = useState<string>('');

  const [bossAnim, setBossAnim] = useState<'idle' | 'hit' | 'attack'>('idle');
  const [arenaShake, setArenaShake] = useState(false);
  const [arenaFlash, setArenaFlash] = useState<'none' | 'yellow' | 'red'>('none');
  const [damagePopup, setDamagePopup] = useState<{ key: number; label: string } | null>(null);
  const [heroPopup, setHeroPopup] = useState<{ key: number; label: string; tone: 'heal' | 'hurt' } | null>(null);

  const timersRef = useRef<number[]>([]);
  const clearAllTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  };
  const scheduleTimer = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
  };

  useEffect(() => () => clearAllTimers(), []);

  const resetBattle = (nextChapterId?: string, startImmediately = false) => {
    clearAllTimers();
    const targetCh = nextChapterId ? course.chapters.find((c) => c.id === nextChapterId) ?? chapter : chapter;
    setHeroHp(state.hero.maxHp);
    setBossHp(targetCh.boss.maxHp);
    setQuestionIdx(0);
    setSelectedOption(null);
    setSubmitted(false);
    setCombo(0);
    setAttackBoost(0);
    setEliminatedOptions([]);
    setUsedItemIds([]);
    setPassedIdsThisRun([]);
    setWrongEntriesThisRun([]);
    setLastHpImpact('');
    setBossAnim('idle');
    setArenaShake(false);
    setArenaFlash('none');
    setDamagePopup(null);
    setHeroPopup(null);
    setPhase(startImmediately ? 'fighting' : 'intro');
    setBattleSeed((s) => s + 1);
  };

  const currentEntry = deck[questionIdx];
  const ownedItems = state.inventoryCatalog.filter((item) => state.hero.inventoryItemIds.includes(item.id));
  const isBossEnraged = bossHp > 0 && bossHp <= boss.maxHp * 0.5;
  const effectiveBossAtk = isBossEnraged ? Math.round(boss.attackPower * 1.25) : boss.attackPower;

  const triggerHitEffects = (dmgLabel: string) => {
    setBossAnim('hit');
    setArenaFlash('yellow');
    setDamagePopup({ key: Date.now(), label: dmgLabel });
    scheduleTimer(() => {
      setBossAnim('idle');
      setArenaFlash('none');
    }, 450);
    scheduleTimer(() => setDamagePopup(null), 860);
  };

  const triggerCounterEffects = (dmgToHero: number) => {
    setBossAnim('attack');
    setArenaShake(true);
    setArenaFlash('red');
    setHeroPopup({ key: Date.now(), label: `-${dmgToHero} HP`, tone: 'hurt' });
    scheduleTimer(() => {
      setBossAnim('idle');
      setArenaShake(false);
      setArenaFlash('none');
    }, 480);
    scheduleTimer(() => setHeroPopup(null), 900);
  };

  const handleUseItem = (itemId: string) => {
    if (phase !== 'fighting' || submitted || usedItemIds.includes(itemId)) return;
    const item = ownedItems.find((i) => i.id === itemId);
    if (!item) return;

    setUsedItemIds((prev) => [...prev, itemId]);

    if (item.effectType === 'heal') {
      setHeroHp((hp) => Math.min(state.hero.maxHp, hp + item.effectValue));
      setHeroPopup({ key: Date.now(), label: `+${item.effectValue} HP`, tone: 'heal' });
      scheduleTimer(() => setHeroPopup(null), 900);
      addToast({ type: 'success', title: `Dùng ${item.name}`, message: `Hồi phục +${item.effectValue} HP` });
    } else if (item.effectType === 'boost') {
      setAttackBoost((b) => b + item.effectValue);
      addToast({ type: 'warning', title: `Nạp ${item.name}`, message: `+${item.effectValue} sát thương đòn kế tiếp!` });
    } else if (item.effectType === 'hint' && currentEntry) {
      const wrongs = currentEntry.question.options.map((_, idx) => idx).filter((idx) => idx !== currentEntry.question.correctIndex);
      setEliminatedOptions(wrongs.slice(0, item.effectValue));
      addToast({ type: 'info', title: `Quét ${item.name}`, message: `Đã vô hiệu hóa ${item.effectValue} đáp án nhiễu` });
    }
  };

  const handleConfirm = (optionIdx: number) => {
    if (!currentEntry || submitted || phase !== 'fighting') return;
    setSelectedOption(optionIdx);
    setSubmitted(true);
    const q = currentEntry.question;

    if (optionIdx === q.correctIndex) {
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      const comboBonus = nextCombo >= 2 ? 6 * (nextCombo - 1) : 0;
      const dmg = state.hero.attack + attackBoost + comboBonus;
      setAttackBoost(0);
      const nextBossHp = Math.max(0, bossHp - dmg);
      setBossHp(nextBossHp);
      setLastHpImpact(`Gây ${dmg} sát thương${nextCombo >= 2 ? ` (Combo ×${nextCombo})` : ''}`);
      triggerHitEffects(nextCombo >= 2 ? `CRIT -${dmg}!` : `-${dmg}`);

      const nextPassed = [...passedIdsThisRun, q.id];
      setPassedIdsThisRun(nextPassed);

      if (nextBossHp <= 0) {
        const total = nextPassed.length + wrongEntriesThisRun.length;
        const acc = total > 0 ? Math.round((nextPassed.length / total) * 100) : 100;
        recordBossAttemptResult({
          chapterId: chapter.id,
          defeated: true,
          passedIds: nextPassed,
          wrongEntries: wrongEntriesThisRun,
          accuracy: acc,
          xpEarned: isFinalBoss ? 180 : 130,
        });
      }
    } else {
      setCombo(0);
      const dmgToHero = Math.max(34, effectiveBossAtk);
      const nextHeroHp = Math.max(0, heroHp - dmgToHero);
      setHeroHp(nextHeroHp);
      setLastHpImpact(`Mất ${dmgToHero} HP${isBossEnraged ? ' (Boss Cuồng nộ +25%)' : ''}`);
      triggerCounterEffects(dmgToHero);

      const nextWrong = [...wrongEntriesThisRun, { questionId: q.id, selectedIndex: optionIdx }];
      setWrongEntriesThisRun(nextWrong);

      if (nextHeroHp <= 0) {
        const total = passedIdsThisRun.length + nextWrong.length;
        const acc = total > 0 ? Math.round((passedIdsThisRun.length / total) * 100) : 0;
        recordBossAttemptResult({
          chapterId: chapter.id,
          defeated: false,
          passedIds: passedIdsThisRun,
          wrongEntries: nextWrong,
          accuracy: acc,
          xpEarned: 25,
        });
      }
    }
  };

  const handleNextStep = () => {
    if (bossHp <= 0) {
      setPhase('victory');
      return;
    }
    if (heroHp <= 0) {
      setPhase('defeat');
      return;
    }
    if (questionIdx + 1 >= deck.length) {
      const total = passedIdsThisRun.length + wrongEntriesThisRun.length;
      const acc = total > 0 ? Math.round((passedIdsThisRun.length / total) * 100) : 0;
      const won = passedIdsThisRun.length >= Math.ceil(deck.length * 0.6);
      setPhase(won ? 'victory' : 'defeat');
      recordBossAttemptResult({
        chapterId: chapter.id,
        defeated: won,
        passedIds: passedIdsThisRun,
        wrongEntries: wrongEntriesThisRun,
        accuracy: acc,
        xpEarned: won ? 110 : 25,
      });
      return;
    }
    setQuestionIdx((i) => i + 1);
    setSelectedOption(null);
    setSubmitted(false);
    setEliminatedOptions([]);
  };

  const totalAnswered = passedIdsThisRun.length + wrongEntriesThisRun.length;
  const runAccuracy = totalAnswered > 0 ? Math.round((passedIdsThisRun.length / totalAnswered) * 100) : 0;
  const rankInfo =
    runAccuracy === 100 && heroHp >= state.hero.maxHp * 0.75
      ? { label: 'Hạng S // Hoàn hảo', tone: '#f4d35e' }
      : runAccuracy >= 75
        ? { label: 'Hạng A // Anh hùng', tone: '#4da3ff' }
        : { label: 'Hạng B // Sinh tồn', tone: '#45d483' };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Eyebrow color={isFinalBoss ? '#c084fc' : '#ff7373'}>
            {isFinalBoss ? 'Final Mission // Cyber Citadel' : `Chapter ${chapter.order} Boss Arena`}
          </Eyebrow>
          <h1 className="display-font text-4xl sm:text-6xl font-extrabold text-[#f3f6fc] mt-2 leading-[1.06]">
            Đối đầu {boss.name}
          </h1>
          <p className="text-sm text-[#a8b5c9] mt-2">
            {isFinalBoss
              ? 'Trùm cuối học phần Computer Networking — vượt qua để hoàn thành toàn bộ khóa học CN-101.'
              : `Kiến thức chuẩn xác là vũ khí duy nhất xuyên phá ${boss.title}.`}
          </p>
        </div>

        <Select
          value={chapter.id}
          onChange={(e) => {
            navigate('boss-battle', { chapterId: e.target.value });
            resetBattle(e.target.value, false);
          }}
          className="w-full md:w-72"
        >
          {course.chapters.map((ch) => (
            <option key={ch.id} value={ch.id}>
              Chương {ch.order}: {ch.boss.name} {state.bossProgress[ch.id]?.defeated ? '(Đã hạ)' : ''}
            </option>
          ))}
        </Select>
      </div>

      {/* Asymmetric Boss Arena */}
      <div
        className={`boss-arena grid grid-cols-1 lg:grid-cols-[330px_1fr] min-h-[560px] ${arenaShake ? 'shake' : ''}`}
        style={isFinalBoss ? { borderColor: 'rgba(192, 132, 252, 0.45)' } : undefined}
      >
        {/* Victory Confetti */}
        {phase === 'victory' && (
          <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none">
            {Array.from({ length: 42 }, (_, idx) => (
              <i
                key={idx}
                className="confetti-piece"
                style={{
                  left: `${(idx * 37) % 100}%`,
                  background: CONFETTI_COLORS[idx % CONFETTI_COLORS.length],
                  animationDelay: `${(idx % 9) * 0.11}s`,
                  transform: `rotate(${idx * 23}deg)`,
                }}
              />
            ))}
          </div>
        )}

        {/* Left Boss Side (flash scoped to Boss Side so quiz & explanation text stays crystal clear!) */}
        <div
          className={`boss-side p-7 flex flex-col items-center justify-between border-b lg:border-b-0 lg:border-r border-[#ef4444]/25 ${
            isBossEnraged ? 'is-enraged' : ''
          }`}
        >
          {arenaFlash !== 'none' && <div className={`absolute inset-0 z-10 pointer-events-none arena-flash ${arenaFlash}`} />}

          <div className="relative z-10 text-center space-y-1">
            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-[#ff7979] block">
              {isBossEnraged
                ? '⚡ PHASE 2 ENRAGED (+25% ATK)'
                : isFinalBoss
                  ? 'FINAL BOSS // CYBER CITADEL'
                  : `Chapter ${chapter.order} Boss`}
            </span>
          </div>

          <div className="relative my-4 flex items-center justify-center">
            <div
              className={`w-64 h-64 rounded-full border flex items-center justify-center ${
                isBossEnraged ? 'enrage-ring' : 'border-[#ef4444]/20'
              }`}
            >
              <div className="w-52 h-52 rounded-full border border-[#ef4444]/15 flex items-center justify-center">
                <img
                  src={boss.avatar}
                  alt={boss.name}
                  className={`w-44 h-44 rounded-2xl object-cover border-2 shadow-[0_18px_36px_rgba(0,0,0,0.55)] ${
                    isFinalBoss ? 'border-[#c084fc]/70' : 'border-[#ef4444]/60'
                  } ${
                    phase === 'victory'
                      ? 'boss-portrait-defeated'
                      : bossAnim === 'hit'
                        ? 'boss-portrait-hit'
                        : bossAnim === 'attack'
                          ? 'boss-portrait-attack'
                          : ''
                  }`}
                />
              </div>
            </div>

            {damagePopup && (
              <span
                key={damagePopup.key}
                className="display-font absolute left-1/2 top-1/3 text-4xl font-extrabold text-white drop-shadow-[0_4px_0_#9f2538] pointer-events-none damage-float z-30"
              >
                {damagePopup.label}
              </span>
            )}
          </div>

          <div className="relative z-10 w-full text-center space-y-3">
            <div>
              <h2 className="display-font text-3xl font-extrabold text-[#f3f6fc] leading-none">{boss.name}</h2>
              <p className="text-[10px] font-black tracking-[0.16em] uppercase text-[#b47d88] mt-1">
                {boss.trait} · ATK {effectiveBossAtk}
              </p>
            </div>
            <BossHealthBar current={bossHp} max={boss.maxHp} />
          </div>
        </div>

        {/* Right Battle Panel */}
        <div className="relative z-20 p-6 sm:p-8 flex flex-col justify-between gap-6">
          {/* Player Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#2a3448]">
            <div className="flex items-center gap-3">
              <img src={state.hero.avatar} alt={state.hero.name} className="w-12 h-12 object-cover hex-avatar shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <strong className="text-xs font-extrabold uppercase tracking-wider text-[#f3f6fc]">{state.hero.name}</strong>
                  {combo >= 2 && (
                    <span key={combo} className="combo-pop inline-block">
                      <Badge tone="yellow" icon={<Flame className="w-3 h-3" />}>
                        Combo ×{combo} (+{6 * (combo - 1)} ATK)
                      </Badge>
                    </span>
                  )}
                </div>
                <small className="text-[10px] font-bold uppercase tracking-wider text-[#8292a9]">
                  ATK {state.hero.attack + attackBoost} · {phase === 'fighting' ? `Câu ${questionIdx + 1}/${deck.length}` : 'Sẵn sàng'}
                </small>
              </div>
            </div>

            <div className="relative w-full sm:w-56">
              <HeroHealthBar current={heroHp} max={state.hero.maxHp} />
              {heroPopup && (
                <span
                  key={heroPopup.key}
                  className={`display-font absolute right-2 -top-4 text-xl font-extrabold pointer-events-none damage-float ${
                    heroPopup.tone === 'heal' ? 'text-[#45d483]' : 'text-[#ff6262]'
                  }`}
                >
                  {heroPopup.label}
                </span>
              )}
            </div>
          </div>

          {/* Center Battle Content */}
          <div className="flex-1 flex flex-col justify-center">
            {phase === 'intro' && (
              <div className="max-w-xl mx-auto text-center space-y-5 py-4">
                <Swords className="w-14 h-14 mx-auto text-[#ef5353]" />
                <h3 className="display-font text-3xl sm:text-4xl font-extrabold text-[#f3f6fc] leading-[1.1]">
                  {isFinalBoss ? 'Trận quyết chiến cuối cùng' : `Bạn đã sẵn sàng đối đầu ${boss.name}?`}
                </h3>
                <p className="text-sm text-[#aab7ca] leading-relaxed">{boss.description}</p>

                {chapterProgress.attempts > 0 && (
                  <div className="p-3 rounded-xl bg-[#4da3ff]/10 border border-[#4da3ff]/35 text-xs text-[#71b7ff]">
                    <strong>Chế độ Tái đấu (#{chapterProgress.attempts + 1}):</strong>{' '}
                    {chapterProgress.wrongQuestionIds.length > 0
                      ? `Giữ lại ${chapterProgress.wrongQuestionIds.length} câu từng sai để khắc phục; các câu đã vượt qua được thay bằng câu mới cùng mục tiêu kiến thức.`
                      : 'Các câu đã vượt qua được thay bằng bộ câu hỏi biến thể mới cùng mục tiêu kiến thức.'}
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2.5 max-w-md mx-auto">
                  <div className="p-3 rounded-lg border border-[#303b51] bg-[#0d1421]">
                    <strong className="display-font text-xl block">{deck.length}</strong>
                    <span className="text-[9px] font-black uppercase tracking-wider text-[#8291a7]">Câu hỏi</span>
                  </div>
                  <div className="p-3 rounded-lg border border-[#303b51] bg-[#0d1421]">
                    <strong className="display-font text-xl block text-[#f4d35e]">{state.hero.attack}</strong>
                    <span className="text-[9px] font-black uppercase tracking-wider text-[#8291a7]">Sát thương</span>
                  </div>
                  <div className="p-3 rounded-lg border border-[#303b51] bg-[#0d1421]">
                    <strong className="display-font text-xl block text-[#45d483]">{ownedItems.length}</strong>
                    <span className="text-[9px] font-black uppercase tracking-wider text-[#8291a7]">Vật phẩm</span>
                  </div>
                </div>

                <Button size="lg" disabled={deck.length === 0} onClick={() => setPhase('fighting')}>
                  {deck.length === 0 ? 'Chưa có câu hỏi cho chương này' : 'Bắt đầu trận đấu →'}
                </Button>
              </div>
            )}

            {phase === 'fighting' && !currentEntry && (
              <div className="text-center space-y-4 py-8">
                <p className="text-sm text-[#98a7bd]">Chưa có câu hỏi nào trong ngân hàng đề cho chương này.</p>
                <Button variant="secondary" onClick={() => navigate('student-dashboard')}>Quay lại Dashboard</Button>
              </div>
            )}

            {phase === 'fighting' && currentEntry && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-black uppercase tracking-[0.12em]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[#ff8585]">Mục tiêu: {currentEntry.question.knowledgeObjective}</span>
                    {currentEntry.sourceTag === 'retained_wrong' && (
                      <Badge tone="red" icon={<AlertCircle className="w-3 h-3" />}>Câu sai trước đó</Badge>
                    )}
                    {currentEntry.sourceTag === 'swapped_objective' && (
                      <Badge tone="green" icon={<Sparkles className="w-3 h-3" />}>Câu mới cùng mục tiêu</Badge>
                    )}
                  </div>
                  <span className="mono text-[#8f9eb4]">
                    ROUND {String(questionIdx + 1).padStart(2, '0')} / {String(deck.length).padStart(2, '0')}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-[#f3f6fc] leading-snug">
                  {currentEntry.question.prompt}
                </h3>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#98a7bd] inline-flex items-center gap-1">
                    <Backpack className="w-3.5 h-3.5 text-[#f4d35e]" /> Vật phẩm:
                  </span>
                  {ownedItems.map((item) => {
                    const used = usedItemIds.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        disabled={used || submitted}
                        onClick={() => handleUseItem(item.id)}
                        title={item.description}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors ${
                          used
                            ? 'border-[#26334a] text-[#6f819b] line-through cursor-not-allowed'
                            : 'border-[#f4d35e]/45 bg-[#f4d35e]/10 text-[#f4d35e] hover:bg-[#f4d35e]/20 cursor-pointer'
                        }`}
                      >
                        {item.name}
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentEntry.question.options.map((opt, idx) => {
                    const isEliminated = eliminatedOptions.includes(idx);
                    const isCorrect = idx === currentEntry.question.correctIndex;
                    const isChosen = selectedOption === idx;

                    let cardCls = 'border-[#344159] bg-[#101827] hover:border-[#f4d35e] hover:bg-[#162136] text-[#dce5f2]';
                    let badgeCls = 'border-[#465571] text-[#9fb0c8]';
                    if (isEliminated) {
                      cardCls = 'border-[#26334a] bg-[#0a111e] text-[#4c5b73] line-through opacity-50 cursor-not-allowed';
                    } else if (submitted) {
                      if (isCorrect) {
                        cardCls = 'border-[#45d483] bg-[#45d483]/12 text-[#f3f6fc]';
                        badgeCls = 'border-[#45d483] bg-[#45d483] text-[#08120c]';
                      } else if (isChosen) {
                        cardCls = 'border-[#ef5b5b] bg-[#ef4444]/12 text-[#f3f6fc]';
                        badgeCls = 'border-[#ef5b5b] bg-[#ef5b5b] text-[#190808]';
                      } else {
                        cardCls = 'border-[#26334a] bg-[#101827] opacity-55';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={submitted || isEliminated}
                        onClick={() => handleConfirm(idx)}
                        className={`min-h-[72px] flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${!submitted && !isEliminated ? 'cursor-pointer hover:-translate-y-0.5' : ''} ${cardCls}`}
                      >
                        <span className={`w-7 h-7 rounded border mono text-[11px] font-black grid place-items-center shrink-0 ${badgeCls}`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-xs sm:text-sm leading-snug">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      selectedOption === currentEntry.question.correctIndex
                        ? 'border-[#45d483]/45 bg-[#45d483]/10'
                        : 'border-[#ef4444]/45 bg-[#ef4444]/10'
                    }`}
                  >
                    <div className="space-y-1">
                      <strong
                        className={`text-xs font-extrabold block ${
                          selectedOption === currentEntry.question.correctIndex ? 'text-[#65e09a]' : 'text-[#ff7b7b]'
                        }`}
                      >
                        {selectedOption === currentEntry.question.correctIndex
                          ? `Chính xác! ${lastHpImpact}`
                          : `Sai rồi! ${lastHpImpact} · Đã lưu vào Wrong Answers`}
                      </strong>
                      <p className="text-sm text-[#e2e8f2] leading-relaxed m-0">
                        <strong>Giải thích:</strong> {currentEntry.question.explanation}
                      </p>
                    </div>
                    <Button size="sm" variant="secondary" onClick={handleNextStep} className="shrink-0">
                      {bossHp <= 0 || heroHp <= 0 || questionIdx + 1 >= deck.length ? 'Xem kết quả →' : 'Câu tiếp theo →'}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {(phase === 'victory' || phase === 'defeat') && (
              <div className="text-center space-y-5 py-4 max-w-lg mx-auto">
                <div
                  className="w-24 h-24 mx-auto grid place-items-center border hex-avatar"
                  style={{
                    color: phase === 'victory' ? rankInfo.tone : '#ef4444',
                    borderColor: phase === 'victory' ? rankInfo.tone : 'rgba(239,68,68,0.4)',
                    background: phase === 'victory' ? 'rgba(244,211,94,0.1)' : 'rgba(239,68,68,0.1)',
                  }}
                >
                  {phase === 'victory' ? <Trophy className="w-11 h-11" /> : <XCircle className="w-11 h-11" />}
                </div>

                {phase === 'victory' && (
                  <span
                    className="inline-block px-3 py-1 border text-[10px] font-black tracking-[0.14em] uppercase"
                    style={{ borderColor: rankInfo.tone, color: rankInfo.tone }}
                  >
                    {rankInfo.label}
                  </span>
                )}

                <h3 className="display-font text-4xl sm:text-5xl font-extrabold text-[#f3f6fc] leading-[1.1]">
                  {phase === 'victory'
                    ? isFinalBoss
                      ? 'Hoàn Tất Học Phần CN-101!'
                      : `${boss.name} Đã Bị Hạ!`
                    : 'HP Đã Về 0 — Tạm Dừng'}
                </h3>

                <p className="text-sm text-[#aab7ca]">
                  {phase === 'victory'
                    ? isFinalBoss
                      ? 'Bạn đã đánh bại Trùm cuối Zero-Day Phantom và hoàn thành trọn vẹn lộ trình Computer Networking.'
                      : `Chương ${chapter.order} đã được giải cứu hoàn toàn bằng kiến thức mạng chuẩn xác.`
                    : 'Các câu trả lời sai đã được lưu vào Wrong Answers kèm giải thích để bạn luyện tập trước khi tái đấu.'}
                </p>

                <div className="grid grid-cols-3 gap-2.5 max-w-md mx-auto">
                  <div className="p-3 border border-[#303c52] bg-[#0d1421] rounded-lg">
                    <strong className="display-font text-2xl block text-[#45d483]">{runAccuracy}%</strong>
                    <span className="text-[9px] font-black uppercase text-[#8796ac]">Độ chính xác</span>
                  </div>
                  <div className="p-3 border border-[#303c52] bg-[#0d1421] rounded-lg">
                    <strong className="display-font text-2xl block text-[#f4d35e]">{heroHp}</strong>
                    <span className="text-[9px] font-black uppercase text-[#8796ac]">HP còn lại</span>
                  </div>
                  <div className="p-3 border border-[#303c52] bg-[#0d1421] rounded-lg">
                    <strong className="display-font text-2xl block text-[#ff7b7b]">{boss.maxHp - bossHp}</strong>
                    <span className="text-[9px] font-black uppercase text-[#8796ac]">Sát thương</span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                  <Button variant="secondary" leftIcon={<BookOpen className="w-4 h-4" />} onClick={() => navigate('notes')}>
                    Xem Wrong Answers
                  </Button>
                  <Button leftIcon={<RotateCcw className="w-4 h-4" />} onClick={() => resetBattle(undefined, true)}>
                    {phase === 'victory' ? 'Đánh lại (Câu mới)' : 'Đánh Boss lại (Rematch)'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
