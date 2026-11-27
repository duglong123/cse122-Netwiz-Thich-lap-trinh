import React, { useState } from 'react';
import { Eye, LogIn, LogOut, Menu, Moon, RotateCcw, Shield, Sparkles, Sun, X } from 'lucide-react';
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

const ROLE_META: Record<Role, { label: string; tone: 'muted' | 'yellow' | 'green' | 'blue' }> = {
  guest: { label: 'Khách', tone: 'muted' },
  student: { label: 'Sinh viên', tone: 'yellow' },
  lecturer: { label: 'Giảng viên', tone: 'green' },
  admin: { label: 'Admin', tone: 'blue' },
};

export const AcademyShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    state,
    theme,
    toggleTheme,
    calmMode,
    toggleCalmMode,
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
  const [resetOpen, setResetOpen] = useState(false);

  const mainCourse = state.courses[0];
  const defeatedCount = Object.values(state.bossProgress).filter((b) => b.defeated).length;
  const totalChapters = mainCourse.chapters.length;
  const headerPct = totalChapters > 0 ? Math.round((defeatedCount / totalChapters) * 100) : 0;

  const pendingProposalsCount = state.proposals.filter((p) => p.status === 'pending').length;
  const needsReviewWrongCount = state.wrongAnswers.filter((w) => w.status === 'needs_review').length;
  const flaggedCount = state.courses.reduce(
    (acc, c) => acc + c.chapters.reduce((ca, ch) => ca + ch.lessons.filter((l) => l.moderation.status !== 'normal').length, 0),
    0,
  );

  const navByRole: Record<Role, NavEntry[]> = {
    guest: [
      { id: 'landing', label: 'Học viện' },
      { id: 'discovery', label: 'Khóa học' },
      { id: 'course-preview', label: 'CN-101' },
      { id: 'shared-note', label: 'Ghi chú' },
    ],
    student: [
      { id: 'student-dashboard', label: 'Bản đồ' },
      { id: 'learning', label: 'Học & Inspector' },
      { id: 'boss-battle', label: 'Trận Boss' },
      { id: 'notes', label: 'Sổ tay & Câu sai', badge: needsReviewWrongCount || undefined },
    ],
    lecturer: [
      { id: 'lecturer-dashboard', label: 'Tổng quan' },
      { id: 'classrooms', label: 'Lớp học' },
      { id: 'knowledge', label: 'Kiến thức & Đề' },
      { id: 'proposals', label: 'Đồng thuận', badge: pendingProposalsCount || undefined },
      { id: 'analytics', label: 'Thống kê' },
    ],
    admin: [
      { id: 'admin-dashboard', label: 'Giám sát' },
      { id: 'moderation', label: 'Kiểm duyệt', badge: flaggedCount || undefined },
      { id: 'discovery', label: 'Khóa học' },
    ],
  };

  const activeNav = navByRole[state.role];

  const handleNav = (target: RoutePage) => {
    if (target === 'shared-note') {
      const pub = state.notes.find((n) => n.visibility === 'public');
      navigate('shared-note', { noteId: pub?.id ?? state.notes[0]?.id });
    } else {
      navigate(target);
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sticky 78px blurred header matching css-dc-academy.html */}
      <header className="sticky top-0 z-[100] h-[78px] border-b border-[var(--line)] bg-[var(--header-bg)] backdrop-blur-lg transition-colors">
        <div className="w-[min(1240px,calc(100%-32px))] sm:w-[min(1240px,calc(100%-48px))] h-full mx-auto flex items-center gap-3 sm:gap-5">
          {/* Slanted Brand Mark */}
          <button
            type="button"
            onClick={() => handleNav(activeNav[0].id)}
            className="inline-flex items-center gap-3 shrink-0 cursor-pointer text-left"
          >
            <span className="w-10 h-10 bg-[var(--yellow)] text-[var(--yellow-on)] brand-mark-slanted grid place-items-center">
              <Shield className="w-5 h-5" />
            </span>
            <span className="font-extrabold leading-none tracking-[0.08em] text-[15px] sm:text-[17px] text-[var(--text)]">
              NETWIZ<span className="text-[var(--yellow-fg)]">//</span>HERO
              <small className="block mt-1.5 text-[var(--muted)] text-[8px] sm:text-[9px] tracking-[0.28em] font-bold">
                ACADEMY V3
              </small>
            </span>
          </button>

          {/* Top Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 ml-auto" aria-label="Điều hướng chính">
            {activeNav.map((item) => {
              const active = page === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className={`px-3.5 py-2.5 rounded-lg text-[13px] font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer ${
                    active
                      ? 'text-[var(--yellow-fg)] bg-[var(--yellow-soft)]'
                      : 'text-[var(--text-body)] hover:text-[var(--yellow-fg)] hover:bg-[var(--yellow-soft)]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.5 text-[10px] mono rounded-full bg-[var(--red)] text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Header Course Progress Meter */}
          <div className="hidden sm:block w-[116px] shrink-0 lg:ml-0 ml-auto" aria-label="Tiến độ Boss">
            <div className="flex justify-between mb-1.5 text-[var(--muted)] text-[10px] font-extrabold tracking-[0.1em] uppercase">
              <span>Boss</span>
              <strong className="text-[var(--text)] mono">
                {defeatedCount} / {totalChapters}
              </strong>
            </div>
            <div className="h-[5px] overflow-hidden rounded-full bg-[var(--track)]">
              <div
                className="h-full rounded-full bg-[var(--yellow)] transition-all duration-500"
                style={{ width: `${headerPct}%` }}
              />
            </div>
          </div>

          {/* Right Controls: Theme + Calm Mode + Role Switch + Auth */}
          <div className="flex items-center gap-2 shrink-0 ml-auto sm:ml-0">
            <button
              type="button"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Tối'}
              aria-label={theme === 'dark' ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Tối'}
              className="h-9 px-2.5 rounded-lg border border-[var(--line)] bg-[var(--panel)] text-[var(--text-body)] hover:border-[var(--yellow-fg)] hover:text-[var(--yellow-fg)] text-[11px] font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-[var(--yellow-fg)]" /> : <Moon className="w-3.5 h-3.5 text-[var(--blue-fg)]" />}
              <span className="hidden xl:inline">{theme === 'dark' ? 'Sáng' : 'Tối'}</span>
            </button>

            <button
              type="button"
              onClick={toggleCalmMode}
              title="Giảm hiệu ứng động & film grain cho đọc lâu"
              className={`h-9 px-2.5 rounded-lg border text-[11px] font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                calmMode
                  ? 'border-[var(--green-border)] bg-[var(--green-soft)] text-[var(--green-fg)]'
                  : 'border-[var(--line)] bg-[var(--panel)] text-[var(--text-body)] hover:border-[var(--yellow-fg)]'
              }`}
            >
              {calmMode ? <Eye className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5 text-[var(--yellow-fg)]" />}
              <span className="hidden sm:inline">{calmMode ? 'Dịu mắt' : 'Hiệu ứng'}</span>
            </button>

            {state.role === 'lecturer' && (
              <Dropdown
                trigger={
                  <span className="hidden sm:inline-flex px-2.5 py-1.5 rounded-lg border border-[var(--green-border)] bg-[var(--green-soft)] text-[var(--green-fg)] text-[11px] font-bold">
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
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--panel)] text-[11px] font-bold text-[var(--text)] hover:border-[var(--yellow-fg)]">
                  <Badge tone={ROLE_META[state.role].tone}>{ROLE_META[state.role].label}</Badge>
                </span>
              }
              items={[
                { id: 'g', label: 'Guest – Khách', description: 'Landing, Khóa học, Ghi chú công khai', onClick: () => logout() },
                { id: 's', label: 'Student – Nguyễn Minh Anh', description: 'Hero Aegis-01, Inspector, Boss Arena', onClick: () => loginAs('student', state.demoStudent.id) },
                { id: 'l', label: 'Lecturer – TS. Nguyễn Minh Quân', description: 'Lớp học, Kiến thức, Đồng thuận 100%', onClick: () => loginAs('lecturer', state.lecturers[0].id) },
                { id: 'a', label: 'Admin – Phạm Quốc Bảo', description: 'Kiểm duyệt chỉ đọc, Cảnh báo & Khóa', onClick: () => loginAs('admin', state.demoAdmin.id) },
                { id: 'r', label: 'Đặt lại dữ liệu Demo V3', description: 'Khôi phục LocalStorage về mặc định', icon: <RotateCcw className="w-3.5 h-3.5" />, onClick: () => setResetOpen(true) },
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
              className="lg:hidden p-2 rounded-lg text-[var(--text-body)] hover:text-[var(--yellow-fg)] cursor-pointer"
              aria-label="Mở menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[var(--panel)] border-b border-[var(--line)] px-4 py-3 space-y-1 shadow-2xl">
            {activeNav.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`w-full px-3.5 py-2.5 rounded-lg text-left text-xs font-extrabold uppercase tracking-wider flex items-center justify-between cursor-pointer ${
                  page === item.id ? 'bg-[var(--yellow)] text-[var(--yellow-on)]' : 'text-[var(--text-body)] hover:bg-[var(--panel-2)]'
                }`}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && <Badge tone="red">{item.badge}</Badge>}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="flex-1 w-[min(1240px,calc(100%-24px))] sm:w-[min(1240px,calc(100%-48px))] mx-auto py-8 sm:py-10">
        {children}
      </main>

      {/* Footer matching css-dc-academy.html */}
      <footer className="py-7 border-t border-[var(--line)] bg-[var(--footer-bg)] transition-colors">
        <div className="w-[min(1240px,calc(100%-48px))] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="text-xs font-extrabold tracking-[0.1em]">
            NETWIZ<span className="text-[var(--yellow-fg)]">//</span>SUPERHERO ACADEMY · DEMO V3
          </div>
          <p className="m-0 text-[var(--muted)] text-xs">
            Phong cách Cyber Academy · Chủ đề Computer Networking (5 Chương, 5 Boss) · Hỗ trợ Sáng/Tối & Dịu mắt.
          </p>
        </div>
      </footer>

      <ConfirmDialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={resetDemoData}
        title="Khôi phục dữ liệu Demo V3?"
        message="Toàn bộ tiến độ Boss, vật phẩm, ghi chú, biểu quyết và kiểm duyệt trong Demo V3 sẽ trở về mặc định."
        confirmLabel="Khôi phục"
        tone="primary"
      />
    </div>
  );
};
