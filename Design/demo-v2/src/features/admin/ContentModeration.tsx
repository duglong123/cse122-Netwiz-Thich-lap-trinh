import React, { useMemo, useState } from 'react';
import { Eye, History, Lock, MessageSquareWarning, Search, Unlock } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { Chapter, Course, Lesson } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input, Select, Textarea } from '../../components/ui/FormControls';
import { ConfirmDialog, Modal, SlideDrawer } from '../../components/ui/Modal';
import { Surface, SurfaceContent } from '../../components/ui/Surface';
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Kiểm duyệt nội dung</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Admin chỉ xem, gửi cảnh báo, khóa hoặc mở khóa (bảo toàn dữ liệu & lịch sử phiên bản).
        </p>
      </div>

      <Tabs
        activeTab={tab}
        onChange={(t) => setTab(t as 'content' | 'history')}
        tabs={[
          { id: 'content', label: 'Học liệu', badge: rows.length },
          { id: 'history', label: 'Lịch sử kiểm duyệt', icon: <History className="w-4 h-4" />, badge: state.moderationLogs.length },
        ]}
      />

      {tab === 'content' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-8 relative">
              <Input placeholder="Tìm bài học hoặc khóa học..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3 pointer-events-none" />
            </div>
            <div className="sm:col-span-4">
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
                <Surface key={lesson.id}>
                  <SurfaceContent className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone="primary">{course.code} · Ch.{chapter.order}</Badge>
                        <Badge tone="neutral">v{lesson.version}</Badge>
                        <Badge tone={mod.status === 'locked' ? 'danger' : mod.status === 'warned' ? 'warning' : 'success'}>
                          {mod.status === 'locked' ? 'Đã khóa' : mod.status === 'warned' ? 'Cảnh báo' : 'Bình thường'}
                        </Badge>
                      </div>
                      <div className="font-bold text-[var(--text-primary)]">{lesson.title}</div>
                      {mod.status === 'locked' && (
                        <div className="text-xs text-[var(--accent-danger-fg)]">
                          Lý do: {mod.reason} ({mod.lockedBy} · {mod.lockedAt})
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <Button size="sm" variant="ghost" leftIcon={<Eye className="w-3.5 h-3.5" />} onClick={() => setInspectRow(row)}>Xem</Button>
                      <Button size="sm" variant="secondary" leftIcon={<MessageSquareWarning className="w-3.5 h-3.5" />} onClick={() => { setWarnRow(row); setWarnReason(''); }}>Cảnh báo</Button>
                      {mod.status === 'locked' ? (
                        <Button size="sm" variant="success" leftIcon={<Unlock className="w-3.5 h-3.5" />} onClick={() => setUnlockRow(row)}>Mở khóa</Button>
                      ) : (
                        <Button size="sm" variant="danger" leftIcon={<Lock className="w-3.5 h-3.5" />} onClick={() => { setLockRow(row); setLockReason(''); }}>Khóa</Button>
                      )}
                    </div>
                  </SurfaceContent>
                </Surface>
              );
            })}
          </div>
        </div>
      ) : (
        <Surface>
          <SurfaceContent className="divide-y divide-[var(--border-subtle)] p-0">
            {state.moderationLogs.map((log) => (
              <div key={log.id} className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge tone={log.action === 'lock' ? 'danger' : log.action === 'unlock' ? 'success' : 'warning'}>{log.action.toUpperCase()}</Badge>
                    <span className="font-bold text-sm text-[var(--text-primary)]">{log.targetLabel}</span>
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">{log.reason} · {log.actorName}</div>
                </div>
                <span className="text-xs font-mono text-[var(--text-muted)] shrink-0">{log.timestamp}</span>
              </div>
            ))}
          </SurfaceContent>
        </Surface>
      )}

      {/* Read-Only SlideDrawer */}
      <SlideDrawer open={Boolean(inspectRow)} onClose={() => setInspectRow(null)} title={inspectRow?.lesson.title ?? ''} subtitle="Chế độ chỉ đọc (Admin không thể chỉnh sửa kiến thức)">
        {inspectRow && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[var(--bg-subtle)] text-sm text-[var(--text-primary)] whitespace-pre-line leading-relaxed">
              {inspectRow.lesson.content}
            </div>
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Lịch sử phiên bản ({inspectRow.lesson.versionHistory.length})</div>
              {inspectRow.lesson.versionHistory.map((v) => (
                <div key={v.version} className="p-3 rounded-xl bg-[var(--bg-subtle)] text-xs">
                  <strong className="font-mono">v{v.version}</strong> · {v.updatedBy} · {v.updatedAt} — {v.summary}
                </div>
              ))}
            </div>
          </div>
        )}
      </SlideDrawer>

      <Modal open={Boolean(warnRow)} onClose={() => setWarnRow(null)} title="Gửi cảnh báo / nhắc nhở">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!warnRow || !warnReason.trim()) return;
            sendModerationWarning({ courseId: warnRow.course.id, chapterId: warnRow.chapter.id, lessonId: warnRow.lesson.id, type: warnType, reason: warnReason.trim() });
            setWarnRow(null);
          }}
          className="space-y-4"
        >
          <Select label="Loại" value={warnType} onChange={(e) => setWarnType(e.target.value as 'warning' | 'reminder')}>
            <option value="warning">Cảnh báo nội dung</option>
            <option value="reminder">Nhắc nhở rà soát</option>
          </Select>
          <Textarea label="Nội dung gửi giảng viên" rows={4} value={warnReason} onChange={(e) => setWarnReason(e.target.value)} required />
          <div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => setWarnRow(null)}>Hủy</Button><Button type="submit">Gửi</Button></div>
        </form>
      </Modal>

      <Modal open={Boolean(lockRow)} onClose={() => setLockRow(null)} title="Khóa kiến thức">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!lockRow || !lockReason.trim()) return;
            lockLessonContent({ courseId: lockRow.course.id, chapterId: lockRow.chapter.id, lessonId: lockRow.lesson.id, reason: lockReason.trim() });
            setLockRow(null);
          }}
          className="space-y-4"
        >
          <Textarea label="Lý do khóa (bắt buộc)" rows={4} value={lockReason} onChange={(e) => setLockReason(e.target.value)} required />
          <div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => setLockRow(null)}>Hủy</Button><Button type="submit" variant="danger">Khóa nội dung</Button></div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(unlockRow)}
        onClose={() => setUnlockRow(null)}
        onConfirm={() => {
          if (!unlockRow) return;
          unlockLessonContent({ courseId: unlockRow.course.id, chapterId: unlockRow.chapter.id, lessonId: unlockRow.lesson.id, reason: 'Mở khóa sau khi xác minh.' });
        }}
        title="Mở khóa nội dung?"
        message={`Mở khóa lại "${unlockRow?.lesson.title ?? ''}" cho giảng viên và sinh viên?`}
        confirmLabel="Mở khóa"
        tone="primary"
      />
    </div>
  );
};
