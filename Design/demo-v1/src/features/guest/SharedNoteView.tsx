import React from 'react';
import { ArrowLeft, Copy, Globe, Lock } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/DataFeedback';

export const SharedNoteView: React.FC = () => {
  const { state, sharedNoteId, navigate, addToast } = useApp();
  const publicNotes = state.notes.filter((n) => n.visibility === 'public');
  const note = state.notes.find((n) => n.id === sharedNoteId) ?? publicNotes[0];

  const shareUrl = note ? `${window.location.origin}/#/shared-note/${note.id}` : '';

  const copyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard?.writeText(shareUrl).catch(() => {});
    addToast({ type: 'success', title: 'Đã sao chép liên kết chia sẻ', message: shareUrl });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate(state.role === 'student' ? 'notes' : 'landing')}
        >
          {state.role === 'student' ? 'Quay lại Sổ ghi chú' : 'Quay lại Trang chủ'}
        </Button>

        {publicNotes.length > 1 && (
          <div className="flex flex-wrap items-center gap-2">
            {publicNotes.map((pn) => (
              <button
                key={pn.id}
                type="button"
                onClick={() => navigate('shared-note', { noteId: pn.id })}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-colors ${
                  note?.id === pn.id
                    ? 'bg-blue-600/20 border-blue-500/40 text-blue-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
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
          icon={<Lock className="w-6 h-6 text-amber-400" />}
          title="Ghi chú này đang ở chế độ Riêng tư hoặc không tồn tại"
          description="Chủ sở hữu đã chuyển ghi chú về trạng thái Private hoặc đường dẫn chia sẻ không hợp lệ."
          action={
            <Button onClick={() => navigate(state.role === 'student' ? 'notes' : 'landing')}>
              Về trang chính
            </Button>
          }
        />
      ) : (
        <Card>
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="emerald" icon={<Globe className="w-3.5 h-3.5" />}>
                    Ghi chú công khai
                  </Badge>
                  <Badge tone="cobalt">
                    {note.scope === 'global' ? 'Global Notes' : 'Chapter Notes'}
                  </Badge>
                  {note.tags.map((tag) => (
                    <Badge key={tag} tone="slate">
                      #{tag}
                    </Badge>
                  ))}
                </div>
                <h1 className="text-2xl font-bold text-white">{note.title}</h1>
                <div className="text-xs text-slate-400">
                  Tác giả: <strong className="text-slate-200">{note.authorName}</strong> · Cập nhật: {note.updatedAt}
                </div>
              </div>

              <Button variant="outline" size="sm" leftIcon={<Copy className="w-3.5 h-3.5" />} onClick={copyLink}>
                Sao chép link
              </Button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-xs text-slate-400 break-all">
              URL chia sẻ: <span className="text-blue-300">{shareUrl}</span>
            </div>

            <div className="prose prose-invert max-w-none text-slate-200 whitespace-pre-line leading-relaxed text-sm sm:text-base">
              {note.content}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
