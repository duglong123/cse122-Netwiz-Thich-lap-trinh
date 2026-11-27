import React, { useMemo, useState } from 'react';
import { CheckCircle2, Clock, GitPullRequest, XCircle } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/DataFeedback';
import { Input } from '../../components/ui/FormControls';
import { Eyebrow, Panel, PanelContent, PanelHeader, PanelTitle } from '../../components/ui/Panel';
import { Tabs } from '../../components/ui/Tabs';

export const SharedProposals: React.FC = () => {
  const { state, currentUser, switchActiveLecturer, voteProposal } = useApp();
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [comments, setComments] = useState<Record<string, string>>({});

  const activeLecId = currentUser?.id ?? state.lecturers[0].id;
  const mainCourse = state.courses[0];
  const collaborators = state.lecturers.filter((l) => mainCourse.collaboratorIds.includes(l.id));
  const filtered = useMemo(() => state.proposals.filter((p) => statusFilter === 'all' || p.status === statusFilter), [state.proposals, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <Eyebrow color="#45d483">100% Consensus Rule</Eyebrow>
          <h1 className="display-font text-4xl font-extrabold text-[#f3f6fc] mt-2">Đồng thuận khóa học chung</h1>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {collaborators.map((lec) => (
            <button
              key={lec.id}
              type="button"
              onClick={() => switchActiveLecturer(lec.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                lec.id === activeLecId ? 'bg-[#45d483] text-[#08120c] border-[#45d483]' : 'bg-[#0e1523] text-[#c5d1e2] border-[#26334a]'
              }`}
            >
              {lec.name}
            </button>
          ))}
        </div>
      </div>

      <Tabs
        activeTab={statusFilter}
        onChange={(t) => setStatusFilter(t as typeof statusFilter)}
        tabs={[
          { id: 'all', label: 'Tất cả', badge: state.proposals.length },
          { id: 'pending', label: 'Pending', badge: state.proposals.filter((p) => p.status === 'pending').length },
          { id: 'approved', label: 'Approved', badge: state.proposals.filter((p) => p.status === 'approved').length },
          { id: 'rejected', label: 'Rejected', badge: state.proposals.filter((p) => p.status === 'rejected').length },
        ]}
      />

      {filtered.length === 0 ? (
        <EmptyState icon={<GitPullRequest className="w-6 h-6" />} title="Không có đề xuất" description="Chưa có đề xuất nào trong trạng thái này." />
      ) : (
        <div className="space-y-5">
          {filtered.map((prop) => {
            const course = state.courses.find((c) => c.id === prop.courseId) ?? mainCourse;
            const courseCollabs = state.lecturers.filter((l) => course.collaboratorIds.includes(l.id));
            const proposer = state.lecturers.find((l) => l.id === prop.proposerId);
            const myVote = prop.votes[activeLecId];
            const approvedCount = courseCollabs.filter((l) => prop.votes[l.id]?.decision === 'approved').length;

            return (
              <Panel key={prop.id} accent={prop.status === 'approved' ? '#45d483' : prop.status === 'rejected' ? '#ef4444' : '#f4d35e'}>
                <PanelHeader>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <Badge tone="blue">{course.code}</Badge>
                    <Badge tone={prop.status === 'approved' ? 'green' : prop.status === 'rejected' ? 'red' : 'yellow'}>
                      {prop.status === 'approved' ? 'Approved' : prop.status === 'rejected' ? 'Rejected' : `Pending (${approvedCount}/${courseCollabs.length})`}
                    </Badge>
                  </div>
                  <PanelTitle>{prop.lessonTitle}</PanelTitle>
                  <div className="text-xs text-[#98a7bd] mt-1">Đề xuất bởi <strong>{proposer?.name}</strong> · {prop.summary}</div>
                </PanelHeader>
                <PanelContent className="space-y-5">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-[#ef4444]/8 border border-[#ef4444]/30 space-y-1.5">
                      <div className="text-[10px] mono font-bold text-[#ff7b7b]">TRƯỚC KHI SỬA</div>
                      <div className="text-xs text-[#c5d1e2] whitespace-pre-line max-h-52 overflow-y-auto">{prop.beforeContent}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#45d483]/8 border border-[#45d483]/30 space-y-1.5">
                      <div className="text-[10px] mono font-bold text-[#65e09a]">SAU KHI SỬA</div>
                      <div className="text-xs text-[#f3f6fc] whitespace-pre-line max-h-52 overflow-y-auto">{prop.afterContent}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {courseCollabs.map((lec) => {
                      const v = prop.votes[lec.id];
                      return (
                        <div key={lec.id} className="p-3 rounded-xl bg-[#0a111e] border border-[#26334a]">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#f3f6fc]">{lec.name}</span>
                            {v?.decision === 'approved' ? <CheckCircle2 className="w-4 h-4 text-[#45d483]" /> : v?.decision === 'rejected' ? <XCircle className="w-4 h-4 text-[#ef4444]" /> : <Clock className="w-4 h-4 text-[#f4d35e]" />}
                          </div>
                          <div className="text-[11px] text-[#98a7bd] mt-1">
                            {v ? (v.decision === 'approved' ? 'Đã đồng ý' : 'Từ chối') : 'Chưa biểu quyết'}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {prop.status === 'pending' && (
                    <div className="pt-4 border-t border-[#26334a] flex flex-col sm:flex-row sm:items-end gap-3">
                      <div className="flex-1">
                        <Input label={`Góp ý (${currentUser?.name})`} value={comments[prop.id] ?? ''} onChange={(e) => setComments((p) => ({ ...p, [prop.id]: e.target.value }))} />
                      </div>
                      <div className="flex gap-2">
                        <Button variant="danger" size="sm" disabled={myVote?.decision === 'rejected'} onClick={() => voteProposal(prop.id, 'rejected', comments[prop.id])}>Từ chối</Button>
                        <Button variant="success" size="sm" disabled={myVote?.decision === 'approved'} onClick={() => voteProposal(prop.id, 'approved', comments[prop.id])}>
                          {myVote?.decision === 'approved' ? 'Đã đồng ý' : 'Đồng ý chỉnh sửa'}
                        </Button>
                      </div>
                    </div>
                  )}
                </PanelContent>
              </Panel>
            );
          })}
        </div>
      )}
    </div>
  );
};
