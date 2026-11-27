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
      title="Gia nhập Học viện NetWiz // V3"
      description="Chọn tài khoản Demo theo vai trò để trải nghiệm đầy đủ nhiệm vụ và trận Boss."
      size="lg"
    >
      <div className="space-y-5">
        <Tabs
          activeTab={tab}
          onChange={(t) => setTab(t as 'login' | 'register')}
          tabs={[
            { id: 'login', label: 'Đăng nhập nhanh' },
            { id: 'register', label: 'Đăng ký Tân binh' },
          ]}
        />

        {tab === 'login' ? (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => loginAs('student', state.demoStudent.id)}
              className="w-full p-4 rounded-xl bg-[#0a111e] border border-[#26334a] hover:border-[#f4d35e] text-left flex items-center justify-between gap-4 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-lg bg-[#f4d35e]/15 border border-[#f4d35e]/40 flex items-center justify-center text-[#f4d35e] shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-[#f3f6fc]">
                    Sinh viên · {state.demoStudent.name}
                  </div>
                  <div className="text-xs text-[#98a7bd] mt-0.5">
                    Hero {state.hero.name} (Lv.{state.hero.level}) · Inspector + Boss Arena
                  </div>
                </div>
              </div>
              <span className="text-xs font-extrabold uppercase text-[#f4d35e]">Vào trận →</span>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {state.lecturers.map((lec) => (
                <button
                  key={lec.id}
                  type="button"
                  onClick={() => loginAs('lecturer', lec.id)}
                  className="p-3.5 rounded-xl bg-[#0a111e] border border-[#26334a] hover:border-[#45d483] text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#45d483] mb-1">
                    <GraduationCap className="w-4 h-4" />
                    <span>{lec.code}</span>
                  </div>
                  <div className="text-sm font-bold text-[#f3f6fc]">{lec.name}</div>
                  <div className="text-[11px] text-[#98a7bd] mt-1 line-clamp-1">{lec.title}</div>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => loginAs('admin', state.demoAdmin.id)}
              className="w-full p-4 rounded-xl bg-[#0a111e] border border-[#26334a] hover:border-[#4da3ff] text-left flex items-center justify-between gap-4 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-lg bg-[#4da3ff]/15 border border-[#4da3ff]/40 flex items-center justify-center text-[#4da3ff] shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-[#f3f6fc]">
                    Quản trị viên · {state.demoAdmin.name}
                  </div>
                  <div className="text-xs text-[#98a7bd] mt-0.5">
                    Kiểm duyệt chỉ đọc, gửi cảnh báo, khóa & mở khóa nội dung
                  </div>
                </div>
              </div>
              <span className="text-xs font-extrabold uppercase text-[#4da3ff]">Giám sát →</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <Input label="Họ và tên tân binh" placeholder="Nguyễn Văn A" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Email học tập" type="email" placeholder="a.nv@netwiz.edu.vn" value={email} onChange={(e) => setEmail(e.target.value)} error={formError} />
            <div className="p-3 rounded-lg bg-[#f4d35e]/10 border border-[#f4d35e]/30 text-xs text-[#f4d35e] flex items-center gap-2">
              <Shield className="w-4 h-4 shrink-0" />
              <span>Tài khoản được cấp sẵn nhân vật <strong>Aegis-01</strong> để học & chiến đấu ngay.</span>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setLoginModalOpen(false)}>Hủy</Button>
              <Button type="submit" leftIcon={<UserPlus className="w-4 h-4" />}>Đăng ký & Vào học</Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
