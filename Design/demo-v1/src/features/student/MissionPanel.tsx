import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Gift,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { InteractiveMission } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';

interface MissionPanelProps {
  mission: InteractiveMission;
  onGoToBoss: () => void;
}

export const MissionPanel: React.FC<MissionPanelProps> = ({ mission, onGoToBoss }) => {
  const { state, completeMission, addToast } = useApp();
  const isAlreadyCompleted = state.completedMissionIds.includes(mission.id);
  const rewardItem = state.inventoryCatalog.find((i) => i.id === mission.rewardItemId);

  // Match state
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [matchSelections, setMatchSelections] = useState<Record<string, string>>({});

  // Order state
  const [orderList, setOrderList] = useState(() => {
    const items = mission.orderItems ?? [];
    if (items.length <= 1) return items;
    // Deterministic shuffled order so the user actually sorts them
    return [...items].sort((a, b) => a.id.localeCompare(b.id)).reverse();
  });

  // Scenario state
  const [scenarioAnswers, setScenarioAnswers] = useState<Record<string, string>>({});
  const [feedbackMessage, setFeedbackMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [rewardModalOpen, setRewardModalOpen] = useState(false);

  useEffect(() => {
    setSelectedLeftId(null);
    setMatchSelections({});
    setScenarioAnswers({});
    setFeedbackMessage(null);
    const items = mission.orderItems ?? [];
    setOrderList(items.length <= 1 ? items : [...items].sort((a, b) => a.id.localeCompare(b.id)).reverse());
  }, [mission.id, mission.orderItems]);

  const shuffledRightOptions = useMemo(() => {
    const pairs = mission.matchPairs ?? [];
    return [...pairs].sort((a, b) => a.right.localeCompare(b.right));
  }, [mission.matchPairs]);

  const handleRightClick = (rightText: string) => {
    if (!selectedLeftId) return;
    setMatchSelections((prev) => ({ ...prev, [selectedLeftId]: rightText }));
    setSelectedLeftId(null);
  };

  const moveOrderItem = (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= orderList.length) return;
    const next = [...orderList];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    setOrderList(next);
  };

  const handleVerifyMission = () => {
    if (mission.type === 'match') {
      const pairs = mission.matchPairs ?? [];
      if (Object.keys(matchSelections).length < pairs.length) {
        setFeedbackMessage({ ok: false, text: 'Hãy ghép đủ tất cả các cặp khái niệm trước khi kiểm tra.' });
        return;
      }
      const allCorrect = pairs.every((p) => matchSelections[p.id] === p.right);
      if (!allCorrect) {
        setFeedbackMessage({
          ok: false,
          text: 'Có cặp ghép chưa chính xác. Hãy rà soát lại khái niệm và thử kiểm tra lần nữa!',
        });
        return;
      }
    } else if (mission.type === 'order') {
      const isSorted = orderList.every((item, idx) => item.correctPosition === idx + 1);
      if (!isSorted) {
        setFeedbackMessage({
          ok: false,
          text: 'Thứ tự các bước chưa đúng. Gợi ý: Kiểm tra chiều từ trên xuống (hoặc bước khởi đầu đến kết thúc).',
        });
        return;
      }
    } else if (mission.type === 'scenario') {
      const scenarios = mission.scenarioItems ?? [];
      if (Object.keys(scenarioAnswers).length < scenarios.length) {
        setFeedbackMessage({ ok: false, text: 'Vui lòng chọn đáp án cho tất cả tình huống.' });
        return;
      }
      const wrongScenario = scenarios.find((sc) => scenarioAnswers[sc.id] !== sc.correctOption);
      if (wrongScenario) {
        setFeedbackMessage({
          ok: false,
          text: `Tình huống "${wrongScenario.prompt.slice(0, 48)}..." chưa chính xác. Gợi ý: ${wrongScenario.explanation}`,
        });
        return;
      }
    }

    setFeedbackMessage({
      ok: true,
      text: 'Chính xác tuyệt đối! Nhiệm vụ hoàn tất và vật phẩm thưởng đã được chuyển vào Inventory.',
    });
    completeMission(mission.id, mission.rewardItemId, mission.title);
    setRewardModalOpen(true);
    addToast({
      type: 'success',
      title: 'Hoàn thành nhiệm vụ giữa chương!',
      message: rewardItem ? `Nhận vật phẩm: ${rewardItem.name}` : undefined,
    });
  };

  return (
    <div className="space-y-5">
      <Card>
        <CardContent className="p-6 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Badge tone="amber" icon={<Sparkles className="w-3.5 h-3.5" />}>
                  Nhiệm vụ tương tác ({mission.type === 'match' ? 'Ghép nối' : mission.type === 'order' ? 'Sắp xếp thứ tự' : 'Xử lý tình huống'})
                </Badge>
                {isAlreadyCompleted && (
                  <Badge tone="emerald" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
                    Đã hoàn thành
                  </Badge>
                )}
              </div>
              <h2 className="text-xl font-bold text-white">{mission.title}</h2>
              <p className="text-sm text-slate-400">{mission.description}</p>
            </div>

            {rewardItem && (
              <div className="px-3.5 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center gap-2.5">
                <Gift className="w-4 h-4 text-blue-400 shrink-0" />
                <div>
                  <div className="text-[11px] text-blue-300 font-medium">Phần thưởng vật phẩm</div>
                  <div className="text-xs font-bold text-white">{rewardItem.name}</div>
                </div>
              </div>
            )}
          </div>

          {/* MATCH MISSION */}
          {mission.type === 'match' && mission.matchPairs && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400">
                Bước 1: Chọn một thẻ bên trái. Bước 2: Chọn định nghĩa tương ứng bên phải để ghép cặp.
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2.5">
                  {mission.matchPairs.map((pair) => {
                    const isSelected = selectedLeftId === pair.id;
                    const assigned = matchSelections[pair.id];
                    return (
                      <button
                        key={pair.id}
                        type="button"
                        onClick={() => setSelectedLeftId(pair.id)}
                        className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600/20 border-blue-400 ring-1 ring-blue-400'
                            : assigned
                              ? 'bg-emerald-500/10 border-emerald-500/40'
                              : 'bg-slate-900 border-slate-800 hover:border-slate-600'
                        }`}
                      >
                        <div className="text-sm font-semibold text-white">{pair.left}</div>
                        <div className="text-xs text-slate-400 mt-1">
                          {assigned ? `Đã ghép → ${assigned}` : 'Chưa ghép cặp'}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-2.5">
                  {shuffledRightOptions.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      disabled={!selectedLeftId}
                      onClick={() => handleRightClick(item.right)}
                      className={`w-full p-3.5 rounded-xl border text-left text-sm transition-all ${
                        selectedLeftId
                          ? 'bg-slate-900 border-blue-500/40 hover:bg-blue-500/15 text-slate-100 cursor-pointer'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {item.right}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ORDER MISSION */}
          {mission.type === 'order' && (
            <div className="space-y-2.5">
              <div className="text-xs text-slate-400 mb-2">
                Dùng nút mũi tên Lên / Xuống để sắp xếp đúng trình tự từ vị trí #1 đến #{orderList.length}.
              </div>
              {orderList.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-300 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-white">{item.label}</div>
                      <div className="text-xs text-slate-400">{item.detail}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={idx === 0}
                      onClick={() => moveOrderItem(idx, -1)}
                      aria-label="Di chuyển lên"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={idx === orderList.length - 1}
                      onClick={() => moveOrderItem(idx, 1)}
                      aria-label="Di chuyển xuống"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SCENARIO MISSION */}
          {mission.type === 'scenario' && mission.scenarioItems && (
            <div className="space-y-4">
              {mission.scenarioItems.map((sc, idx) => (
                <div key={sc.id} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="text-sm font-semibold text-white">
                    Tình huống {idx + 1}: {sc.prompt}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sc.options.map((opt) => {
                      const chosen = scenarioAnswers[sc.id] === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() =>
                            setScenarioAnswers((prev) => ({ ...prev, [sc.id]: opt }))
                          }
                          className={`px-3.5 py-2 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                            chosen
                              ? 'bg-blue-600 text-white border-blue-400'
                              : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-500'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {feedbackMessage && (
            <div
              className={`p-4 rounded-xl border text-sm ${
                feedbackMessage.ok
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-500/10 border-rose-500/40 text-rose-200'
              }`}
            >
              {feedbackMessage.text}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={() => {
                setMatchSelections({});
                setScenarioAnswers({});
                setFeedbackMessage(null);
              }}
            >
              Làm lại
            </Button>
            <div className="flex items-center gap-2.5">
              <Button onClick={handleVerifyMission}>Kiểm tra & Nhận vật phẩm</Button>
              {isAlreadyCompleted && (
                <Button variant="danger" onClick={onGoToBoss}>
                  Thử thách Boss chương →
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Modal
        open={rewardModalOpen}
        onClose={() => setRewardModalOpen(false)}
        title="Nhận vật phẩm chiến đấu mới!"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setRewardModalOpen(false)}>
              Đóng
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setRewardModalOpen(false);
                onGoToBoss();
              }}
            >
              Tiến vào Boss Battle
            </Button>
          </>
        }
      >
        {rewardItem && (
          <div className="text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Gift className="w-7 h-7" />
            </div>
            <div className="text-lg font-bold text-white">{rewardItem.name}</div>
            <Badge tone="amber">{rewardItem.rarity.toUpperCase()}</Badge>
            <p className="text-sm text-slate-300">{rewardItem.description}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};
