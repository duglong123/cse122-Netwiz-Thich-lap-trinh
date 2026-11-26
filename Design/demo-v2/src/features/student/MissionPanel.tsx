import React, { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, CheckCircle2, Gift, RotateCcw, Sparkles } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { InteractiveMission } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Surface, SurfaceContent } from '../../components/ui/Surface';

interface MissionPanelProps {
  mission: InteractiveMission;
  onGoToBoss: () => void;
}

export const MissionPanel: React.FC<MissionPanelProps> = ({ mission, onGoToBoss }) => {
  const { state, completeMission, addToast } = useApp();
  const isAlreadyCompleted = state.completedMissionIds.includes(mission.id);
  const rewardItem = state.inventoryCatalog.find((i) => i.id === mission.rewardItemId);

  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [matchSelections, setMatchSelections] = useState<Record<string, string>>({});
  const [orderList, setOrderList] = useState(() => {
    const items = mission.orderItems ?? [];
    return items.length <= 1 ? items : [...items].sort((a, b) => a.id.localeCompare(b.id)).reverse();
  });
  const [scenarioAnswers, setScenarioAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [rewardOpen, setRewardOpen] = useState(false);

  useEffect(() => {
    setSelectedLeftId(null);
    setMatchSelections({});
    setScenarioAnswers({});
    setFeedback(null);
    const items = mission.orderItems ?? [];
    setOrderList(items.length <= 1 ? items : [...items].sort((a, b) => a.id.localeCompare(b.id)).reverse());
  }, [mission.id, mission.orderItems]);

  const shuffledRights = useMemo(
    () => [...(mission.matchPairs ?? [])].sort((a, b) => a.right.localeCompare(b.right)),
    [mission.matchPairs],
  );

  const moveOrder = (idx: number, delta: -1 | 1) => {
    const target = idx + delta;
    if (target < 0 || target >= orderList.length) return;
    const next = [...orderList];
    const [moved] = next.splice(idx, 1);
    next.splice(target, 0, moved);
    setOrderList(next);
  };

  const verify = () => {
    if (mission.type === 'match') {
      const pairs = mission.matchPairs ?? [];
      if (Object.keys(matchSelections).length < pairs.length) {
        setFeedback({ ok: false, text: 'Hãy ghép đủ tất cả các cặp trước khi kiểm tra.' });
        return;
      }
      if (!pairs.every((p) => matchSelections[p.id] === p.right)) {
        setFeedback({ ok: false, text: 'Có cặp chưa khớp đúng. Hãy kiểm tra lại định nghĩa.' });
        return;
      }
    } else if (mission.type === 'order') {
      if (!orderList.every((item, idx) => item.correctPosition === idx + 1)) {
        setFeedback({ ok: false, text: 'Thứ tự chưa chính xác. Hãy rà soát lại chiều từ trên xuống dưới.' });
        return;
      }
    } else if (mission.type === 'scenario') {
      const scenarios = mission.scenarioItems ?? [];
      if (Object.keys(scenarioAnswers).length < scenarios.length) {
        setFeedback({ ok: false, text: 'Hãy chọn đáp án cho tất cả tình huống.' });
        return;
      }
      const wrong = scenarios.find((sc) => scenarioAnswers[sc.id] !== sc.correctOption);
      if (wrong) {
        setFeedback({ ok: false, text: `Chưa đúng. Gợi ý: ${wrong.explanation}` });
        return;
      }
    }

    setFeedback({ ok: true, text: 'Hoàn tất nhiệm vụ! Vật phẩm đã được thêm vào Inventory.' });
    completeMission(mission.id, mission.rewardItemId, mission.title);
    setRewardOpen(true);
    addToast({ type: 'success', title: 'Hoàn thành nhiệm vụ!', message: rewardItem?.name });
  };

  return (
    <Surface elevated>
      <SurfaceContent className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge tone="warning" icon={<Sparkles className="w-3.5 h-3.5" />}>Nhiệm vụ giữa chương</Badge>
              {isAlreadyCompleted && <Badge tone="success" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>Đã xong</Badge>}
            </div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">{mission.title}</h2>
            <p className="text-sm text-[var(--text-secondary)]">{mission.description}</p>
          </div>
          {rewardItem && (
            <div className="px-3.5 py-2 rounded-xl bg-[var(--accent-primary-soft)] text-[var(--accent-primary-fg)] text-xs font-bold flex items-center gap-2">
              <Gift className="w-4 h-4" /> Thưởng: {rewardItem.name}
            </div>
          )}
        </div>

        {mission.type === 'match' && mission.matchPairs && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2.5">
              {mission.matchPairs.map((pair) => (
                <button
                  key={pair.id}
                  type="button"
                  onClick={() => setSelectedLeftId(pair.id)}
                  className={`w-full p-3.5 rounded-xl border text-left cursor-pointer transition-colors ${
                    selectedLeftId === pair.id
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-primary-soft)]'
                      : matchSelections[pair.id]
                        ? 'border-[var(--accent-success)] bg-[var(--accent-success-soft)]/50'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-subtle)]'
                  }`}
                >
                  <div className="text-sm font-bold text-[var(--text-primary)]">{pair.left}</div>
                  <div className="text-xs text-[var(--text-secondary)] mt-1">
                    {matchSelections[pair.id] ? `→ ${matchSelections[pair.id]}` : 'Chọn để ghép'}
                  </div>
                </button>
              ))}
            </div>
            <div className="space-y-2.5">
              {shuffledRights.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  disabled={!selectedLeftId}
                  onClick={() => {
                    if (!selectedLeftId) return;
                    setMatchSelections((prev) => ({ ...prev, [selectedLeftId]: item.right }));
                    setSelectedLeftId(null);
                  }}
                  className={`w-full p-3.5 rounded-xl border text-left text-sm ${
                    selectedLeftId
                      ? 'border-[var(--border-strong)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] text-[var(--text-primary)] cursor-pointer'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-subtle)]/50 text-[var(--text-muted)] cursor-not-allowed'
                  }`}
                >
                  {item.right}
                </button>
              ))}
            </div>
          </div>
        )}

        {mission.type === 'order' && (
          <div className="space-y-2.5">
            {orderList.map((item, idx) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-7 h-7 rounded-lg bg-[var(--accent-primary-soft)] text-[var(--accent-primary-fg)] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    #{idx + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-[var(--text-primary)]">{item.label}</div>
                    <div className="text-xs text-[var(--text-secondary)]">{item.detail}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button size="sm" variant="secondary" disabled={idx === 0} onClick={() => moveOrder(idx, -1)} aria-label="Lên">
                    <ArrowUp className="w-3.5 h-3.5" />
                  </Button>
                  <Button size="sm" variant="secondary" disabled={idx === orderList.length - 1} onClick={() => moveOrder(idx, 1)} aria-label="Xuống">
                    <ArrowDown className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {mission.type === 'scenario' && mission.scenarioItems && (
          <div className="space-y-4">
            {mission.scenarioItems.map((sc, idx) => (
              <div key={sc.id} className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-3">
                <div className="text-sm font-bold text-[var(--text-primary)]">
                  Tình huống {idx + 1}: {sc.prompt}
                </div>
                <div className="flex flex-wrap gap-2">
                  {sc.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setScenarioAnswers((p) => ({ ...p, [sc.id]: opt }))}
                      className={`px-3.5 py-2 rounded-lg text-xs font-semibold border cursor-pointer ${
                        scenarioAnswers[sc.id] === opt
                          ? 'bg-[var(--accent-primary)] text-[var(--accent-primary-text)] border-transparent'
                          : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-strong)]'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {feedback && (
          <div
            className={`p-4 rounded-xl border text-sm font-medium ${
              feedback.ok
                ? 'bg-[var(--accent-success-soft)] text-[var(--accent-success-fg)] border-[var(--accent-success)]/40'
                : 'bg-[var(--accent-danger-soft)] text-[var(--accent-danger-fg)] border-[var(--accent-danger)]/40'
            }`}
          >
            {feedback.text}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[var(--border-subtle)]">
          <Button variant="ghost" size="sm" leftIcon={<RotateCcw className="w-3.5 h-3.5" />} onClick={() => { setMatchSelections({}); setScenarioAnswers({}); setFeedback(null); }}>
            Làm lại
          </Button>
          <div className="flex items-center gap-2.5">
            <Button onClick={verify}>Kiểm tra & Nhận vật phẩm</Button>
            {isAlreadyCompleted && (
              <Button variant="danger" onClick={onGoToBoss}>Đánh Boss chương →</Button>
            )}
          </div>
        </div>
      </SurfaceContent>

      <Modal
        open={rewardOpen}
        onClose={() => setRewardOpen(false)}
        title="Nhận vật phẩm mới!"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setRewardOpen(false)}>Đóng</Button>
            <Button variant="danger" onClick={() => { setRewardOpen(false); onGoToBoss(); }}>Vào Boss Battle</Button>
          </>
        }
      >
        {rewardItem && (
          <div className="text-center space-y-2.5">
            <div className="w-12 h-12 mx-auto rounded-xl bg-[var(--accent-warning-soft)] text-[var(--accent-warning-fg)] flex items-center justify-center">
              <Gift className="w-6 h-6" />
            </div>
            <div className="text-lg font-bold text-[var(--text-primary)]">{rewardItem.name}</div>
            <p className="text-sm text-[var(--text-secondary)]">{rewardItem.description}</p>
          </div>
        )}
      </Modal>
    </Surface>
  );
};
