import React, { useState } from 'react';
import { Copy, Edit3, Plus, ShieldCheck, UserPlus, Users } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { StudentMetric } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ColumnDef, DataTable, EmptyState } from '../../components/ui/DataFeedback';
import { Input, Select } from '../../components/ui/FormControls';
import { Modal, SlideDrawer } from '../../components/ui/Modal';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Surface, SurfaceContent } from '../../components/ui/Surface';

export const ClassroomManagement: React.FC = () => {
  const { state, createClassroom, updateClassroom, enrollStudentToClass, addToast } = useApp();
  const [selectedClassId, setSelectedClassId] = useState(state.classrooms[0]?.id ?? '');

  const [classModalOpen, setClassModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [clsName, setClsName] = useState('');
  const [clsCode, setClsCode] = useState('');
  const [clsCourseId, setClsCourseId] = useState(state.courses[0]?.id ?? '');
  const [clsSemester, setClsSemester] = useState('Học kỳ 1 · 2026–2027');

  const [enrollOpen, setEnrollOpen] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [stuName, setStuName] = useState('');
  const [stuCode, setStuCode] = useState('');
  const [detailStudent, setDetailStudent] = useState<StudentMetric | null>(null);

  const activeClass = state.classrooms.find((c) => c.id === selectedClassId) ?? state.classrooms[0];

  const columns: ColumnDef<StudentMetric>[] = [
    {
      key: 'student',
      header: 'Sinh viên',
      render: (s) => (
        <div>
          <div className="font-bold text-[var(--text-primary)]">{s.name}</div>
          <div className="text-xs font-mono text-[var(--text-muted)]">{s.studentCode}</div>
        </div>
      ),
    },
    {
      key: 'progress',
      header: 'Tiến độ',
      render: (s) => (
        <div className="w-32">
          <ProgressBar value={s.progressPercent} size="sm" tone={s.progressPercent >= 80 ? 'success' : 'primary'} />
        </div>
      ),
    },
    {
      key: 'boss',
      header: 'Boss',
      render: (s) => <span className="font-mono">{s.bossesDefeated}/5</span>,
    },
    {
      key: 'acc',
      header: 'Đúng',
      render: (s) => <Badge tone={s.accuracyRate >= 80 ? 'success' : s.accuracyRate >= 65 ? 'warning' : 'danger'}>{s.accuracyRate}%</Badge>,
    },
    {
      key: 'act',
      header: '',
      className: 'text-right',
      render: (s) => (
        <Button size="sm" variant="ghost" onClick={() => setDetailStudent(s)}>
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Quản lý lớp học</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Chọn lớp học để quản lý danh sách và mã tham gia.</p>
        </div>
        <Button
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => {
            setEditing(false);
            setClsName('');
            setClsCode('');
            setClassModalOpen(true);
          }}
        >
          Tạo lớp mới
        </Button>
      </div>

      {/* Focused Single-Class Selector Bar */}
      {activeClass && (
        <Surface>
          <SurfaceContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <Select value={activeClass.id} onChange={(e) => setSelectedClassId(e.target.value)} className="w-64">
                {state.classrooms.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.code} – {cls.name} ({cls.students.length} SV)
                  </option>
                ))}
              </Select>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(activeClass.joinCode).catch(() => {});
                  addToast({ type: 'success', title: `Đã sao chép mã ${activeClass.joinCode}` });
                }}
                className="px-3 py-2 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-xs font-mono font-bold text-[var(--text-primary)] inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Mã: {activeClass.joinCode}</span>
                <Copy className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                onClick={() => {
                  setEditing(true);
                  setClsName(activeClass.name);
                  setClsCode(activeClass.code);
                  setClsSemester(activeClass.semester);
                  setClassModalOpen(true);
                }}
              >
                Sửa lớp
              </Button>
              <Button
                size="sm"
                leftIcon={<UserPlus className="w-3.5 h-3.5" />}
                onClick={() => {
                  setJoinCodeInput(activeClass.joinCode);
                  setEnrollOpen(true);
                }}
              >
                Thêm SV bằng mã
              </Button>
            </div>
          </SurfaceContent>
        </Surface>
      )}

      {activeClass && (
        <DataTable
          columns={columns}
          data={activeClass.students}
          keyExtractor={(s) => s.id}
          onRowClick={(s) => setDetailStudent(s)}
          emptyState={
            <EmptyState
              icon={<Users className="w-6 h-6" />}
              title="Lớp chưa có sinh viên"
              description="Dùng mã tham gia để thêm sinh viên vào lớp."
            />
          }
        />
      )}

      {/* Create/Edit Modal */}
      <Modal open={classModalOpen} onClose={() => setClassModalOpen(false)} title={editing ? 'Sửa thông tin lớp' : 'Tạo lớp mới'}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!clsName.trim() || !clsCode.trim()) return;
            if (editing && activeClass) {
              updateClassroom(activeClass.id, { name: clsName.trim(), code: clsCode.trim(), semester: clsSemester.trim() });
            } else {
              createClassroom({ name: clsName.trim(), code: clsCode.trim(), courseId: clsCourseId, semester: clsSemester.trim() });
            }
            setClassModalOpen(false);
          }}
          className="space-y-4"
        >
          <Input label="Tên lớp" value={clsName} onChange={(e) => setClsName(e.target.value)} required />
          <Input label="Mã lớp" value={clsCode} onChange={(e) => setClsCode(e.target.value)} required />
          {!editing && (
            <Select label="Khóa học" value={clsCourseId} onChange={(e) => setClsCourseId(e.target.value)}>
              {state.courses.map((c) => <option key={c.id} value={c.id}>{c.code} – {c.title}</option>)}
            </Select>
          )}
          <Input label="Học kỳ" value={clsSemester} onChange={(e) => setClsSemester(e.target.value)} />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setClassModalOpen(false)}>Hủy</Button>
            <Button type="submit">{editing ? 'Lưu' : 'Tạo lớp'}</Button>
          </div>
        </form>
      </Modal>

      {/* Enroll Modal */}
      <Modal open={enrollOpen} onClose={() => setEnrollOpen(false)} title="Thêm sinh viên qua mã tham gia">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!activeClass || !stuName.trim() || !stuCode.trim()) return;
            if (enrollStudentToClass(activeClass.id, joinCodeInput, stuName, stuCode)) {
              setEnrollOpen(false);
              setStuName('');
              setStuCode('');
            }
          }}
          className="space-y-4"
        >
          <Input label="Mã tham gia" value={joinCodeInput} onChange={(e) => setJoinCodeInput(e.target.value)} required />
          <Input label="Họ tên sinh viên" value={stuName} onChange={(e) => setStuName(e.target.value)} required />
          <Input label="MSSV" value={stuCode} onChange={(e) => setStuCode(e.target.value)} required />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setEnrollOpen(false)}>Hủy</Button>
            <Button type="submit">Thêm vào lớp</Button>
          </div>
        </form>
      </Modal>

      {/* Student Detail Drawer — Strictly NO private notes */}
      <SlideDrawer
        open={Boolean(detailStudent)}
        onClose={() => setDetailStudent(null)}
        title={detailStudent?.name ?? ''}
        subtitle={detailStudent ? `${detailStudent.studentCode} · ${detailStudent.email}` : ''}
      >
        {detailStudent && (
          <>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-xl bg-[var(--bg-subtle)]">
                <div className="text-xs text-[var(--text-muted)]">Tiến độ</div>
                <div className="text-lg font-mono font-bold text-[var(--accent-primary)]">{detailStudent.progressPercent}%</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg-subtle)]">
                <div className="text-xs text-[var(--text-muted)]">Boss</div>
                <div className="text-lg font-mono font-bold text-[var(--accent-success)]">{detailStudent.bossesDefeated}/5</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg-subtle)]">
                <div className="text-xs text-[var(--text-muted)]">Đúng</div>
                <div className="text-lg font-mono font-bold text-[var(--text-primary)]">{detailStudent.accuracyRate}%</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Điểm khó khăn</div>
              <div className="flex flex-wrap gap-1.5">
                {detailStudent.difficultTopics.length === 0 ? (
                  <span className="text-sm text-[var(--accent-success)]">Không có</span>
                ) : (
                  detailStudent.difficultTopics.map((t) => <Badge key={t} tone="danger">{t}</Badge>)
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Lịch sử học tập</div>
              {detailStudent.learningHistory.map((h) => (
                <div key={h.id} className="p-3 rounded-xl bg-[var(--bg-subtle)] text-xs space-y-1">
                  <div className="font-bold text-[var(--text-primary)]">{h.action}</div>
                  <div className="text-[var(--text-secondary)]">{h.detail} · {h.timestamp}</div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-[var(--accent-success-soft)] text-[var(--accent-success-fg)] text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Ghi chú cá nhân của sinh viên được bảo mật tuyệt đối.</span>
            </div>
          </>
        )}
      </SlideDrawer>
    </div>
  );
};
