import React from 'react';
import {
  Trophy,
  KeyRound,
  QrCode,
  ExternalLink,
  Search,
  ShieldCheck,
  Flame,
  Mic,
  Award,
  Sparkles,
  Lock,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ACHIEVEMENTS_DATA } from '../../data/mockData';

export const AchievementsView: React.FC = () => {
  const { user } = useApp();

  const iconMap: Record<string, React.ElementType> = {
    KeyRound,
    QrCode,
    ExternalLink,
    Search,
    ShieldCheck,
    Flame,
    Mic,
    Award
  };

  const unlockedCount = ACHIEVEMENTS_DATA.filter((a) =>
    user.unlockedAchievementIds.includes(a.id)
  ).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold mb-2">
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>Hall of Cyber Defense Honors</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Defense Badges & Milestone Achievements
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm max-w-xl">
            Track your mastery badges earned through flawless decisions, anti-smishing streaks, and investigative excellence.
          </p>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 self-start md:self-auto min-w-[190px]">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-lg shadow-sm">
            {unlockedCount}/{ACHIEVEMENTS_DATA.length}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Badges Unlocked</div>
            <div className="text-[11px] text-slate-500">
              {Math.round((unlockedCount / ACHIEVEMENTS_DATA.length) * 100)}% Cabinet Full
            </div>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {ACHIEVEMENTS_DATA.map((ach) => {
          const Icon = iconMap[ach.icon] || Trophy;
          const isUnlocked = user.unlockedAchievementIds.includes(ach.id);
          const percent = Math.min(100, Math.round((ach.progress / ach.maxProgress) * 100));

          return (
            <div
              key={ach.id}
              className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
                isUnlocked
                  ? 'bg-white border-amber-200/80 shadow-sm hover:shadow-md'
                  : 'bg-slate-50/70 border-slate-200/80 opacity-75'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xs transition-transform hover:scale-105 ${
                      isUnlocked
                        ? 'bg-gradient-to-tr from-amber-400 to-orange-500 text-white'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>

                  {isUnlocked ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                      <CheckCircle2 className="w-3 h-3" />
                      Unlocked
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                      <Lock className="w-3 h-3" />
                      Locked
                    </span>
                  )}
                </div>

                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {ach.category}
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                    {ach.name}
                  </h3>
                  <div className="text-xs text-amber-600 font-semibold">{ach.title}</div>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {ach.description}
                  </p>
                </div>
              </div>

              {/* Progress Bar & Status */}
              <div className="mt-5 pt-4 border-t border-slate-100 space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold text-slate-400">
                  <span>Progress</span>
                  <span>{ach.progress} / {ach.maxProgress}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isUnlocked ? 'bg-amber-500' : 'bg-slate-400'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                {ach.unlockedAt && (
                  <div className="text-[10px] text-slate-400 text-right">
                    Awarded: {ach.unlockedAt}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
