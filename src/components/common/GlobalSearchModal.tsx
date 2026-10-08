import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  Zap,
  BookOpen,
  Newspaper,
  Shield,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SIMULATION_SCENARIOS, FRAUD_NEWS_ARTICLES, COURSE_MODULES } from '../../data/mockData';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchOpen, closeSearch, openSimulation, openNews, setActiveTab, playSound } = useApp();
  const [query, setQuery] = useState('');

  // Keyboard shortcut ⌘K or Esc listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle or open search
      }
      if (e.key === 'Escape' && isSearchOpen) {
        closeSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const matchedSims = SIMULATION_SCENARIOS.filter(
    (s) =>
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.category.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  const matchedNews = FRAUD_NEWS_ARTICLES.filter(
    (n) =>
      n.headline.toLowerCase().includes(query.toLowerCase()) ||
      n.category.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const matchedCourses = COURSE_MODULES.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all 15 simulations, news, and safety modules..."
            className="flex-1 text-sm bg-transparent border-none focus:outline-none text-slate-900"
          />
          <button
            onClick={closeSearch}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Simulations Section */}
          {matchedSims.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                Simulations ({matchedSims.length})
              </div>
              {matchedSims.map((sim) => (
                <div
                  key={sim.id}
                  onClick={() => {
                    closeSearch();
                    openSimulation(sim);
                  }}
                  className="p-2.5 rounded-xl hover:bg-blue-50 cursor-pointer flex items-center justify-between text-xs transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="font-bold text-slate-900">{sim.title}</div>
                      <div className="text-[10px] text-slate-500">{sim.category} · {sim.difficulty}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              ))}
            </div>
          )}

          {/* News Bulletins Section */}
          {matchedNews.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                Real Case Studies ({matchedNews.length})
              </div>
              {matchedNews.map((news) => (
                <div
                  key={news.id}
                  onClick={() => {
                    closeSearch();
                    openNews(news);
                  }}
                  className="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Newspaper className="w-4 h-4 text-red-500" />
                    <div className="line-clamp-1">
                      <div className="font-bold text-slate-900 truncate max-w-md">{news.headline}</div>
                      <div className="text-[10px] text-slate-500">{news.location} · {news.estimatedLoss}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              ))}
            </div>
          )}

          {/* Courses Section */}
          {matchedCourses.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                Courses & Curricula ({matchedCourses.length})
              </div>
              {matchedCourses.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    closeSearch();
                    setActiveTab('learning-hub');
                  }}
                  className="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-bold text-slate-900">{c.title}</div>
                      <div className="text-[10px] text-slate-500">{c.track} · {c.durationMinutes} mins</div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              ))}
            </div>
          )}

          {matchedSims.length === 0 && matchedNews.length === 0 && matchedCourses.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-400">
              No direct matches found for "{query}". Try "UPI", "OTP", "QR", or "AnyDesk".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
