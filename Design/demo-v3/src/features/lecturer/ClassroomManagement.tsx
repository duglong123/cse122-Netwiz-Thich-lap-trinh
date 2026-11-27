import React, { useState } from 'react';
import { Copy, Edit3, Plus, ShieldCheck, UserPlus, Users } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { Classroom, StudentMetric } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ColumnDef, DataTable, EmptyState } from '../../components/ui/DataFeedback';
import { Input, Select } from '../../components/ui/FormControls';
import { Modal } from '../../components/ui/Modal';
import { Eyebrow, Panel, PanelContent, PanelHeader, PanelTitle } from '../../components/ui/Panel';
import { ProgressBar } from '../../components/ui/ProgressBar';

export const ClassroomManagement: React.FC = () => {
  const { state, createClassroom, updateClassroom, enrollStudentToClass, addToast } = useApp();
  const [selectedClassId, setSelectedClassId] = useState(state.classrooms[0]?.id ?? '');

  const [classModalOpen, setClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Classroom | null>(null);
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
          <div className="font-bold text-[var(--text)]">{s.name}</div>
          <div className="text-xs mono text-[var(--muted)]">{s.studentCode} · {s.email}</div>
        </div>
      ),
    },
    {
      key: 'progress',
      header: 'Tiến độ',
      render: (s) => <div className="w-36"><ProgressBar value={s.progressPercent} size="sm" color={s.progressPercent >= 80 ? 'var(--green)' : 'var(--yellow)'} /></div>,
    },
    {
      key: 'boss',
      header: 'Boss',
      render: (s) => <span className="mono">{s.bossesDefeated}/5</span>,
    },
    {
      key: 'acc',
      header: 'Độ chính xác',
      render: (s) => <Badge tone={s.accuracyRate >= 80 ? 'green' : s.accuracyRate >= 65 ? 'yellow' : 'red'}>{s.accuracyRate}%</Badge>,
    },
    {
      key: 'act',
      header: '',
      className: 'text-right',
      render: (s) => <Button size="sm" variant="ghost" onClick={() => setDetailStudent(s)}>Chi tiết</Button>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <Eyebrow color="var(--green-fg)">Classroom Ops</Eyebrow>
          <h1 className="display-font text-4xl font-extrabold text-[var(--text)] mt-2">Quản lý lớp học</h1>
        </div>
        <Button
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => { setEditingClass(null); setClsName(''); setClsCode(''); setClassModalOpen(true); }}
        >
          Tạo lớp học
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {state.classrooms.map((cls) => (
          <Panel
            key={cls.id}
            accent={activeClass?.id === cls.id ? 'var(--yellow)' : undefined}
            onClick={() => setSelectedClassId(cls.id)}
            className="cursor-pointer"
          >
            <PanelContent className="p-5 space-y-2.5">
              <div className="flex items-center justify-between">
                <Badge tone="yellow">{cls.code}</Badge>
                <span className="text-xs mono text-[var(--green-fg)]">Mã: {cls.joinCode}</span>
              </div>
              <div className="font-bold text-[var(--text)]">{cls.name}</div>
              <div className="flex items-center justify-between text-xs text-[var(--muted)] pt-2 border-t border-[var(--line)]">
                <span>{cls.students.length} sinh viên</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingClass(cls);
                    setClsName(cls.name);
                    setClsCode(cls.code);
                    setClsSemester(cls.semester);
                    setClassModalOpen(true);
                  }}
                  className="text-[var(--yellow-fg)] inline-flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" /> Sửa
                </button>
              </div>
            </PanelContent>
          </Panel>
        ))}
      </div>

      {activeClass && (
        <Panel>
          <PanelHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <PanelTitle>{activeClass.name}</PanelTitle>
              <div className="text-xs text-[var(--muted)] mt-1 flex items-center gap-3">
                <span>Mã tham gia: <strong className="mono text-[var(--green-fg)]">{activeClass.joinCode}</strong></span>
                <button
                  type="button"
                  onClick={() => { navigator.clipboard?.writeText(activeClass.joinCode).catch(() => {}); addToast({ type: 'success', title: `Đã sao chép ${activeClass.joinCode}` }); }}
                  className="text-[var(--yellow-fg)] inline-flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
            </div>
            <Button size="sm" leftIcon={<UserPlus className="w-3.5 h-3.5" />} onClick={() => { setJoinCodeInput(activeClass.joinCode); setEnrollOpen(true); }}>
              Thêm SV qua mã
            </Button>
          </PanelHeader>
          <PanelContent className="p-0">
            <DataTable
              columns={columns}
              data={activeClass.students}
              keyExtractor={(s) => s.id}
              onRowClick={(s) => setDetailStudent(s)}
              emptyState={<div className="p-6"><EmptyState icon={<Users className="w-6 h-6" />} title="Chưa có sinh viên" description="Thêm sinh viên bằng mã tham gia." /></div>}
            />
          </PanelContent>
        </Panel>
      )}

      <Modal open={classModalOpen} onClose={() => setClassModalOpen(false)} title={editingClass ? 'Sửa lớp học' : 'Tạo lớp học mới'}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!clsName.trim() || !clsCode.trim()) return;
            if (editingClass) updateClassroom(editingClass.id, { name: clsName.trim(), code: clsCode.trim(), semester: clsSemester.trim() });
            else createClassroom({ name: clsName.trim(), code: clsCode.trim(), courseId: clsCourseId, semester: clsSemester.trim() });
            setClassModalOpen(false);
          }}
          className="space-y-4"
        >
          <Input label="Tên lớp" value={clsName} onChange={(e) => setClsName(e.target.value)} required />
          <Input label="Mã lớp" value={clsCode} onChange={(e) => setClsCode(e.target.value)} required />
          {!editingClass && (
            <Select label="Khóa học" value={clsCourseId} onChange={(e) => setClsCourseId(e.target.value)}>
              {state.courses.map((c) => <option key={c.id} value={c.id}>{c.code} – {c.title}</option>)}
            </Select>
          )}
          <Input label="Học kỳ" value={clsSemester} onChange={(e) => setClsSemester(e.target.value)} />
          <div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => setClassModalOpen(false)}>Hủy</Button><Button type="submit">Lưu</Button></div>
        </form>
      </Modal>

      <Modal open={enrollOpen} onClose={() => setEnrollOpen(false)} title="Thêm sinh viên qua mã">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!activeClass || !stuName.trim() || !stuCode.trim()) return;
            if (enrollStudentToClass(activeClass.id, joinCodeInput, stuName, stuCode)) {
              setEnrollOpen(false); setStuName(''); setStuCode('');
            }
          }}
          className="space-y-4"
        >
          <Input label="Mã tham gia" value={joinCodeInput} onChange={(e) => setJoinCodeInput(e.target.value)} required />
          <Input label="Họ tên sinh viên" value={stuName} onChange={(e) => setStuName(e.target.value)} required />
          <Input label="MSSV" value={stuCode} onChange={(e) => setStuCode(e.target.value)} required />
          <div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => setEnrollOpen(false)}>Hủy</Button><Button type="submit">Thêm</Button></div>
        </form>
      </Modal>

      <Modal open={Boolean(detailStudent)} onClose={() => setDetailStudent(null)} title={detailStudent ? `Chi tiết: ${detailStudent.name}` : ''} size="lg">
        {detailStudent && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-[var(--panel-deep)] border border-[var(--line)]"><div className="text-xs text-[var(--muted)]">Tiến độ</div><div className="display-font text-2xl text-[var(--yellow-fg)]">{detailStudent.progressPercent}%</div></div>
              <div className="p-3 rounded-xl bg-[var(--panel-deep)] border border-[var(--line)]"><div className="text-xs text-[var(--muted)]">Boss</div><div className="display-font text-2xl text-[var(--green-fg)]">{detailStudent.bossesDefeated}/5</div></div>
              <div className="p-3 rounded-xl bg-[var(--panel-deep)] border border-[var(--line)]"><div className="text-xs text-[var(--muted)]">Độ chính xác</div><div className="display-font text-2xl text-[var(--blue-fg)]">{detailStudent.accuracyRate}%</div></div>
            </div>
            <div className="space-y-2">
              {detailStudent.learningHistory.map((h) => (
                <div key={h.id} className="p-3 rounded-lg bg-[var(--panel-deep)] border border-[var(--line)] flex justify-between text-xs">
                  <div><strong className="text-[var(--text)]">{h.action}</strong><div className="text-[var(--muted)]">{h.detail}</div></div>
                  <span className="mono text-[var(--muted)]">{h.timestamp}</span>
                </div>
              ))}
            </div>
            <div className="p-3 rounded-lg bg-[var(--green-soft)] border border-[var(--green-border)] text-xs text-[var(--green-fg)] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Ghi chú cá nhân của sinh viên được bảo mật, giảng viên không thể xem.
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
