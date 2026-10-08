import React, { useState } from 'react';
import {
  Award,
  Trophy,
  Flame,
  Medal,
  Crown,
  Search,
  Sparkles,
  Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LEADERBOARD_USERS } from '../../data/mockData';

export const LeaderboardView: React.FC = () => {
  const { user, playSound } = useApp();
  const [activeTier, setActiveTier] = useState<'national' | 'global' | 'college'>('national');

  const topThree = LEADERBOARD_USERS.slice(0, 3);
  const restUsers = LEADERBOARD_USERS.slice(3);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
            <Trophy className="w-3.5 h-3.5 text-blue-600" />
            <span>National Defense Honor Roll</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Leaderboard & Cyber Sentinel Standings
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm max-w-xl">
            Rankings of citizens, cybersecurity students, and banking associates across verified scenario accuracy and unbroken safety streaks.
          </p>
        </div>

        {/* Tier Tabs */}
        <div className="flex items-center gap-1 p-1.5 bg-slate-100 rounded-2xl self-start md:self-auto">
          <button
            onClick={() => {
              playSound('click');
              setActiveTier('national');
            }}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTier === 'national'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            National (India)
          </button>
          <button
            onClick={() => {
              playSound('click');
              setActiveTier('college');
            }}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTier === 'college'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Colleges & Orgs
          </button>
          <button
            onClick={() => {
              playSound('click');
              setActiveTier('global');
            }}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTier === 'global'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Global
          </button>
        </div>
      </div>

      {/* Top 3 Podiums */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        {/* Rank 2 Podium */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col items-center text-center space-y-3 order-2 md:order-1">
          <div className="relative">
            <img
              src={topThree[1].avatar}
              alt={topThree[1].name}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-slate-200 shadow-md"
            />
            <span className="absolute -bottom-2 -right-1 w-7 h-7 rounded-full bg-slate-300 text-slate-800 font-black text-xs flex items-center justify-center border-2 border-white shadow-xs">
              2
            </span>
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">{topThree[1].name}</h3>
            <div className="text-xs text-slate-400">{topThree[1].institution}</div>
          </div>
          <div className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
            {topThree[1].xp.toLocaleString()} XP
          </div>
          <div className="text-[11px] text-blue-600 font-semibold">{topThree[1].shieldBadge}</div>
        </div>

        {/* Rank 1 Podium (Tallest / Highlighted) */}
        <div className="p-7 rounded-3xl bg-gradient-to-b from-amber-50 to-white border-2 border-amber-300 shadow-md flex flex-col items-center text-center space-y-3.5 order-1 md:order-2 -mt-4 relative">
          <div className="absolute -top-4 w-9 h-9 rounded-full bg-amber-400 text-white flex items-center justify-center shadow-md">
            <Crown className="w-5 h-5 fill-white" />
          </div>
          <div className="relative">
            <img
              src={topThree[0].avatar}
              alt={topThree[0].name}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-amber-400 shadow-lg"
            />
            <span className="absolute -bottom-2 -right-1 w-8 h-8 rounded-full bg-amber-400 text-white font-black text-xs flex items-center justify-center border-2 border-white shadow-xs">
              1
            </span>
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-lg">{topThree[0].name}</h3>
            <div className="text-xs text-slate-500">{topThree[0].institution}</div>
          </div>
          <div className="px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-black">
            {topThree[0].xp.toLocaleString()} XP
          </div>
          <div className="text-xs text-amber-700 font-bold">{topThree[0].shieldBadge}</div>
        </div>

        {/* Rank 3 Podium */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col items-center text-center space-y-3 order-3">
          <div className="relative">
            <img
              src={topThree[2].avatar}
              alt={topThree[2].name}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-amber-200 shadow-md"
            />
            <span className="absolute -bottom-2 -right-1 w-7 h-7 rounded-full bg-amber-700 text-white font-black text-xs flex items-center justify-center border-2 border-white shadow-xs">
              3
            </span>
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">{topThree[2].name}</h3>
            <div className="text-xs text-slate-400">{topThree[2].institution}</div>
          </div>
          <div className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
            {topThree[2].xp.toLocaleString()} XP
          </div>
          <div className="text-[11px] text-blue-600 font-semibold">{topThree[2].shieldBadge}</div>
        </div>
      </div>

      {/* Ranks 4+ Table */}
      <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
          <div className="w-16">Rank</div>
          <div className="flex-1">Defender & Institution</div>
          <div className="w-28 text-center">Badge</div>
          <div className="w-20 text-center">Streak</div>
          <div className="w-24 text-right">Total XP</div>
        </div>

        <div className="divide-y divide-slate-100">
          {restUsers.map((defender) => {
            const isMe = defender.isCurrentUser;
            return (
              <div
                key={defender.rank}
                className={`p-4 flex items-center justify-between transition-colors ${
                  isMe ? 'bg-blue-50/70 font-semibold' : 'hover:bg-slate-50'
                }`}
              >
                <div className="w-16 font-extrabold text-slate-500 text-sm">
                  #{defender.rank}
                </div>

                <div className="flex-1 flex items-center gap-3">
                  <img
                    src={defender.avatar}
                    alt={defender.name}
                    className="w-10 h-10 rounded-full object-cover shadow-xs"
                  />
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                      <span>{defender.name}</span>
                      {isMe && (
                        <span className="text-[9px] px-1.5 py-0.2 bg-blue-600 text-white rounded font-bold">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400">{defender.institution}</div>
                  </div>
                </div>

                <div className="w-28 text-center text-xs font-semibold text-blue-600 truncate">
                  {defender.shieldBadge}
                </div>

                <div className="w-20 text-center text-xs text-orange-600 font-bold flex items-center justify-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-orange-500" />
                  <span>{defender.streak}d</span>
                </div>

                <div className="w-24 text-right font-extrabold text-xs sm:text-sm text-slate-900 font-mono">
                  {defender.xp.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
