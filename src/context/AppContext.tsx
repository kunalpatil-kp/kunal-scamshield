import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  NavigationTab,
  UserProfile,
  SimulationScenario,
  NewsArticle
} from '../types';
import { INITIAL_USER, SIMULATION_SCENARIOS, FRAUD_NEWS_ARTICLES } from '../data/mockData';

interface AppContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  user: UserProfile;
  awardXp: (amount: number, reason?: string) => void;
  completeSimulation: (simId: string, category: string, scoreBoost?: number) => void;
  activeSimulation: SimulationScenario | null;
  openSimulation: (sim: SimulationScenario) => void;
  closeSimulation: () => void;
  activeNews: NewsArticle | null;
  openNews: (news: NewsArticle) => void;
  closeNews: () => void;
  isScannerOpen: boolean;
  openScanner: () => void;
  closeScanner: () => void;
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  notifications: { id: string; title: string; message: string; time: string; read: boolean; tag: string }[];
  markNotificationsRead: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  playSound: (type: 'success' | 'alert' | 'click' | 'levelup') => void;
  triggerConfetti: () => void;
  resetProgress: () => void;
  quickSimulationPrompt: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('scamshield_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved user profile', e);
      }
    }
    return INITIAL_USER;
  });

  const [activeSimulation, setActiveSimulation] = useState<SimulationScenario | null>(null);
  const [activeNews, setActiveNews] = useState<NewsArticle | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [notifications, setNotifications] = useState([
    {
      id: 'notif_1',
      title: 'High Alert: Electricity SMS Scam Surge',
      message: 'New late-night power cutoff messages detected across Western India. Review warning signs.',
      time: '15m ago',
      read: false,
      tag: 'Urgent'
    },
    {
      id: 'notif_2',
      title: '7-Day Safety Streak Reached!',
      message: 'You have protected your digital identity for 7 consecutive days. +100 Bonus XP awarded.',
      time: '2h ago',
      read: false,
      tag: 'Streak'
    },
    {
      id: 'notif_3',
      title: 'New Simulation Available',
      message: 'Test your reflexes against "The Distressed Son" AI Voice Clone scenario.',
      time: '1d ago',
      read: true,
      tag: 'New'
    }
  ]);

  useEffect(() => {
    localStorage.setItem('scamshield_user', JSON.stringify(user));
  }, [user]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Fallback if canvas-confetti is not loaded
    }
  };

  const playSound = (type: 'success' | 'alert' | 'click' | 'levelup') => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'click') {
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'success') {
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'alert') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.setValueAtTime(180, now + 0.1);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'levelup') {
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(554.37, now + 0.1);
        osc.frequency.setValueAtTime(659.25, now + 0.2);
        osc.frequency.setValueAtTime(880, now + 0.3);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
        osc.start(now);
        osc.stop(now + 0.55);
      }
    } catch {
      // AudioContext audio generation unsupported
    }
  };

  const awardXp = (amount: number) => {
    setUser((prev) => {
      const newXp = prev.xp + amount;
      let newLevel = prev.level;
      let nextThreshold = prev.nextLevelXp;

      if (newXp >= nextThreshold) {
        newLevel += 1;
        nextThreshold = nextThreshold + 800;
        playSound('levelup');
        triggerConfetti();
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        nextLevelXp: nextThreshold
      };
    });
  };

  const completeSimulation = (simId: string, category: string, scoreBoost = 3) => {
    setUser((prev) => {
      const alreadyCompleted = prev.completedSimulationIds.includes(simId);
      const newCompleted = alreadyCompleted ? prev.completedSimulationIds : [...prev.completedSimulationIds, simId];
      const newScore = Math.min(99, prev.overallScore + (alreadyCompleted ? 1 : scoreBoost));

      // Category breakdown mapping
      const keyMap: Record<string, keyof typeof prev.categoryScores> = {
        'OTP Fraud': 'otp',
        'QR Code Scam': 'qr',
        'UPI Collect': 'upi',
        'Phishing Link': 'phishing',
        'KYC Scam': 'kyc',
        'Deepfake & Voice': 'voice',
        'Investment Fraud': 'investment',
        'Social Engineering': 'socialEngineering'
      };

      const scoreKey = keyMap[category];
      const updatedCatScores = { ...prev.categoryScores };
      if (scoreKey) {
        updatedCatScores[scoreKey] = Math.min(100, updatedCatScores[scoreKey] + 4);
      }

      return {
        ...prev,
        completedSimulationIds: newCompleted,
        overallScore: newScore,
        categoryScores: updatedCatScores
      };
    });

    awardXp(120);
    playSound('success');
    triggerConfetti();
  };

  const openSimulation = (sim: SimulationScenario) => {
    playSound('click');
    setActiveSimulation(sim);
  };

  const closeSimulation = () => {
    setActiveSimulation(null);
  };

  const openNews = (news: NewsArticle) => {
    playSound('click');
    setActiveNews(news);
  };

  const closeNews = () => {
    setActiveNews(null);
  };

  const openScanner = () => {
    playSound('click');
    setIsScannerOpen(true);
  };

  const closeScanner = () => {
    setIsScannerOpen(false);
  };

  const openSearch = () => {
    playSound('click');
    setIsSearchOpen(true);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
  };

  const markNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  const resetProgress = () => {
    localStorage.removeItem('scamshield_user');
    setUser(INITIAL_USER);
    playSound('alert');
  };

  const quickSimulationPrompt = () => {
    // Pick an uncompleted simulation or the first one
    const uncompleted = SIMULATION_SCENARIOS.find(
      (s) => !user.completedSimulationIds.includes(s.id)
    ) || SIMULATION_SCENARIOS[0];
    openSimulation(uncompleted);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        user,
        awardXp,
        completeSimulation,
        activeSimulation,
        openSimulation,
        closeSimulation,
        activeNews,
        openNews,
        closeNews,
        isScannerOpen,
        openScanner,
        closeScanner,
        isSearchOpen,
        openSearch,
        closeSearch,
        notifications,
        markNotificationsRead,
        soundEnabled,
        toggleSound,
        playSound,
        triggerConfetti,
        resetProgress,
        quickSimulationPrompt
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
