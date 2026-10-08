import React, { useState } from 'react';
import {
  MessageSquare,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Check,
  X,
  Search,
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SMS_SIMULATION_ITEMS } from '../../data/mockData';
import { SMSItem } from '../../types';

export const SMSScamSimulator: React.FC = () => {
  const { playSound, awardXp } = useApp();

  const [selectedSMSId, setSelectedSMSId] = useState<string>(SMS_SIMULATION_ITEMS[0].id);
  const [decisions, setDecisions] = useState<
    Record<string, { userMarkedScam: boolean; isCorrect: boolean }>
  >({});

  const selectedSMS = SMS_SIMULATION_ITEMS.find((s) => s.id === selectedSMSId) || SMS_SIMULATION_ITEMS[0];
  const userDecision = decisions[selectedSMS.id];

  const handleDecision = (markedAsScam: boolean) => {
    const isCorrect = markedAsScam === selectedSMS.isScam;
    playSound(isCorrect ? 'success' : 'alert');

    setDecisions((prev) => ({
      ...prev,
      [selectedSMS.id]: { userMarkedScam: markedAsScam, isCorrect }
    }));

    if (isCorrect) {
      awardXp(50);
    }
  };

  const totalEvaluated = Object.keys(decisions).length;
  const correctCount = Object.values(decisions).filter((d) => d.isCorrect).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-2">
            <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
            <span>Mobile Smishing Triage</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            SMS & Smishing Triage Simulator
          </h1>
          <p className="text-xs text-slate-500">
            Inspect real-world SMS headers, detect counterfeit links, and separate authentic bank alerts from credential harvesting smishing traps.
          </p>
        </div>

        <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-2xl self-start">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-900">Triage Accuracy</div>
            <div className="text-[10px] text-slate-500">
              {totalEvaluated > 0 ? `${Math.round((correctCount / totalEvaluated) * 100)}% Verified` : 'Evaluate inbox below'}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-black text-sm flex items-center justify-center">
            {correctCount}/{SMS_SIMULATION_ITEMS.length}
          </div>
        </div>
      </div>

      {/* Main Two-Column Device Inbox Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Mobile SMS Inbox List */}
        <div className="lg:col-span-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <span className="font-bold text-xs">Simulated SMS Inbox (Messages)</span>
            </div>
            <span className="text-[10px] text-slate-400">{SMS_SIMULATION_ITEMS.length} threads</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
            {SMS_SIMULATION_ITEMS.map((item) => {
              const isSelected = item.id === selectedSMSId;
              const dec = decisions[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    playSound('click');
                    setSelectedSMSId(item.id);
                  }}
                  className={`p-4 cursor-pointer transition-all ${
                    isSelected ? 'bg-purple-50/70 border-l-4 border-purple-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900 font-mono">
                      {item.senderId}
                    </span>
                    <span className="text-[10px] text-slate-400">{item.timestamp}</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-700">{item.header}</div>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{item.body}</p>

                  {/* Decision Tag if already made */}
                  {dec && (
                    <div className="mt-2 flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          dec.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {dec.isCorrect ? '✓ Correct Verdict' : '✗ Misidentified'}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Message Detail & Decision Action Panel */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-5">
            {/* Sender and Header Info */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Origin Sender ID
                </div>
                <div className="text-sm font-extrabold text-slate-900 font-mono">
                  {selectedSMS.senderId}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400">{selectedSMS.timestamp}</div>
                <div className="text-xs font-semibold text-slate-600">{selectedSMS.header}</div>
              </div>
            </div>

            {/* Message Bubble Display */}
            <div className="p-4 rounded-2xl bg-slate-100 text-slate-900 font-mono text-xs sm:text-sm leading-relaxed border border-slate-200 select-text">
              {selectedSMS.body}
            </div>

            {/* Decision Buttons */}
            {!userDecision ? (
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider text-center">
                  Is this message Legitimate or a Fraudulent Scam?
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleDecision(false)}
                    className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 text-slate-700 border border-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Legitimate (Safe)</span>
                  </button>

                  <button
                    onClick={() => handleDecision(true)}
                    className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-red-50 hover:border-red-300 hover:text-red-700 text-slate-700 border border-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-2"
                  >
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>Malicious Scam (Smishing)</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Post Decision Forensic Breakdown */
              <div className="space-y-4 pt-2">
                <div
                  className={`p-4 rounded-2xl border ${
                    userDecision.isCorrect
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-red-50 border-red-200 text-red-950'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm mb-1">
                    {userDecision.isCorrect ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>Accurate Diagnosis (+50 XP)</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <span>Incorrect Evaluation</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed mt-1">
                    {selectedSMS.safeExplanation}
                  </p>

                  {/* Red flags list */}
                  {selectedSMS.redFlags.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-black/10">
                      <div className="text-[11px] font-bold uppercase tracking-wider mb-1">
                        Smishing Indicators Present:
                      </div>
                      <ul className="list-disc list-inside text-xs space-y-0.5">
                        {selectedSMS.redFlags.map((flag, idx) => (
                          <li key={idx}>{flag}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    const currIdx = SMS_SIMULATION_ITEMS.findIndex((s) => s.id === selectedSMS.id);
                    const nextItem = SMS_SIMULATION_ITEMS[(currIdx + 1) % SMS_SIMULATION_ITEMS.length];
                    setSelectedSMSId(nextItem.id);
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <span>Evaluate Next SMS Thread</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
