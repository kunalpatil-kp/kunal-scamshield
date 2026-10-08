import React from 'react';
import {
  Shield,
  LayoutDashboard,
  Gamepad2,
  BotMessageSquare,
  PhoneCall,
  MessageSquare,
  MessagesSquare,
  Newspaper,
  BookOpen,
  MapPin,
  HelpCircle,
  Trophy,
  Award,
  FileCheck2,
  User,
  Settings,
  Flame,
  Volume2,
  VolumeX,
  Compass
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavigationTab } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onCloseMobile }) => {
  const { activeTab, setActiveTab, user, soundEnabled, toggleSound, playSound } = useApp();

  const navItems: { id: NavigationTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'simulations', label: 'Fraud Simulations', icon: Gamepad2, badge: '15 Active' },
    { id: 'ai-chat', label: 'AI Scam Trainer', icon: BotMessageSquare, badge: 'AI Live' },
    { id: 'voice-sim', label: 'Voice Scam Simulator', icon: PhoneCall },
    { id: 'sms-sim', label: 'SMS Scam Simulator', icon: MessageSquare },
    { id: 'whatsapp-sim', label: 'WhatsApp Simulator', icon: MessagesSquare },
    { id: 'news', label: 'Fraud News Center', icon: Newspaper },
    { id: 'learning-hub', label: 'Learning Hub', icon: BookOpen },
    { id: 'learning-path', label: 'Learning Journey', icon: Compass },
    { id: 'heatmap', label: 'Fraud Heatmap', icon: MapPin },
    { id: 'assessments', label: 'Assessments', icon: HelpCircle },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'leaderboard', label: 'Leaderboard', icon: Award },
    { id: 'certificates', label: 'Certificates', icon: FileCheck2 },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNav = (tabId: NavigationTab) => {
    playSound('click');
    setActiveTab(tabId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo and Brand Header */}
        <div className="h-16 flex items-center px-5 border-b border-slate-100 justify-between">
          <div
            onClick={() => handleNav('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/30 group-hover:bg-blue-700 transition-colors">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 text-lg tracking-tight">ScamShield</span>
                <span className="font-semibold text-blue-600 text-xs tracking-wider">AI</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Financial Defense Academy</p>
            </div>
          </div>

          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Mute sound fx' : 'Enable sound fx'}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>
        </div>

        {/* User Mini Stat Strip */}
        <div className="px-4 py-3 mx-3 my-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-900 leading-none">
                Score: {user.overallScore}/100
              </div>
              <div className="text-[10px] text-emerald-600 font-medium">{user.riskRating}</div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md text-xs font-bold">
            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
            <span>{user.streakDays}d</span>
          </div>
        </div>

        {/* Navigation Items Scrollable */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span className="flex-1 text-left truncate">{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-100 bg-white">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50/80 hover:bg-slate-100 transition-colors cursor-pointer"
               onClick={() => handleNav('profile')}>
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-xs"
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-900 truncate">{user.name}</div>
              <div className="text-[10px] text-slate-500 truncate">Lvl {user.level} · {user.xp} XP</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
