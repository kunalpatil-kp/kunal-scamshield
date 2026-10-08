import React, { useState } from 'react';
import {
  Settings,
  Volume2,
  VolumeX,
  Globe,
  RotateCcw,
  Shield,
  Bell,
  Smartphone,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsView: React.FC = () => {
  const { soundEnabled, toggleSound, resetProgress, playSound } = useApp();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isResetConfirmed, setIsResetConfirmed] = useState(false);

  const handleReset = () => {
    resetProgress();
    setIsResetConfirmed(true);
    setTimeout(() => setIsResetConfirmed(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
          <Settings className="w-3.5 h-3.5 text-slate-600" />
          <span>Platform Preferences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Application Settings & Controls
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm">
          Customize simulation sound feedback, localized language preferences, and data privacy settings.
        </p>
      </div>

      {/* Settings Grid */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">
        {/* Language Selection */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-slate-900">
                Regional Training Language
              </div>
              <div className="text-xs text-slate-500">
                Localize simulation prompts into regional languages
              </div>
            </div>
          </div>

          <select
            value={selectedLanguage}
            onChange={(e) => {
              playSound('click');
              setSelectedLanguage(e.target.value);
            }}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none"
          >
            <option value="en">English (Default)</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="mr">मराठी (Marathi)</option>
            <option value="bn">বাংলা (Bengali)</option>
            <option value="te">తెలుగు (Telugu)</option>
            <option value="ta">தமிழ் (Tamil)</option>
          </select>
        </div>

        {/* Audio Effects Toggle */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-slate-900">
                Auditory Feedback & Dial Tones
              </div>
              <div className="text-xs text-slate-500">
                Synthesized phone ringers, alert beeps, and celebration chords
              </div>
            </div>
          </div>

          <button
            onClick={toggleSound}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              soundEnabled ? 'bg-blue-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                soundEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Real-time Threat Bulletins Toggle */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-slate-900">
                Critical Cyber Bulletin Alerts
              </div>
              <div className="text-xs text-slate-500">
                Notify when emergency fraud patterns spike nationally
              </div>
            </div>
          </div>

          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              notificationsEnabled ? 'bg-blue-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                notificationsEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Reset Simulation State */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <div className="font-bold text-xs sm:text-sm text-red-600">
              Reset Training Progress & Score
            </div>
            <div className="text-xs text-slate-500">
              Clear completed simulation flags and reset score to initial diagnostic state
            </div>
          </div>

          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs border border-red-200 transition-colors flex items-center gap-2 self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isResetConfirmed ? 'Progress Reset Successfully' : 'Reset My Progress'}</span>
          </button>
        </div>
      </div>

      {/* Compliance and Regulatory Disclaimers */}
      <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 text-xs text-slate-500 space-y-2">
        <div className="font-bold text-slate-800">ScamShield AI Platform Specifications</div>
        <p>
          Version 2.4.0 (Enterprise Edition). Built in alignment with National Payments Corporation of India (NPCI) customer safety charters and Reserve Bank of India (RBI) circulars on digital payment fraud prevention. All simulation scenarios use synthetic dummy phone numbers and mock payment VPAs to eliminate operational hazards.
        </p>
      </div>
    </div>
  );
};
