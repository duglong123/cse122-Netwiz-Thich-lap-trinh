import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  GitPullRequest,
  Users,
  XCircle,
} from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/DataFeedback';
import { Input } from '../../components/ui/FormControls';
import { Tabs } from '../../components/ui/Tabs';

export const SharedProposals: React.FC = () => {
  const { state, currentUser, switchActiveLecturer, voteProposal } = useApp();
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [voteComments, setVoteComments] = useState<Record<string, string>>({});

  const activeLecId = currentUser?.id ?? state.lecturers[0].id;
  const mainCourse = state.courses[0];
  const collaborators = state.lecturers.filter((l) => mainCourse.collaboratorIds.includes(l.id));

  const filtered = useMemo(
    () => state.proposals.filter((p) => statusFilter === 'all' || p.status === statusFilter),
    [state.proposals, statusFilter],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Đồng thuận chỉnh sửa khóa học chung
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Quy tắc bắt buộc: Chỉ công bố phiên bản mới khi <strong>100% giảng viên tham gia</strong> đều biểu quyết Đồng ý.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400">Đang biểu quyết với tư cách:</span>
          {collaborators.map((lec) => (
            <button
              key={lec.id}
              type="button"
              onClick={() => switchActiveLecturer(lec.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                lec.id === activeLecId
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {lec.name}
            </button>
          ))}
        </div>
      </div>

      {/* Collaborating Lecturers */}
      <Card>
        <CardContent className="p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Users className="w-4 h-4 text-blue-400" />
            <span>Giảng viên cùng sử dụng {mainCourse.code} ({collaborators.length} người):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {collaborators.map((lec) => (
              <Badge key={lec.id} tone={lec.id === activeLecId ? 'emerald' : 'slate'}>
                {lec.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

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
        <EmptyState
          icon={<GitPullRequest className="w-6 h-6" />}
          title="Không có đề xuất nào ở trạng thái này"
          description="Khi giảng viên chỉnh sửa bài học đã công bố trong khóa học chung, đề xuất mới sẽ xuất hiện tại đây."
        />
      ) : (
        <div className="space-y-5">
          {filtered.map((prop) => {
            const course = state.courses.find((c) => c.id === prop.courseId) ?? mainCourse;
            const courseCollabs = state.lecturers.filter((l) => course.collaboratorIds.includes(l.id));
            const proposer = state.lecturers.find((l) => l.id === prop.proposerId);
            const myVote = prop.votes[activeLecId];
            const approvedCount = courseCollabs.filter(
              (l) => prop.votes[l.id]?.decision === 'approved',
            ).length;

            return (
              <Card key={prop.id}>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="cobalt">{course.code}</Badge>
                      <Badge
                        tone={
                          prop.status === 'approved'
                            ? 'emerald'
                            : prop.status === 'rejected'
                              ? 'rose'
                              : 'amber'
                        }
                      >
                        {prop.status === 'approved'
                          ? 'Approved (Đã công bố)'
                          : prop.status === 'rejected'
                            ? 'Rejected (Không áp dụng)'
                            : `Pending (${approvedCount}/${courseCollabs.length} đồng thuận)`}
                      </Badge>
                    </div>
                    <CardTitle>{prop.lessonTitle}</CardTitle>
                    <div className="text-xs text-slate-400">
                      Đề xuất bởi <strong className="text-slate-200">{proposer?.name}</strong> · {prop.createdAt} — {prop.summary}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-5">
                  {/* Before / After Diff */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/25 space-y-2">
                      <div className="text-xs font-mono font-semibold uppercase text-rose-300">
                        Nội dung trước khi sửa (Current)
                      </div>
                      <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed max-h-56 overflow-y-auto">
                        {prop.beforeContent}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/25 space-y-2">
                      <div className="text-xs font-mono font-semibold uppercase text-emerald-300">
                        Nội dung sau khi sửa (Proposed)
                      </div>
                      <div className="text-xs text-slate-200 whitespace-pre-line leading-relaxed max-h-56 overflow-y-auto">
                        {prop.afterContent}
                      </div>
                    </div>
                  </div>

                  {/* Collaborator Vote Matrix */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Trạng thái biểu quyết từng giảng viên ({approvedCount}/{courseCollabs.length})
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {courseCollabs.map((lec) => {
                        const vote = prop.votes[lec.id];
                        return (
                          <div
                            key={lec.id}
                            className={`p-3 rounded-xl border ${
                              vote?.decision === 'approved'
                                ? 'bg-emerald-500/10 border-emerald-500/35'
                                : vote?.decision === 'rejected'
                                  ? 'bg-rose-500/10 border-rose-500/35'
                                  : 'bg-slate-900 border-slate-800'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-semibold text-white">{lec.name}</span>
                              {vote?.decision === 'approved' ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              ) : vote?.decision === 'rejected' ? (
                                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                              ) : (
                                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                              )}
                            </div>
                            <div className="text-xs text-slate-400 mt-1">
                              {vote
                                ? `${vote.decision === 'approved' ? 'Đã đồng ý' : 'Đã từ chối'} · ${vote.votedAt}`
                                : 'Chưa biểu quyết'}
                            </div>
                            {vote?.comment && (
                              <div className="text-xs text-slate-300 mt-1 italic">“{vote.comment}”</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Voting Controls for active lecturer */}
                  {prop.status === 'pending' && (
                    <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                      <div className="flex-1">
                        <Input
                          label={`Nhận xét biểu quyết (${currentUser?.name})`}
                          placeholder="Nhập ghi chú góp ý trước khi chốt..."
                          value={voteComments[prop.id] ?? ''}
                          onChange={(e) =>
                            setVoteComments((prev) => ({ ...prev, [prop.id]: e.target.value }))
                          }
                        />
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="danger"
                          disabled={myVote?.decision === 'rejected'}
                          leftIcon={<XCircle className="w-4 h-4" />}
                          onClick={() => voteProposal(prop.id, 'rejected', voteComments[prop.id])}
                        >
                          Từ chối
                        </Button>
                        <Button
                          variant="success"
                          disabled={myVote?.decision === 'approved'}
                          leftIcon={<CheckCircle2 className="w-4 h-4" />}
                          onClick={() => voteProposal(prop.id, 'approved', voteComments[prop.id])}
                        >
                          {myVote?.decision === 'approved' ? 'Bạn đã đồng ý' : 'Đồng ý chỉnh sửa'}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
