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
  Search,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { Note, WrongAnswerRecord } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/DataFeedback';
import { Input, Select, Textarea } from '../../components/ui/FormControls';
import { ConfirmDialog, Modal } from '../../components/ui/Modal';
import { Eyebrow, Panel, PanelContent } from '../../components/ui/Panel';
import { Tabs } from '../../components/ui/Tabs';

export const NotesHub: React.FC = () => {
  const { state, navigate, createNote, updateNote, deleteNote, resolveWrongAnswer, addToast } = useApp();
  const [activeTab, setActiveTab] = useState<'chapter' | 'global' | 'wrong'>('chapter');
  const [chapterFilter, setChapterFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [wrongStatusFilter, setWrongStatusFilter] = useState<'all' | 'needs_review' | 'resolved'>('all');

  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formChapterId, setFormChapterId] = useState('ch-3');
  const [formTags, setFormTags] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [practicing, setPracticing] = useState<WrongAnswerRecord | null>(null);
  const [choice, setChoice] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  const mainCourse = state.courses[0];
  const qLower = searchQuery.trim().toLowerCase();

  const chapterNotes = useMemo(
    () =>
      state.notes.filter(
        (n) =>
          n.scope === 'chapter' &&
          (chapterFilter === 'all' || n.chapterId === chapterFilter) &&
          (!qLower || n.title.toLowerCase().includes(qLower) || n.content.toLowerCase().includes(qLower)),
      ),
    [state.notes, chapterFilter, qLower],
  );
  const globalNotes = useMemo(
    () =>
      state.notes.filter(
        (n) =>
          n.scope === 'global' &&
          (!qLower || n.title.toLowerCase().includes(qLower) || n.content.toLowerCase().includes(qLower)),
      ),
    [state.notes, qLower],
  );
  const wrongAnswers = useMemo(
    () =>
      state.wrongAnswers.filter(
        (w) =>
          (chapterFilter === 'all' || w.chapterId === chapterFilter) &&
          (wrongStatusFilter === 'all' || w.status === wrongStatusFilter),
      ),
    [state.wrongAnswers, chapterFilter, wrongStatusFilter],
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
    addToast({ type: next === 'public' ? 'success' : 'info', title: next === 'public' ? 'Đã công khai ghi chú' : 'Đã đặt về Riêng tư' });
  };

  const renderNotes = (list: Note[]) => {
    if (list.length === 0) {
      return <EmptyState icon={<FileText className="w-6 h-6" />} title="Chưa có ghi chú phù hợp" description="Ghi chú mặc định ở chế độ Riêng tư." action={<Button onClick={openNew}>Tạo ghi chú</Button>} />;
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {list.map((note) => {
          const ch = mainCourse.chapters.find((c) => c.id === note.chapterId);
          return (
            <Panel key={note.id} className="flex flex-col justify-between">
              <PanelContent className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Badge tone={note.visibility === 'public' ? 'green' : 'muted'} icon={note.visibility === 'public' ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}>
                      {note.visibility === 'public' ? 'Công khai' : 'Riêng tư'}
                    </Badge>
                    {ch && <Badge tone="yellow">Ch.{ch.order}</Badge>}
                  </div>
                  <span className="text-[11px] mono text-[#98a7bd]">{note.updatedAt}</span>
                </div>
                <h3 className="text-lg font-extrabold text-[#f3f6fc] leading-snug">{note.title}</h3>
                <p className="text-sm text-[#c5d1e2] whitespace-pre-line line-clamp-5 leading-relaxed">{note.content}</p>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#26334a]">
                  <div className="flex gap-1.5">
                    <Button size="sm" variant="secondary" onClick={() => openEdit(note)}>Sửa</Button>
                    <Button size="sm" variant="outline" onClick={() => toggleVis(note)}>
                      {note.visibility === 'private' ? 'Công khai' : 'Riêng tư'}
                    </Button>
                  </div>
                  <div className="flex gap-1">
                    {note.visibility === 'public' && (
                      <Button size="sm" variant="ghost" leftIcon={<ExternalLink className="w-3.5 h-3.5" />} onClick={() => navigate('shared-note', { noteId: note.id })}>
                        Chia sẻ
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => setDeleteId(note.id)} aria-label="Xóa">
                      <Trash2 className="w-3.5 h-3.5 text-[#ef4444]" />
                    </Button>
                  </div>
                </div>
              </PanelContent>
            </Panel>
          );
        })}
      </div>
    );
  };

  const practiceQ = practicing ? state.questions.find((q) => q.id === practicing.questionId) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <Eyebrow>Knowledge Vault // Privacy Protected</Eyebrow>
          <h1 className="display-font text-4xl font-extrabold text-[#f3f6fc] mt-2">Sổ tay & Câu hỏi sai</h1>
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
            { id: 'global', label: 'Global Notes', badge: state.notes.filter((n) => n.scope === 'global').length },
            { id: 'wrong', label: 'Wrong Answers', badge: state.wrongAnswers.filter((w) => w.status === 'needs_review').length },
          ]}
        />

        <div className="flex flex-wrap items-center gap-2">
          {activeTab !== 'wrong' && (
            <div className="relative w-56">
              <Input
                placeholder="Tìm trong ghi chú..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
              <Search className="w-3.5 h-3.5 text-[#98a7bd] absolute left-3 top-3 pointer-events-none" />
            </div>
          )}
          {activeTab !== 'global' && (
            <Select value={chapterFilter} onChange={(e) => setChapterFilter(e.target.value)} className="w-48">
              <option value="all">Tất cả chương</option>
              {mainCourse.chapters.map((ch) => <option key={ch.id} value={ch.id}>Chương {ch.order}: {ch.title}</option>)}
            </Select>
          )}
          {activeTab === 'wrong' && (
            <Select value={wrongStatusFilter} onChange={(e) => setWrongStatusFilter(e.target.value as typeof wrongStatusFilter)} className="w-44">
              <option value="all">Mọi trạng thái</option>
              <option value="needs_review">Cần ôn lại</option>
              <option value="resolved">Đã khắc phục</option>
            </Select>
          )}
        </div>
      </div>

      {activeTab === 'chapter' && renderNotes(chapterNotes)}
      {activeTab === 'global' && renderNotes(globalNotes)}

      {activeTab === 'wrong' && (
        <div className="space-y-4">
          {wrongAnswers.length === 0 ? (
            <EmptyState icon={<CheckCircle2 className="w-6 h-6 text-[#45d483]" />} title="Không có câu sai ở bộ lọc này" description="Các câu trả lời sai trong Boss Battle sẽ được lưu tại đây kèm lời giải thích." />
          ) : (
            wrongAnswers.map((wa) => {
              const q = state.questions.find((item) => item.id === wa.questionId);
              const ch = mainCourse.chapters.find((c) => c.id === wa.chapterId);
              if (!q) return null;
              return (
                <Panel key={wa.id} accent={wa.status === 'resolved' ? '#45d483' : '#ef4444'}>
                  <PanelContent className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {ch && <Badge tone="yellow">Chương {ch.order}</Badge>}
                        <Badge tone={wa.status === 'resolved' ? 'green' : 'red'} icon={wa.status === 'resolved' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}>
                          {wa.status === 'resolved' ? 'Đã khắc phục' : 'Cần ôn lại'}
                        </Badge>
                      </div>
                      <span className="text-xs mono text-[#98a7bd]">{wa.lastAttemptAt}</span>
                    </div>
                    <div className="text-base font-bold text-[#f3f6fc]">{q.prompt}</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm leading-relaxed">
                      <div className="p-3.5 rounded-lg bg-[#ef4444]/10 border border-[#ef4444]/35 text-[#ff9494]">
                        <strong>Bạn chọn sai:</strong> {q.options[wa.selectedIndex]}
                      </div>
                      <div className="p-3.5 rounded-lg bg-[#45d483]/10 border border-[#45d483]/35 text-[#75e6a5]">
                        <strong>Đáp án đúng:</strong> {q.options[q.correctIndex]}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-[#0a111e] border border-[#26334a] text-sm text-[#c5d1e2] leading-relaxed">
                      <strong className="text-[#f4d35e]">Giải thích:</strong> {q.explanation}
                    </div>
                    <div className="flex justify-end">
                      <Button size="sm" variant="secondary" leftIcon={<RotateCcw className="w-3.5 h-3.5" />} onClick={() => { setPracticing(wa); setChoice(null); setChecked(false); }}>
                        Luyện tập khắc phục
                      </Button>
                    </div>
                  </PanelContent>
                </Panel>
              );
            })
          )}
        </div>
      )}

      <Modal open={noteModalOpen} onClose={() => setNoteModalOpen(false)} title={editingNote ? 'Sửa ghi chú' : 'Ghi chú mới'}>
        <form onSubmit={handleSave} className="space-y-4">
          {!editingNote && activeTab === 'chapter' && (
            <Select label="Chương" value={formChapterId} onChange={(e) => setFormChapterId(e.target.value)}>
              {mainCourse.chapters.map((ch) => <option key={ch.id} value={ch.id}>Chương {ch.order}: {ch.title}</option>)}
            </Select>
          )}
          <Input label="Tiêu đề" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} required />
          <Textarea label="Nội dung" rows={5} value={formContent} onChange={(e) => setFormContent(e.target.value)} required />
          <Input label="Tags" value={formTags} onChange={(e) => setFormTags(e.target.value)} />
          <div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => setNoteModalOpen(false)}>Hủy</Button><Button type="submit">Lưu</Button></div>
        </form>
      </Modal>

      <Modal open={Boolean(practicing && practiceQ)} onClose={() => setPracticing(null)} title="Khắc phục câu sai" size="lg">
        {practicing && practiceQ && (
          <div className="space-y-4">
            <div className="text-base font-bold text-[#f3f6fc]">{practiceQ.prompt}</div>
            <div className="space-y-2">
              {practiceQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={checked}
                  onClick={() => setChoice(idx)}
                  className={`w-full p-3.5 rounded-lg border text-left text-sm cursor-pointer ${
                    checked && idx === practiceQ.correctIndex
                      ? 'border-[#45d483] bg-[#45d483]/15 text-[#75e6a5]'
                      : checked && choice === idx
                        ? 'border-[#ef4444] bg-[#ef4444]/15 text-[#ff9494]'
                        : choice === idx
                          ? 'border-[#f4d35e] bg-[#f4d35e]/15 text-[#f4d35e]'
                          : 'border-[#26334a] bg-[#0a111e] text-[#c5d1e2]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {checked && <div className="p-4 rounded-lg bg-[#0a111e] border border-[#26334a] text-sm text-[#c5d1e2] leading-relaxed"><strong>Giải thích:</strong> {practiceQ.explanation}</div>}
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setPracticing(null)}>Đóng</Button>
              {!checked ? (
                <Button disabled={choice === null} onClick={() => { setChecked(true); if (choice === practiceQ.correctIndex) resolveWrongAnswer(practicing.id); }}>Kiểm tra</Button>
              ) : (
                <Button onClick={() => setPracticing(null)}>Hoàn tất</Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) deleteNote(deleteId); }}
        title="Xóa ghi chú?"
        message="Bạn có chắc chắn muốn xóa ghi chú này?"
        confirmLabel="Xóa"
      />
    </div>
  );
};
