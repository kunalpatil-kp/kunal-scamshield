import React from 'react';
import {
  X,
  Shield,
  ShieldAlert,
  AlertTriangle,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  ExternalLink,
  Zap,
  CheckCircle2,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { NewsArticle } from '../../types';
import { useApp } from '../../context/AppContext';
import { SIMULATION_SCENARIOS } from '../../data/mockData';

interface NewsDetailModalProps {
  article: NewsArticle;
  onClose: () => void;
}

export const NewsDetailModal: React.FC<NewsDetailModalProps> = ({ article, onClose }) => {
  const { openSimulation, setActiveTab, playSound } = useApp();

  const relatedSim = article.relatedSimulationId
    ? SIMULATION_SCENARIOS.find((s) => s.id === article.relatedSimulationId)
    : null;

  const handleLaunchSim = () => {
    playSound('click');
    onClose();
    if (relatedSim) {
      openSimulation(relatedSim);
    } else {
      setActiveTab('simulations');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-red-100 text-red-700">
              {article.riskLevel} ALERT
            </span>
            <span className="text-xs font-bold text-blue-600">{article.category}</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
          {/* Headline & Metadata */}
          <div className="space-y-3">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {article.headline}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {article.location}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {article.date}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {article.readTime}
              </span>
              <span>·</span>
              <span className="font-bold text-red-600">
                Estimated Loss: {article.estimatedLoss}
              </span>
            </div>
          </div>

          {/* AI Forensic Summary Banner */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>AI Intelligence Summary</span>
            </div>
            <p className="text-xs sm:text-sm text-blue-950 font-medium leading-relaxed">
              {article.summary}
            </p>
          </div>

          {/* Detailed Narrative Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              1. What Happened
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {article.whatHappened}
            </p>
          </div>

          {/* Step by Step Breakdown of how scam worked */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              2. How the Scam Operated
            </h3>
            <div className="space-y-2">
              {article.howScamWorked.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="leading-snug">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Red flags */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>3. Crucial Warning Signs (Red Flags)</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-700 bg-amber-50/60 p-4 rounded-2xl border border-amber-200/60">
              {article.redFlags.map((flag, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-red-500 font-bold shrink-0">⚠️</span>
                  <span>{flag}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Countermeasures & Prevention */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>4. How To Protect Yourself</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-700 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200/60">
              {article.howToStaySafe.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400">
            Source: <strong className="text-slate-600">{article.source}</strong>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onClose();
                setActiveTab('learning-hub');
              }}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Learning Modules</span>
            </button>

            <button
              onClick={handleLaunchSim}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Practice Similar Simulation</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
