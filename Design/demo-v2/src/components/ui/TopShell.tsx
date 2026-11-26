import React, { useState } from 'react';
import {
  LogIn,
  LogOut,
  Menu,
  Moon,
  RotateCcw,
  Shield,
  Sun,
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
  badge?: number;
}

const ROLE_META: Record<Role, { label: string; tone: 'neutral' | 'primary' | 'success' | 'warning' }> = {
  guest: { label: 'Khách', tone: 'neutral' },
  student: { label: 'Sinh viên', tone: 'primary' },
  lecturer: { label: 'Giảng viên', tone: 'success' },
  admin: { label: 'Quản trị', tone: 'warning' },
};

export const TopShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    state,
    theme,
    toggleTheme,
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
    (acc, c) => acc + c.chapters.reduce((ca, ch) => ca + ch.lessons.filter((l) => l.moderation.status !== 'normal').length, 0),
    0,
  );

  const navByRole: Record<Role, NavEntry[]> = {
    guest: [
      { id: 'landing', label: 'Giới thiệu' },
      { id: 'discovery', label: 'Khóa học' },
      { id: 'shared-note', label: 'Ghi chú công khai' },
    ],
    student: [
      { id: 'student-dashboard', label: 'Tập trung' },
      { id: 'learning', label: 'Học & Nhiệm vụ' },
      { id: 'boss-battle', label: 'Boss Battle' },
      { id: 'notes', label: 'Ghi chú & Câu sai', badge: needsReviewWrongCount || undefined },
    ],
    lecturer: [
      { id: 'lecturer-dashboard', label: 'Ưu tiên' },
      { id: 'classrooms', label: 'Lớp học' },
      { id: 'knowledge', label: 'Kiến thức & Đề' },
      { id: 'proposals', label: 'Đồng thuận', badge: pendingProposalsCount || undefined },
      { id: 'analytics', label: 'Thống kê' },
    ],
    admin: [
      { id: 'admin-dashboard', label: 'Tổng quan' },
      { id: 'moderation', label: 'Kiểm duyệt', badge: flaggedLessonsCount || undefined },
      { id: 'discovery', label: 'Danh mục' },
    ],
  };

  const activeNav = navByRole[state.role];

  const handleNavClick = (target: RoutePage) => {
    if (target === 'shared-note') {
      const firstPublic = state.notes.find((n) => n.visibility === 'public');
      navigate('shared-note', { noteId: firstPublic?.id ?? state.notes[0]?.id });
    } else {
      navigate(target);
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      {/* Minimal 60px Top Command Bar — No permanent left sidebar! */}
      <header className="sticky top-0 z-30 h-16 bg-[var(--bg-surface)]/95 backdrop-blur-md border-b border-[var(--border-subtle)]">
        <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-3">
          {/* Left: Brand + Role */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => handleNavClick(activeNav[0].id)}
              className="flex items-center gap-2.5 cursor-pointer group shrink-0"
            >
              <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary-soft)] border border-[var(--accent-primary)]/35 flex items-center justify-center text-[var(--accent-primary-fg)]">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-editorial font-bold text-lg text-[var(--text-primary)]">
                NetWiz
              </span>
            </button>
            <Badge tone={ROLE_META[state.role].tone} className="hidden sm:inline-flex">
              {ROLE_META[state.role].label}
            </Badge>
          </div>

          {/* Center: Focused horizontal tabs */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Điều hướng chính">
            {activeNav.map((item) => {
              const active = page === item.id || (item.id === 'discovery' && page === 'course-preview');
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors inline-flex items-center gap-1.5 cursor-pointer ${
                    active
                      ? 'bg-[var(--accent-primary-soft)] text-[var(--accent-primary-fg)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.2 text-[11px] font-mono rounded-full bg-[var(--accent-warning-soft)] text-[var(--accent-warning-fg)]">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Light/Dark Mode Toggle + Role Switch + Auth */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'light' ? 'Chuyển sang chế độ tối' : 'Chuyển sang chế độ sáng'}
              className="h-9 px-3 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-subtle)] text-[var(--text-primary)] hover:bg-[var(--bg-muted)] inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-colors"
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tối</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-[var(--accent-warning)]" />
                  <span className="hidden sm:inline">Sáng</span>
                </>
              )}
            </button>

            {state.role === 'lecturer' && (
              <Dropdown
                trigger={
                  <span className="hidden sm:inline-flex items-center px-2.5 py-1.5 rounded-lg bg-[var(--accent-success-soft)] text-[var(--accent-success-fg)] border border-[var(--accent-success)]/30 text-xs font-semibold">
                    {currentUser?.name.split(' ').slice(-2).join(' ')}
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
                <span className="px-2.5 py-1.5 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-surface)] text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]">
                  Vai trò
                </span>
              }
              items={[
                { id: 'g', label: 'Guest – Khách', description: 'Khám phá & ghi chú công khai', onClick: () => logout() },
                { id: 's', label: 'Student – Nguyễn Minh Anh', description: 'Học tập tập trung & Boss Battle', onClick: () => loginAs('student', state.demoStudent.id) },
                { id: 'l', label: 'Lecturer – TS. Nguyễn Minh Quân', description: 'Lớp học, kiến thức, đồng thuận', onClick: () => loginAs('lecturer', state.lecturers[0].id) },
                { id: 'a', label: 'Admin – Phạm Quốc Bảo', description: 'Kiểm duyệt chỉ đọc', onClick: () => loginAs('admin', state.demoAdmin.id) },
                { id: 'r', label: 'Đặt lại dữ liệu Demo V2', description: 'Khôi phục trạng thái ban đầu', icon: <RotateCcw className="w-4 h-4" />, onClick: () => setResetConfirmOpen(true) },
              ]}
            />

            {state.role === 'guest' ? (
              <Button size="sm" leftIcon={<LogIn className="w-3.5 h-3.5" />} onClick={() => setLoginModalOpen(true)}>
                <span className="hidden sm:inline">Đăng nhập</span>
              </Button>
            ) : (
              <Button size="sm" variant="ghost" leftIcon={<LogOut className="w-3.5 h-3.5" />} onClick={logout}>
                <span className="hidden sm:inline">Thoát</span>
              </Button>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] cursor-pointer"
              aria-label="Mở menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[var(--bg-surface)] border-b border-[var(--border-strong)] px-4 py-3 space-y-1 shadow-xl">
            {activeNav.map((item) => {
              const active = page === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full px-3.5 py-2.5 rounded-lg text-left text-sm font-semibold flex items-center justify-between cursor-pointer ${
                    active
                      ? 'bg-[var(--accent-primary-soft)] text-[var(--accent-primary-fg)]'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge !== undefined && <Badge tone="warning">{item.badge}</Badge>}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Centered Focus Stage */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-7 sm:py-10">
        {children}
      </main>

      <ConfirmDialog
        open={resetConfirmOpen}
        onClose={() => setResetConfirmOpen(false)}
        onConfirm={resetDemoData}
        title="Đặt lại dữ liệu Demo V2?"
        message="Khôi phục toàn bộ khóa học, tiến độ Boss, ghi chú và trạng thái kiểm duyệt về mặc định."
        confirmLabel="Khôi phục"
        tone="primary"
      />
    </div>
  );
};
