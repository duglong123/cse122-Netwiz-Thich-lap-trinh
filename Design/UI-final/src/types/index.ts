export type Role = 'guest' | 'student' | 'lecturer' | 'admin';

export type RoutePage =
  | 'landing'
  | 'discovery'
  | 'course-preview'
  | 'shared-note'
  | 'student-dashboard'
  | 'learning'
  | 'boss-battle'
  | 'notes'
  | 'lecturer-dashboard'
  | 'classrooms'
  | 'knowledge'
  | 'proposals'
  | 'analytics'
  | 'admin-dashboard'
  | 'moderation';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: Exclude<Role, 'guest'>;
  title: string;
  code: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic';
  effectType: 'heal' | 'hint' | 'boost' | 'badge';
  effectValue: number;
  sourceLabel: string;
}

export interface HeroProfile {
  id: string;
  name: string;
  title: string;
  avatar: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  inventoryItemIds: string[];
}

export interface ModerationWarning {
  id: string;
  type: 'warning' | 'reminder';
  message: string;
  actorName: string;
  createdAt: string;
}

export interface LessonModeration {
  status: 'normal' | 'warned' | 'locked';
  reason?: string;
  lockedBy?: string;
  lockedAt?: string;
  warnings: ModerationWarning[];
}

export interface LessonVersion {
  version: number;
  updatedAt: string;
  updatedBy: string;
  summary: string;
  content: string;
}

export interface Lesson {
  id: string;
  title: string;
  durationMinutes: number;
  summary: string;
  content: string;
  keyTakeaways: string[];
  status: 'published' | 'draft' | 'archived';
  version: number;
  versionHistory: LessonVersion[];
  moderation: LessonModeration;
}

export interface MatchPair {
  id: string;
  left: string;
  right: string;
}

export interface OrderItem {
  id: string;
  label: string;
  detail: string;
  correctPosition: number;
}

export interface ScenarioQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctOption: string;
  explanation: string;
}

export interface InteractiveMission {
  id: string;
  chapterId: string;
  title: string;
  type: 'match' | 'order' | 'scenario';
  description: string;
  rewardItemId: string;
  matchPairs?: MatchPair[];
  orderItems?: OrderItem[];
  scenarioItems?: ScenarioQuestion[];
}

export interface Boss {
  id: string;
  chapterId: string;
  name: string;
  title: string;
  avatar: string;
  maxHp: number;
  attackPower: number;
  trait: string;
  description: string;
}

export interface Chapter {
  id: string;
  order: number;
  title: string;
  summary: string;
  lessons: Lesson[];
  mission: InteractiveMission;
  boss: Boss;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  category: string;
  level: 'Cơ bản' | 'Trung cấp' | 'Nâng cao';
  isPublic: boolean;
  collaboratorIds: string[];
  chapters: Chapter[];
  enrolledCount: number;
  updatedAt: string;
}

export interface Question {
  id: string;
  courseId: string;
  chapterId: string;
  knowledgeObjective: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
}

export interface BossProgress {
  chapterId: string;
  defeated: boolean;
  attempts: number;
  passedQuestionIds: string[];
  wrongQuestionIds: string[];
  bestAccuracy: number;
}

export interface WrongAnswerRecord {
  id: string;
  questionId: string;
  courseId: string;
  chapterId: string;
  selectedIndex: number;
  attempts: number;
  status: 'needs_review' | 'resolved';
  lastAttemptAt: string;
}

export interface Note {
  id: string;
  scope: 'chapter' | 'global';
  courseId?: string;
  chapterId?: string;
  title: string;
  content: string;
  tags: string[];
  visibility: 'private' | 'public';
  updatedAt: string;
  authorId: string;
  authorName: string;
}

export interface LearningHistoryItem {
  id: string;
  action: string;
  detail: string;
  timestamp: string;
}

export interface StudentMetric {
  id: string;
  name: string;
  studentCode: string;
  email: string;
  progressPercent: number;
  completedChapters: number;
  bossesDefeated: number;
  accuracyRate: number;
  lastActive: string;
  difficultTopics: string[];
  learningHistory: LearningHistoryItem[];
}

export interface Classroom {
  id: string;
  name: string;
  code: string;
  courseId: string;
  lecturerId: string;
  joinCode: string;
  semester: string;
  students: StudentMetric[];
}

export interface ProposalVote {
  decision: 'approved' | 'rejected';
  comment?: string;
  votedAt: string;
}

export interface ChangeProposal {
  id: string;
  courseId: string;
  chapterId: string;
  lessonId: string;
  lessonTitle: string;
  proposerId: string;
  summary: string;
  beforeContent: string;
  afterContent: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  votes: Record<string, ProposalVote>;
}

export interface ModerationLogEntry {
  id: string;
  action: 'warning' | 'reminder' | 'lock' | 'unlock';
  targetLabel: string;
  courseId: string;
  chapterId: string;
  lessonId: string;
  reason: string;
  actorName: string;
  timestamp: string;
}

export interface ToastItem {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message?: string;
}

export interface PersistedDemoState {
  role: Role;
  currentUserId: string;
  activeCourseId: string;
  activeChapterId: string;
  activeLessonId: string;
  hero: HeroProfile;
  courses: Course[];
  questions: Question[];
  inventoryCatalog: InventoryItem[];
  completedLessonIds: string[];
  completedMissionIds: string[];
  bossProgress: Record<string, BossProgress>;
  wrongAnswers: WrongAnswerRecord[];
  notes: Note[];
  classrooms: Classroom[];
  proposals: ChangeProposal[];
  moderationLogs: ModerationLogEntry[];
  studentHistory: LearningHistoryItem[];
  lecturers: UserAccount[];
  demoStudent: UserAccount;
  demoAdmin: UserAccount;
}
