import React, { useState } from 'react';
import {
  BarChart3,
  BookOpen,
  ChevronRight,
  Compass,
  FileText,
  GitPullRequest,
  GraduationCap,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  RotateCcw,
  Shield,
  ShieldAlert,
  Swords,
  Users,
  X,
} from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { Role, RoutePage } from '../../types';
import { Badge } from './Badge';
import { Button } from './Button';
import { Dropdown } from './Dropdown';
import { ConfirmDialog } from './Modal';

interface NavEntry {
  id: RoutePage;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
}

const ROLE_META: Record<Role, { label: string; tone: 'slate' | 'cobalt' | 'emerald' | 'amber' }> = {
  guest: { label: 'Khách (Guest)', tone: 'slate' },
  student: { label: 'Sinh viên', tone: 'cobalt' },
  lecturer: { label: 'Giảng viên', tone: 'emerald' },
  admin: { label: 'Quản trị viên', tone: 'amber' },
};

const PAGE_BREADCRUMBS: Record<RoutePage, string[]> = {
  landing: ['Trang chủ'],
  discovery: ['Khám phá khóa học'],
  'course-preview': ['Khám phá khóa học', 'Chi tiết khóa học'],
  'shared-note': ['Ghi chú công khai'],
  'student-dashboard': ['Sinh viên', 'Tổng quan học tập'],
  learning: ['Sinh viên', 'Không gian học tập'],
  'boss-battle': ['Sinh viên', 'Boss Battle'],
  notes: ['Sinh viên', 'Ghi chú & Câu hỏi sai'],
  'lecturer-dashboard': ['Giảng viên', 'Tổng quan'],
  classrooms: ['Giảng viên', 'Quản lý lớp học'],
  knowledge: ['Giảng viên', 'Quản lý kiến thức'],
  proposals: ['Giảng viên', 'Biểu quyết khóa học chung'],
  analytics: ['Giảng viên', 'Thống kê học tập'],
  'admin-dashboard': ['Quản trị viên', 'Tổng quan hệ thống'],
  moderation: ['Quản trị viên', 'Kiểm duyệt nội dung'],
};

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    state,
    page,
    currentUser,
    navigate,
    loginAs,
    logout,
    switchActiveLecturer,
    resetDemoData,
    setLoginModalOpen,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const pendingProposalsCount = state.proposals.filter((p) => p.status === 'pending').length;
  const needsReviewWrongCount = state.wrongAnswers.filter((w) => w.status === 'needs_review').length;
  const flaggedLessonsCount = state.courses.reduce(
    (acc, c) =>
      acc +
      c.chapters.reduce(
        (ca, ch) => ca + ch.lessons.filter((l) => l.moderation.status !== 'normal').length,
        0,
      ),
    0,
  );

  const navByRole: Record<Role, NavEntry[]> = {
    guest: [
      { id: 'landing', label: 'Trang chủ', icon: <Home className="w-4 h-4" /> },
      { id: 'discovery', label: 'Khám phá khóa học', icon: <Compass className="w-4 h-4" /> },
      { id: 'course-preview', label: 'Xem trước CN-101', icon: <BookOpen className="w-4 h-4" /> },
      { id: 'shared-note', label: 'Ghi chú công khai', icon: <FileText className="w-4 h-4" /> },
    ],
    student: [
      { id: 'student-dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
      { id: 'learning', label: 'Học tập & Nhiệm vụ', icon: <BookOpen className="w-4 h-4" /> },
      { id: 'boss-battle', label: 'Boss Battle', icon: <Swords className="w-4 h-4" /> },
      {
        id: 'notes',
        label: 'Ghi chú & Câu sai',
        icon: <FileText className="w-4 h-4" />,
        badge: needsReviewWrongCount > 0 ? needsReviewWrongCount : undefined,
      },
      { id: 'discovery', label: 'Khóa học công khai', icon: <Compass className="w-4 h-4" /> },
    ],
    lecturer: [
      { id: 'lecturer-dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
      { id: 'classrooms', label: 'Quản lý lớp học', icon: <Users className="w-4 h-4" /> },
      { id: 'knowledge', label: 'Quản lý kiến thức', icon: <GraduationCap className="w-4 h-4" /> },
      {
        id: 'proposals',
        label: 'Đồng thuận chỉnh sửa',
        icon: <GitPullRequest className="w-4 h-4" />,
        badge: pendingProposalsCount > 0 ? pendingProposalsCount : undefined,
      },
      { id: 'analytics', label: 'Thống kê học tập', icon: <BarChart3 className="w-4 h-4" /> },
    ],
    admin: [
      { id: 'admin-dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
      {
        id: 'moderation',
        label: 'Kiểm duyệt nội dung',
        icon: <ShieldAlert className="w-4 h-4" />,
        badge: flaggedLessonsCount > 0 ? flaggedLessonsCount : undefined,
      },
      { id: 'discovery', label: 'Danh mục khóa học', icon: <Compass className="w-4 h-4" /> },
    ],
  };

  const activeNav = navByRole[state.role];
  const breadcrumbs = PAGE_BREADCRUMBS[page] ?? ['NetWiz'];

  const handleNavClick = (target: RoutePage) => {
    if (target === 'shared-note') {
      const firstPublic = state.notes.find((n) => n.visibility === 'public');
      navigate('shared-note', { noteId: firstPublic?.id ?? state.notes[0]?.id });
    } else {
      navigate(target);
    }
    setMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-slate-800/80 flex items-center justify-between">
        <button
          type="button"
          onClick={() => handleNavClick(state.role === 'guest' ? 'landing' : activeNav[0].id)}
          className="flex items-center gap-3 text-left cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:bg-blue-600/30 transition-colors">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="font-display font-bold text-base tracking-tight text-white">NetWiz</div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-blue-400">
              Project Superhero
            </div>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          aria-label="Đóng menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="px-4 py-3 border-b border-slate-800/70">
        <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1.5">
          Khu vực hiện tại
        </div>
        <div className="flex items-center justify-between gap-2">
          <Badge tone={ROLE_META[state.role].tone}>{ROLE_META[state.role].label}</Badge>
          {currentUser && (
            <span className="text-xs font-mono text-slate-400 truncate">{currentUser.code}</span>
          )}
        </div>
        {currentUser && (
          <div className="mt-2 text-xs text-slate-300 font-medium truncate">{currentUser.name}</div>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Điều hướng chính">
        {activeNav.map((item) => {
          const active = page === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                active
                  ? 'bg-blue-600/15 text-blue-300 border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <span className="flex items-center gap-2.5 min-w-0">
                {item.icon}
                <span className="truncate">{item.label}</span>
              </span>
              {item.badge !== undefined && (
                <span className="px-2 py-0.5 text-[11px] font-mono rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {state.role === 'student' && (
        <div className="mx-3 mb-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center gap-2.5">
            <img
              src={state.hero.avatar}
              alt={state.hero.name}
              className="w-10 h-10 rounded-lg object-cover border border-blue-500/40"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-white truncate">{state.hero.name}</div>
              <div className="text-[11px] text-slate-400 font-mono">
                Lv.{state.hero.level} · HP {state.hero.hp}/{state.hero.maxHp}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-3 border-t border-slate-800/80 space-y-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-slate-400"
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          onClick={() => setResetConfirmOpen(true)}
        >
          Đặt lại dữ liệu Demo
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#0B1120] text-slate-100">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-[#0F172A] border-r border-slate-800/90 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-950/80" onClick={() => setMobileMenuOpen(false)} />
          <aside className="relative w-72 max-w-[85vw] bg-[#0F172A] border-r border-slate-800 h-full z-10">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content Column */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Navigation */}
        <header className="sticky top-0 z-20 h-16 bg-[#0B1120]/90 backdrop-blur-md border-b border-slate-800/90 px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-800 cursor-pointer"
              aria-label="Mở menu điều hướng"
            >
              <Menu className="w-5 h-5" />
            </button>

            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs sm:text-sm min-w-0">
              <span className="text-slate-500 hidden sm:inline">NetWiz</span>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb}>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 hidden sm:inline shrink-0" />
                  <span
                    className={`truncate ${
                      idx === breadcrumbs.length - 1 ? 'text-slate-100 font-medium' : 'text-slate-400 hidden sm:inline'
                    }`}
                  >
                    {crumb}
                  </span>
                </React.Fragment>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {state.role === 'lecturer' && (
              <Dropdown
                trigger={
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-medium text-emerald-300">
                    <span className="hidden sm:inline">GV:</span>
                    <span className="max-w-[130px] truncate">{currentUser?.name}</span>
                  </span>
                }
                items={state.lecturers.map((lec) => ({
                  id: lec.id,
                  label: lec.name,
                  description: lec.title,
                  onClick: () => switchActiveLecturer(lec.id),
                }))}
              />
            )}

            <Dropdown
              trigger={
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/90 border border-slate-700 text-xs font-medium text-slate-200 hover:border-slate-500">
                  <span>Đổi vai trò Demo</span>
                </span>
              }
              items={[
                {
                  id: 'switch-guest',
                  label: 'Guest – Khách',
                  description: 'Khám phá khóa học & ghi chú công khai',
                  onClick: () => logout(),
                },
                {
                  id: 'switch-student',
                  label: 'Student – Nguyễn Minh Anh',
                  description: 'Học tập, nhiệm vụ, Boss Battle, ghi chú',
                  onClick: () => loginAs('student', state.demoStudent.id),
                },
                {
                  id: 'switch-lecturer',
                  label: 'Lecturer – TS. Nguyễn Minh Quân',
                  description: 'Quản lý lớp, kiến thức, đồng thuận & thống kê',
                  onClick: () => loginAs('lecturer', state.lecturers[0].id),
                },
                {
                  id: 'switch-admin',
                  label: 'Admin – Phạm Quốc Bảo',
                  description: 'Giám sát, cảnh báo & khóa/mở khóa nội dung',
                  onClick: () => loginAs('admin', state.demoAdmin.id),
                },
              ]}
            />

            {state.role === 'guest' ? (
              <Button
                size="sm"
                leftIcon={<LogIn className="w-3.5 h-3.5" />}
                onClick={() => setLoginModalOpen(true)}
              >
                Đăng nhập
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<LogOut className="w-3.5 h-3.5" />}
                onClick={logout}
              >
                <span className="hidden sm:inline">Đăng xuất</span>
              </Button>
            )}
          </div>
        </header>

        {/* Page View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      <ConfirmDialog
        open={resetConfirmOpen}
        onClose={() => setResetConfirmOpen(false)}
        onConfirm={resetDemoData}
        title="Khôi phục dữ liệu Demo V1?"
        message="Thao tác này sẽ xóa các thay đổi trong LocalStorage và đưa khóa học, tiến độ Boss, ghi chú, biểu quyết và trạng thái kiểm duyệt về mặc định ban đầu."
        confirmLabel="Khôi phục mặc định"
        tone="primary"
      />
    </div>
  );
};
