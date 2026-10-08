import React, { useState } from 'react';
import {
  X,
  Shield,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Phone,
  PhoneOff,
  Zap,
  ArrowRight,
  RotateCcw,
  Sparkles,
  ExternalLink,
  MessageSquare,
  QrCode,
  Flame,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SimulationScenario } from '../../types';

interface SimulationModalProps {
  simulation: SimulationScenario;
  onClose: () => void;
}

export const InteractiveSimulationModal: React.FC<SimulationModalProps> = ({
  simulation,
  onClose
}) => {
  const { completeSimulation, playSound } = useApp();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasSubmittedDecision, setHasSubmittedDecision] = useState(false);
  const [discoveredFlags, setDiscoveredFlags] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isAllSafeChoices, setIsAllSafeChoices] = useState(true);

  const step = simulation.steps[currentStepIndex];
  const selectedOption = step?.options.find((o) => o.id === selectedOptionId);

  const handleSelectOption = (optId: string) => {
    if (hasSubmittedDecision) return;
    playSound('click');
    setSelectedOptionId(optId);
  };

  const handleSubmitDecision = () => {
    if (!selectedOption) return;
    setHasSubmittedDecision(true);

    if (selectedOption.isSafe) {
      playSound('success');
    } else {
      playSound('alert');
      setIsAllSafeChoices(false);
    }

    // Accumulate unique flags
    setDiscoveredFlags((prev) => [
      ...prev,
      ...selectedOption.redFlagsDiscovered.filter((f) => !prev.includes(f))
    ]);
  };

  const handleNextStep = () => {
    playSound('click');
    if (currentStepIndex < simulation.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setHasSubmittedDecision(false);
    } else {
      // Completed all steps!
      setIsFinished(true);
      completeSimulation(simulation.id, simulation.category, isAllSafeChoices ? 4 : 2);
    }
  };

  const handleRestart = () => {
    playSound('click');
    setCurrentStepIndex(0);
    setSelectedOptionId(null);
    setHasSubmittedDecision(false);
    setDiscoveredFlags([]);
    setIsFinished(false);
    setIsAllSafeChoices(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  {simulation.category}
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {simulation.difficulty} Simulation
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">
                {simulation.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        {!isFinished && (
          <div className="px-5 pt-3 pb-1 bg-white flex items-center justify-between text-[11px] text-slate-500 font-semibold border-b border-slate-100">
            <span>
              Decision Point {currentStepIndex + 1} of {simulation.steps.length}
            </span>
            <div className="flex items-center gap-1.5">
              {simulation.steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentStepIndex
                      ? 'w-6 bg-blue-600'
                      : idx < currentStepIndex
                      ? 'w-3 bg-emerald-500'
                      : 'w-3 bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {!isFinished ? (
            <>
              {/* Context Prompt */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100/80">
                <div className="text-xs font-bold text-blue-900 mb-1">
                  Scenario Dilemma:
                </div>
                <p className="text-xs sm:text-sm text-blue-950 font-medium leading-relaxed">
                  {step.prompt}
                </p>
                {step.contextNarrative && (
                  <p className="text-xs text-blue-900/80 mt-2 italic">
                    "{step.contextNarrative}"
                  </p>
                )}
              </div>

              {/* Realistic Screen Mockup */}
              <div className="rounded-2xl border border-slate-300 bg-slate-900 text-white overflow-hidden shadow-md">
                {/* Simulated Phone Top Bar */}
                <div className="h-6 bg-slate-950 px-4 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>9:41 AM</span>
                  <div className="flex items-center gap-1">
                    <span>5G</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Specific Screen Content */}
                {step.screenType === 'phone_call' && (
                  <div className="p-6 text-center space-y-4 bg-gradient-to-b from-slate-900 to-slate-950">
                    <div className="w-16 h-16 mx-auto rounded-full bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center animate-pulse">
                      <Phone className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="text-base font-bold text-white">
                        {step.screenMockupData?.sender || 'Unknown Caller'}
                      </div>
                      <div className="text-xs text-slate-400">Incoming Voice Call (Active)</div>
                    </div>
                    {step.screenMockupData?.messageText && (
                      <div className="p-3 rounded-xl bg-white/10 text-xs text-slate-200 max-w-md mx-auto text-left border border-white/10">
                        {step.screenMockupData.messageText}
                      </div>
                    )}
                  </div>
                )}

                {step.screenType === 'upi_app' && (
                  <div className="p-5 bg-slate-800 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                      <span className="font-bold text-xs text-blue-400">
                        {step.screenMockupData?.appBrand || 'Google Pay'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">Payment Collect Request</span>
                    </div>
                    <div className="text-center py-2 space-y-1">
                      <div className="text-xs text-slate-400">Requested from</div>
                      <div className="text-sm font-bold text-white">
                        {step.screenMockupData?.sender || 'Merchant Terminal'}
                      </div>
                      <div className="text-2xl font-extrabold text-white mt-1">
                        {step.screenMockupData?.amount || '₹4,999.00'}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 text-xs text-amber-300 border border-amber-500/30 text-center">
                      {step.screenMockupData?.messageText || 'Tap Pay & Enter UPI PIN to authorize'}
                    </div>
                  </div>
                )}

                {step.screenType === 'whatsapp' && (
                  <div className="p-4 bg-emerald-950/70 space-y-3">
                    <div className="flex items-center gap-2 border-b border-emerald-900/60 pb-2 text-xs">
                      <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                        WA
                      </div>
                      <span className="font-bold text-white">
                        {step.screenMockupData?.sender || 'WhatsApp Contact'}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 text-xs text-slate-100 max-w-sm space-y-2 border border-slate-800">
                      <p>{step.screenMockupData?.messageText}</p>
                      {step.screenMockupData?.attachmentName && (
                        <div className="p-2 rounded-lg bg-slate-800 flex items-center gap-2 text-[11px] text-blue-400 border border-slate-700">
                          <QrCode className="w-4 h-4 text-emerald-400" />
                          <span>{step.screenMockupData.attachmentName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {step.screenType === 'sms' && (
                  <div className="p-4 bg-slate-800 space-y-3">
                    <div className="text-xs font-mono text-slate-400 border-b border-slate-700 pb-1">
                      SMS From: <strong className="text-white">{step.screenMockupData?.sender || 'VM-ALERTS'}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 text-xs text-slate-200 leading-relaxed border border-slate-700">
                      {step.screenMockupData?.messageText}
                    </div>
                  </div>
                )}

                {step.screenType === 'bank_portal' && (
                  <div className="p-4 bg-slate-900 space-y-3">
                    <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-950 text-[10px] text-slate-400 font-mono">
                      <span className="text-amber-400">⚠️ Not Secure</span>
                      <span className="text-slate-300 truncate">{step.screenMockupData?.url}</span>
                    </div>
                    <div className="p-4 rounded-xl bg-white text-slate-900 space-y-2">
                      <div className="text-xs font-bold text-blue-900">Online Banking Rewards Claim</div>
                      <p className="text-xs text-slate-600">{step.screenMockupData?.messageText}</p>
                    </div>
                  </div>
                )}

                {step.screenType === 'generic' && (
                  <div className="p-4 bg-slate-800 space-y-2">
                    <div className="text-xs font-bold text-white">
                      {step.screenMockupData?.appBrand || 'Third-Party Application'}
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 text-xs text-slate-200">
                      {step.screenMockupData?.messageText}
                    </div>
                  </div>
                )}
              </div>

              {/* Decision Options */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select Your Defensive Action:
                </div>

                <div className="space-y-2.5">
                  {step.options.map((option) => {
                    const isSelected = selectedOptionId === option.id;
                    return (
                      <button
                        key={option.id}
                        disabled={hasSubmittedDecision}
                        onClick={() => handleSelectOption(option.id)}
                        className={`w-full p-3.5 rounded-2xl text-left text-xs sm:text-sm font-medium transition-all border flex items-start gap-3 ${
                          isSelected
                            ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 text-blue-950 font-semibold'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                        } ${hasSubmittedDecision ? 'opacity-85 cursor-default' : ''}`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'border-blue-600 bg-blue-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span className="leading-snug">{option.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons & Feedback */}
              {!hasSubmittedDecision ? (
                <div className="pt-2">
                  <button
                    disabled={!selectedOptionId}
                    onClick={handleSubmitDecision}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2"
                  >
                    <span>Confirm Action</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* Post-Decision Forensic Feedback Card */
                <div className="space-y-4 pt-2">
                  <div
                    className={`p-4 rounded-2xl border ${
                      selectedOption?.isSafe
                        ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                        : 'bg-red-50/80 border-red-200 text-red-950'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-sm mb-1">
                      {selectedOption?.isSafe ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          <span>Safe Choice (+{selectedOption?.xpEarned || 50} XP)</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                          <span>Critical Vulnerability Triggered</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed mt-1">
                      {selectedOption?.explanation}
                    </p>

                    {/* Red Flags Discovered */}
                    {selectedOption?.redFlagsDiscovered &&
                      selectedOption.redFlagsDiscovered.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-black/10">
                          <div className="text-[11px] font-bold uppercase tracking-wider mb-1">
                            Red Flags Exposed:
                          </div>
                          <ul className="list-disc list-inside text-xs space-y-0.5">
                            {selectedOption.redFlagsDiscovered.map((flag, i) => (
                              <li key={i}>{flag}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>

                  <button
                    onClick={handleNextStep}
                    className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2"
                  >
                    <span>
                      {currentStepIndex < simulation.steps.length - 1
                        ? 'Next Scenario Stage'
                        : 'Complete Simulation'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Simulation Completed Summary View */
            <div className="text-center py-6 space-y-6">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <ShieldCheck className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  Simulation Concluded
                </span>
                <h3 className="text-2xl font-black text-slate-900">
                  {isAllSafeChoices ? 'Flawless Fraud Defense!' : 'Simulation Completed'}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {isAllSafeChoices
                    ? 'You successfully navigated the deceit without disclosing credentials or approving unauthorized payments.'
                    : 'You identified key warning signs. Review the core takeaways below to reinforce your reflexes.'}
                </p>
              </div>

              {/* XP and Score Reward Pill */}
              <div className="flex items-center justify-center gap-3">
                <div className="px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>+120 Defense XP Earned</span>
                </div>
                <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>Safety Score Boosted</span>
                </div>
              </div>

              {/* Key Takeaways */}
              <div className="text-left p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Key Rules to Remember:
                </div>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {simulation.learningTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Completion Actions */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleRestart}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Replay Scenario</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
