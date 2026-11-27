import React, { useMemo, useState } from 'react';
import { Eye, History, Lock, MessageSquareWarning, Search, Unlock } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { Chapter, Course, Lesson } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input, Select, Textarea } from '../../components/ui/FormControls';
import { ConfirmDialog, Modal } from '../../components/ui/Modal';
import { Eyebrow, Panel, PanelContent } from '../../components/ui/Panel';
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

  const [inspectRow, setInspectRow] = useState<LessonRow | null>(null);
  const [warnRow, setWarnRow] = useState<LessonRow | null>(null);
  const [warnType, setWarnType] = useState<'warning' | 'reminder'>('warning');
  const [warnReason, setWarnReason] = useState('');
  const [lockRow, setLockRow] = useState<LessonRow | null>(null);
  const [lockReason, setLockReason] = useState('');
  const [unlockRow, setUnlockRow] = useState<LessonRow | null>(null);

  const rows: LessonRow[] = useMemo(
    () => state.courses.flatMap((course) => course.chapters.flatMap((chapter) => chapter.lessons.map((lesson) => ({ course, chapter, lesson })))),
    [state.courses],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter(({ course, chapter, lesson }) => {
      const mQ = !q || lesson.title.toLowerCase().includes(q) || course.title.toLowerCase().includes(q) || chapter.title.toLowerCase().includes(q);
      const mS = statusFilter === 'all' || lesson.moderation.status === statusFilter;
      return mQ && mS;
    });
  }, [rows, search, statusFilter]);

  return (
    <div className="space-y-6">
      <div>
        <Eyebrow color="#4da3ff">Read-Only Knowledge Policy</Eyebrow>
        <h1 className="display-font text-4xl font-extrabold text-[#f3f6fc] mt-2">Kiểm duyệt nội dung</h1>
      </div>

      <Tabs
        activeTab={tab}
        onChange={(t) => setTab(t as 'content' | 'history')}
        tabs={[
          { id: 'content', label: 'Học liệu', badge: rows.length },
          { id: 'history', label: 'Lịch sử xử lý', icon: <History className="w-3.5 h-3.5" />, badge: state.moderationLogs.length },
        ]}
      />

      {tab === 'content' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-8 relative">
              <Input placeholder="Tìm bài học hoặc khóa học..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
              <Search className="w-4 h-4 text-[#98a7bd] absolute left-3.5 top-3 pointer-events-none" />
            </div>
            <div className="md:col-span-4">
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}>
                <option value="all">Tất cả trạng thái</option>
                <option value="normal">Bình thường</option>
                <option value="warned">Đang cảnh báo</option>
                <option value="locked">Đã khóa</option>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            {filtered.map((row) => {
              const { course, chapter, lesson } = row;
              const mod = lesson.moderation;
              return (
                <Panel key={lesson.id} accent={mod.status === 'locked' ? '#ef4444' : mod.status === 'warned' ? '#f4d35e' : undefined}>
                  <PanelContent className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone="blue">{course.code} · Ch.{chapter.order}</Badge>
                        <Badge tone="muted">v{lesson.version}</Badge>
                        <Badge tone={mod.status === 'locked' ? 'red' : mod.status === 'warned' ? 'yellow' : 'green'}>
                          {mod.status === 'locked' ? 'Đã khóa' : mod.status === 'warned' ? 'Đang cảnh báo' : 'Bình thường'}
                        </Badge>
                      </div>
                      <div className="text-base font-bold text-[#f3f6fc]">{lesson.title}</div>
                      {mod.status === 'locked' && (
                        <div className="text-xs text-[#ff7b7b]">Lý do: {mod.reason} · {mod.lockedBy} · {mod.lockedAt}</div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 shrink-0">
                      <Button size="sm" variant="ghost" leftIcon={<Eye className="w-3.5 h-3.5" />} onClick={() => setInspectRow(row)}>Xem (Chỉ đọc)</Button>
                      <Button size="sm" variant="secondary" leftIcon={<MessageSquareWarning className="w-3.5 h-3.5" />} onClick={() => { setWarnRow(row); setWarnReason(''); }}>Cảnh báo</Button>
                      {mod.status === 'locked' ? (
                        <Button size="sm" variant="success" leftIcon={<Unlock className="w-3.5 h-3.5" />} onClick={() => setUnlockRow(row)}>Mở khóa</Button>
                      ) : (
                        <Button size="sm" variant="danger" leftIcon={<Lock className="w-3.5 h-3.5" />} onClick={() => { setLockRow(row); setLockReason(''); }}>Khóa</Button>
                      )}
                    </div>
                  </PanelContent>
                </Panel>
              );
            })}
          </div>
        </div>
      ) : (
        <Panel>
          <PanelContent className="divide-y divide-[#26334a] p-0">
            {state.moderationLogs.map((log) => (
              <div key={log.id} className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge tone={log.action === 'lock' ? 'red' : log.action === 'unlock' ? 'green' : 'yellow'}>{log.action.toUpperCase()}</Badge>
                    <span className="text-sm font-bold text-[#f3f6fc]">{log.targetLabel}</span>
                  </div>
                  <div className="text-xs text-[#98a7bd]">{log.reason} · {log.actorName}</div>
                </div>
                <span className="text-xs mono text-[#98a7bd]">{log.timestamp}</span>
              </div>
            ))}
          </PanelContent>
        </Panel>
      )}

      <Modal open={Boolean(inspectRow)} onClose={() => setInspectRow(null)} title={inspectRow ? `Chỉ đọc: ${inspectRow.lesson.title}` : ''} size="lg">
        {inspectRow && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#0a111e] border border-[#26334a] text-sm text-[#c5d1e2] whitespace-pre-line">{inspectRow.lesson.content}</div>
            <div className="space-y-1.5">
              <div className="text-xs font-bold uppercase text-[#98a7bd]">Lịch sử phiên bản được bảo toàn ({inspectRow.lesson.versionHistory.length})</div>
              {inspectRow.lesson.versionHistory.map((v) => (
                <div key={v.version} className="p-2.5 rounded-lg bg-[#0a111e] border border-[#26334a] text-xs">
                  <strong className="mono text-[#f4d35e]">v{v.version}</strong> · {v.updatedBy} · {v.updatedAt} — {v.summary}
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      <Modal open={Boolean(warnRow)} onClose={() => setWarnRow(null)} title="Gửi cảnh báo / nhắc nhở">
        <form onSubmit={(e) => { e.preventDefault(); if (!warnRow || !warnReason.trim()) return; sendModerationWarning({ courseId: warnRow.course.id, chapterId: warnRow.chapter.id, lessonId: warnRow.lesson.id, type: warnType, reason: warnReason.trim() }); setWarnRow(null); }} className="space-y-4">
          <Select label="Loại" value={warnType} onChange={(e) => setWarnType(e.target.value as 'warning' | 'reminder')}><option value="warning">Cảnh báo</option><option value="reminder">Nhắc nhở</option></Select>
          <Textarea label="Nội dung" rows={4} value={warnReason} onChange={(e) => setWarnReason(e.target.value)} required />
          <div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => setWarnRow(null)}>Hủy</Button><Button type="submit">Gửi</Button></div>
        </form>
      </Modal>

      <Modal open={Boolean(lockRow)} onClose={() => setLockRow(null)} title="Khóa kiến thức">
        <form onSubmit={(e) => { e.preventDefault(); if (!lockRow || !lockReason.trim()) return; lockLessonContent({ courseId: lockRow.course.id, chapterId: lockRow.chapter.id, lessonId: lockRow.lesson.id, reason: lockReason.trim() }); setLockRow(null); }} className="space-y-4">
          <Textarea label="Lý do khóa (bắt buộc)" rows={4} value={lockReason} onChange={(e) => setLockReason(e.target.value)} required />
          <div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => setLockRow(null)}>Hủy</Button><Button type="submit" variant="danger">Khóa nội dung</Button></div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(unlockRow)}
        onClose={() => setUnlockRow(null)}
        onConfirm={() => { if (unlockRow) unlockLessonContent({ courseId: unlockRow.course.id, chapterId: unlockRow.chapter.id, lessonId: unlockRow.lesson.id, reason: 'Admin mở khóa sau khi xác minh.' }); }}
        title="Mở khóa nội dung?"
        message={`Mở khóa lại "${unlockRow?.lesson.title ?? ''}"?`}
        confirmLabel="Mở khóa"
        tone="primary"
      />
    </div>
  );
};
