import React from 'react';
import { ArrowLeft, Copy, Globe, Lock } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/DataFeedback';
import { Eyebrow, Panel, PanelContent } from '../../components/ui/Panel';

export const SharedNoteView: React.FC = () => {
  const { state, sharedNoteId, navigate, addToast } = useApp();
  const publicNotes = state.notes.filter((n) => n.visibility === 'public');
  const note = state.notes.find((n) => n.id === sharedNoteId) ?? publicNotes[0];
  const shareUrl = note ? `${window.location.origin}/#/shared-note/${note.id}` : '';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate(state.role === 'student' ? 'notes' : 'landing')}
        >
          {state.role === 'student' ? 'Quay lại Sổ tay' : 'Về trang chủ'}
        </Button>

        {publicNotes.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {publicNotes.map((pn) => (
              <button
                key={pn.id}
                type="button"
                onClick={() => navigate('shared-note', { noteId: pn.id })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                  note?.id === pn.id ? 'bg-[var(--yellow)] text-[var(--yellow-on)] border-[var(--yellow)]' : 'bg-[var(--panel)] text-[var(--text-body)] border-[var(--line)]'
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
          title="Ghi chú đang ở chế độ Riêng tư"
          description="Chủ sở hữu chưa công khai ghi chú này hoặc đã chuyển lại thành Private."
          action={<Button onClick={() => navigate('landing')}>Về trang chủ</Button>}
        />
      ) : (
        <Panel accent="var(--green)" className="bg-[var(--reading-bg)]">
          <PanelContent className="p-7 sm:p-9 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-[var(--line)]">
              <div className="space-y-2">
                <Eyebrow color="var(--green-fg)">Public Community Note</Eyebrow>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="green" icon={<Globe className="w-3 h-3" />}>Công khai</Badge>
                  <Badge tone="blue">{note.scope === 'global' ? 'Global Notes' : 'Chapter Notes'}</Badge>
                </div>
                <h1 className="display-font text-3xl sm:text-4xl font-extrabold text-[var(--text)]">{note.title}</h1>
                <div className="text-xs text-[var(--muted)]">
                  Tác giả: <strong className="text-[var(--text)]">{note.authorName}</strong> · {note.updatedAt}
                </div>
              </div>

              <Button
                size="sm"
                variant="outline"
                leftIcon={<Copy className="w-3.5 h-3.5" />}
                onClick={() => {
                  navigator.clipboard?.writeText(shareUrl).catch(() => {});
                  addToast({ type: 'success', title: 'Đã sao chép link chia sẻ' });
                }}
              >
                Sao chép link
              </Button>
            </div>

            <div className="text-[15px] sm:text-base text-[var(--text-body)] whitespace-pre-line leading-[1.8]">
              {note.content}
            </div>
          </PanelContent>
        </Panel>
      )}
    </div>
  );
};
