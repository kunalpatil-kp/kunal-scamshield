import React, { useState } from 'react';
import {
  KeyRound,
  Headphones,
  ShieldAlert,
  QrCode,
  ExternalLink,
  IndianRupee,
  TrendingUp,
  Mic,
  MessageSquare,
  FileText,
  Zap,
  Smartphone,
  Award,
  CreditCard,
  UserX,
  Search,
  CheckCircle2,
  Clock,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SIMULATION_SCENARIOS } from '../../data/mockData';
import { ScamCategory, SimulationScenario } from '../../types';

export const FraudSimulationsList: React.FC = () => {
  const { user, openSimulation, playSound } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const iconMap: Record<string, React.ElementType> = {
    KeyRound,
    Headphones,
    ShieldAlert,
    QrCode,
    ExternalLink,
    IndianRupee,
    TrendingUp,
    Mic,
    MessageSquare,
    FileText,
    Zap,
    Smartphone,
    Award,
    CreditCard,
    UserX,
  };

  const filteredSimulations = SIMULATION_SCENARIOS.filter((sim) => {
    const matchesSearch =
      sim.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sim.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sim.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDifficulty =
      selectedDifficulty === 'all' || sim.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

    const matchesFilter =
      selectedFilter === 'all' ||
      (selectedFilter === 'completed' && user.completedSimulationIds.includes(sim.id)) ||
      (selectedFilter === 'uncompleted' && !user.completedSimulationIds.includes(sim.id));

    return matchesSearch && matchesDifficulty && matchesFilter;
  });

  const completedCount = SIMULATION_SCENARIOS.filter((s) =>
    user.completedSimulationIds.includes(s.id)
  ).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner and Summary */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
            <span>Enterprise Simulation Matrix</span>
            <span>·</span>
            <span>15 Scenarios</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Fraud Simulation Training Library
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm max-w-xl">
            Interactive scenarios modeled directly from real cybercrime complaints reported to police cells and bank security divisions. Experience the deceit in a safe sandbox.
          </p>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 self-start md:self-auto min-w-[200px]">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg">
            {completedCount}/{SIMULATION_SCENARIOS.length}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Completed</div>
            <div className="text-[11px] text-slate-500">
              {Math.round((completedCount / SIMULATION_SCENARIOS.length) * 100)}% Defense Ready
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search OTP, QR, KYC, PhonePe, Digital Arrest..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All (15)
            </button>
            <button
              onClick={() => setSelectedFilter('uncompleted')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedFilter === 'uncompleted'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending ({SIMULATION_SCENARIOS.length - completedCount})
            </button>
            <button
              onClick={() => setSelectedFilter('completed')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedFilter === 'completed'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Done ({completedCount})
            </button>
          </div>

          {/* Difficulty Dropdown */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 focus:outline-none"
          >
            <option value="all">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
        </div>
      </div>

      {/* Grid of 15 Simulations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSimulations.map((sim, index) => {
          const Icon = iconMap[sim.iconName] || KeyRound;
          const isDone = user.completedSimulationIds.includes(sim.id);

          const difficultyColor =
            sim.difficulty === 'Beginner'
              ? 'text-emerald-700 bg-emerald-50'
              : sim.difficulty === 'Intermediate'
              ? 'text-blue-700 bg-blue-50'
              : sim.difficulty === 'Advanced'
              ? 'text-amber-700 bg-amber-50'
              : 'text-red-700 bg-red-50';

          return (
            <div
              key={sim.id}
              className={`p-5 rounded-3xl bg-white border transition-all duration-200 flex flex-col justify-between ${
                isDone
                  ? 'border-emerald-200/80 shadow-xs'
                  : 'border-slate-200/80 shadow-xs hover:border-blue-400 hover:shadow-md'
              }`}
            >
              <div className="space-y-3.5">
                {/* Header metadata */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                        Scenario {index + 1}
                      </div>
                      <div className="text-xs font-bold text-slate-900">{sim.category}</div>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${difficultyColor}`}>
                    {sim.difficulty}
                  </span>
                </div>

                {/* Title and Tagline */}
                <div>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1">
                    {sim.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {sim.tagline}
                  </p>
                </div>

                {/* Real World Impact Callout */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 space-y-1">
                  <div className="font-semibold text-slate-800 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Est. {sim.estimatedMinutes} mins simulation</span>
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-2">{sim.realWorldContext}</p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {isDone ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" />
                      Passed
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-medium">Not started</span>
                  )}
                </div>

                <button
                  onClick={() => openSimulation(sim)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isDone
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                  }`}
                >
                  <span>{isDone ? 'Replay Simulation' : 'Start Simulation'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
