import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  AlertTriangle,
  CheckCircle2,
  Shield,
  ShieldAlert,
  RotateCcw,
  Sparkles,
  Award,
  ChevronRight,
  Headphones
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VOICE_SCENARIOS } from '../../data/mockData';
import { VoiceScenario } from '../../types';

export const VoiceScamSimulator: React.FC = () => {
  const { playSound, awardXp } = useApp();

  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [callState, setCallState] = useState<'idle' | 'ringing' | 'active' | 'ended'>('idle');
  const [dialogueStepIndex, setDialogueStepIndex] = useState(0);
  const [transcriptHistory, setTranscriptHistory] = useState<
    { speaker: 'caller' | 'user'; text: string; isSafe?: boolean }[]
  >([]);
  const [userScore, setUserScore] = useState(100);
  const [missedFlags, setMissedFlags] = useState<string[]>([]);
  const [detectedFlags, setDetectedFlags] = useState<string[]>([]);
  const [isMuted, setIsMuted] = useState(false);

  const scenario: VoiceScenario = VOICE_SCENARIOS[selectedScenarioIndex];
  const currentStep = scenario.dialogueScript[dialogueStepIndex];

  const ringAudioRef = useRef<number | null>(null);

  // Generate ringing sound using Web Audio API
  const startRinging = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.frequency.value = 440;
      osc2.frequency.value = 480;
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);

      osc1.start();
      osc2.start();

      setTimeout(() => {
        try {
          osc1.stop();
          osc2.stop();
        } catch {}
      }, 1800);
    } catch {}
  };

  const handleStartCallSimulation = () => {
    playSound('click');
    setCallState('ringing');
    startRinging();
  };

  const handleAnswerCall = () => {
    playSound('click');
    setCallState('active');
    setTranscriptHistory([
      { speaker: 'caller', text: scenario.initialTranscript }
    ]);
    setDialogueStepIndex(0);
  };

  const handleDeclineCall = () => {
    playSound('alert');
    setCallState('ended');
    setTranscriptHistory([
      { speaker: 'user', text: '[Call Rejected Immediately as Unsolicited Spam]', isSafe: true }
    ]);
    awardXp(50);
  };

  const handleUserReply = (opt: typeof currentStep.options[0]) => {
    playSound('click');
    const newHistory = [
      ...transcriptHistory,
      { speaker: 'user' as const, text: opt.userReply, isSafe: opt.isSafe },
      { speaker: 'caller' as const, text: opt.callerReaction }
    ];
    setTranscriptHistory(newHistory);

    if (opt.isSafe) {
      playSound('success');
      setDetectedFlags((prev) => [...prev, ...opt.detectedFlags]);
      awardXp(opt.points);
    } else {
      playSound('alert');
      setUserScore((prev) => Math.max(0, prev - 40));
      setMissedFlags((prev) => [...prev, ...opt.detectedFlags]);
    }

    if (dialogueStepIndex < scenario.dialogueScript.length - 1) {
      setDialogueStepIndex((prev) => prev + 1);
    } else {
      // Finished call
      setCallState('ended');
    }
  };

  const handleReset = () => {
    playSound('click');
    setCallState('idle');
    setDialogueStepIndex(0);
    setTranscriptHistory([]);
    setUserScore(100);
    setMissedFlags([]);
    setDetectedFlags([]);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2">
            <Headphones className="w-3.5 h-3.5 text-emerald-600" />
            <span>Audio Forensics & IVR Sandbox</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Voice Scam & Vishing Simulator
          </h1>
          <p className="text-xs text-slate-500">
            Experience realistic impersonations of police officials, cyber crime officers, and fraud prevention executives.
          </p>
        </div>

        {/* Scenario Selection */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl self-start">
          {VOICE_SCENARIOS.map((scen, idx) => (
            <button
              key={scen.id}
              onClick={() => {
                setSelectedScenarioIndex(idx);
                handleReset();
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                selectedScenarioIndex === idx
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Case {idx + 1}: {scen.callerName.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Simulator Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Phone Call Device Simulation UI */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-sm rounded-[40px] bg-slate-950 text-white p-6 shadow-2xl border-4 border-slate-800 flex flex-col min-h-[560px] justify-between relative overflow-hidden">
            {/* Top Speaker and Camera Notch */}
            <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto mb-4 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-slate-700" />
            </div>

            {callState === 'idle' && (
              <div className="text-center my-auto space-y-5">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                  <Phone className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">Vishing Test Ready</h3>
                  <p className="text-xs text-slate-400 px-4">
                    Target: <strong>{scenario.callerName}</strong> ({scenario.callerTitle})
                  </p>
                </div>
                <button
                  onClick={handleStartCallSimulation}
                  className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
                >
                  Simulate Incoming Call
                </button>
              </div>
            )}

            {callState === 'ringing' && (
              <div className="text-center my-auto space-y-6">
                <div className="relative">
                  <div className="w-24 h-24 mx-auto rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center animate-pulse">
                    <Phone className="w-10 h-10" />
                  </div>
                  <div className="absolute inset-0 rounded-full border-2 border-rose-500/30 animate-ping" />
                </div>

                <div>
                  <div className="text-xs text-rose-400 font-bold uppercase tracking-widest animate-pulse">
                    Incoming Call...
                  </div>
                  <h3 className="text-lg font-extrabold text-white mt-1">
                    {scenario.callerName}
                  </h3>
                  <p className="text-xs text-slate-400">{scenario.organization}</p>
                </div>

                {/* Call Controls */}
                <div className="flex items-center justify-center gap-10 pt-4">
                  <button
                    onClick={handleDeclineCall}
                    className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-600/40 transition-transform hover:scale-110"
                    title="Reject Call"
                  >
                    <PhoneOff className="w-6 h-6" />
                  </button>

                  <button
                    onClick={handleAnswerCall}
                    className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/40 transition-transform hover:scale-110 animate-bounce"
                    title="Answer Call"
                  >
                    <Phone className="w-6 h-6" />
                  </button>
                </div>
              </div>
            )}

            {callState === 'active' && (
              <div className="flex-1 flex flex-col justify-between py-4">
                <div className="text-center space-y-1">
                  <div className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase">
                    Call In Progress (00:38)
                  </div>
                  <h3 className="text-base font-bold text-white">{scenario.callerName}</h3>
                  <div className="text-xs text-slate-400">{scenario.callerTitle}</div>
                </div>

                {/* Audio Waveform Animation */}
                <div className="my-6 flex items-center justify-center gap-1.5 h-12">
                  <span className="w-1.5 h-6 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="w-1.5 h-10 bg-emerald-500 rounded-full animate-pulse delay-75" />
                  <span className="w-1.5 h-4 bg-emerald-400 rounded-full animate-pulse delay-150" />
                  <span className="w-1.5 h-12 bg-emerald-300 rounded-full animate-pulse delay-100" />
                  <span className="w-1.5 h-8 bg-emerald-400 rounded-full animate-pulse delay-200" />
                </div>

                {/* In-Call Phone Bar Controls */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-center">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 flex flex-col items-center gap-1"
                  >
                    {isMuted ? <MicOff className="w-4 h-4 text-red-400" /> : <Mic className="w-4 h-4" />}
                    <span className="text-[10px]">{isMuted ? 'Muted' : 'Mute'}</span>
                  </button>
                  <button
                    onClick={() => playSound('click')}
                    className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 flex flex-col items-center gap-1"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span className="text-[10px]">Speaker</span>
                  </button>
                  <button
                    onClick={() => setCallState('ended')}
                    className="p-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white flex flex-col items-center gap-1"
                  >
                    <PhoneOff className="w-4 h-4" />
                    <span className="text-[10px]">Hang Up</span>
                  </button>
                </div>
              </div>
            )}

            {callState === 'ended' && (
              <div className="text-center my-auto space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-slate-900 text-slate-400 flex items-center justify-center border border-slate-800">
                  <PhoneOff className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Call Terminated</h3>
                  <div className="text-xs text-slate-400 mt-1">
                    Defense Score: <strong className="text-emerald-400">{userScore}%</strong>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                >
                  Restart Test
                </button>
              </div>
            )}

            {/* Bottom Indicator Bar */}
            <div className="w-32 h-1 bg-slate-800 rounded-full mx-auto mt-4" />
          </div>
        </div>

        {/* Right: Live Audio Transcript & Decision Options */}
        <div className="lg:col-span-7 space-y-4">
          {/* Transcript Log Container */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4 min-h-[300px]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Real-Time Audio Transcript
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {callState === 'active' ? 'STREAMING ACTIVE' : 'LOG READY'}
              </span>
            </div>

            {transcriptHistory.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                <Headphones className="w-8 h-8 mx-auto text-slate-300" />
                <p>Click "Simulate Incoming Call" on the device to begin audio exercise.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {transcriptHistory.map((entry, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      entry.speaker === 'caller'
                        ? 'bg-slate-100 text-slate-800 border border-slate-200'
                        : entry.isSafe
                        ? 'bg-emerald-50 text-emerald-950 border border-emerald-200 ml-4 font-medium'
                        : 'bg-red-50 text-red-950 border border-red-200 ml-4 font-medium'
                    }`}
                  >
                    <div className="text-[10px] font-bold uppercase mb-1 opacity-60">
                      {entry.speaker === 'caller' ? `Caller (${scenario.callerName})` : 'You (Defender)'}
                    </div>
                    {entry.text}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interactive Response Prompt during active call */}
          {callState === 'active' && currentStep && (
            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                How Do You Respond to the Caller?
              </div>
              <div className="space-y-2">
                {currentStep.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleUserReply(opt)}
                    className="w-full p-3.5 rounded-2xl text-left text-xs font-semibold bg-slate-50 hover:bg-blue-50 hover:border-blue-300 border border-slate-200 text-slate-800 transition-all flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 text-[10px]">
                      {i + 1}
                    </span>
                    <span className="leading-snug">{opt.userReply}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Golden Rule Callout */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/70 text-xs text-amber-950 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Voice Defense Rule</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-900/90">
              {scenario.summaryAdvice}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
