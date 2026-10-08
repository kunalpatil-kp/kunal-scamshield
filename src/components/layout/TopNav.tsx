import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  Shield,
  Zap,
  Sparkles,
  Flame,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface TopNavProps {
  onToggleMobileMenu: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onToggleMobileMenu }) => {
  const {
    user,
    openSearch,
    openScanner,
    notifications,
    markNotificationsRead,
    setActiveTab,
    quickSimulationPrompt,
    playSound
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const xpProgressPercent = Math.min(
    100,
    Math.round((user.xp / user.nextLevelXp) * 100)
  );

  const toggleNotif = () => {
    playSound('click');
    setIsNotifOpen((prev) => !prev);
    if (!isNotifOpen && unreadCount > 0) {
      markNotificationsRead();
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile hamburger & Search trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar (Trigger) */}
        <button
          onClick={openSearch}
          className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-100/80 hover:bg-slate-100 border border-slate-200/60 text-slate-500 hover:text-slate-800 transition-all text-xs w-48 sm:w-72 md:w-80"
        >
          <Search className="w-4 h-4 text-slate-400" />
          <span className="truncate">Search simulations, scams, news...</span>
          <span className="hidden sm:inline-block ml-auto text-[10px] font-mono bg-white px-1.5 py-0.5 rounded-md border border-slate-200 text-slate-400">
            ⌘K
          </span>
        </button>
      </div>

      {/* Right Action Clusters */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Fraud Awareness Score Pill */}
        <div
          onClick={() => setActiveTab('assessments')}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50/80 border border-blue-200/60 hover:bg-blue-100/70 transition-colors cursor-pointer group"
          title="Click to take full diagnostic assessment"
        >
          <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
            <Shield className="w-3 h-3" />
          </div>
          <div>
            <div className="text-[10px] text-blue-700 font-semibold leading-tight flex items-center gap-1">
              <span>Safety Score</span>
              <span className="font-bold text-blue-900">{user.overallScore}/100</span>
            </div>
            <div className="text-[9px] text-blue-600/80 leading-tight font-medium">
              {user.riskRating}
            </div>
          </div>
        </div>

        {/* User Level & XP bar */}
        <div
          onClick={() => setActiveTab('learning-path')}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer hover:bg-slate-100 transition-colors"
          title="Click to view learning roadmap"
        >
          <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 font-extrabold text-[11px] flex items-center justify-center">
            L{user.level}
          </div>
          <div className="w-20">
            <div className="flex justify-between text-[10px] text-slate-500 font-medium">
              <span>XP</span>
              <span>{user.xp}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-0.5">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${xpProgressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Daily Streak Counter */}
        <div
          onClick={() => setActiveTab('achievements')}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-orange-50 border border-orange-200/80 text-orange-700 text-xs font-bold cursor-pointer hover:bg-orange-100 transition-colors"
          title={`${user.streakDays}-day scam defense streak!`}
        >
          <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
          <span className="text-xs">{user.streakDays}</span>
        </div>

        {/* AI Scam Scanner Instant Button */}
        <button
          onClick={openScanner}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs shadow-xs transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Scan Message</span>
        </button>

        {/* Quick Start Button */}
        <button
          onClick={quickSimulationPrompt}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
        >
          <Zap className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Quick Simulation</span>
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={toggleNotif}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">Fraud Alerts & Activity</span>
                <span className="text-[10px] text-slate-400 font-medium">{notifications.length} alerts</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-900">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div
          onClick={() => setActiveTab('profile')}
          className="cursor-pointer rounded-full p-0.5 ring-2 ring-transparent hover:ring-blue-500 transition-all"
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover shadow-xs"
          />
        </div>
      </div>
    </header>
  );
};
