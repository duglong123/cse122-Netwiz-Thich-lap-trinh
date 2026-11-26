import React, { useMemo, useState } from 'react';
import {
  Archive,
  ArrowDown,
  ArrowUp,
  BookOpen,
  Edit3,
  FolderPlus,
  GitPullRequest,
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
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input, Select, Textarea } from '../../components/ui/FormControls';
import { Modal } from '../../components/ui/Modal';
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

  // Course modal
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [cCode, setCCode] = useState('');
  const [cTitle, setCTitle] = useState('');
  const [cSubtitle, setCSubtitle] = useState('');
  const [cCategory, setCCategory] = useState('Mạng máy tính');
  const [cLevel, setCLevel] = useState<Course['level']>('Cơ bản');

  // Chapter modal
  const [chapterModalOpen, setChapterModalOpen] = useState(false);
  const [chTitle, setChTitle] = useState('');
  const [chSummary, setChSummary] = useState('');

  // Lesson modal
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [targetChapterId, setTargetChapterId] = useState('');
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [lTitle, setLTitle] = useState('');
  const [lDuration, setLDuration] = useState(15);
  const [lSummary, setLSummary] = useState('');
  const [lContent, setLContent] = useState('');
  const [lTakeaways, setLTakeaways] = useState('');
  const [lStatus, setLStatus] = useState<Lesson['status']>('published');
  const [proposalReason, setProposalReason] = useState('');

  // Question Bank state
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

  // Boss Config modal
  const [bossModalChapterId, setBossModalChapterId] = useState<string | null>(null);
  const [bName, setBName] = useState('');
  const [bTitle, setBTitle] = useState('');
  const [bHp, setBHp] = useState(100);
  const [bAtk, setBAtk] = useState(30);
  const [bTrait, setBTrait] = useState('');

  const courseQuestions = useMemo(
    () =>
      state.questions.filter(
        (q) =>
          q.courseId === course.id &&
          (qChapterFilter === 'all' || q.chapterId === qChapterFilter),
      ),
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
    setLStatus('published');
    setProposalReason('');
    setLessonModalOpen(true);
  };

  const openEditLesson = (chapterId: string, lesson: Lesson) => {
    setTargetChapterId(chapterId);
    setEditingLesson(lesson);
    setLTitle(lesson.title);
    setLDuration(lesson.durationMinutes);
    setLSummary(lesson.summary);
    setLContent(lesson.content);
    setLTakeaways(lesson.keyTakeaways.join('\n'));
    setLStatus(lesson.status);
    setProposalReason('');
    setLessonModalOpen(true);
  };

  const handleSaveLesson = (e: React.FormEvent, saveAsDraft?: boolean) => {
    e.preventDefault();
    if (!lTitle.trim() || !lContent.trim()) return;
    const finalStatus: Lesson['status'] = saveAsDraft ? 'draft' : lStatus;
    const result = saveLessonOrPropose({
      courseId: course.id,
      chapterId: targetChapterId,
      lessonId: editingLesson?.id,
      title: lTitle.trim(),
      durationMinutes: Number(lDuration) || 15,
      summary: lSummary.trim(),
      content: lContent.trim(),
      keyTakeaways: lTakeaways
        .split('\n')
        .map((t) => t.trim())
        .filter(Boolean),
      status: finalStatus,
      proposalSummary: proposalReason,
    });
    setLessonModalOpen(false);
    if (result.mode === 'proposed') {
      navigate('proposals');
    }
  };

  const openNewQuestion = () => {
    setEditingQuestion(null);
    setQChapterId(course.chapters[0]?.id ?? '');
    setQObjective('osi-pdu');
    setQPrompt('');
    setQOptA('');
    setQOptB('');
    setQOptC('');
    setQOptD('');
    setQCorrectIdx(0);
    setQExplanation('');
    setQDifficulty('basic');
    setQModalOpen(true);
  };

  const openEditQuestion = (q: Question) => {
    setEditingQuestion(q);
    setQChapterId(q.chapterId);
    setQObjective(q.knowledgeObjective);
    setQPrompt(q.prompt);
    setQOptA(q.options[0] ?? '');
    setQOptB(q.options[1] ?? '');
    setQOptC(q.options[2] ?? '');
    setQOptD(q.options[3] ?? '');
    setQCorrectIdx(q.correctIndex);
    setQExplanation(q.explanation);
    setQDifficulty(q.difficulty);
    setQModalOpen(true);
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
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Quản lý Kiến thức & Ngân hàng đề</h1>
          <p className="text-sm text-slate-400 mt-1">
            Cấu trúc Course → Chapter → Lesson → Knowledge Content. Ngân hàng câu hỏi tách rời để tái sử dụng.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Select
            value={course.id}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-60"
          >
            {state.courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} – {c.title}
              </option>
            ))}
          </Select>
          <Button variant="secondary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setCourseModalOpen(true)}>
            Tạo khóa học
          </Button>
        </div>
      </div>

      {isSharedCourse && (
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-blue-200">
          <span>
            <strong>Khóa học đồng sở hữu ({course.collaboratorIds.length} giảng viên):</strong> Khi chỉnh sửa bài học đã công bố, hệ thống tự động tạo{' '}
            <em>Đề xuất chỉnh sửa</em> thay vì ghi đè trực tiếp.
          </span>
          <Button size="sm" variant="outline" leftIcon={<GitPullRequest className="w-3.5 h-3.5" />} onClick={() => navigate('proposals')}>
            Xem biểu quyết
          </Button>
        </div>
      )}

      <Tabs
        activeTab={subTab}
        onChange={(t) => setSubTab(t as typeof subTab)}
        tabs={[
          { id: 'structure', label: 'Chương & Nội dung kiến thức', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'questions', label: 'Ngân hàng câu hỏi (Tách rời)', icon: <HelpCircle className="w-4 h-4" />, badge: courseQuestions.length },
          { id: 'boss', label: 'Nhiệm vụ & Boss theo chương', icon: <Swords className="w-4 h-4" /> },
        ]}
      />

      {/* TAB 1: Structure */}
      {subTab === 'structure' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" leftIcon={<FolderPlus className="w-4 h-4" />} onClick={() => setChapterModalOpen(true)}>
              Thêm chương mới
            </Button>
          </div>

          {course.chapters.map((ch) => (
            <Card key={ch.id}>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-mono text-blue-400">CHƯƠNG {ch.order}</div>
                  <CardTitle>{ch.title}</CardTitle>
                  <p className="text-xs text-slate-400 mt-0.5">{ch.summary}</p>
                </div>
                <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => openNewLesson(ch.id)}>
                  Thêm bài kiến thức
                </Button>
              </CardHeader>

              <CardContent className="space-y-2.5">
                {ch.lessons.length === 0 ? (
                  <div className="text-xs text-slate-500 py-3">Chưa có bài học nào trong chương này.</div>
                ) : (
                  ch.lessons.map((les, idx) => (
                    <div
                      key={les.id}
                      className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-white">
                            {ch.order}.{idx + 1} {les.title}
                          </span>
                          <Badge tone={les.status === 'published' ? 'emerald' : les.status === 'draft' ? 'amber' : 'slate'}>
                            {les.status === 'published' ? `Published v${les.version}` : les.status === 'draft' ? 'Bản nháp (Draft)' : 'Đã lưu trữ'}
                          </Badge>
                          {les.moderation.status === 'locked' && (
                            <Badge tone="rose" icon={<Lock className="w-3 h-3" />}>
                              Admin đã khóa
                            </Badge>
                          )}
                          {les.moderation.status === 'warned' && (
                            <Badge tone="amber">Cảnh báo Admin</Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1">{les.summary}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={idx === 0}
                          onClick={() => reorderLesson(course.id, ch.id, les.id, 'up')}
                          aria-label="Lên"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={idx === ch.lessons.length - 1}
                          onClick={() => reorderLesson(course.id, ch.id, les.id, 'down')}
                          aria-label="Xuống"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </Button>

                        {course.chapters.length > 1 && (
                          <select
                            aria-label="Chuyển sang chương khác"
                            value={ch.id}
                            onChange={(e) => moveLessonToChapter(course.id, ch.id, les.id, e.target.value)}
                            className="h-8 px-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300"
                          >
                            {course.chapters.map((targetCh) => (
                              <option key={targetCh.id} value={targetCh.id}>
                                Chuyển → Ch.{targetCh.order}
                              </option>
                            ))}
                          </select>
                        )}

                        <Button
                          size="sm"
                          variant="secondary"
                          leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                          onClick={() => openEditLesson(ch.id, les)}
                        >
                          {isSharedCourse && les.status === 'published' ? 'Đề xuất sửa' : 'Sửa'}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => archiveOrDeleteLesson(course.id, ch.id, les.id, 'archive')}
                          aria-label="Lưu trữ bài học"
                        >
                          <Archive className="w-3.5 h-3.5 text-amber-400" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => archiveOrDeleteLesson(course.id, ch.id, les.id, 'delete')}
                          aria-label="Xóa bài học"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 2: Question Bank */}
      {subTab === 'questions' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <Select
              value={qChapterFilter}
              onChange={(e) => setQChapterFilter(e.target.value)}
              className="w-64"
            >
              <option value="all">Tất cả chương</option>
              {course.chapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  Chương {ch.order}: {ch.title}
                </option>
              ))}
            </Select>
            <Button leftIcon={<Plus className="w-4 h-4" />} onClick={openNewQuestion}>
              Tạo câu hỏi mới
            </Button>
          </div>

          <div className="space-y-3">
            {courseQuestions.map((q) => {
              const ch = course.chapters.find((c) => c.id === q.chapterId);
              return (
                <Card key={q.id}>
                  <CardContent className="p-4 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {ch && <Badge tone="cobalt">Chương {ch.order}</Badge>}
                        <Badge tone="slate">Mục tiêu: {q.knowledgeObjective}</Badge>
                        <Badge tone={q.difficulty === 'advanced' ? 'rose' : q.difficulty === 'intermediate' ? 'amber' : 'emerald'}>
                          {q.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Button size="sm" variant="secondary" onClick={() => openEditQuestion(q)}>
                          Sửa
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => deleteQuestion(q.id)}>
                          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-white">{q.prompt}</div>
                    <div className="text-xs text-emerald-300">
                      Đáp án đúng: {q.options[q.correctIndex]}
                    </div>
                    <div className="text-xs text-slate-400">
                      Giải thích: {q.explanation}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Boss & Mission Config */}
      {subTab === 'boss' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {course.chapters.map((ch) => (
            <Card key={ch.id}>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={ch.boss.avatar}
                    alt={ch.boss.name}
                    className="w-16 h-16 rounded-xl object-cover border border-rose-500/40 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-mono text-rose-400">BOSS CHƯƠNG {ch.order}</div>
                    <div className="text-base font-bold text-white truncate">{ch.boss.name}</div>
                    <div className="text-xs text-slate-400">
                      HP: {ch.boss.maxHp} · ATK: {ch.boss.attackPower} · {ch.boss.trait}
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
                  <strong>Nhiệm vụ giữa chương:</strong> {ch.mission.title} ({ch.mission.type})
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setBossModalChapterId(ch.id);
                    setBName(ch.boss.name);
                    setBTitle(ch.boss.title);
                    setBHp(ch.boss.maxHp);
                    setBAtk(ch.boss.attackPower);
                    setBTrait(ch.boss.trait);
                  }}
                >
                  Tùy chỉnh thông số Boss
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Course Modal */}
      <Modal open={courseModalOpen} onClose={() => setCourseModalOpen(false)} title="Tạo khóa học mới">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!cCode.trim() || !cTitle.trim()) return;
            createCourse({
              code: cCode.trim(),
              title: cTitle.trim(),
              subtitle: cSubtitle.trim() || 'Khóa học mới được tạo từ trình biên soạn NetWiz.',
              category: cCategory.trim(),
              level: cLevel,
              isPublic: true,
            });
            setCourseModalOpen(false);
          }}
          className="space-y-4"
        >
          <Input label="Mã khóa học" placeholder="CN-205" value={cCode} onChange={(e) => setCCode(e.target.value)} required />
          <Input label="Tên khóa học" placeholder="Cloud Networking Fundamentals" value={cTitle} onChange={(e) => setCTitle(e.target.value)} required />
          <Textarea label="Mô tả ngắn" rows={2} value={cSubtitle} onChange={(e) => setCSubtitle(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Lĩnh vực" value={cCategory} onChange={(e) => setCCategory(e.target.value)} />
            <Select label="Cấp độ" value={cLevel} onChange={(e) => setCLevel(e.target.value as Course['level'])}>
              <option value="Cơ bản">Cơ bản</option>
              <option value="Trung cấp">Trung cấp</option>
              <option value="Nâng cao">Nâng cao</option>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setCourseModalOpen(false)}>Hủy</Button>
            <Button type="submit">Tạo khóa học</Button>
          </div>
        </form>
      </Modal>

      {/* Chapter Modal */}
      <Modal open={chapterModalOpen} onClose={() => setChapterModalOpen(false)} title="Thêm chương học mới">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!chTitle.trim()) return;
            addChapter(course.id, chTitle.trim(), chSummary.trim());
            setChTitle('');
            setChSummary('');
            setChapterModalOpen(false);
          }}
          className="space-y-4"
        >
          <Input label="Tên chương" placeholder="Ví dụ: IPv6 & Routing Protocols" value={chTitle} onChange={(e) => setChTitle(e.target.value)} required />
          <Textarea label="Tóm tắt mục tiêu chương" rows={3} value={chSummary} onChange={(e) => setChSummary(e.target.value)} />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setChapterModalOpen(false)}>Hủy</Button>
            <Button type="submit">Thêm chương</Button>
          </div>
        </form>
      </Modal>

      {/* Lesson Create / Edit / Propose Modal */}
      <Modal
        open={lessonModalOpen}
        onClose={() => setLessonModalOpen(false)}
        title={
          editingLesson
            ? isSharedCourse && editingLesson.status === 'published'
              ? 'Đề xuất chỉnh sửa nội dung khóa học chung'
              : 'Chỉnh sửa bài kiến thức'
            : 'Thêm bài kiến thức mới'
        }
        size="lg"
      >
        <form onSubmit={(e) => handleSaveLesson(e)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <Input label="Tiêu đề bài học" value={lTitle} onChange={(e) => setLTitle(e.target.value)} required />
            </div>
            <Input label="Thời lượng (phút)" type="number" value={lDuration} onChange={(e) => setLDuration(Number(e.target.value))} />
          </div>
          <Input label="Tóm tắt ngắn" value={lSummary} onChange={(e) => setLSummary(e.target.value)} />
          <Textarea label="Nội dung kiến thức" rows={6} value={lContent} onChange={(e) => setLContent(e.target.value)} required />
          <Textarea
            label="Điểm cốt lõi (mỗi dòng 1 ý)"
            rows={3}
            value={lTakeaways}
            onChange={(e) => setLTakeaways(e.target.value)}
          />
          {isSharedCourse && editingLesson?.status === 'published' && (
            <Input
              label="Tóm tắt lý do đề xuất thay đổi (hiển thị cho đồng giảng viên)"
              placeholder="Ví dụ: Bổ sung ví dụ cấu hình CIDR thực tế..."
              value={proposalReason}
              onChange={(e) => setProposalReason(e.target.value)}
              required
            />
          )}
          <div className="flex flex-wrap justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setLessonModalOpen(false)}>Hủy</Button>
            <Button type="button" variant="secondary" onClick={(e) => handleSaveLesson(e, true)}>
              Lưu nháp (Draft)
            </Button>
            <Button type="submit">
              {isSharedCourse && editingLesson?.status === 'published'
                ? 'Gửi đề xuất đồng thuận'
                : 'Công bố nội dung'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Question Modal */}
      <Modal
        open={qModalOpen}
        onClose={() => setQModalOpen(false)}
        title={editingQuestion ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới vào Ngân hàng đề'}
        size="lg"
      >
        <form onSubmit={handleSaveQuestion} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select label="Chương áp dụng" value={qChapterId} onChange={(e) => setQChapterId(e.target.value)}>
              {course.chapters.map((ch) => (
                <option key={ch.id} value={ch.id}>Chương {ch.order}: {ch.title}</option>
              ))}
            </Select>
            <Input
              label="Mục tiêu kiến thức (Tag)"
              value={qObjective}
              onChange={(e) => setQObjective(e.target.value)}
              placeholder="vd: osi-pdu, tcp-handshake"
            />
            <Select label="Độ khó" value={qDifficulty} onChange={(e) => setQDifficulty(e.target.value as Question['difficulty'])}>
              <option value="basic">basic</option>
              <option value="intermediate">intermediate</option>
              <option value="advanced">advanced</option>
            </Select>
          </div>
          <Textarea label="Nội dung câu hỏi" rows={2} value={qPrompt} onChange={(e) => setQPrompt(e.target.value)} required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Đáp án A" value={qOptA} onChange={(e) => setQOptA(e.target.value)} required />
            <Input label="Đáp án B" value={qOptB} onChange={(e) => setQOptB(e.target.value)} required />
            <Input label="Đáp án C" value={qOptC} onChange={(e) => setQOptC(e.target.value)} required />
            <Input label="Đáp án D" value={qOptD} onChange={(e) => setQOptD(e.target.value)} required />
          </div>
          <Select label="Đáp án đúng" value={qCorrectIdx} onChange={(e) => setQCorrectIdx(Number(e.target.value))}>
            <option value={0}>Đáp án A</option>
            <option value={1}>Đáp án B</option>
            <option value={2}>Đáp án C</option>
            <option value={3}>Đáp án D</option>
          </Select>
          <Textarea
            label="Lời giải thích bắt buộc (hiển thị khi sinh viên làm Boss Battle)"
            rows={3}
            value={qExplanation}
            onChange={(e) => setQExplanation(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setQModalOpen(false)}>Hủy</Button>
            <Button type="submit">Lưu câu hỏi</Button>
          </div>
        </form>
      </Modal>

      {/* Boss Config Modal */}
      <Modal
        open={Boolean(bossModalChapterId)}
        onClose={() => setBossModalChapterId(null)}
        title="Cấu hình Boss cuối chương"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!bossModalChapterId) return;
            updateBossConfig(course.id, bossModalChapterId, {
              name: bName.trim(),
              title: bTitle.trim(),
              maxHp: Number(bHp) || 100,
              attackPower: Number(bAtk) || 30,
              trait: bTrait.trim(),
            });
            setBossModalChapterId(null);
          }}
          className="space-y-4"
        >
          <Input label="Tên Boss" value={bName} onChange={(e) => setBName(e.target.value)} required />
          <Input label="Danh hiệu Boss" value={bTitle} onChange={(e) => setBTitle(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="HP tối đa" type="number" value={bHp} onChange={(e) => setBHp(Number(e.target.value))} />
            <Input label="Sát thương (ATK)" type="number" value={bAtk} onChange={(e) => setBAtk(Number(e.target.value))} />
          </div>
          <Input label="Đặc điểm chiến đấu" value={bTrait} onChange={(e) => setBTrait(e.target.value)} />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setBossModalChapterId(null)}>Hủy</Button>
            <Button type="submit">Lưu cấu hình Boss</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
