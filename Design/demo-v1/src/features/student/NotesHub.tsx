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
import { Card, CardContent } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/DataFeedback';
import { Input, Select, Textarea } from '../../components/ui/FormControls';
import { ConfirmDialog, Modal } from '../../components/ui/Modal';
import { Tabs } from '../../components/ui/Tabs';

export const NotesHub: React.FC = () => {
  const {
    state,
    navigate,
    createNote,
    updateNote,
    deleteNote,
    resolveWrongAnswer,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'chapter' | 'global' | 'wrong'>('chapter');
  const [chapterFilter, setChapterFilter] = useState<string>('all');
  const [wrongStatusFilter, setWrongStatusFilter] = useState<'all' | 'needs_review' | 'resolved'>('all');

  // Note editor modal
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formChapterId, setFormChapterId] = useState('ch-3');
  const [formTags, setFormTags] = useState('');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Wrong answer practice modal
  const [practicingRecord, setPracticingRecord] = useState<WrongAnswerRecord | null>(null);
  const [practiceChoice, setPracticeChoice] = useState<number | null>(null);
  const [practiceChecked, setPracticeChecked] = useState(false);

  const mainCourse = state.courses[0];

  const chapterNotes = useMemo(
    () =>
      state.notes.filter(
        (n) => n.scope === 'chapter' && (chapterFilter === 'all' || n.chapterId === chapterFilter),
      ),
    [state.notes, chapterFilter],
  );

  const globalNotes = useMemo(
    () => state.notes.filter((n) => n.scope === 'global'),
    [state.notes],
  );

  const filteredWrongAnswers = useMemo(
    () =>
      state.wrongAnswers.filter(
        (w) =>
          (chapterFilter === 'all' || w.chapterId === chapterFilter) &&
          (wrongStatusFilter === 'all' || w.status === wrongStatusFilter),
      ),
    [state.wrongAnswers, chapterFilter, wrongStatusFilter],
  );

  const openNewNoteModal = (scope: 'chapter' | 'global') => {
    setEditingNote(null);
    setFormTitle('');
    setFormContent('');
    setFormChapterId(state.activeChapterId || 'ch-3');
    setFormTags(scope === 'global' ? 'Global, Ôn tập' : 'Chương học');
    setNoteModalOpen(true);
  };

  const openEditNoteModal = (note: Note) => {
    setEditingNote(note);
    setFormTitle(note.title);
    setFormContent(note.content);
    setFormChapterId(note.chapterId ?? 'ch-3');
    setFormTags(note.tags.join(', '));
    setNoteModalOpen(true);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;
    const tags = formTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingNote) {
      updateNote(editingNote.id, {
        title: formTitle.trim(),
        content: formContent.trim(),
        tags,
      });
      addToast({ type: 'success', title: 'Đã cập nhật ghi chú' });
    } else {
      createNote({
        scope: activeTab === 'global' ? 'global' : 'chapter',
        courseId: activeTab === 'global' ? undefined : mainCourse.id,
        chapterId: activeTab === 'global' ? undefined : formChapterId,
        title: formTitle.trim(),
        content: formContent.trim(),
        tags,
        visibility: 'private', // Always private by default!
      });
    }
    setNoteModalOpen(false);
  };

  const toggleVisibility = (note: Note) => {
    const nextVis = note.visibility === 'private' ? 'public' : 'private';
    updateNote(note.id, { visibility: nextVis });
    addToast({
      type: nextVis === 'public' ? 'success' : 'info',
      title: nextVis === 'public' ? 'Đã công khai ghi chú' : 'Đã chuyển về Riêng tư',
      message:
        nextVis === 'public'
          ? 'Mọi người có thể xem qua trang chia sẻ công khai.'
          : 'Chỉ bạn có thể xem ghi chú này.',
    });
  };

  const renderNoteCards = (list: Note[], scope: 'chapter' | 'global') => {
    if (list.length === 0) {
      return (
        <EmptyState
          icon={<FileText className="w-6 h-6" />}
          title="Chưa có ghi chú nào"
          description="Tạo ghi chú mới để lưu kiến thức. Mọi ghi chú mặc định ở chế độ Riêng tư."
          action={<Button onClick={() => openNewNoteModal(scope)}>Tạo ghi chú đầu tiên</Button>}
        />
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {list.map((note) => {
          const ch = mainCourse.chapters.find((c) => c.id === note.chapterId);
          return (
            <Card key={note.id} className="flex flex-col justify-between">
              <CardContent className="p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge
                      tone={note.visibility === 'public' ? 'emerald' : 'slate'}
                      icon={note.visibility === 'public' ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    >
                      {note.visibility === 'public' ? 'Công khai' : 'Riêng tư'}
                    </Badge>
                    {ch && <Badge tone="cobalt">Chương {ch.order}</Badge>}
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">{note.updatedAt}</span>
                </div>

                <h3 className="text-base font-bold text-white">{note.title}</h3>
                <p className="text-sm text-slate-300 whitespace-pre-line line-clamp-4">{note.content}</p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {note.tags.map((t) => (
                    <span key={t} className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      #{t}
                    </span>
                  ))}
                </div>
              </CardContent>

              <div className="px-5 py-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <Button size="sm" variant="secondary" onClick={() => openEditNoteModal(note)}>
                    Chỉnh sửa
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleVisibility(note)}
                  >
                    {note.visibility === 'private' ? 'Công khai' : 'Đặt riêng tư'}
                  </Button>
                </div>

                <div className="flex items-center gap-1.5">
                  {note.visibility === 'public' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
                      onClick={() => navigate('shared-note', { noteId: note.id })}
                    >
                      Trang chia sẻ
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-rose-400 hover:text-rose-300"
                    onClick={() => setDeleteTargetId(note.id)}
                    aria-label="Xóa ghi chú"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    );
  };

  const practiceQuestion = practicingRecord
    ? state.questions.find((q) => q.id === practicingRecord.questionId)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Ghi chú & Câu hỏi trả lời sai</h1>
          <p className="text-sm text-slate-400 mt-1">
            Ghi chú cá nhân mặc định là Riêng tư (Giảng viên không thể xem). Bạn có thể chia sẻ công khai từng ghi chú.
          </p>
        </div>

        {activeTab !== 'wrong' && (
          <Button
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => openNewNoteModal(activeTab === 'global' ? 'global' : 'chapter')}
          >
            {activeTab === 'global' ? 'Thêm Global Note' : 'Thêm Chapter Note'}
          </Button>
        )}
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <Tabs
          activeTab={activeTab}
          onChange={(t) => setActiveTab(t as 'chapter' | 'global' | 'wrong')}
          tabs={[
            { id: 'chapter', label: 'Chapter Notes', badge: state.notes.filter((n) => n.scope === 'chapter').length },
            { id: 'global', label: 'Global Notes', badge: globalNotes.length },
            {
              id: 'wrong',
              label: 'Wrong Answers',
              badge: state.wrongAnswers.filter((w) => w.status === 'needs_review').length,
            },
          ]}
        />

        {activeTab !== 'global' && (
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={chapterFilter}
              onChange={(e) => setChapterFilter(e.target.value)}
              className="w-48"
            >
              <option value="all">Tất cả chương</option>
              {mainCourse.chapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  Chương {ch.order}: {ch.title}
                </option>
              ))}
            </Select>
            {activeTab === 'wrong' && (
              <Select
                value={wrongStatusFilter}
                onChange={(e) => setWrongStatusFilter(e.target.value as typeof wrongStatusFilter)}
                className="w-44"
              >
                <option value="all">Mọi trạng thái</option>
                <option value="needs_review">Cần ôn lại</option>
                <option value="resolved">Đã khắc phục</option>
              </Select>
            )}
          </div>
        )}
      </div>

      {activeTab === 'chapter' && renderNoteCards(chapterNotes, 'chapter')}
      {activeTab === 'global' && renderNoteCards(globalNotes, 'global')}

      {activeTab === 'wrong' && (
        <div className="space-y-4">
          {filteredWrongAnswers.length === 0 ? (
            <EmptyState
              icon={<CheckCircle2 className="w-6 h-6 text-emerald-400" />}
              title="Không có câu hỏi sai nào trong bộ lọc này"
              description="Các câu hỏi bạn trả lời sai trong Boss Battle sẽ được lưu tại đây kèm lời giải thích."
            />
          ) : (
            filteredWrongAnswers.map((wa) => {
              const q = state.questions.find((item) => item.id === wa.questionId);
              const ch = mainCourse.chapters.find((c) => c.id === wa.chapterId);
              if (!q) return null;
              return (
                <Card key={wa.id}>
                  <CardContent className="p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone="cobalt">{mainCourse.code}</Badge>
                        {ch && <Badge tone="slate">Chương {ch.order}: {ch.title}</Badge>}
                        <Badge
                          tone={wa.status === 'resolved' ? 'emerald' : 'rose'}
                          icon={
                            wa.status === 'resolved' ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : (
                              <AlertCircle className="w-3.5 h-3.5" />
                            )
                          }
                        >
                          {wa.status === 'resolved' ? 'Đã khắc phục' : 'Cần ôn lại'}
                        </Badge>
                      </div>
                      <span className="text-xs font-mono text-slate-500">
                        Lần sai: {wa.attempts} · {wa.lastAttemptAt}
                      </span>
                    </div>

                    <div className="text-base font-bold text-white">{q.prompt}</div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30">
                        <div className="text-xs font-semibold text-rose-300 mb-1">Đáp án bạn đã chọn sai</div>
                        <div className="text-slate-200">{q.options[wa.selectedIndex] ?? 'Không xác định'}</div>
                      </div>
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                        <div className="text-xs font-semibold text-emerald-300 mb-1">Đáp án đúng</div>
                        <div className="text-slate-200">{q.options[q.correctIndex]}</div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-300 leading-relaxed">
                      <strong className="text-blue-300">Giải thích:</strong> {q.explanation}
                    </div>

                    <div className="flex flex-wrap justify-end gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                        onClick={() => {
                          setPracticingRecord(wa);
                          setPracticeChoice(null);
                          setPracticeChecked(false);
                        }}
                      >
                        Luyện tập khắc phục câu này
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* Note Create / Edit Modal */}
      <Modal
        open={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        title={editingNote ? 'Chỉnh sửa ghi chú' : 'Tạo ghi chú mới'}
        description="Ghi chú mới mặc định ở chế độ Riêng tư (chỉ chủ sở hữu nhìn thấy)."
      >
        <form onSubmit={handleSaveNote} className="space-y-4">
          {!editingNote && activeTab === 'chapter' && (
            <Select
              label="Thuộc chương"
              value={formChapterId}
              onChange={(e) => setFormChapterId(e.target.value)}
            >
              {mainCourse.chapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  Chương {ch.order}: {ch.title}
                </option>
              ))}
            </Select>
          )}
          <Input
            label="Tiêu đề ghi chú"
            placeholder="Ví dụ: Tóm tắt quy trình ARP & Routing"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            required
          />
          <Textarea
            label="Nội dung ghi chú"
            rows={5}
            placeholder="Nhập nội dung ghi chú học tập của bạn..."
            value={formContent}
            onChange={(e) => setFormContent(e.target.value)}
            required
          />
          <Input
            label="Thẻ phân loại (phân cách bằng dấu phẩy)"
            value={formTags}
            onChange={(e) => setFormTags(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setNoteModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit">Lưu ghi chú</Button>
          </div>
        </form>
      </Modal>

      {/* Practice Wrong Answer Modal */}
      <Modal
        open={Boolean(practicingRecord && practiceQuestion)}
        onClose={() => setPracticingRecord(null)}
        title="Ôn luyện khắc phục câu trả lời sai"
        size="lg"
      >
        {practicingRecord && practiceQuestion && (
          <div className="space-y-4">
            <div className="text-base font-bold text-white">{practiceQuestion.prompt}</div>
            <div className="space-y-2">
              {practiceQuestion.options.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={practiceChecked}
                  onClick={() => setPracticeChoice(idx)}
                  className={`w-full p-3.5 rounded-xl border text-left text-sm cursor-pointer ${
                    practiceChecked && idx === practiceQuestion.correctIndex
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-200'
                      : practiceChecked && practiceChoice === idx
                        ? 'bg-rose-500/15 border-rose-500 text-rose-200'
                        : practiceChoice === idx
                          ? 'bg-blue-600/20 border-blue-400 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {practiceChecked && (
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-200">
                <strong>Giải thích:</strong> {practiceQuestion.explanation}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setPracticingRecord(null)}>
                Đóng
              </Button>
              {!practiceChecked ? (
                <Button
                  disabled={practiceChoice === null}
                  onClick={() => {
                    setPracticeChecked(true);
                    if (practiceChoice === practiceQuestion.correctIndex) {
                      resolveWrongAnswer(practicingRecord.id);
                    }
                  }}
                >
                  Kiểm tra đáp án
                </Button>
              ) : (
                <Button onClick={() => setPracticingRecord(null)}>Hoàn tất</Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId) deleteNote(deleteTargetId);
        }}
        title="Xóa ghi chú?"
        message="Bạn có chắc chắn muốn xóa ghi chú này không? Hành động không thể hoàn tác."
        confirmLabel="Xóa ghi chú"
      />
    </div>
  );
};
