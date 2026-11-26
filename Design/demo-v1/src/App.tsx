import React from 'react';
import { AppProvider, useApp } from './store/AppContext';
import { AppShell } from './components/ui/AppShell';
import { ToastContainer } from './components/ui/DataFeedback';
import { LoginModal } from './features/guest/LoginModal';
import { LandingPage } from './features/guest/LandingPage';
import { CourseDiscovery } from './features/guest/CourseDiscovery';
import { CoursePreview } from './features/guest/CoursePreview';
import { SharedNoteView } from './features/guest/SharedNoteView';
import { StudentDashboard } from './features/student/StudentDashboard';
import { LearningInterface } from './features/student/LearningInterface';
import { BossBattle } from './features/student/BossBattle';
import { NotesHub } from './features/student/NotesHub';
import { LecturerDashboard } from './features/lecturer/LecturerDashboard';
import { ClassroomManagement } from './features/lecturer/ClassroomManagement';
import { KnowledgeManagement } from './features/lecturer/KnowledgeManagement';
import { SharedProposals } from './features/lecturer/SharedProposals';
import { LearningAnalytics } from './features/lecturer/LearningAnalytics';
import { AdminDashboard } from './features/admin/AdminDashboard';
import { ContentModeration } from './features/admin/ContentModeration';

const PageRouter: React.FC = () => {
  const { page } = useApp();

  switch (page) {
    case 'landing':
      return <LandingPage />;
    case 'discovery':
      return <CourseDiscovery />;
    case 'course-preview':
      return <CoursePreview />;
    case 'shared-note':
      return <SharedNoteView />;
    case 'student-dashboard':
      return <StudentDashboard />;
    case 'learning':
      return <LearningInterface />;
    case 'boss-battle':
      return <BossBattle />;
    case 'notes':
      return <NotesHub />;
    case 'lecturer-dashboard':
      return <LecturerDashboard />;
    case 'classrooms':
      return <ClassroomManagement />;
    case 'knowledge':
      return <KnowledgeManagement />;
    case 'proposals':
      return <SharedProposals />;
    case 'analytics':
      return <LearningAnalytics />;
    case 'admin-dashboard':
      return <AdminDashboard />;
    case 'moderation':
      return <ContentModeration />;
    default:
      return <LandingPage />;
  }
};

const RootLayout: React.FC = () => {
  const { toasts, dismissToast } = useApp();
  return (
    <>
      <AppShell>
        <PageRouter />
      </AppShell>
      <LoginModal />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  );
};

export const App: React.FC = () => (
  <AppProvider>
    <RootLayout />
  </AppProvider>
);

export default App;
