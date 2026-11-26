import React, { useState } from 'react';
import { GraduationCap, Shield, ShieldAlert, User, UserPlus } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/FormControls';
import { Modal } from '../../components/ui/Modal';
import { Tabs } from '../../components/ui/Tabs';

export const LoginModal: React.FC = () => {
  const { state, loginModalOpen, setLoginModalOpen, loginAs, registerDemoStudent } = useApp();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setFormError('Vui lòng nhập đầy đủ họ tên và email sinh viên.');
      return;
    }
    setFormError('');
    registerDemoStudent(name, email);
    setName('');
    setEmail('');
  };

  return (
    <Modal
      open={loginModalOpen}
      onClose={() => setLoginModalOpen(false)}
      title="Đăng nhập Demo NetWiz V2"
      description="Chọn một vai trò để trải nghiệm giao diện tập trung theo từng đối tượng."
      size="lg"
    >
      <div className="space-y-5">
        <Tabs
          activeTab={tab}
          onChange={(t) => setTab(t as 'login' | 'register')}
          tabs={[
            { id: 'login', label: 'Đăng nhập nhanh' },
            { id: 'register', label: 'Đăng ký Sinh viên' },
          ]}
        />

        {tab === 'login' ? (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => loginAs('student', state.demoStudent.id)}
              className="w-full p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] text-left flex items-center justify-between gap-4 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary-soft)] text-[var(--accent-primary-fg)] flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[var(--text-primary)]">
                    Sinh viên · {state.demoStudent.name}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    Hero {state.hero.name} (Lv.{state.hero.level}) · Đang học Chương 3
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold text-[var(--accent-primary)] shrink-0">Vào học →</span>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {state.lecturers.map((lec) => (
                <button
                  key={lec.id}
                  type="button"
                  onClick={() => loginAs('lecturer', lec.id)}
                  className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] hover:border-[var(--accent-success)] text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-success)] mb-1">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>{lec.code}</span>
                  </div>
                  <div className="text-sm font-bold text-[var(--text-primary)]">{lec.name}</div>
                  <div className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-1">{lec.title}</div>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => loginAs('admin', state.demoAdmin.id)}
              className="w-full p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] hover:border-[var(--accent-warning)] text-left flex items-center justify-between gap-4 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-warning-soft)] text-[var(--accent-warning-fg)] flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[var(--text-primary)]">
                    Quản trị viên · {state.demoAdmin.name}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    Kiểm duyệt nội dung, cảnh báo & khóa/mở khóa (chỉ đọc kiến thức)
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold text-[var(--accent-warning)] shrink-0">Quản trị →</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              label="Họ và tên sinh viên"
              placeholder="Ví dụ: Trần Minh Khoa"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Email học tập"
              type="email"
              placeholder="khoa.tm@netwiz.edu.vn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={formError}
            />
            <div className="p-3 rounded-xl bg-[var(--accent-primary-soft)] text-[var(--accent-primary-fg)] text-xs flex items-center gap-2">
              <Shield className="w-4 h-4 shrink-0" />
              <span>Tài khoản mới được cấp sẵn nhân vật Hero Aegis-01 trong phiên Demo.</span>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setLoginModalOpen(false)}>Hủy</Button>
              <Button type="submit" leftIcon={<UserPlus className="w-4 h-4" />}>Đăng ký & Bắt đầu</Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
