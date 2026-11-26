import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Eye,
  History,
  Lock,
  MessageSquareWarning,
  Search,
  ShieldCheck,
  Unlock,
} from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { Chapter, Course, Lesson } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Input, Select, Textarea } from '../../components/ui/FormControls';
import { ConfirmDialog, Modal } from '../../components/ui/Modal';
import { Tabs } from '../../components/ui/Tabs';

interface LessonRow {
  course: Course;
  chapter: Chapter;
  lesson: Lesson;
}

export const ContentModeration: React.FC = () => {
  const { state, sendModerationWarning, lockLessonContent, unlockLessonContent } = useApp();
  const [tab, setTab] = useState<'content' | 'history'>('content');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'normal' | 'warned' | 'locked'>('all');

  // Inspect read-only modal
  const [inspectRow, setInspectRow] = useState<LessonRow | null>(null);

  // Warning/Reminder modal
  const [warnRow, setWarnRow] = useState<LessonRow | null>(null);
  const [warnType, setWarnType] = useState<'warning' | 'reminder'>('warning');
  const [warnReason, setWarnReason] = useState('');

  // Lock modal
  const [lockRow, setLockRow] = useState<LessonRow | null>(null);
  const [lockReason, setLockReason] = useState('');

  // Unlock confirm
  const [unlockRow, setUnlockRow] = useState<LessonRow | null>(null);

  const rows: LessonRow[] = useMemo(
    () =>
      state.courses.flatMap((course) =>
        course.chapters.flatMap((chapter) =>
          chapter.lessons.map((lesson) => ({ course, chapter, lesson })),
        ),
      ),
    [state.courses],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter(({ course, chapter, lesson }) => {
      const matchSearch =
        !q ||
        lesson.title.toLowerCase().includes(q) ||
        course.title.toLowerCase().includes(q) ||
        chapter.title.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'all' || lesson.moderation.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [rows, search, statusFilter]);

  const handleSendWarning = (e: React.FormEvent) => {
    e.preventDefault();
    if (!warnRow || !warnReason.trim()) return;
    sendModerationWarning({
      courseId: warnRow.course.id,
      chapterId: warnRow.chapter.id,
      lessonId: warnRow.lesson.id,
      type: warnType,
      reason: warnReason.trim(),
    });
    setWarnRow(null);
    setWarnReason('');
  };

  const handleLock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lockRow || !lockReason.trim()) return;
    lockLessonContent({
      courseId: lockRow.course.id,
      chapterId: lockRow.chapter.id,
      lessonId: lockRow.lesson.id,
      reason: lockReason.trim(),
    });
    setLockRow(null);
    setLockReason('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Kiểm duyệt nội dung kiến thức</h1>
          <p className="text-sm text-slate-400 mt-1">
            Admin chỉ có quyền Xem (chỉ đọc), Gửi cảnh báo/nhắc nhở, Khóa hoặc Mở khóa nội dung — giữ nguyên dữ liệu & lịch sử phiên bản.
          </p>
        </div>
        <Badge tone="amber" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
          Chế độ chỉ đọc kiến thức
        </Badge>
      </div>

      <Tabs
        activeTab={tab}
        onChange={(t) => setTab(t as 'content' | 'history')}
        tabs={[
          { id: 'content', label: 'Danh sách nội dung kiến thức', badge: rows.length },
          { id: 'history', label: 'Lịch sử cảnh báo & hành động', icon: <History className="w-4 h-4" />, badge: state.moderationLogs.length },
        ]}
      />

      {tab === 'content' ? (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-8 relative">
                <Input
                  placeholder="Tìm theo tên bài học, chương hoặc khóa học..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
              </div>
              <div className="md:col-span-4">
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}>
                  <option value="all">Tất cả trạng thái</option>
                  <option value="normal">Bình thường</option>
                  <option value="warned">Đang cảnh báo</option>
                  <option value="locked">Đã khóa</option>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {filtered.map((row) => {
              const { course, chapter, lesson } = row;
              const mod = lesson.moderation;
              return (
                <Card key={lesson.id}>
                  <CardContent className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone="cobalt">{course.code}</Badge>
                        <Badge tone="slate">Chương {chapter.order}</Badge>
                        <Badge tone="slate">v{lesson.version}</Badge>
                        {mod.status === 'normal' && <Badge tone="emerald">Bình thường</Badge>}
                        {mod.status === 'warned' && (
                          <Badge tone="amber" icon={<AlertTriangle className="w-3 h-3" />}>
                            Đang cảnh báo ({mod.warnings.length})
                          </Badge>
                        )}
                        {mod.status === 'locked' && (
                          <Badge tone="rose" icon={<Lock className="w-3 h-3" />}>
                            Đã khóa
                          </Badge>
                        )}
                      </div>

                      <div className="text-base font-bold text-white">{lesson.title}</div>

                      {mod.status === 'locked' && (
                        <div className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-2">
                          <strong>Lý do khóa:</strong> {mod.reason} · <span>{mod.lockedBy}</span> ·{' '}
                          <span className="font-mono">{mod.lockedAt}</span>
                        </div>
                      )}

                      {mod.status === 'warned' && mod.warnings[0] && (
                        <div className="text-xs text-amber-200 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2">
                          <strong>Cảnh báo gần nhất:</strong> {mod.warnings[0].message}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="ghost"
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                        onClick={() => setInspectRow(row)}
                      >
                        Xem (Chỉ đọc)
                      </Button>

                      <Button
                        size="sm"
                        variant="secondary"
                        leftIcon={<MessageSquareWarning className="w-3.5 h-3.5 text-amber-400" />}
                        onClick={() => {
                          setWarnRow(row);
                          setWarnType('warning');
                          setWarnReason('');
                        }}
                      >
                        Cảnh báo / Nhắc nhở
                      </Button>

                      {mod.status === 'locked' ? (
                        <Button
                          size="sm"
                          variant="success"
                          leftIcon={<Unlock className="w-3.5 h-3.5" />}
                          onClick={() => setUnlockRow(row)}
                        >
                          Mở khóa
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="danger"
                          leftIcon={<Lock className="w-3.5 h-3.5" />}
                          onClick={() => {
                            setLockRow(row);
                            setLockReason('');
                          }}
                        >
                          Khóa kiến thức
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="divide-y divide-slate-800/80 p-0">
            {state.moderationLogs.map((log) => (
              <div key={log.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge
                      tone={
                        log.action === 'lock'
                          ? 'rose'
                          : log.action === 'unlock'
                            ? 'emerald'
                            : 'amber'
                      }
                    >
                      {log.action === 'lock'
                        ? 'KHÓA NỘI DUNG'
                        : log.action === 'unlock'
                          ? 'MỞ KHÓA'
                          : log.action === 'warning'
                            ? 'CẢNH BÁO'
                            : 'NHẮC NHỞ'}
                    </Badge>
                    <span className="text-sm font-semibold text-white">{log.targetLabel}</span>
                  </div>
                  <div className="text-xs text-slate-300">Lý do: {log.reason}</div>
                  <div className="text-xs text-slate-500">Thực hiện bởi: {log.actorName}</div>
                </div>
                <span className="text-xs font-mono text-slate-400 shrink-0">{log.timestamp}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Read-only inspect modal */}
      <Modal
        open={Boolean(inspectRow)}
        onClose={() => setInspectRow(null)}
        title={inspectRow ? `Xem nội dung (Chỉ đọc): ${inspectRow.lesson.title}` : ''}
        description={
          inspectRow
            ? `${inspectRow.course.code} · Chương ${inspectRow.chapter.order} · Phiên bản v${inspectRow.lesson.version}`
            : ''
        }
        size="lg"
      >
        {inspectRow && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 whitespace-pre-line leading-relaxed">
              {inspectRow.lesson.content}
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Lịch sử phiên bản được bảo toàn ({inspectRow.lesson.versionHistory.length})
              </div>
              <div className="space-y-2">
                {inspectRow.lesson.versionHistory.map((vh) => (
                  <div key={vh.version} className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 text-xs">
                    <span className="font-mono text-blue-400">v{vh.version}</span> · {vh.updatedBy} · {vh.updatedAt} — {vh.summary}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Warning / Reminder Modal */}
      <Modal
        open={Boolean(warnRow)}
        onClose={() => setWarnRow(null)}
        title="Gửi cảnh báo / Nhắc nhở tới Giảng viên"
        description={warnRow ? warnRow.lesson.title : ''}
      >
        <form onSubmit={handleSendWarning} className="space-y-4">
          <Select label="Loại thông báo" value={warnType} onChange={(e) => setWarnType(e.target.value as 'warning' | 'reminder')}>
            <option value="warning">Cảnh báo nội dung (Warning)</option>
            <option value="reminder">Nhắc nhở rà soát (Reminder)</option>
          </Select>
          <Textarea
            label="Nội dung cảnh báo / yêu cầu kiểm tra"
            rows={4}
            placeholder="Ví dụ: Cần cập nhật lại ví dụ CIDR /27 hoặc bổ sung nguồn tham chiếu chuẩn..."
            value={warnReason}
            onChange={(e) => setWarnReason(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setWarnRow(null)}>Hủy</Button>
            <Button type="submit">Gửi thông báo</Button>
          </div>
        </form>
      </Modal>

      {/* Lock Modal */}
      <Modal
        open={Boolean(lockRow)}
        onClose={() => setLockRow(null)}
        title="Khóa phần kiến thức"
        description="Khi khóa, dữ liệu và lịch sử phiên bản vẫn được giữ nguyên. Giảng viên sẽ nhận thông báo để xử lý."
      >
        <form onSubmit={handleLock} className="space-y-4">
          <Textarea
            label="Lý do khóa nội dung (bắt buộc)"
            rows={4}
            placeholder="Nhập lý do cụ thể (ví dụ: Phát hiện sai sót kiến thức định tuyến cần xác minh trước kỳ thi)..."
            value={lockReason}
            onChange={(e) => setLockReason(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setLockRow(null)}>Hủy</Button>
            <Button type="submit" variant="danger">Xác nhận khóa kiến thức</Button>
          </div>
        </form>
      </Modal>

      {/* Unlock Confirm */}
      <ConfirmDialog
        open={Boolean(unlockRow)}
        onClose={() => setUnlockRow(null)}
        onConfirm={() => {
          if (!unlockRow) return;
          unlockLessonContent({
            courseId: unlockRow.course.id,
            chapterId: unlockRow.chapter.id,
            lessonId: unlockRow.lesson.id,
            reason: 'Quản trị viên xác nhận vấn đề đã được khắc phục và mở khóa lại nội dung.',
          });
        }}
        title="Mở khóa nội dung kiến thức?"
        message={`Nội dung "${unlockRow?.lesson.title ?? ''}" sẽ được mở khóa trở lại cho sinh viên học tập bình thường.`}
        confirmLabel="Mở khóa nội dung"
        tone="primary"
      />
    </div>
  );
};
