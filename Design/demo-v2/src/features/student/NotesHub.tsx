import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  FileText,
  Globe,
  Lock,
  Plus,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { Note, WrongAnswerRecord } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/DataFeedback';
import { Input, Select, Textarea } from '../../components/ui/FormControls';
import { ConfirmDialog, Modal } from '../../components/ui/Modal';
import { Surface, SurfaceContent } from '../../components/ui/Surface';
import { Tabs } from '../../components/ui/Tabs';

export const NotesHub: React.FC = () => {
  const { state, navigate, createNote, updateNote, deleteNote, resolveWrongAnswer, addToast } = useApp();
  const [activeTab, setActiveTab] = useState<'chapter' | 'global' | 'wrong'>('chapter');
  const [chapterFilter, setChapterFilter] = useState('all');

  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formChapterId, setFormChapterId] = useState('ch-3');
  const [formTags, setFormTags] = useState('');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [practicing, setPracticing] = useState<WrongAnswerRecord | null>(null);
  const [choice, setChoice] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  const mainCourse = state.courses[0];

  const chapterNotes = useMemo(
    () => state.notes.filter((n) => n.scope === 'chapter' && (chapterFilter === 'all' || n.chapterId === chapterFilter)),
    [state.notes, chapterFilter],
  );
  const globalNotes = useMemo(() => state.notes.filter((n) => n.scope === 'global'), [state.notes]);
  const wrongAnswers = useMemo(
    () => state.wrongAnswers.filter((w) => chapterFilter === 'all' || w.chapterId === chapterFilter),
    [state.wrongAnswers, chapterFilter],
  );

  const openNew = () => {
    setEditingNote(null);
    setFormTitle('');
    setFormContent('');
    setFormChapterId(state.activeChapterId || 'ch-3');
    setFormTags(activeTab === 'global' ? 'Global' : 'Chương học');
    setNoteModalOpen(true);
  };

  const openEdit = (note: Note) => {
    setEditingNote(note);
    setFormTitle(note.title);
    setFormContent(note.content);
    setFormChapterId(note.chapterId ?? 'ch-3');
    setFormTags(note.tags.join(', '));
    setNoteModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;
    const tags = formTags.split(',').map((t) => t.trim()).filter(Boolean);
    if (editingNote) {
      updateNote(editingNote.id, { title: formTitle.trim(), content: formContent.trim(), tags });
      addToast({ type: 'success', title: 'Đã cập nhật ghi chú' });
    } else {
      createNote({
        scope: activeTab === 'global' ? 'global' : 'chapter',
        courseId: activeTab === 'global' ? undefined : mainCourse.id,
        chapterId: activeTab === 'global' ? undefined : formChapterId,
        title: formTitle.trim(),
        content: formContent.trim(),
        tags,
        visibility: 'private',
      });
    }
    setNoteModalOpen(false);
  };

  const toggleVis = (note: Note) => {
    const next = note.visibility === 'private' ? 'public' : 'private';
    updateNote(note.id, { visibility: next });
    addToast({ type: 'info', title: next === 'public' ? 'Đã công khai ghi chú' : 'Đã đặt về Riêng tư' });
  };

  const renderNotes = (list: Note[]) => {
    if (list.length === 0) {
      return (
        <EmptyState
          icon={<FileText className="w-6 h-6" />}
          title="Chưa có ghi chú nào"
          description="Ghi chú mới mặc định ở chế độ Riêng tư."
          action={<Button onClick={openNew}>Tạo ghi chú</Button>}
        />
      );
    }
    return (
      <div className="space-y-3">
        {list.map((note) => {
          const ch = mainCourse.chapters.find((c) => c.id === note.chapterId);
          return (
            <Surface key={note.id} elevated>
              <SurfaceContent className="p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      tone={note.visibility === 'public' ? 'success' : 'neutral'}
                      icon={note.visibility === 'public' ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    >
                      {note.visibility === 'public' ? 'Công khai' : 'Riêng tư'}
                    </Badge>
                    {ch && <Badge tone="primary">Chương {ch.order}</Badge>}
                  </div>
                  <span className="text-xs font-mono text-[var(--text-muted)]">{note.updatedAt}</span>
                </div>

                <h3 className="text-base font-bold text-[var(--text-primary)]">{note.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] whitespace-pre-line leading-relaxed">{note.content}</p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => openEdit(note)}>Chỉnh sửa</Button>
                    <Button size="sm" variant="outline" onClick={() => toggleVis(note)}>
                      {note.visibility === 'private' ? 'Công khai' : 'Đặt riêng tư'}
                    </Button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {note.visibility === 'public' && (
                      <Button size="sm" variant="ghost" leftIcon={<ExternalLink className="w-3.5 h-3.5" />} onClick={() => navigate('shared-note', { noteId: note.id })}>
                        Trang chia sẻ
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => setDeleteTargetId(note.id)} aria-label="Xóa">
                      <Trash2 className="w-3.5 h-3.5 text-[var(--accent-danger)]" />
                    </Button>
                  </div>
                </div>
              </SurfaceContent>
            </Surface>
          );
        })}
      </div>
    );
  };

  const practiceQ = practicing ? state.questions.find((q) => q.id === practicing.questionId) : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Ghi chú & Câu hỏi sai</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Mặc định riêng tư (giảng viên không xem được). Có thể bật công khai để lấy đường dẫn chia sẻ.
          </p>
        </div>
        {activeTab !== 'wrong' && (
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={openNew}>
            {activeTab === 'global' ? 'Thêm Global Note' : 'Thêm Chapter Note'}
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs
          activeTab={activeTab}
          onChange={(t) => setActiveTab(t as typeof activeTab)}
          tabs={[
            { id: 'chapter', label: 'Chapter Notes', badge: state.notes.filter((n) => n.scope === 'chapter').length },
            { id: 'global', label: 'Global Notes', badge: globalNotes.length },
            { id: 'wrong', label: 'Wrong Answers', badge: state.wrongAnswers.filter((w) => w.status === 'needs_review').length },
          ]}
        />
        {activeTab !== 'global' && (
          <Select value={chapterFilter} onChange={(e) => setChapterFilter(e.target.value)} className="w-52">
            <option value="all">Tất cả chương</option>
            {mainCourse.chapters.map((ch) => (
              <option key={ch.id} value={ch.id}>Chương {ch.order}: {ch.title}</option>
            ))}
          </Select>
        )}
      </div>

      {activeTab === 'chapter' && renderNotes(chapterNotes)}
      {activeTab === 'global' && renderNotes(globalNotes)}

      {activeTab === 'wrong' && (
        <div className="space-y-4">
          {wrongAnswers.map((wa) => {
            const q = state.questions.find((item) => item.id === wa.questionId);
            const ch = mainCourse.chapters.find((c) => c.id === wa.chapterId);
            if (!q) return null;
            return (
              <Surface key={wa.id} elevated>
                <SurfaceContent className="p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {ch && <Badge tone="primary">Chương {ch.order}</Badge>}
                      <Badge
                        tone={wa.status === 'resolved' ? 'success' : 'danger'}
                        icon={wa.status === 'resolved' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                      >
                        {wa.status === 'resolved' ? 'Đã khắc phục' : 'Cần ôn lại'}
                      </Badge>
                    </div>
                    <span className="text-xs font-mono text-[var(--text-muted)]">{wa.lastAttemptAt}</span>
                  </div>

                  <div className="text-base font-bold text-[var(--text-primary)]">{q.prompt}</div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="p-3 rounded-xl bg-[var(--accent-danger-soft)] text-[var(--accent-danger-fg)]">
                      <div className="text-xs font-bold mb-1">Đã chọn sai</div>
                      <div>{q.options[wa.selectedIndex]}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--accent-success-soft)] text-[var(--accent-success-fg)]">
                      <div className="text-xs font-bold mb-1">Đáp án đúng</div>
                      <div>{q.options[q.correctIndex]}</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)] text-sm text-[var(--text-primary)]">
                    <strong>Giải thích:</strong> {q.explanation}
                  </div>

                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      variant="secondary"
                      leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                      onClick={() => {
                        setPracticing(wa);
                        setChoice(null);
                        setChecked(false);
                      }}
                    >
                      Luyện tập khắc phục
                    </Button>
                  </div>
                </SurfaceContent>
              </Surface>
            );
          })}
        </div>
      )}

      <Modal open={noteModalOpen} onClose={() => setNoteModalOpen(false)} title={editingNote ? 'Sửa ghi chú' : 'Ghi chú mới'}>
        <form onSubmit={handleSave} className="space-y-4">
          {!editingNote && activeTab === 'chapter' && (
            <Select label="Chương" value={formChapterId} onChange={(e) => setFormChapterId(e.target.value)}>
              {mainCourse.chapters.map((ch) => (
                <option key={ch.id} value={ch.id}>Chương {ch.order}: {ch.title}</option>
              ))}
            </Select>
          )}
          <Input label="Tiêu đề" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} required />
          <Textarea label="Nội dung" rows={5} value={formContent} onChange={(e) => setFormContent(e.target.value)} required />
          <Input label="Tags" value={formTags} onChange={(e) => setFormTags(e.target.value)} />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setNoteModalOpen(false)}>Hủy</Button>
            <Button type="submit">Lưu ghi chú</Button>
          </div>
        </form>
      </Modal>

      <Modal open={Boolean(practicing && practiceQ)} onClose={() => setPracticing(null)} title="Ôn luyện khắc phục câu sai" size="lg">
        {practicing && practiceQ && (
          <div className="space-y-4">
            <div className="font-bold text-[var(--text-primary)]">{practiceQ.prompt}</div>
            <div className="space-y-2">
              {practiceQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={checked}
                  onClick={() => setChoice(idx)}
                  className={`w-full p-3.5 rounded-xl border text-left text-sm cursor-pointer ${
                    checked && idx === practiceQ.correctIndex
                      ? 'bg-[var(--accent-success-soft)] border-[var(--accent-success)] text-[var(--accent-success-fg)]'
                      : checked && choice === idx
                        ? 'bg-[var(--accent-danger-soft)] border-[var(--accent-danger)] text-[var(--accent-danger-fg)]'
                        : choice === idx
                          ? 'bg-[var(--accent-primary-soft)] border-[var(--accent-primary)] text-[var(--accent-primary-fg)]'
                          : 'bg-[var(--bg-subtle)] border-[var(--border-subtle)] text-[var(--text-primary)]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {checked && <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)] text-sm"><strong>Giải thích:</strong> {practiceQ.explanation}</div>}
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setPracticing(null)}>Đóng</Button>
              {!checked ? (
                <Button disabled={choice === null} onClick={() => { setChecked(true); if (choice === practiceQ.correctIndex) resolveWrongAnswer(practicing.id); }}>
                  Kiểm tra
                </Button>
              ) : (
                <Button onClick={() => setPracticing(null)}>Hoàn tất</Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => { if (deleteTargetId) deleteNote(deleteTargetId); }}
        title="Xóa ghi chú?"
        message="Bạn có chắc chắn muốn xóa ghi chú này?"
        confirmLabel="Xóa"
      />
    </div>
  );
};
