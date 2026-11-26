import React, { useMemo, useState } from 'react';
import { CheckCircle2, Clock, GitPullRequest, XCircle } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/DataFeedback';
import { Input } from '../../components/ui/FormControls';
import { Surface, SurfaceContent, SurfaceHeader, SurfaceTitle } from '../../components/ui/Surface';
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Đồng thuận chỉnh sửa (100%)</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Mọi thay đổi chỉ được công bố khi toàn bộ {collaborators.length} giảng viên cùng sử dụng đồng ý.
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {collaborators.map((lec) => (
            <button
              key={lec.id}
              type="button"
              onClick={() => switchActiveLecturer(lec.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                lec.id === activeLecId
                  ? 'bg-[var(--accent-success-soft)] text-[var(--accent-success-fg)] border-[var(--accent-success)]/40'
                  : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-subtle)]'
              }`}
            >
              {lec.name.split(' ').slice(-2).join(' ')}
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
        <EmptyState icon={<GitPullRequest className="w-6 h-6" />} title="Chưa có đề xuất" description="Không có đề xuất nào ở bộ lọc này." />
      ) : (
        <div className="space-y-5">
          {filtered.map((prop) => {
            const course = state.courses.find((c) => c.id === prop.courseId) ?? mainCourse;
            const courseCollabs = state.lecturers.filter((l) => course.collaboratorIds.includes(l.id));
            const proposer = state.lecturers.find((l) => l.id === prop.proposerId);
            const myVote = prop.votes[activeLecId];
            const approvedCount = courseCollabs.filter((l) => prop.votes[l.id]?.decision === 'approved').length;

            return (
              <Surface key={prop.id} elevated>
                <SurfaceHeader>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <Badge tone="primary">{course.code}</Badge>
                    <Badge tone={prop.status === 'approved' ? 'success' : prop.status === 'rejected' ? 'danger' : 'warning'}>
                      {prop.status === 'approved' ? 'Approved' : prop.status === 'rejected' ? 'Rejected' : `Pending (${approvedCount}/${courseCollabs.length})`}
                    </Badge>
                  </div>
                  <SurfaceTitle>{prop.lessonTitle}</SurfaceTitle>
                  <div className="text-xs text-[var(--text-secondary)] mt-1">
                    Đề xuất bởi <strong>{proposer?.name}</strong> · {prop.summary}
                  </div>
                </SurfaceHeader>

                <SurfaceContent className="space-y-5">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-[var(--accent-danger-soft)]/50 border border-[var(--accent-danger)]/30 space-y-1.5">
                      <div className="text-xs font-mono font-bold text-[var(--accent-danger-fg)]">TRƯỚC KHI SỬA</div>
                      <div className="text-xs text-[var(--text-primary)] whitespace-pre-line leading-relaxed max-h-52 overflow-y-auto">{prop.beforeContent}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[var(--accent-success-soft)]/50 border border-[var(--accent-success)]/30 space-y-1.5">
                      <div className="text-xs font-mono font-bold text-[var(--accent-success-fg)]">SAU KHI SỬA</div>
                      <div className="text-xs text-[var(--text-primary)] whitespace-pre-line leading-relaxed max-h-52 overflow-y-auto">{prop.afterContent}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {courseCollabs.map((lec) => {
                      const v = prop.votes[lec.id];
                      return (
                        <div key={lec.id} className="p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-bold text-[var(--text-primary)]">{lec.name}</span>
                            {v?.decision === 'approved' ? (
                              <CheckCircle2 className="w-4 h-4 text-[var(--accent-success)]" />
                            ) : v?.decision === 'rejected' ? (
                              <XCircle className="w-4 h-4 text-[var(--accent-danger)]" />
                            ) : (
                              <Clock className="w-4 h-4 text-[var(--accent-warning)]" />
                            )}
                          </div>
                          <div className="text-xs text-[var(--text-muted)] mt-1">
                            {v ? (v.decision === 'approved' ? 'Đã đồng ý' : 'Từ chối') : 'Chưa biểu quyết'}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {prop.status === 'pending' && (
                    <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-end gap-3">
                      <div className="flex-1">
                        <Input
                          label={`Nhận xét (${currentUser?.name})`}
                          value={comments[prop.id] ?? ''}
                          onChange={(e) => setComments((prev) => ({ ...prev, [prop.id]: e.target.value }))}
                          placeholder="Góp ý ngắn..."
                        />
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button variant="danger" disabled={myVote?.decision === 'rejected'} onClick={() => voteProposal(prop.id, 'rejected', comments[prop.id])}>
                          Từ chối
                        </Button>
                        <Button variant="success" disabled={myVote?.decision === 'approved'} onClick={() => voteProposal(prop.id, 'approved', comments[prop.id])}>
                          {myVote?.decision === 'approved' ? 'Đã đồng ý' : 'Đồng ý chỉnh sửa'}
                        </Button>
                      </div>
                    </div>
                  )}
                </SurfaceContent>
              </Surface>
            );
          })}
        </div>
      )}
    </div>
  );
};
