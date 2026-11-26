import React, { useMemo, useState } from 'react';
import {
  Archive,
  ArrowDown,
  ArrowUp,
  BookOpen,
  Edit3,
  FolderPlus,
  HelpCircle,
  Lock,
  Plus,
  Swords,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { Course, Lesson, Question } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input, Select, Textarea } from '../../components/ui/FormControls';
import { Modal } from '../../components/ui/Modal';
import { Surface, SurfaceContent, SurfaceHeader, SurfaceTitle } from '../../components/ui/Surface';
import { Tabs } from '../../components/ui/Tabs';

export const KnowledgeManagement: React.FC = () => {
  const {
    state,
    navigate,
    createCourse,
    addChapter,
    saveLessonOrPropose,
    reorderLesson,
    moveLessonToChapter,
    archiveOrDeleteLesson,
    upsertQuestion,
    deleteQuestion,
    updateBossConfig,
  } = useApp();

  const [selectedCourseId, setSelectedCourseId] = useState(state.courses[0]?.id ?? '');
  const [subTab, setSubTab] = useState<'structure' | 'questions' | 'boss'>('structure');
  const course = state.courses.find((c) => c.id === selectedCourseId) ?? state.courses[0];
  const isSharedCourse = course.collaboratorIds.length > 1;

  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [cCode, setCCode] = useState('');
  const [cTitle, setCTitle] = useState('');
  const [cSubtitle, setCSubtitle] = useState('');
  const [cLevel, setCLevel] = useState<Course['level']>('Cơ bản');

  const [chapterModalOpen, setChapterModalOpen] = useState(false);
  const [chTitle, setChTitle] = useState('');
  const [chSummary, setChSummary] = useState('');

  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [targetChapterId, setTargetChapterId] = useState('');
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [lTitle, setLTitle] = useState('');
  const [lDuration, setLDuration] = useState(15);
  const [lSummary, setLSummary] = useState('');
  const [lContent, setLContent] = useState('');
  const [lTakeaways, setLTakeaways] = useState('');
  const [proposalReason, setProposalReason] = useState('');

  const [qChapterFilter, setQChapterFilter] = useState('all');
  const [qModalOpen, setQModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [qChapterId, setQChapterId] = useState(course.chapters[0]?.id ?? '');
  const [qObjective, setQObjective] = useState('osi-pdu');
  const [qPrompt, setQPrompt] = useState('');
  const [qOptA, setQOptA] = useState('');
  const [qOptB, setQOptB] = useState('');
  const [qOptC, setQOptC] = useState('');
  const [qOptD, setQOptD] = useState('');
  const [qCorrectIdx, setQCorrectIdx] = useState(0);
  const [qExplanation, setQExplanation] = useState('');
  const [qDifficulty, setQDifficulty] = useState<Question['difficulty']>('basic');

  const [bossModalChapterId, setBossModalChapterId] = useState<string | null>(null);
  const [bName, setBName] = useState('');
  const [bHp, setBHp] = useState(100);
  const [bAtk, setBAtk] = useState(30);
  const [bTrait, setBTrait] = useState('');

  const courseQuestions = useMemo(
    () => state.questions.filter((q) => q.courseId === course.id && (qChapterFilter === 'all' || q.chapterId === qChapterFilter)),
    [state.questions, course.id, qChapterFilter],
  );

  const openNewLesson = (chapterId: string) => {
    setTargetChapterId(chapterId);
    setEditingLesson(null);
    setLTitle('');
    setLDuration(15);
    setLSummary('');
    setLContent('');
    setLTakeaways('');
    setProposalReason('');
    setLessonModalOpen(true);
  };

  const openEditLesson = (chapterId: string, les: Lesson) => {
    setTargetChapterId(chapterId);
    setEditingLesson(les);
    setLTitle(les.title);
    setLDuration(les.durationMinutes);
    setLSummary(les.summary);
    setLContent(les.content);
    setLTakeaways(les.keyTakeaways.join('\n'));
    setProposalReason('');
    setLessonModalOpen(true);
  };

  const handleSaveLesson = (e: React.FormEvent, asDraft?: boolean) => {
    e.preventDefault();
    if (!lTitle.trim() || !lContent.trim()) return;
    const res = saveLessonOrPropose({
      courseId: course.id,
      chapterId: targetChapterId,
      lessonId: editingLesson?.id,
      title: lTitle.trim(),
      durationMinutes: Number(lDuration) || 15,
      summary: lSummary.trim(),
      content: lContent.trim(),
      keyTakeaways: lTakeaways.split('\n').map((x) => x.trim()).filter(Boolean),
      status: asDraft ? 'draft' : 'published',
      proposalSummary: proposalReason,
    });
    setLessonModalOpen(false);
    if (res.mode === 'proposed') navigate('proposals');
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qPrompt.trim() || !qOptA.trim() || !qOptB.trim() || !qExplanation.trim()) return;
    upsertQuestion({
      id: editingQuestion?.id,
      courseId: course.id,
      chapterId: qChapterId,
      knowledgeObjective: qObjective.trim() || 'general',
      prompt: qPrompt.trim(),
      options: [qOptA.trim(), qOptB.trim(), qOptC.trim(), qOptD.trim()].filter(Boolean),
      correctIndex: qCorrectIdx,
      explanation: qExplanation.trim(),
      difficulty: qDifficulty,
    });
    setQModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Kiến thức & Ngân hàng đề</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Course → Chapter → Lesson. Ngân hàng câu hỏi tách rời.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={course.id} onChange={(e) => setSelectedCourseId(e.target.value)} className="w-56">
            {state.courses.map((c) => <option key={c.id} value={c.id}>{c.code} – {c.title}</option>)}
          </Select>
          <Button size="sm" variant="secondary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setCourseModalOpen(true)}>
            Tạo khóa
          </Button>
        </div>
      </div>

      {isSharedCourse && (
        <div className="p-4 rounded-xl bg-[var(--accent-primary-soft)] text-[var(--accent-primary-fg)] text-sm flex flex-wrap items-center justify-between gap-2">
          <span><strong>Khóa học chung ({course.collaboratorIds.length} GV):</strong> Sửa bài đã công bố sẽ tạo Đề xuất đồng thuận 100%.</span>
          <Button size="sm" variant="outline" onClick={() => navigate('proposals')}>Xem biểu quyết</Button>
        </div>
      )}

      <Tabs
        activeTab={subTab}
        onChange={(t) => setSubTab(t as typeof subTab)}
        tabs={[
          { id: 'structure', label: 'Bài giảng', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'questions', label: 'Ngân hàng câu hỏi', icon: <HelpCircle className="w-4 h-4" />, badge: courseQuestions.length },
          { id: 'boss', label: 'Boss & Nhiệm vụ', icon: <Swords className="w-4 h-4" /> },
        ]}
      />

      {subTab === 'structure' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" leftIcon={<FolderPlus className="w-4 h-4" />} onClick={() => setChapterModalOpen(true)}>Thêm chương</Button>
          </div>
          {course.chapters.map((ch) => (
            <Surface key={ch.id}>
              <SurfaceHeader className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-mono text-[var(--accent-primary)]">CHƯƠNG {ch.order}</div>
                  <SurfaceTitle>{ch.title}</SurfaceTitle>
                </div>
                <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => openNewLesson(ch.id)}>Thêm bài</Button>
              </SurfaceHeader>
              <SurfaceContent className="space-y-2.5">
                {ch.lessons.map((les, idx) => (
                  <div key={les.id} className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm text-[var(--text-primary)]">{ch.order}.{idx + 1} {les.title}</span>
                        <Badge tone={les.status === 'published' ? 'success' : les.status === 'draft' ? 'warning' : 'neutral'}>
                          {les.status === 'published' ? `v${les.version}` : les.status}
                        </Badge>
                        {les.moderation.status === 'locked' && <Badge tone="danger" icon={<Lock className="w-3 h-3" />}>Đã khóa</Badge>}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-1 shrink-0">
                      <Button size="sm" variant="ghost" disabled={idx === 0} onClick={() => reorderLesson(course.id, ch.id, les.id, 'up')}><ArrowUp className="w-3.5 h-3.5" /></Button>
                      <Button size="sm" variant="ghost" disabled={idx === ch.lessons.length - 1} onClick={() => reorderLesson(course.id, ch.id, les.id, 'down')}><ArrowDown className="w-3.5 h-3.5" /></Button>
                      {course.chapters.length > 1 && (
                        <select
                          aria-label="Chuyển chương"
                          value={ch.id}
                          onChange={(e) => moveLessonToChapter(course.id, ch.id, les.id, e.target.value)}
                          className="h-8 px-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-strong)] text-xs text-[var(--text-primary)]"
                        >
                          {course.chapters.map((tc) => <option key={tc.id} value={tc.id}>→ Ch.{tc.order}</option>)}
                        </select>
                      )}
                      <Button size="sm" variant="secondary" leftIcon={<Edit3 className="w-3.5 h-3.5" />} onClick={() => openEditLesson(ch.id, les)}>
                        {isSharedCourse && les.status === 'published' ? 'Đề xuất' : 'Sửa'}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => archiveOrDeleteLesson(course.id, ch.id, les.id, 'archive')} aria-label="Lưu trữ"><Archive className="w-3.5 h-3.5" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => archiveOrDeleteLesson(course.id, ch.id, les.id, 'delete')} aria-label="Xóa"><Trash2 className="w-3.5 h-3.5 text-[var(--accent-danger)]" /></Button>
                    </div>
                  </div>
                ))}
              </SurfaceContent>
            </Surface>
          ))}
        </div>
      )}

      {subTab === 'questions' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Select value={qChapterFilter} onChange={(e) => setQChapterFilter(e.target.value)} className="w-60">
              <option value="all">Tất cả chương</option>
              {course.chapters.map((ch) => <option key={ch.id} value={ch.id}>Chương {ch.order}: {ch.title}</option>)}
            </Select>
            <Button
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setEditingQuestion(null);
                setQChapterId(course.chapters[0]?.id ?? '');
                setQPrompt(''); setQOptA(''); setQOptB(''); setQOptC(''); setQOptD(''); setQExplanation('');
                setQModalOpen(true);
              }}
            >
              Thêm câu hỏi
            </Button>
          </div>
          {courseQuestions.map((q) => (
            <Surface key={q.id}>
              <SurfaceContent className="p-4 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge tone="primary">{q.knowledgeObjective}</Badge>
                    <Badge tone="neutral">{q.difficulty}</Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setEditingQuestion(q);
                        setQChapterId(q.chapterId);
                        setQObjective(q.knowledgeObjective);
                        setQPrompt(q.prompt);
                        setQOptA(q.options[0] ?? ''); setQOptB(q.options[1] ?? ''); setQOptC(q.options[2] ?? ''); setQOptD(q.options[3] ?? '');
                        setQCorrectIdx(q.correctIndex);
                        setQExplanation(q.explanation);
                        setQDifficulty(q.difficulty);
                        setQModalOpen(true);
                      }}
                    >
                      Sửa
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => deleteQuestion(q.id)}><Trash2 className="w-3.5 h-3.5 text-[var(--accent-danger)]" /></Button>
                  </div>
                </div>
                <div className="font-bold text-sm text-[var(--text-primary)]">{q.prompt}</div>
                <div className="text-xs text-[var(--accent-success)]">Đáp án: {q.options[q.correctIndex]}</div>
              </SurfaceContent>
            </Surface>
          ))}
        </div>
      )}

      {subTab === 'boss' && (
        <div className="space-y-3">
          {course.chapters.map((ch) => (
            <Surface key={ch.id}>
              <SurfaceContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img src={ch.boss.avatar} alt={ch.boss.name} className="w-14 h-14 rounded-xl object-cover" />
                  <div>
                    <div className="text-xs font-mono text-[var(--accent-danger)]">BOSS CHƯƠNG {ch.order}</div>
                    <div className="font-bold text-[var(--text-primary)]">{ch.boss.name}</div>
                    <div className="text-xs text-[var(--text-secondary)]">HP {ch.boss.maxHp} · ATK {ch.boss.attackPower} · {ch.boss.trait}</div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setBossModalChapterId(ch.id);
                    setBName(ch.boss.name);
                    setBHp(ch.boss.maxHp);
                    setBAtk(ch.boss.attackPower);
                    setBTrait(ch.boss.trait);
                  }}
                >
                  Chỉnh thông số Boss
                </Button>
              </SurfaceContent>
            </Surface>
          ))}
        </div>
      )}

      {/* Modals */}
      <Modal open={courseModalOpen} onClose={() => setCourseModalOpen(false)} title="Tạo khóa học mới">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!cCode.trim() || !cTitle.trim()) return;
            createCourse({ code: cCode.trim(), title: cTitle.trim(), subtitle: cSubtitle.trim() || 'Khóa học mới.', category: 'Mạng máy tính', level: cLevel, isPublic: true });
            setCourseModalOpen(false);
          }}
          className="space-y-4"
        >
          <Input label="Mã khóa học" value={cCode} onChange={(e) => setCCode(e.target.value)} required />
          <Input label="Tên khóa học" value={cTitle} onChange={(e) => setCTitle(e.target.value)} required />
          <Textarea label="Mô tả" rows={2} value={cSubtitle} onChange={(e) => setCSubtitle(e.target.value)} />
          <Select label="Cấp độ" value={cLevel} onChange={(e) => setCLevel(e.target.value as Course['level'])}>
            <option value="Cơ bản">Cơ bản</option><option value="Trung cấp">Trung cấp</option><option value="Nâng cao">Nâng cao</option>
          </Select>
          <div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => setCourseModalOpen(false)}>Hủy</Button><Button type="submit">Tạo</Button></div>
        </form>
      </Modal>

      <Modal open={chapterModalOpen} onClose={() => setChapterModalOpen(false)} title="Thêm chương mới">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!chTitle.trim()) return;
            addChapter(course.id, chTitle.trim(), chSummary.trim());
            setChTitle(''); setChSummary(''); setChapterModalOpen(false);
          }}
          className="space-y-4"
        >
          <Input label="Tên chương" value={chTitle} onChange={(e) => setChTitle(e.target.value)} required />
          <Textarea label="Tóm tắt" rows={3} value={chSummary} onChange={(e) => setChSummary(e.target.value)} />
          <div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => setChapterModalOpen(false)}>Hủy</Button><Button type="submit">Thêm</Button></div>
        </form>
      </Modal>

      <Modal open={lessonModalOpen} onClose={() => setLessonModalOpen(false)} title={editingLesson ? 'Cập nhật bài học' : 'Thêm bài học'} size="lg">
        <form onSubmit={(e) => handleSaveLesson(e)} className="space-y-4">
          <Input label="Tiêu đề" value={lTitle} onChange={(e) => setLTitle(e.target.value)} required />
          <Input label="Tóm tắt" value={lSummary} onChange={(e) => setLSummary(e.target.value)} />
          <Textarea label="Nội dung kiến thức" rows={6} value={lContent} onChange={(e) => setLContent(e.target.value)} required />
          <Textarea label="Điểm cốt lõi (mỗi dòng 1 ý)" rows={2} value={lTakeaways} onChange={(e) => setLTakeaways(e.target.value)} />
          {isSharedCourse && editingLesson?.status === 'published' && (
            <Input label="Lý do đề xuất chỉnh sửa" value={proposalReason} onChange={(e) => setProposalReason(e.target.value)} required />
          )}
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setLessonModalOpen(false)}>Hủy</Button>
            <Button type="button" variant="secondary" onClick={(e) => handleSaveLesson(e, true)}>Lưu nháp</Button>
            <Button type="submit">{isSharedCourse && editingLesson?.status === 'published' ? 'Gửi đề xuất 100%' : 'Công bố'}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={qModalOpen} onClose={() => setQModalOpen(false)} title={editingQuestion ? 'Sửa câu hỏi' : 'Thêm câu hỏi'} size="lg">
        <form onSubmit={handleSaveQuestion} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Select label="Chương" value={qChapterId} onChange={(e) => setQChapterId(e.target.value)}>
              {course.chapters.map((ch) => <option key={ch.id} value={ch.id}>Chương {ch.order}</option>)}
            </Select>
            <Input label="Mục tiêu kiến thức" value={qObjective} onChange={(e) => setQObjective(e.target.value)} />
          </div>
          <Textarea label="Câu hỏi" rows={2} value={qPrompt} onChange={(e) => setQPrompt(e.target.value)} required />
          <div className="grid grid-cols-2 gap-2">
            <Input label="A" value={qOptA} onChange={(e) => setQOptA(e.target.value)} required />
            <Input label="B" value={qOptB} onChange={(e) => setQOptB(e.target.value)} required />
            <Input label="C" value={qOptC} onChange={(e) => setQOptC(e.target.value)} required />
            <Input label="D" value={qOptD} onChange={(e) => setQOptD(e.target.value)} required />
          </div>
          <Select label="Đáp án đúng" value={qCorrectIdx} onChange={(e) => setQCorrectIdx(Number(e.target.value))}>
            <option value={0}>A</option><option value={1}>B</option><option value={2}>C</option><option value={3}>D</option>
          </Select>
          <Textarea label="Giải thích" rows={2} value={qExplanation} onChange={(e) => setQExplanation(e.target.value)} required />
          <div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => setQModalOpen(false)}>Hủy</Button><Button type="submit">Lưu</Button></div>
        </form>
      </Modal>

      <Modal open={Boolean(bossModalChapterId)} onClose={() => setBossModalChapterId(null)} title="Cấu hình Boss">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!bossModalChapterId) return;
            updateBossConfig(course.id, bossModalChapterId, { name: bName, maxHp: Number(bHp), attackPower: Number(bAtk), trait: bTrait });
            setBossModalChapterId(null);
          }}
          className="space-y-4"
        >
          <Input label="Tên Boss" value={bName} onChange={(e) => setBName(e.target.value)} required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Max HP" type="number" value={bHp} onChange={(e) => setBHp(Number(e.target.value))} />
            <Input label="ATK" type="number" value={bAtk} onChange={(e) => setBAtk(Number(e.target.value))} />
          </div>
          <Input label="Đặc điểm" value={bTrait} onChange={(e) => setBTrait(e.target.value)} />
          <div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => setBossModalChapterId(null)}>Hủy</Button><Button type="submit">Lưu</Button></div>
        </form>
      </Modal>
    </div>
  );
};
