import React, { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, CheckCircle2, Gift, RotateCcw, Sparkles } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { InteractiveMission } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Panel, PanelContent } from '../../components/ui/Panel';

export const MissionPanel: React.FC<{ mission: InteractiveMission; onGoToBoss: () => void }> = ({
  mission,
  onGoToBoss,
}) => {
  const { state, completeMission, addToast } = useApp();
  const isCompleted = state.completedMissionIds.includes(mission.id);
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
        setFeedback({ ok: false, text: 'Có cặp ghép chưa chính xác. Hãy kiểm tra lại.' });
        return;
      }
    } else if (mission.type === 'order') {
      if (!orderList.every((item, idx) => item.correctPosition === idx + 1)) {
        setFeedback({ ok: false, text: 'Thứ tự các tầng/bước chưa chính xác.' });
        return;
      }
    } else if (mission.type === 'scenario') {
      const scenarios = mission.scenarioItems ?? [];
      if (Object.keys(scenarioAnswers).length < scenarios.length) {
        setFeedback({ ok: false, text: 'Vui lòng chọn đáp án cho tất cả tình huống.' });
        return;
      }
      const wrong = scenarios.find((sc) => scenarioAnswers[sc.id] !== sc.correctOption);
      if (wrong) {
        setFeedback({ ok: false, text: `Chưa đúng. Gợi ý: ${wrong.explanation}` });
        return;
      }
    }

    setFeedback({ ok: true, text: 'Hoàn tất nhiệm vụ! Vật phẩm đã được chuyển vào Inventory.' });
    completeMission(mission.id, mission.rewardItemId, mission.title);
    setRewardOpen(true);
    addToast({ type: 'success', title: 'Nhiệm vụ hoàn thành!', message: rewardItem?.name });
  };

  return (
    <Panel accent="#f4d35e">
      <PanelContent className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge tone="yellow" icon={<Sparkles className="w-3 h-3" />}>Nhiệm vụ giữa chương</Badge>
              {isCompleted && <Badge tone="green" icon={<CheckCircle2 className="w-3 h-3" />}>Đã xong</Badge>}
            </div>
            <h2 className="display-font text-3xl font-extrabold text-[#f3f6fc]">{mission.title}</h2>
            <p className="text-sm text-[#98a7bd]">{mission.description}</p>
          </div>
          {rewardItem && (
            <div className="px-3.5 py-2.5 rounded-xl bg-[#f4d35e]/10 border border-[#f4d35e]/35 text-xs text-[#f4d35e] font-bold flex items-center gap-2">
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
                      ? 'border-[#f4d35e] bg-[#f4d35e]/15'
                      : matchSelections[pair.id]
                        ? 'border-[#45d483] bg-[#45d483]/10'
                        : 'border-[#26334a] bg-[#0a111e]'
                  }`}
                >
                  <div className="text-sm font-bold text-[#f3f6fc]">{pair.left}</div>
                  <div className="text-xs text-[#98a7bd] mt-1">{matchSelections[pair.id] ? `→ ${matchSelections[pair.id]}` : 'Chọn để ghép'}</div>
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
                    setMatchSelections((p) => ({ ...p, [selectedLeftId]: item.right }));
                    setSelectedLeftId(null);
                  }}
                  className={`w-full p-3.5 rounded-xl border text-left text-sm ${
                    selectedLeftId
                      ? 'border-[#f4d35e]/45 bg-[#0e1523] hover:bg-[#162136] text-[#f3f6fc] cursor-pointer'
                      : 'border-[#26334a] bg-[#0a111e]/60 text-[#6f819b] cursor-not-allowed'
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
              <div key={item.id} className="p-3.5 rounded-xl bg-[#0a111e] border border-[#26334a] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-7 h-7 rounded bg-[#f4d35e]/15 border border-[#f4d35e]/35 text-[#f4d35e] mono text-xs font-extrabold flex items-center justify-center shrink-0">
                    #{idx + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-[#f3f6fc]">{item.label}</div>
                    <div className="text-xs text-[#98a7bd]">{item.detail}</div>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button size="sm" variant="secondary" disabled={idx === 0} onClick={() => moveOrder(idx, -1)} aria-label="Lên"><ArrowUp className="w-3.5 h-3.5" /></Button>
                  <Button size="sm" variant="secondary" disabled={idx === orderList.length - 1} onClick={() => moveOrder(idx, 1)} aria-label="Xuống"><ArrowDown className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {mission.type === 'scenario' && mission.scenarioItems && (
          <div className="space-y-4">
            {mission.scenarioItems.map((sc, idx) => (
              <div key={sc.id} className="p-4 rounded-xl bg-[#0a111e] border border-[#26334a] space-y-3">
                <div className="text-sm font-bold text-[#f3f6fc]">Tình huống {idx + 1}: {sc.prompt}</div>
                <div className="flex flex-wrap gap-2">
                  {sc.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setScenarioAnswers((p) => ({ ...p, [sc.id]: opt }))}
                      className={`px-3.5 py-2 rounded-lg text-xs font-bold border cursor-pointer ${
                        scenarioAnswers[sc.id] === opt
                          ? 'bg-[#f4d35e] text-[#080c16] border-[#f4d35e]'
                          : 'bg-[#0e1523] text-[#c5d1e2] border-[#2b3951]'
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
          <div className={`p-4 rounded-xl border text-sm ${feedback.ok ? 'bg-[#45d483]/10 border-[#45d483]/40 text-[#65e09a]' : 'bg-[#ef4444]/10 border-[#ef4444]/40 text-[#ff7b7b]'}`}>
            {feedback.text}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#26334a]">
          <Button variant="ghost" size="sm" leftIcon={<RotateCcw className="w-3.5 h-3.5" />} onClick={() => { setMatchSelections({}); setScenarioAnswers({}); setFeedback(null); }}>
            Làm lại
          </Button>
          <div className="flex gap-2.5">
            <Button onClick={verify}>Kiểm tra & Nhận vật phẩm</Button>
            {isCompleted && <Button variant="danger" onClick={onGoToBoss}>Đánh Boss chương →</Button>}
          </div>
        </div>
      </PanelContent>

      <Modal
        open={rewardOpen}
        onClose={() => setRewardOpen(false)}
        title="Mở khóa vật phẩm mới!"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setRewardOpen(false)}>Đóng</Button>
            <Button variant="danger" onClick={() => { setRewardOpen(false); onGoToBoss(); }}>Vào Boss Arena</Button>
          </>
        }
      >
        {rewardItem && (
          <div className="text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-xl bg-[#f4d35e]/15 text-[#f4d35e] flex items-center justify-center"><Gift className="w-6 h-6" /></div>
            <div className="display-font text-2xl font-extrabold text-[#f3f6fc]">{rewardItem.name}</div>
            <p className="text-sm text-[#98a7bd]">{rewardItem.description}</p>
          </div>
        )}
      </Modal>
    </Panel>
  );
};
