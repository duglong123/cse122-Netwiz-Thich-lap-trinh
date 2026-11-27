import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  Boss,
  ChangeProposal,
  Classroom,
  Course,
  LearningHistoryItem,
  Lesson,
  LessonModeration,
  ModerationLogEntry,
  Note,
  PersistedDemoState,
  Question,
  Role,
  RoutePage,
  ToastItem,
  UserAccount,
  WrongAnswerRecord,
} from '../types';
import { createInitialDemoState } from '../data/mockData';

export type ThemeMode = 'dark' | 'light';

const STORAGE_KEY = 'netwiz_superhero_demo_v3_state';
const CALM_KEY = 'netwiz_v3_calm_mode';
const THEME_KEY = 'netwiz_v3_theme';

function nowFormatted(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function shortTimestamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function loadInitialCalm(): boolean {
  try {
    return localStorage.getItem(CALM_KEY) === 'true';
  } catch {
    return false;
  }
}

function loadInitialTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    return saved === 'light' || saved === 'dark' ? saved : 'dark';
  } catch {
    return 'dark';
  }
}

function loadPersistedState(): PersistedDemoState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialDemoState();
    const parsed = JSON.parse(raw) as PersistedDemoState;
    if (!parsed || !Array.isArray(parsed.courses) || !parsed.hero) {
      return createInitialDemoState();
    }
    return parsed;
  } catch {
    return createInitialDemoState();
  }
}

interface NavigateOptions {
  courseId?: string;
  chapterId?: string;
  lessonId?: string;
  noteId?: string;
}

interface AppContextValue {
  state: PersistedDemoState;
  theme: ThemeMode;
  toggleTheme: () => void;
  calmMode: boolean;
  toggleCalmMode: () => void;
  page: RoutePage;
  sharedNoteId: string | null;
  toasts: ToastItem[];
  loginModalOpen: boolean;
  setLoginModalOpen: (open: boolean) => void;
  currentUser: UserAccount | null;
  navigate: (page: RoutePage, opts?: NavigateOptions) => void;
  loginAs: (role: Exclude<Role, 'guest'>, userId?: string) => void;
  registerDemoStudent: (name: string, email: string) => void;
  logout: () => void;
  switchActiveLecturer: (lecturerId: string) => void;
  resetDemoData: () => void;
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  dismissToast: (id: string) => void;
  toggleLessonComplete: (lessonId: string) => void;
  completeMission: (missionId: string, rewardItemId: string, missionTitle: string) => void;
  recordBossAttemptResult: (params: {
    chapterId: string;
    defeated: boolean;
    passedIds: string[];
    wrongEntries: { questionId: string; selectedIndex: number }[];
    accuracy: number;
    xpEarned: number;
  }) => void;
  resolveWrongAnswer: (wrongAnswerId: string) => void;
  createNote: (input: Omit<Note, 'id' | 'updatedAt' | 'authorId' | 'authorName'>) => Note;
  updateNote: (noteId: string, patch: Partial<Pick<Note, 'title' | 'content' | 'tags' | 'visibility'>>) => void;
  deleteNote: (noteId: string) => void;
  createClassroom: (input: { name: string; code: string; courseId: string; semester: string }) => void;
  updateClassroom: (classroomId: string, patch: { name: string; code: string; semester: string }) => void;
  enrollStudentToClass: (classroomId: string, joinCodeInput: string, studentName: string, studentCode: string) => boolean;
  createCourse: (input: { code: string; title: string; subtitle: string; category: string; level: Course['level']; isPublic: boolean }) => void;
  addChapter: (courseId: string, title: string, summary: string) => void;
  saveLessonOrPropose: (params: {
    courseId: string;
    chapterId: string;
    lessonId?: string;
    title: string;
    durationMinutes: number;
    summary: string;
    content: string;
    keyTakeaways: string[];
    status: Lesson['status'];
    proposalSummary?: string;
  }) => { mode: 'direct' | 'proposed' };
  reorderLesson: (courseId: string, chapterId: string, lessonId: string, direction: 'up' | 'down') => void;
  moveLessonToChapter: (courseId: string, fromChapterId: string, lessonId: string, toChapterId: string) => void;
  archiveOrDeleteLesson: (courseId: string, chapterId: string, lessonId: string, mode: 'archive' | 'delete') => void;
  upsertQuestion: (question: Omit<Question, 'id'> & { id?: string }) => void;
  deleteQuestion: (questionId: string) => void;
  updateBossConfig: (courseId: string, chapterId: string, patch: Partial<Pick<Boss, 'name' | 'title' | 'maxHp' | 'attackPower' | 'trait' | 'description'>>) => void;
  voteProposal: (proposalId: string, decision: 'approved' | 'rejected', comment?: string) => void;
  sendModerationWarning: (params: {
    courseId: string;
    chapterId: string;
    lessonId: string;
    type: 'warning' | 'reminder';
    reason: string;
  }) => void;
  lockLessonContent: (params: {
    courseId: string;
    chapterId: string;
    lessonId: string;
    reason: string;
  }) => void;
  unlockLessonContent: (params: {
    courseId: string;
    chapterId: string;
    lessonId: string;
    reason: string;
  }) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function defaultPageForRole(role: Role): RoutePage {
  switch (role) {
    case 'student':
      return 'student-dashboard';
    case 'lecturer':
      return 'lecturer-dashboard';
    case 'admin':
      return 'admin-dashboard';
    default:
      return 'landing';
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PersistedDemoState>(() => loadPersistedState());
  const [theme, setTheme] = useState<ThemeMode>(() => loadInitialTheme());
  const [calmMode, setCalmMode] = useState<boolean>(() => loadInitialCalm());
  const [page, setPage] = useState<RoutePage>(() => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (hash.startsWith('shared-note/')) return 'shared-note';
    return defaultPageForRole(loadPersistedState().role);
  });
  const [sharedNoteId, setSharedNoteId] = useState<string | null>(() => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (hash.startsWith('shared-note/')) return hash.slice('shared-note/'.length);
    return null;
  });
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#f2efe9' : '#111824');
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next: ThemeMode = prev === 'dark' ? 'light' : 'dark';
      addToast({
        type: 'info',
        title: next === 'light' ? 'Đã chuyển sang Giao diện Sáng (Daylight Paper)' : 'Đã chuyển sang Giao diện Tối (Soft Slate)',
      });
      return next;
    });
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-calm', calmMode ? 'true' : 'false');
    try {
      localStorage.setItem(CALM_KEY, String(calmMode));
    } catch {
      // ignore
    }
  }, [calmMode]);

  const toggleCalmMode = () => {
    setCalmMode((prev) => {
      const next = !prev;
      addToast({
        type: 'info',
        title: next ? 'Đã bật chế độ Dịu mắt (Calm Mode)' : 'Đã bật hiệu ứng Academy đầy đủ',
        message: next ? 'Tạm dừng chuyển động nền & tắt film-grain để đọc lâu dễ chịu hơn.' : undefined,
      });
      return next;
    });
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (hash.startsWith('shared-note/')) {
        setSharedNoteId(hash.slice('shared-note/'.length));
        setPage('shared-note');
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const addToast = (toast: Omit<ToastItem, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3600);
  };

  const dismissToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const currentUser: UserAccount | null =
    state.role === 'guest'
      ? null
      : state.role === 'student'
        ? state.demoStudent
        : state.role === 'admin'
          ? state.demoAdmin
          : state.lecturers.find((l) => l.id === state.currentUserId) || state.lecturers[0];

  const navigate = (nextPage: RoutePage, opts?: NavigateOptions) => {
    if (opts?.courseId || opts?.chapterId || opts?.lessonId) {
      setState((prev) => ({
        ...prev,
        activeCourseId: opts.courseId ?? prev.activeCourseId,
        activeChapterId: opts.chapterId ?? prev.activeChapterId,
        activeLessonId: opts.lessonId ?? prev.activeLessonId,
      }));
    }
    if (nextPage === 'shared-note' && opts?.noteId) {
      setSharedNoteId(opts.noteId);
      window.location.hash = `#/shared-note/${opts.noteId}`;
    } else if (window.location.hash.startsWith('#/shared-note/')) {
      window.history.replaceState(null, '', `#/${nextPage}`);
    }
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loginAs = (role: Exclude<Role, 'guest'>, userId?: string) => {
    const nextUserId =
      userId ??
      (role === 'student'
        ? state.demoStudent.id
        : role === 'admin'
          ? state.demoAdmin.id
          : state.lecturers[0].id);

    setState((prev) => ({ ...prev, role, currentUserId: nextUserId }));
    setLoginModalOpen(false);
    setPage(defaultPageForRole(role));
    const roleLabel = role === 'student' ? 'Sinh viên' : role === 'lecturer' ? 'Giảng viên' : 'Quản trị viên';
    addToast({ type: 'success', title: `Đăng nhập thành công (${roleLabel})` });
  };

  const registerDemoStudent = (name: string, email: string) => {
    const newStudent: UserAccount = {
      id: 'stu-01',
      name: name.trim() || 'Học viên Mới',
      email: email.trim() || 'new.sv@netwiz.edu.vn',
      role: 'student',
      title: 'Sinh viên K22 – Hệ thống Thông tin',
      code: `2252${Math.floor(1000 + Math.random() * 8999)}`,
    };
    setState((prev) => ({ ...prev, role: 'student', currentUserId: newStudent.id, demoStudent: newStudent }));
    setLoginModalOpen(false);
    setPage('student-dashboard');
    addToast({ type: 'success', title: `Chào mừng ${newStudent.name}!` });
  };

  const logout = () => {
    setState((prev) => ({ ...prev, role: 'guest' }));
    setPage('landing');
    addToast({ type: 'info', title: 'Đã chuyển về chế độ Khách (Guest)' });
  };

  const switchActiveLecturer = (lecturerId: string) => {
    const found = state.lecturers.find((l) => l.id === lecturerId);
    if (!found) return;
    setState((prev) => ({ ...prev, role: 'lecturer', currentUserId: lecturerId }));
    addToast({ type: 'info', title: `Đang thao tác với tư cách ${found.name}` });
  };

  const resetDemoData = () => {
    const fresh = createInitialDemoState();
    setState(fresh);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    setPage('landing');
    addToast({ type: 'info', title: 'Đã khôi phục dữ liệu Demo V3 về mặc định' });
  };

  const toggleLessonComplete = (lessonId: string) => {
    setState((prev) => {
      const exists = prev.completedLessonIds.includes(lessonId);
      const completedLessonIds = exists
        ? prev.completedLessonIds.filter((id) => id !== lessonId)
        : [...prev.completedLessonIds, lessonId];
      const historyItem: LearningHistoryItem | null = !exists
        ? { id: `sh-${Date.now()}`, action: 'Hoàn thành bài học', detail: `Đã hoàn tất (${lessonId})`, timestamp: shortTimestamp() }
        : null;
      return {
        ...prev,
        completedLessonIds,
        hero: !exists ? { ...prev.hero, xp: prev.hero.xp + 25 } : prev.hero,
        studentHistory: historyItem ? [historyItem, ...prev.studentHistory] : prev.studentHistory,
      };
    });
  };

  const completeMission = (missionId: string, rewardItemId: string, missionTitle: string) => {
    setState((prev) => {
      const alreadyCompleted = prev.completedMissionIds.includes(missionId);
      const hasItem = prev.hero.inventoryItemIds.includes(rewardItemId);
      return {
        ...prev,
        completedMissionIds: alreadyCompleted ? prev.completedMissionIds : [...prev.completedMissionIds, missionId],
        hero: {
          ...prev.hero,
          xp: alreadyCompleted ? prev.hero.xp : prev.hero.xp + 60,
          inventoryItemIds: hasItem ? prev.hero.inventoryItemIds : [...prev.hero.inventoryItemIds, rewardItemId],
        },
        studentHistory: [
          { id: `sh-${Date.now()}`, action: `Hoàn thành nhiệm vụ: ${missionTitle}`, detail: 'Nhận vật phẩm mới vào Inventory', timestamp: shortTimestamp() },
          ...prev.studentHistory,
        ],
      };
    });
  };

  const recordBossAttemptResult: AppContextValue['recordBossAttemptResult'] = ({
    chapterId,
    defeated,
    passedIds,
    wrongEntries,
    accuracy,
    xpEarned,
  }) => {
    setState((prev) => {
      const prevProg = prev.bossProgress[chapterId] ?? {
        chapterId,
        defeated: false,
        attempts: 0,
        passedQuestionIds: [],
        wrongQuestionIds: [],
        bestAccuracy: 0,
      };

      const wrongIdsThisRun = wrongEntries.map((w) => w.questionId);
      const mergedPassed = Array.from(new Set([...prevProg.passedQuestionIds, ...passedIds])).filter(
        (id) => !wrongIdsThisRun.includes(id),
      );
      const resolvedIds = new Set(passedIds);
      const remainingWrong = Array.from(
        new Set([...prevProg.wrongQuestionIds.filter((id) => !resolvedIds.has(id)), ...wrongIdsThisRun]),
      );

      const updatedWrongAnswers: WrongAnswerRecord[] = [...prev.wrongAnswers];
      for (let i = 0; i < updatedWrongAnswers.length; i++) {
        const rec = updatedWrongAnswers[i];
        if (rec.chapterId === chapterId && resolvedIds.has(rec.questionId)) {
          updatedWrongAnswers[i] = { ...rec, status: 'resolved', lastAttemptAt: nowFormatted() };
        }
      }

      for (const entry of wrongEntries) {
        const idx = updatedWrongAnswers.findIndex((r) => r.questionId === entry.questionId);
        if (idx >= 0) {
          updatedWrongAnswers[idx] = {
            ...updatedWrongAnswers[idx],
            selectedIndex: entry.selectedIndex,
            attempts: updatedWrongAnswers[idx].attempts + 1,
            status: 'needs_review',
            lastAttemptAt: nowFormatted(),
          };
        } else {
          updatedWrongAnswers.unshift({
            id: `wa-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            questionId: entry.questionId,
            courseId: prev.activeCourseId,
            chapterId,
            selectedIndex: entry.selectedIndex,
            attempts: 1,
            status: 'needs_review',
            lastAttemptAt: nowFormatted(),
          });
        }
      }

      const chapterObj = prev.courses.find((c) => c.id === prev.activeCourseId)?.chapters.find((ch) => ch.id === chapterId);
      const newXp = prev.hero.xp + xpEarned;
      const leveledUp = newXp >= prev.hero.nextLevelXp;

      return {
        ...prev,
        bossProgress: {
          ...prev.bossProgress,
          [chapterId]: {
            chapterId,
            defeated: prevProg.defeated || defeated,
            attempts: prevProg.attempts + 1,
            passedQuestionIds: mergedPassed,
            wrongQuestionIds: remainingWrong,
            bestAccuracy: Math.max(prevProg.bestAccuracy, accuracy),
          },
        },
        wrongAnswers: updatedWrongAnswers,
        hero: {
          ...prev.hero,
          level: leveledUp ? prev.hero.level + 1 : prev.hero.level,
          xp: leveledUp ? newXp - prev.hero.nextLevelXp : newXp,
          maxHp: leveledUp ? prev.hero.maxHp + 10 : prev.hero.maxHp,
          hp: leveledUp ? prev.hero.maxHp + 10 : prev.hero.maxHp,
          attack: leveledUp ? prev.hero.attack + 4 : prev.hero.attack,
        },
        studentHistory: [
          {
            id: `sh-${Date.now()}`,
            action: defeated
              ? `Đánh bại Boss ${chapterObj?.boss.name ?? chapterId}`
              : `Thất bại trước Boss ${chapterObj?.boss.name ?? chapterId}`,
            detail: `Độ chính xác ${accuracy}% · ${passedIds.length} câu đúng, ${wrongEntries.length} câu cần ôn`,
            timestamp: shortTimestamp(),
          },
          ...prev.studentHistory,
        ],
      };
    });
  };

  const resolveWrongAnswer = (wrongAnswerId: string) => {
    setState((prev) => {
      const target = prev.wrongAnswers.find((w) => w.id === wrongAnswerId);
      if (!target) return prev;
      const nextWrong = prev.wrongAnswers.map((w) =>
        w.id === wrongAnswerId ? { ...w, status: 'resolved' as const, lastAttemptAt: nowFormatted() } : w,
      );
      const chProg = prev.bossProgress[target.chapterId];
      const nextBossProgress = chProg
        ? {
            ...prev.bossProgress,
            [target.chapterId]: {
              ...chProg,
              wrongQuestionIds: chProg.wrongQuestionIds.filter((id) => id !== target.questionId),
              passedQuestionIds: Array.from(new Set([...chProg.passedQuestionIds, target.questionId])),
            },
          }
        : prev.bossProgress;
      return {
        ...prev,
        wrongAnswers: nextWrong,
        bossProgress: nextBossProgress,
        studentHistory: [
          { id: `sh-${Date.now()}`, action: 'Khắc phục câu trả lời sai', detail: 'Đã trả lời đúng lại câu hỏi trong Wrong Answers', timestamp: shortTimestamp() },
          ...prev.studentHistory,
        ],
      };
    });
    addToast({ type: 'success', title: 'Đã khắc phục câu hỏi!' });
  };

  const createNote: AppContextValue['createNote'] = (input) => {
    const newNote: Note = {
      ...input,
      id: `note-${Date.now()}`,
      updatedAt: nowFormatted(),
      authorId: state.demoStudent.id,
      authorName: state.demoStudent.name,
    };
    setState((prev) => ({ ...prev, notes: [newNote, ...prev.notes] }));
    addToast({
      type: 'success',
      title: 'Đã lưu ghi chú mới',
      message: newNote.visibility === 'private' ? 'Mặc định ở chế độ Riêng tư.' : 'Đang ở chế độ Công khai.',
    });
    return newNote;
  };

  const updateNote: AppContextValue['updateNote'] = (noteId, patch) => {
    setState((prev) => ({
      ...prev,
      notes: prev.notes.map((n) => (n.id === noteId ? { ...n, ...patch, updatedAt: nowFormatted() } : n)),
    }));
  };

  const deleteNote = (noteId: string) => {
    setState((prev) => ({ ...prev, notes: prev.notes.filter((n) => n.id !== noteId) }));
    addToast({ type: 'info', title: 'Đã xóa ghi chú' });
  };

  const createClassroom: AppContextValue['createClassroom'] = ({ name, code, courseId, semester }) => {
    const joinCode = `NW-${Math.floor(1000 + Math.random() * 9000)}`;
    const newClass: Classroom = {
      id: `cls-${Date.now()}`,
      name,
      code,
      courseId,
      lecturerId: currentUser?.id ?? state.lecturers[0].id,
      joinCode,
      semester,
      students: [],
    };
    setState((prev) => ({ ...prev, classrooms: [newClass, ...prev.classrooms] }));
    addToast({ type: 'success', title: `Đã tạo lớp ${name}`, message: `Mã tham gia: ${joinCode}` });
  };

  const updateClassroom: AppContextValue['updateClassroom'] = (classroomId, patch) => {
    setState((prev) => ({
      ...prev,
      classrooms: prev.classrooms.map((c) => (c.id === classroomId ? { ...c, ...patch } : c)),
    }));
    addToast({ type: 'success', title: 'Đã cập nhật thông tin lớp học' });
  };

  const enrollStudentToClass: AppContextValue['enrollStudentToClass'] = (
    classroomId,
    joinCodeInput,
    studentName,
    studentCode,
  ) => {
    const targetClass = state.classrooms.find((c) => c.id === classroomId);
    if (!targetClass) return false;
    if (joinCodeInput.trim().toUpperCase() !== targetClass.joinCode.toUpperCase()) {
      addToast({ type: 'error', title: 'Mã tham gia không khớp', message: `Mã đúng là ${targetClass.joinCode}` });
      return false;
    }
    const newStu = {
      id: `stu-${Date.now()}`,
      name: studentName.trim(),
      studentCode: studentCode.trim(),
      email: `${studentCode.trim().toLowerCase()}@netwiz.edu.vn`,
      progressPercent: 0,
      completedChapters: 0,
      bossesDefeated: 0,
      accuracyRate: 0,
      lastActive: 'Vừa tham gia',
      difficultTopics: [],
      learningHistory: [{ id: `h-${Date.now()}`, action: 'Tham gia lớp học', detail: `Mã ${targetClass.joinCode}`, timestamp: shortTimestamp() }],
    };
    setState((prev) => ({
      ...prev,
      classrooms: prev.classrooms.map((c) => (c.id === classroomId ? { ...c, students: [newStu, ...c.students] } : c)),
    }));
    addToast({ type: 'success', title: `Đã thêm ${newStu.name} vào lớp` });
    return true;
  };

  const createCourse: AppContextValue['createCourse'] = (input) => {
    const newCourseId = `course-${Date.now()}`;
    const chId = `ch-${Date.now()}`;
    const newCourse: Course = {
      id: newCourseId,
      ...input,
      collaboratorIds: [currentUser?.id ?? state.lecturers[0].id],
      enrolledCount: 0,
      updatedAt: nowFormatted(),
      chapters: [
        {
          id: chId,
          order: 1,
          title: 'Chương 1: Tổng quan & Nền tảng',
          summary: 'Chương khởi đầu mới được tạo.',
          lessons: [],
          mission: {
            id: `mis-${Date.now()}`,
            chapterId: chId,
            title: 'Nhiệm vụ Khởi động',
            type: 'scenario',
            description: 'Nhiệm vụ mẫu.',
            rewardItemId: 'item-shield',
            scenarioItems: [
              { id: `sc-${Date.now()}`, prompt: 'Xác nhận khởi tạo chương:', options: ['Kích hoạt', 'Hủy'], correctOption: 'Kích hoạt', explanation: 'Sẵn sàng biên soạn.' },
            ],
          },
          boss: {
            id: `boss-${Date.now()}`,
            chapterId: chId,
            name: 'Protocol Sentinel',
            title: 'Boss Chương 1',
            avatar: '/images/boss-2.jpg',
            maxHp: 90,
            attackPower: 25,
            trait: 'Kiểm tra kiến thức nền',
            description: 'Boss mặc định khi tạo khóa học mới.',
          },
        },
      ],
    };
    setState((prev) => ({ ...prev, courses: [newCourse, ...prev.courses], activeCourseId: newCourseId, activeChapterId: chId }));
    addToast({ type: 'success', title: `Đã tạo khóa học ${input.title}` });
  };

  const addChapter: AppContextValue['addChapter'] = (courseId, title, summary) => {
    setState((prev) => ({
      ...prev,
      courses: prev.courses.map((c) => {
        if (c.id !== courseId) return c;
        const chId = `ch-${Date.now()}`;
        const order = c.chapters.length + 1;
        return {
          ...c,
          updatedAt: nowFormatted(),
          chapters: [
            ...c.chapters,
            {
              id: chId,
              order,
              title,
              summary,
              lessons: [],
              mission: {
                id: `mis-${Date.now()}`,
                chapterId: chId,
                title: `Nhiệm vụ Chương ${order}`,
                type: 'scenario',
                description: 'Thử thách giữa chương.',
                rewardItemId: 'item-stabilizer',
                scenarioItems: [
                  { id: `sc-${Date.now()}`, prompt: 'Xác nhận triển khai:', options: ['Xác nhận', 'Tạm hoãn'], correctOption: 'Xác nhận', explanation: 'Sẵn sàng thêm bài học.' },
                ],
              },
              boss: {
                id: `boss-${Date.now()}`,
                chapterId: chId,
                name: `Guardian Ch.${order}`,
                title: `Boss Chương ${order}`,
                avatar: '/images/boss-3.jpg',
                maxHp: 100,
                attackPower: 30,
                trait: 'Thử thách tổng hợp chương',
                description: 'Boss bảo vệ chương mới.',
              },
            },
          ],
        };
      }),
    }));
    addToast({ type: 'success', title: `Đã thêm chương: ${title}` });
  };

  const saveLessonOrPropose: AppContextValue['saveLessonOrPropose'] = ({
    courseId,
    chapterId,
    lessonId,
    title,
    durationMinutes,
    summary,
    content,
    keyTakeaways,
    status,
    proposalSummary,
  }) => {
    const course = state.courses.find((c) => c.id === courseId);
    const chapter = course?.chapters.find((ch) => ch.id === chapterId);
    const existingLesson = lessonId ? chapter?.lessons.find((l) => l.id === lessonId) : undefined;
    const isSharedPublishedEdit =
      Boolean(course && course.collaboratorIds.length > 1) &&
      Boolean(existingLesson && existingLesson.status === 'published' && status === 'published');

    const actorId = currentUser?.id ?? state.lecturers[0].id;
    const actorName = currentUser?.name ?? state.lecturers[0].name;

    if (isSharedPublishedEdit && existingLesson) {
      const proposal: ChangeProposal = {
        id: `prop-${Date.now()}`,
        courseId,
        chapterId,
        lessonId: existingLesson.id,
        lessonTitle: title,
        proposerId: actorId,
        summary: proposalSummary?.trim() || `Đề xuất cập nhật nội dung "${title}"`,
        beforeContent: existingLesson.content,
        afterContent: content,
        createdAt: nowFormatted(),
        status: 'pending',
        votes: { [actorId]: { decision: 'approved', comment: 'Người đề xuất đồng ý.', votedAt: nowFormatted() } },
      };
      setState((prev) => ({ ...prev, proposals: [proposal, ...prev.proposals] }));
      addToast({ type: 'info', title: 'Đã tạo Đề xuất đồng thuận', message: 'Cần 100% giảng viên đồng ý trước khi công bố.' });
      return { mode: 'proposed' };
    }

    setState((prev) => ({
      ...prev,
      courses: prev.courses.map((c) => {
        if (c.id !== courseId) return c;
        return {
          ...c,
          updatedAt: nowFormatted(),
          chapters: c.chapters.map((ch) => {
            if (ch.id !== chapterId) return ch;
            if (existingLesson) {
              return {
                ...ch,
                lessons: ch.lessons.map((l) =>
                  l.id === existingLesson.id
                    ? {
                        ...l,
                        title,
                        durationMinutes,
                        summary,
                        content,
                        keyTakeaways,
                        status,
                        version: l.version + 1,
                        versionHistory: [
                          ...l.versionHistory,
                          { version: l.version + 1, updatedAt: nowFormatted(), updatedBy: actorName, summary: status === 'draft' ? 'Lưu nháp' : 'Cập nhật bài học', content },
                        ],
                      }
                    : l,
                ),
              };
            }
            const newLesson: Lesson = {
              id: `les-${Date.now()}`,
              title,
              durationMinutes,
              summary,
              content,
              keyTakeaways,
              status,
              version: 1,
              versionHistory: [{ version: 1, updatedAt: nowFormatted(), updatedBy: actorName, summary: status === 'draft' ? 'Bản nháp' : 'Công bố mới', content }],
              moderation: { status: 'normal', warnings: [] },
            };
            return { ...ch, lessons: [...ch.lessons, newLesson] };
          }),
        };
      }),
    }));
    addToast({ type: 'success', title: status === 'draft' ? 'Đã lưu bản nháp' : 'Đã lưu nội dung kiến thức' });
    return { mode: 'direct' };
  };

  const reorderLesson: AppContextValue['reorderLesson'] = (courseId, chapterId, lessonId, direction) => {
    setState((prev) => ({
      ...prev,
      courses: prev.courses.map((c) =>
        c.id !== courseId
          ? c
          : {
              ...c,
              chapters: c.chapters.map((ch) => {
                if (ch.id !== chapterId) return ch;
                const idx = ch.lessons.findIndex((l) => l.id === lessonId);
                const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
                if (idx < 0 || targetIdx < 0 || targetIdx >= ch.lessons.length) return ch;
                const next = [...ch.lessons];
                const [moved] = next.splice(idx, 1);
                next.splice(targetIdx, 0, moved);
                return { ...ch, lessons: next };
              }),
            },
      ),
    }));
  };

  const moveLessonToChapter: AppContextValue['moveLessonToChapter'] = (courseId, fromChapterId, lessonId, toChapterId) => {
    if (fromChapterId === toChapterId) return;
    setState((prev) => ({
      ...prev,
      courses: prev.courses.map((c) => {
        if (c.id !== courseId) return c;
        let movingLesson: Lesson | undefined;
        const removed = c.chapters.map((ch) => {
          if (ch.id !== fromChapterId) return ch;
          movingLesson = ch.lessons.find((l) => l.id === lessonId);
          return { ...ch, lessons: ch.lessons.filter((l) => l.id !== lessonId) };
        });
        if (!movingLesson) return c;
        return {
          ...c,
          chapters: removed.map((ch) => (ch.id === toChapterId ? { ...ch, lessons: [...ch.lessons, movingLesson!] } : ch)),
        };
      }),
    }));
    addToast({ type: 'success', title: 'Đã chuyển bài học sang chương mới' });
  };

  const archiveOrDeleteLesson: AppContextValue['archiveOrDeleteLesson'] = (courseId, chapterId, lessonId, mode) => {
    setState((prev) => ({
      ...prev,
      courses: prev.courses.map((c) =>
        c.id !== courseId
          ? c
          : {
              ...c,
              chapters: c.chapters.map((ch) =>
                ch.id !== chapterId
                  ? ch
                  : mode === 'delete'
                    ? { ...ch, lessons: ch.lessons.filter((l) => l.id !== lessonId) }
                    : { ...ch, lessons: ch.lessons.map((l) => (l.id === lessonId ? { ...l, status: 'archived' as const } : l)) },
              ),
            },
      ),
    }));
    addToast({ type: 'info', title: mode === 'delete' ? 'Đã xóa bài học' : 'Đã lưu trữ bài học' });
  };

  const upsertQuestion: AppContextValue['upsertQuestion'] = (question) => {
    setState((prev) =>
      question.id
        ? { ...prev, questions: prev.questions.map((q) => (q.id === question.id ? ({ ...question, id: question.id } as Question) : q)) }
        : { ...prev, questions: [{ ...question, id: `q-${Date.now()}` }, ...prev.questions] },
    );
    addToast({ type: 'success', title: question.id ? 'Đã cập nhật câu hỏi' : 'Đã thêm câu hỏi vào ngân hàng đề' });
  };

  const deleteQuestion = (questionId: string) => {
    setState((prev) => ({ ...prev, questions: prev.questions.filter((q) => q.id !== questionId) }));
    addToast({ type: 'info', title: 'Đã xóa câu hỏi' });
  };

  const updateBossConfig: AppContextValue['updateBossConfig'] = (courseId, chapterId, patch) => {
    setState((prev) => ({
      ...prev,
      courses: prev.courses.map((c) =>
        c.id !== courseId
          ? c
          : { ...c, chapters: c.chapters.map((ch) => (ch.id === chapterId ? { ...ch, boss: { ...ch.boss, ...patch } } : ch)) },
      ),
    }));
    addToast({ type: 'success', title: 'Đã cập nhật thông số Boss' });
  };

  const voteProposal: AppContextValue['voteProposal'] = (proposalId, decision, comment) => {
    const voterId = currentUser?.id ?? state.lecturers[0].id;
    let outcomeToast: Omit<ToastItem, 'id'> = { type: 'info', title: 'Đã ghi nhận biểu quyết' };

    setState((prev) => {
      const proposal = prev.proposals.find((p) => p.id === proposalId);
      if (!proposal || proposal.status !== 'pending') return prev;
      const course = prev.courses.find((c) => c.id === proposal.courseId);
      const collaboratorIds = course?.collaboratorIds ?? [];

      const nextVotes = {
        ...proposal.votes,
        [voterId]: { decision, comment: comment?.trim() || undefined, votedAt: nowFormatted() },
      };

      const hasRejection = Object.values(nextVotes).some((v) => v.decision === 'rejected');
      const allApproved = collaboratorIds.length > 0 && collaboratorIds.every((id) => nextVotes[id]?.decision === 'approved');

      const nextStatus: ChangeProposal['status'] = hasRejection ? 'rejected' : allApproved ? 'approved' : 'pending';
      let nextCourses = prev.courses;

      if (nextStatus === 'approved') {
        const voterName = prev.lecturers.find((l) => l.id === voterId)?.name ?? 'Giảng viên';
        nextCourses = prev.courses.map((c) =>
          c.id !== proposal.courseId
            ? c
            : {
                ...c,
                updatedAt: nowFormatted(),
                chapters: c.chapters.map((ch) =>
                  ch.id !== proposal.chapterId
                    ? ch
                    : {
                        ...ch,
                        lessons: ch.lessons.map((l) =>
                          l.id === proposal.lessonId
                            ? {
                                ...l,
                                content: proposal.afterContent,
                                version: l.version + 1,
                                versionHistory: [
                                  ...l.versionHistory,
                                  {
                                    version: l.version + 1,
                                    updatedAt: nowFormatted(),
                                    updatedBy: `Đồng thuận 100% (${voterName})`,
                                    summary: proposal.summary,
                                    content: proposal.afterContent,
                                  },
                                ],
                              }
                            : l,
                        ),
                      },
                ),
              },
        );
        outcomeToast = { type: 'success', title: 'Đạt 100% đồng thuận — Phiên bản mới đã được công bố!' };
      } else if (nextStatus === 'rejected') {
        outcomeToast = { type: 'warning', title: 'Đề xuất bị từ chối (Rejected)', message: 'Giữ nguyên nội dung gốc.' };
      } else {
        const remaining = collaboratorIds.filter((id) => !nextVotes[id]).length;
        outcomeToast = { type: 'info', title: 'Đã ghi nhận phiếu Đồng ý', message: `Còn ${remaining} giảng viên chưa biểu quyết.` };
      }

      return {
        ...prev,
        courses: nextCourses,
        proposals: prev.proposals.map((p) => (p.id === proposalId ? { ...p, votes: nextVotes, status: nextStatus } : p)),
      };
    });

    addToast(outcomeToast);
  };

  const sendModerationWarning: AppContextValue['sendModerationWarning'] = ({ courseId, chapterId, lessonId, type, reason }) => {
    const actorName = `${state.demoAdmin.name} (Admin)`;
    const timestamp = nowFormatted();
    let targetLabel = lessonId;

    setState((prev) => {
      const nextCourses = prev.courses.map((c) =>
        c.id !== courseId
          ? c
          : {
              ...c,
              chapters: c.chapters.map((ch) =>
                ch.id !== chapterId
                  ? ch
                  : {
                      ...ch,
                      lessons: ch.lessons.map((l) => {
                        if (l.id !== lessonId) return l;
                        targetLabel = `${c.title} › Chương ${ch.order} › ${l.title}`;
                        return {
                          ...l,
                          moderation: {
                            ...l.moderation,
                            status: (l.moderation.status === 'locked' ? 'locked' : 'warned') as LessonModeration['status'],
                            warnings: [{ id: `warn-${Date.now()}`, type, message: reason, actorName, createdAt: timestamp }, ...l.moderation.warnings],
                          },
                        };
                      }),
                    },
              ),
            },
      );
      const logEntry: ModerationLogEntry = { id: `mod-log-${Date.now()}`, action: type, targetLabel, courseId, chapterId, lessonId, reason, actorName, timestamp };
      return { ...prev, courses: nextCourses, moderationLogs: [logEntry, ...prev.moderationLogs] };
    });
    addToast({ type: 'warning', title: type === 'warning' ? 'Đã gửi cảnh báo cho giảng viên' : 'Đã gửi nhắc nhở rà soát' });
  };

  const lockLessonContent: AppContextValue['lockLessonContent'] = ({ courseId, chapterId, lessonId, reason }) => {
    const actorName = `${state.demoAdmin.name} (Admin)`;
    const timestamp = nowFormatted();
    let targetLabel = lessonId;

    setState((prev) => {
      const nextCourses = prev.courses.map((c) =>
        c.id !== courseId
          ? c
          : {
              ...c,
              chapters: c.chapters.map((ch) =>
                ch.id !== chapterId
                  ? ch
                  : {
                      ...ch,
                      lessons: ch.lessons.map((l) => {
                        if (l.id !== lessonId) return l;
                        targetLabel = `${c.title} › Chương ${ch.order} › ${l.title}`;
                        return {
                          ...l,
                          moderation: { ...l.moderation, status: 'locked' as LessonModeration['status'], reason, lockedBy: actorName, lockedAt: timestamp },
                        };
                      }),
                    },
              ),
            },
      );
      const logEntry: ModerationLogEntry = { id: `mod-log-${Date.now()}`, action: 'lock', targetLabel, courseId, chapterId, lessonId, reason, actorName, timestamp };
      return { ...prev, courses: nextCourses, moderationLogs: [logEntry, ...prev.moderationLogs] };
    });
    addToast({ type: 'error', title: 'Đã khóa phần kiến thức', message: 'Dữ liệu & lịch sử phiên bản được giữ nguyên.' });
  };

  const unlockLessonContent: AppContextValue['unlockLessonContent'] = ({ courseId, chapterId, lessonId, reason }) => {
    const actorName = `${state.demoAdmin.name} (Admin)`;
    const timestamp = nowFormatted();
    let targetLabel = lessonId;

    setState((prev) => {
      const nextCourses = prev.courses.map((c) =>
        c.id !== courseId
          ? c
          : {
              ...c,
              chapters: c.chapters.map((ch) =>
                ch.id !== chapterId
                  ? ch
                  : {
                      ...ch,
                      lessons: ch.lessons.map((l) => {
                        if (l.id !== lessonId) return l;
                        targetLabel = `${c.title} › Chương ${ch.order} › ${l.title}`;
                        return {
                          ...l,
                          moderation: { ...l.moderation, status: 'normal' as LessonModeration['status'], reason: undefined, lockedBy: undefined, lockedAt: undefined },
                        };
                      }),
                    },
              ),
            },
      );
      const logEntry: ModerationLogEntry = { id: `mod-log-${Date.now()}`, action: 'unlock', targetLabel, courseId, chapterId, lessonId, reason, actorName, timestamp };
      return { ...prev, courses: nextCourses, moderationLogs: [logEntry, ...prev.moderationLogs] };
    });
    addToast({ type: 'success', title: 'Đã mở khóa nội dung kiến thức' });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        theme,
        toggleTheme,
        calmMode,
        toggleCalmMode,
        page,
        sharedNoteId,
        toasts,
        loginModalOpen,
        setLoginModalOpen,
        currentUser,
        navigate,
        loginAs,
        registerDemoStudent,
        logout,
        switchActiveLecturer,
        resetDemoData,
        addToast,
        dismissToast,
        toggleLessonComplete,
        completeMission,
        recordBossAttemptResult,
        resolveWrongAnswer,
        createNote,
        updateNote,
        deleteNote,
        createClassroom,
        updateClassroom,
        enrollStudentToClass,
        createCourse,
        addChapter,
        saveLessonOrPropose,
        reorderLesson,
        moveLessonToChapter,
        archiveOrDeleteLesson,
        upsertQuestion,
        deleteQuestion,
        updateBossConfig,
        voteProposal,
        sendModerationWarning,
        lockLessonContent,
        unlockLessonContent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
