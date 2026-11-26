import React from 'react';
import { ArrowLeft, Copy, Globe, Lock } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/DataFeedback';
import { Surface, SurfaceContent } from '../../components/ui/Surface';

export const SharedNoteView: React.FC = () => {
  const { state, sharedNoteId, navigate, addToast } = useApp();
  const publicNotes = state.notes.filter((n) => n.visibility === 'public');
  const note = state.notes.find((n) => n.id === sharedNoteId) ?? publicNotes[0];
  const shareUrl = note ? `${window.location.origin}/#/shared-note/${note.id}` : '';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate(state.role === 'student' ? 'notes' : 'landing')}
        >
          {state.role === 'student' ? 'Quay lại Sổ ghi chú' : 'Quay lại Giới thiệu'}
        </Button>

        {publicNotes.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {publicNotes.map((pn) => (
              <button
                key={pn.id}
                type="button"
                onClick={() => navigate('shared-note', { noteId: pn.id })}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                  note?.id === pn.id
                    ? 'bg-[var(--accent-primary-soft)] text-[var(--accent-primary-fg)] border-[var(--accent-primary)]/40'
                    : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-subtle)]'
                }`}
              >
                {pn.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {!note || note.visibility !== 'public' ? (
        <EmptyState
          icon={<Lock className="w-6 h-6" />}
          title="Ghi chú này đang ở chế độ Riêng tư"
          description="Chủ sở hữu chưa công khai ghi chú này hoặc đã chuyển lại thành Riêng tư."
          action={<Button onClick={() => navigate('landing')}>Về trang chính</Button>}
        />
      ) : (
        <Surface elevated>
          <SurfaceContent className="p-7 sm:p-9 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-[var(--border-subtle)]">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="success" icon={<Globe className="w-3.5 h-3.5" />}>Công khai</Badge>
                  <Badge tone="primary">{note.scope === 'global' ? 'Global Notes' : 'Chapter Notes'}</Badge>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">{note.title}</h1>
                <div className="text-xs text-[var(--text-muted)]">
                  Tác giả: <strong className="text-[var(--text-primary)]">{note.authorName}</strong> · {note.updatedAt}
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Copy className="w-3.5 h-3.5" />}
                onClick={() => {
                  navigator.clipboard?.writeText(shareUrl).catch(() => {});
                  addToast({ type: 'success', title: 'Đã sao chép đường dẫn chia sẻ' });
                }}
              >
                Sao chép link
              </Button>
            </div>

            <div className="text-[16px] text-[var(--text-primary)] whitespace-pre-line leading-[1.8]">
              {note.content}
            </div>
          </SurfaceContent>
        </Surface>
      )}
    </div>
  );
};
