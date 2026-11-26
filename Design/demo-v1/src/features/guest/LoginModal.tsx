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
      title="Truy cập Nền tảng NetWiz – Superhero"
      description="Chọn tài khoản Demo theo vai trò để trải nghiệm đầy đủ quy trình thực tế (không cần mật khẩu)."
      size="lg"
    >
      <div className="space-y-5">
        <Tabs
          activeTab={tab}
          onChange={(t) => setTab(t as 'login' | 'register')}
          tabs={[
            { id: 'login', label: 'Đăng nhập nhanh (Demo)' },
            { id: 'register', label: 'Đăng ký tài khoản Sinh viên' },
          ]}
        />

        {tab === 'login' ? (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => loginAs('student', state.demoStudent.id)}
              className="w-full p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/60 hover:bg-slate-800/80 text-left flex items-center justify-between gap-4 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    Sinh viên · {state.demoStudent.name}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {state.demoStudent.email} · Hero {state.hero.name} (Lv.{state.hero.level})
                  </div>
                </div>
              </div>
              <span className="text-xs font-medium text-blue-400 shrink-0">Vào học →</span>
            </button>

            <div className="pt-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Giảng viên (3 tài khoản đồng sở hữu khóa học CN-101)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {state.lecturers.map((lec) => (
                  <button
                    key={lec.id}
                    type="button"
                    onClick={() => loginAs('lecturer', lec.id)}
                    className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/60 hover:bg-slate-800/80 text-left transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium mb-1">
                      <GraduationCap className="w-4 h-4" />
                      <span>{lec.code}</span>
                    </div>
                    <div className="text-sm font-semibold text-white leading-snug">{lec.name}</div>
                    <div className="text-xs text-slate-400 mt-1 line-clamp-1">{lec.title}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => loginAs('admin', state.demoAdmin.id)}
              className="w-full p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/60 hover:bg-slate-800/80 text-left flex items-center justify-between gap-4 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    Quản trị viên · {state.demoAdmin.name}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Giám sát nền tảng, cảnh báo giảng viên, khóa/mở khóa nội dung (chỉ đọc kiến thức)
                  </div>
                </div>
              </div>
              <span className="text-xs font-medium text-amber-400 shrink-0">Quản trị →</span>
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
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/25 text-xs text-blue-200 flex items-start gap-2">
              <Shield className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                Tài khoản mới được khởi tạo ngay với nhân vật Hero <strong>Aegis-01</strong> và dữ liệu mô phỏng phía trình duyệt.
              </span>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setLoginModalOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" leftIcon={<UserPlus className="w-4 h-4" />}>
                Đăng ký & Vào học ngay
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
