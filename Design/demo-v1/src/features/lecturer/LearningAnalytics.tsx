import React from 'react';
import { AlertCircle, BarChart3, ShieldCheck, Swords, Users } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { Badge } from '../../components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';

export const LearningAnalytics: React.FC = () => {
  const { state } = useApp();
  const mainCourse = state.courses[0];
  const allStudents = state.classrooms.flatMap((c) => c.students);

  const avgAccuracy =
    allStudents.length > 0
      ? Math.round(allStudents.reduce((s, st) => s + st.accuracyRate, 0) / allStudents.length)
      : 0;

  // Aggregate chapter completion across students
  const chapterStats = mainCourse.chapters.map((ch) => {
    const completedByCount = allStudents.filter((st) => st.completedChapters >= ch.order).length;
    const bossDefeatedCount = allStudents.filter((st) => st.bossesDefeated >= ch.order).length;
    const rate = allStudents.length > 0 ? Math.round((completedByCount / allStudents.length) * 100) : 0;
    return { chapter: ch, rate, bossDefeatedCount };
  });

  // Aggregate difficult topics frequency
  const topicCounts: Record<string, number> = {};
  for (const st of allStudents) {
    for (const topic of st.difficultTopics) {
      topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    }
  }
  const topDifficult = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Thống kê & Phân tích học tập</h1>
          <p className="text-sm text-slate-400 mt-1">
            Tổng hợp tiến độ lớp, kết quả Boss Battle và các chủ đề kiến thức sinh viên thường gặp khó khăn.
          </p>
        </div>
        <Badge tone="emerald" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
          Ẩn hoàn toàn ghi chú cá nhân sinh viên
        </Badge>
      </div>

      {/* Overview KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">Tỷ lệ trả lời đúng trung bình</div>
              <div className="text-2xl font-mono font-bold text-emerald-400 mt-1">{avgAccuracy}%</div>
              <div className="text-xs text-slate-500 mt-0.5">Sai trung bình: {100 - avgAccuracy}%</div>
            </div>
            <BarChart3 className="w-6 h-6 text-emerald-400" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">Tổng lượt sinh viên theo dõi</div>
              <div className="text-2xl font-mono font-bold text-white mt-1">{allStudents.length}</div>
              <div className="text-xs text-slate-500 mt-0.5">Trên {state.classrooms.length} lớp học</div>
            </div>
            <Users className="w-6 h-6 text-blue-400" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">Tổng số Boss đã vượt qua</div>
              <div className="text-2xl font-mono font-bold text-amber-400 mt-1">
                {allStudents.reduce((s, st) => s + st.bossesDefeated, 0)}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">Lượt hạ Boss toàn lớp</div>
            </div>
            <Swords className="w-6 h-6 text-rose-400" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Chapter Completion & Boss Pass */}
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle>Tỷ lệ hoàn thành chương & Kết quả Boss Battle ({mainCourse.code})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {chapterStats.map(({ chapter, rate, bossDefeatedCount }) => (
              <div key={chapter.id} className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-slate-200">
                    Chương {chapter.order}: {chapter.title}
                  </span>
                  <span className="font-mono text-slate-400">
                    Hạ Boss {chapter.boss.name}: {bossDefeatedCount}/{allStudents.length} SV
                  </span>
                </div>
                <ProgressBar value={rate} tone={rate >= 70 ? 'emerald' : rate >= 40 ? 'cobalt' : 'amber'} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Difficult Knowledge Topics */}
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>Kiến thức sinh viên hay gặp khó khăn</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topDifficult.map(([topic, count]) => (
              <div key={topic} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                <span className="text-sm text-slate-200">{topic}</span>
                <Badge tone="rose">{count} sinh viên</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Per-student progress & history */}
      <Card>
        <CardHeader>
          <CardTitle>Tiến độ & Lịch sử học tập từng sinh viên</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-slate-800/80 p-0">
          {allStudents.map((st) => (
            <div key={st.id} className="p-4 sm:px-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-sm">{st.name}</span>
                  <span className="text-xs font-mono text-slate-500">{st.studentCode}</span>
                </div>
                <div className="text-xs text-slate-400">
                  Hoạt động gần nhất: {st.learningHistory[0]?.action ?? 'Đang cập nhật'} ({st.lastActive})
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-36">
                  <ProgressBar value={st.progressPercent} size="sm" />
                </div>
                <Badge tone="cobalt">Boss {st.bossesDefeated}/5</Badge>
                <Badge tone={st.accuracyRate >= 80 ? 'emerald' : 'amber'}>{st.accuracyRate}% đúng</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
