import React from 'react';
import {
  User,
  Shield,
  Award,
  Zap,
  TrendingUp,
  AlertTriangle,
  FileCheck2,
  BookOpen,
  ChevronRight,
  Flame,
  CheckCircle2,
  Mail,
  Building,
  MapPin
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SIMULATION_SCENARIOS, CERTIFICATES_DATA, ACHIEVEMENTS_DATA } from '../../data/mockData';

export const ProfileView: React.FC = () => {
  const { user, setActiveTab, openSimulation, playSound } = useApp();

  const completedSims = SIMULATION_SCENARIOS.filter((s) =>
    user.completedSimulationIds.includes(s.id)
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Profile Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-24 h-24 rounded-3xl object-cover ring-4 ring-slate-100 shadow-md"
          />
          <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-extrabold text-[10px] shadow-xs">
            Lvl {user.level}
          </span>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{user.name}</h1>
              <p className="text-xs text-blue-600 font-bold">{user.title}</p>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="px-3 py-1 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-orange-500" />
                {user.streakDays}-Day Streak
              </span>
              <span className="px-3 py-1 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
                {user.xp} XP
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              {user.email}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              {user.collegeOrOrg}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {user.city}
            </span>
          </div>
        </div>
      </div>

      {/* Analytics Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="text-xs font-bold text-slate-500">Overall Awareness Score</div>
          <div className="text-3xl font-black text-slate-900">{user.overallScore}/100</div>
          <div className="text-xs text-emerald-600 font-semibold">{user.riskRating}</div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-3">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${user.overallScore}%` }}
            />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="text-xs font-bold text-slate-500">Completed Simulations</div>
          <div className="text-3xl font-black text-slate-900">
            {user.completedSimulationIds.length} / {SIMULATION_SCENARIOS.length}
          </div>
          <div className="text-xs text-blue-600 font-semibold">
            {Math.round((user.completedSimulationIds.length / SIMULATION_SCENARIOS.length) * 100)}% Defense Ready
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="text-xs font-bold text-slate-500">Accredited Credentials</div>
          <div className="text-3xl font-black text-slate-900">
            {user.earnedCertificateIds.length} Certificates
          </div>
          <div className="text-xs text-amber-600 font-semibold">Verified on Registry</div>
        </div>
      </div>

      {/* Weak Areas Diagnostic & Recommendations */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h3 className="font-extrabold text-slate-900 text-base">
              Vulnerability Diagnostic & Remediation
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-semibold">AI Recommended</span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="font-bold">Identified Weak Area: Investment Scam & Ponzi Defense (75%)</div>
            <p className="text-[11px] text-amber-900/90 mt-0.5">
              You showed slight hesitation identifying unregulated crypto trading syndicates and task bonus traps.
            </p>
          </div>
          <button
            onClick={() => {
              const sim = SIMULATION_SCENARIOS.find((s) => s.id === 'sim_invest_01');
              if (sim) openSimulation(sim);
            }}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0"
          >
            Train Pig Butchering Simulation
          </button>
        </div>
      </div>

      {/* Completed Simulations Log */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-base">Passed Scenario Transcripts</h3>
          <button
            onClick={() => setActiveTab('simulations')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            Explore All Scenarios
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {completedSims.map((sim) => (
            <div
              key={sim.id}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-xs text-slate-900">{sim.title}</div>
                <div className="text-[10px] text-slate-500">{sim.category} · Passed</div>
              </div>
              <button
                onClick={() => openSimulation(sim)}
                className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-100"
              >
                Replay
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
