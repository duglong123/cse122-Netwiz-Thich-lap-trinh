import React, { useState } from 'react';
import {
  Copy,
  Edit3,
  Plus,
  ShieldCheck,
  UserPlus,
  Users,
} from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { Classroom, StudentMetric } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { ColumnDef, DataTable, EmptyState } from '../../components/ui/DataFeedback';
import { Input, Select } from '../../components/ui/FormControls';
import { Modal } from '../../components/ui/Modal';
import { ProgressBar } from '../../components/ui/ProgressBar';

export const ClassroomManagement: React.FC = () => {
  const { state, createClassroom, updateClassroom, enrollStudentToClass, addToast } = useApp();
  const [selectedClassId, setSelectedClassId] = useState<string>(state.classrooms[0]?.id ?? '');

  // Create/Edit classroom modal
  const [classModalOpen, setClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Classroom | null>(null);
  const [clsName, setClsName] = useState('');
  const [clsCode, setClsCode] = useState('');
  const [clsCourseId, setClsCourseId] = useState(state.courses[0]?.id ?? '');
  const [clsSemester, setClsSemester] = useState('Học kỳ 1 · 2026–2027');

  // Enroll student modal
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [stuName, setStuName] = useState('');
  const [stuCode, setStuCode] = useState('');

  // Student detail modal
  const [detailStudent, setDetailStudent] = useState<StudentMetric | null>(null);

  const activeClass =
    state.classrooms.find((c) => c.id === selectedClassId) ?? state.classrooms[0];

  const openCreateModal = () => {
    setEditingClass(null);
    setClsName('');
    setClsCode('');
    setClsCourseId(state.courses[0]?.id ?? '');
    setClsSemester('Học kỳ 1 · 2026–2027');
    setClassModalOpen(true);
  };

  const openEditModal = (cls: Classroom) => {
    setEditingClass(cls);
    setClsName(cls.name);
    setClsCode(cls.code);
    setClsCourseId(cls.courseId);
    setClsSemester(cls.semester);
    setClassModalOpen(true);
  };

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clsName.trim() || !clsCode.trim()) return;
    if (editingClass) {
      updateClassroom(editingClass.id, {
        name: clsName.trim(),
        code: clsCode.trim(),
        semester: clsSemester.trim(),
      });
    } else {
      createClassroom({
        name: clsName.trim(),
        code: clsCode.trim(),
        courseId: clsCourseId,
        semester: clsSemester.trim(),
      });
    }
    setClassModalOpen(false);
  };

  const handleEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClass || !stuName.trim() || !stuCode.trim()) return;
    const ok = enrollStudentToClass(activeClass.id, joinCodeInput, stuName, stuCode);
    if (ok) {
      setEnrollOpen(false);
      setStuName('');
      setStuCode('');
    }
  };

  const columns: ColumnDef<StudentMetric>[] = [
    {
      key: 'student',
      header: 'Sinh viên',
      render: (s) => (
        <div>
          <div className="font-semibold text-white">{s.name}</div>
          <div className="text-xs font-mono text-slate-400">
            {s.studentCode} · {s.email}
          </div>
        </div>
      ),
    },
    {
      key: 'progress',
      header: 'Tiến độ học tập',
      render: (s) => (
        <div className="w-36">
          <ProgressBar value={s.progressPercent} size="sm" tone={s.progressPercent >= 80 ? 'emerald' : 'cobalt'} />
        </div>
      ),
    },
    {
      key: 'boss',
      header: 'Boss đã hạ',
      render: (s) => <span className="font-mono text-slate-200">{s.bossesDefeated}/5</span>,
    },
    {
      key: 'accuracy',
      header: 'Tỷ lệ đúng',
      render: (s) => (
        <Badge tone={s.accuracyRate >= 80 ? 'emerald' : s.accuracyRate >= 65 ? 'amber' : 'rose'}>
          {s.accuracyRate}%
        </Badge>
      ),
    },
    {
      key: 'action',
      header: '',
      className: 'text-right',
      render: (s) => (
        <Button size="sm" variant="ghost" onClick={() => setDetailStudent(s)}>
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Quản lý lớp học</h1>
          <p className="text-sm text-slate-400 mt-1">
            Tạo lớp, chỉnh sửa thông tin, cấp mã tham gia và theo dõi tiến độ từng sinh viên.
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={openCreateModal}>
          Tạo lớp học mới
        </Button>
      </div>

      {/* Classroom switcher */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.classrooms.map((cls) => {
          const isSelected = activeClass?.id === cls.id;
          const course = state.courses.find((c) => c.id === cls.courseId);
          return (
            <Card
              key={cls.id}
              hoverable
              active={isSelected}
              onClick={() => setSelectedClassId(cls.id)}
              className="cursor-pointer"
            >
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge tone="cobalt">{cls.code}</Badge>
                  <span className="text-xs font-mono text-emerald-300">Mã: {cls.joinCode}</span>
                </div>
                <div>
                  <div className="text-base font-bold text-white">{cls.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {course?.title} · {cls.semester}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-400" /> {cls.students.length} sinh viên
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(cls);
                    }}
                    className="text-blue-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" /> Sửa lớp
                  </button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {activeClass && (
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>{activeClass.name}</CardTitle>
              <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                <span>{activeClass.semester}</span>
                <span>
                  Mã tham gia:{' '}
                  <strong className="font-mono text-emerald-300">{activeClass.joinCode}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(activeClass.joinCode).catch(() => {});
                    addToast({ type: 'success', title: `Đã sao chép mã ${activeClass.joinCode}` });
                  }}
                  className="inline-flex items-center gap-1 text-blue-400 hover:underline cursor-pointer"
                >
                  <Copy className="w-3 h-3" /> Sao chép mã
                </button>
              </div>
            </div>

            <Button
              size="sm"
              leftIcon={<UserPlus className="w-4 h-4" />}
              onClick={() => {
                setJoinCodeInput(activeClass.joinCode);
                setEnrollOpen(true);
              }}
            >
              Thêm sinh viên bằng mã tham gia
            </Button>
          </CardHeader>

          <CardContent className="p-0">
            <DataTable
              columns={columns}
              data={activeClass.students}
              keyExtractor={(s) => s.id}
              onRowClick={(s) => setDetailStudent(s)}
              emptyState={
                <div className="p-6">
                  <EmptyState
                    icon={<Users className="w-6 h-6" />}
                    title="Lớp học chưa có sinh viên"
                    description="Chia sẻ mã tham gia hoặc thêm sinh viên trực tiếp bằng nút phía trên."
                  />
                </div>
              }
            />
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Class Modal */}
      <Modal
        open={classModalOpen}
        onClose={() => setClassModalOpen(false)}
        title={editingClass ? 'Chỉnh sửa thông tin lớp học' : 'Tạo lớp học mới'}
      >
        <form onSubmit={handleSaveClass} className="space-y-4">
          <Input
            label="Tên lớp học"
            placeholder="Ví dụ: NT106.O22 – Mạng máy tính K22"
            value={clsName}
            onChange={(e) => setClsName(e.target.value)}
            required
          />
          <Input
            label="Mã lớp"
            placeholder="Ví dụ: NT106.O22"
            value={clsCode}
            onChange={(e) => setClsCode(e.target.value)}
            required
          />
          {!editingClass && (
            <Select
              label="Khóa học áp dụng"
              value={clsCourseId}
              onChange={(e) => setClsCourseId(e.target.value)}
            >
              {state.courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} – {c.title}
                </option>
              ))}
            </Select>
          )}
          <Input
            label="Học kỳ"
            value={clsSemester}
            onChange={(e) => setClsSemester(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setClassModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit">{editingClass ? 'Lưu cập nhật' : 'Tạo lớp học'}</Button>
          </div>
        </form>
      </Modal>

      {/* Enroll via Join Code Modal */}
      <Modal
        open={enrollOpen}
        onClose={() => setEnrollOpen(false)}
        title="Thêm sinh viên qua mã tham gia"
        description={`Mã tham gia hợp lệ của lớp hiện tại là ${activeClass?.joinCode}`}
      >
        <form onSubmit={handleEnroll} className="space-y-4">
          <Input
            label="Mã tham gia lớp"
            value={joinCodeInput}
            onChange={(e) => setJoinCodeInput(e.target.value)}
            required
          />
          <Input
            label="Họ tên sinh viên"
            placeholder="Ví dụ: Trương Bảo Ngọc"
            value={stuName}
            onChange={(e) => setStuName(e.target.value)}
            required
          />
          <Input
            label="Mã số sinh viên (MSSV)"
            placeholder="Ví dụ: 22520911"
            value={stuCode}
            onChange={(e) => setStuCode(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setEnrollOpen(false)}>
              Hủy
            </Button>
            <Button type="submit">Xác nhận thêm vào lớp</Button>
          </div>
        </form>
      </Modal>

      {/* Student Detail Modal (NO private notes shown!) */}
      <Modal
        open={Boolean(detailStudent)}
        onClose={() => setDetailStudent(null)}
        title={detailStudent ? `Chi tiết học tập: ${detailStudent.name}` : ''}
        description={detailStudent ? `${detailStudent.studentCode} · ${detailStudent.email}` : ''}
        size="lg"
      >
        {detailStudent && (
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-xs text-slate-400">Tiến độ</div>
                <div className="text-xl font-mono font-bold text-blue-400 mt-1">
                  {detailStudent.progressPercent}%
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-xs text-slate-400">Boss đã hạ</div>
                <div className="text-xl font-mono font-bold text-emerald-400 mt-1">
                  {detailStudent.bossesDefeated}/5
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-xs text-slate-400">Độ chính xác</div>
                <div className="text-xl font-mono font-bold text-amber-400 mt-1">
                  {detailStudent.accuracyRate}%
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Chủ đề sinh viên còn gặp khó khăn
              </div>
              {detailStudent.difficultTopics.length === 0 ? (
                <div className="text-sm text-emerald-300">Chưa ghi nhận điểm yếu nổi bật.</div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {detailStudent.difficultTopics.map((topic) => (
                    <Badge key={topic} tone="rose">
                      {topic}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Lịch sử học tập
              </div>
              <div className="space-y-2">
                {detailStudent.learningHistory.map((h) => (
                  <div key={h.id} className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium text-white">{h.action}</div>
                      <div className="text-xs text-slate-400">{h.detail}</div>
                    </div>
                    <span className="text-xs font-mono text-slate-500">{h.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Quyền riêng tư: Ghi chú cá nhân của sinh viên được ẩn hoàn toàn khỏi khu vực giảng viên.</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
