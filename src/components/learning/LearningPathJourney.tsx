import React from 'react';
import {
  Compass,
  CheckCircle2,
  Lock,
  Play,
  Flame,
  Sparkles,
  Award,
  Zap,
  ShieldCheck,
  KeyRound,
  QrCode,
  AlertTriangle,
  Smartphone,
  TrendingUp,
  Mic
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LEARNING_PATH_NODES, SIMULATION_SCENARIOS } from '../../data/mockData';

export const LearningPathJourney: React.FC = () => {
  const { user, openSimulation, playSound } = useApp();

  const iconMap: Record<string, React.ElementType> = {
    ShieldCheck,
    KeyRound,
    QrCode,
    AlertTriangle,
    Smartphone,
    TrendingUp,
    Mic,
    Award
  };

  const handleNodeClick = (node: typeof LEARNING_PATH_NODES[0]) => {
    if (!node.isUnlocked) {
      playSound('alert');
      return;
    }
    playSound('click');
    if (node.simulationId) {
      const sim = SIMULATION_SCENARIOS.find((s) => s.id === node.simulationId);
      if (sim) {
        openSimulation(sim);
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Streak & Progress */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-xl border border-indigo-900/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            <span>Duolingo-Inspired Skill Tree</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Digital Immunity Learning Journey
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-lg">
            Progress through connected milestones. Each milestone unlocks verified competencies and defends against real-world attack vectors.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
              <Flame className="w-6 h-6 fill-orange-400" />
            </div>
            <div>
              <div className="text-xs text-slate-300">Active Streak</div>
              <div className="text-lg font-black text-white">{user.streakDays} Days Strong</div>
            </div>
          </div>
        </div>
      </div>

      {/* Duolingo Timeline Journey Layout */}
      <div className="max-w-xl mx-auto py-8 relative">
        {/* Central Vertical Connector Line */}
        <div className="absolute top-12 bottom-12 left-1/2 -translate-x-1/2 w-1.5 bg-slate-200 -z-0 rounded-full" />

        <div className="space-y-12 relative z-10">
          {LEARNING_PATH_NODES.map((node, index) => {
            const Icon = iconMap[node.icon] || ShieldCheck;
            const isCompleted = node.isCompleted || user.completedSimulationIds.includes(node.simulationId || '');
            const isUnlocked = node.isUnlocked || index === 0;

            // Alternate nodes left and right for Duolingo curve feel
            const isOffsetLeft = index % 2 === 0;

            return (
              <div
                key={node.id}
                className={`flex items-center ${
                  isOffsetLeft ? 'flex-row' : 'flex-row-reverse'
                } justify-center gap-6`}
              >
                {/* Milestone Node Button */}
                <div className="relative group">
                  <button
                    onClick={() => handleNodeClick(node)}
                    className={`w-20 h-20 rounded-3xl flex flex-col items-center justify-center transition-all duration-300 shadow-md ${
                      isCompleted
                        ? 'bg-emerald-600 text-white hover:bg-emerald-500 hover:scale-105 ring-4 ring-emerald-100'
                        : isUnlocked
                        ? 'bg-blue-600 text-white hover:bg-blue-500 hover:scale-105 ring-4 ring-blue-100 animate-pulse-subtle'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-80'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    ) : isUnlocked ? (
                      <Icon className="w-8 h-8 text-white" />
                    ) : (
                      <Lock className="w-7 h-7 text-slate-400" />
                    )}
                    <span className="text-[10px] font-black mt-1">Lvl {node.levelNumber}</span>
                  </button>

                  {/* Top floating XP badge */}
                  {isUnlocked && (
                    <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-indigo-600 text-white font-black text-[9px] shadow-xs">
                      +{node.xpReward} XP
                    </span>
                  )}
                </div>

                {/* Text card next to node */}
                <div
                  className={`w-56 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1 ${
                    isOffsetLeft ? 'text-left' : 'text-right'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                    {node.category}
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm leading-snug">
                    {node.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-normal line-clamp-2">
                    {node.description}
                  </p>
                  <div className="pt-2">
                    {isCompleted ? (
                      <span className="text-[10px] font-bold text-emerald-600">✓ Mastered</span>
                    ) : isUnlocked ? (
                      <button
                        onClick={() => handleNodeClick(node)}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-700 underline"
                      >
                        Play Level Now →
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400">Locked Level</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
