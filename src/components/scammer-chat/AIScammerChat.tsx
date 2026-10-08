import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  Shield,
  ShieldAlert,
  AlertTriangle,
  Sparkles,
  Paperclip,
  Mic,
  RotateCcw,
  CheckCheck,
  Phone,
  Video,
  Info,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ChatMessage {
  id: string;
  sender: 'scammer' | 'user';
  text: string;
  timestamp: string;
  hasAttachment?: boolean;
  attachmentName?: string;
  isAudio?: boolean;
  tacticsUsed?: string[];
  redFlagExplanation?: string;
}

export const AIScammerChat: React.FC = () => {
  const { playSound, awardXp } = useApp();
  const [selectedPersona, setSelectedPersona] = useState<string>('bank_kyc');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState<string | null>(
    'Look out for manufactured time pressure, links ending in .info or .top, and requests for OTP codes.'
  );
  const [riskScore, setRiskScore] = useState(78);

  const initialMessages: Record<string, ChatMessage[]> = {
    bank_kyc: [
      {
        id: 'msg_1',
        sender: 'scammer',
        text: 'Dear Customer, your State Bank YONO NetBanking service has been suspended due to pending document verification. Your debit card will be permanently blocked today at 11:59 PM. Please verify immediately: http://sbi-kyc-update-portal.info/login or share the 6-digit code received via SMS.',
        timestamp: '10:42 AM',
        tacticsUsed: ['Extreme Artificial Urgency', 'Fear of Frozen Assets', 'Spoofed Banking Domain'],
        redFlagExplanation: 'Banks never send non-standard domains (.info) or demand immediate OTP verification to stop account blocking.'
      }
    ],
    refund_agent: [
      {
        id: 'msg_1',
        sender: 'scammer',
        text: 'Hello Sir, ₹3,500 has been credited to your PhonePe account by mistake from our merchant server. To accept the return or receive the compensation voucher, please approve the UPI request of ₹3,500 on your phone screen.',
        timestamp: '11:15 AM',
        hasAttachment: true,
        attachmentName: 'PhonePe_Merchant_Refund_Receipt_3500.pdf',
        tacticsUsed: ['Reverse Psychology', 'UPI Collect Request Confusion'],
        redFlagExplanation: 'Approving a UPI request debits money from your account. You NEVER pay to receive a refund.'
      }
    ],
    job_investment: [
      {
        id: 'msg_1',
        sender: 'scammer',
        text: 'Hi! Our company provides part-time Telegram tasks. Like 3 YouTube videos, get ₹150 instantly. In Stage 2, invest ₹1,000 to earn ₹3,500 guaranteed within 20 minutes with crypto hedging!',
        timestamp: '09:05 AM',
        tacticsUsed: ['Small Hook Bait', 'Ponzi / Task Fraud Escalation'],
        redFlagExplanation: 'Legitimate jobs do not require you to deposit your own money to unlock salaries or task bonuses.'
      }
    ],
    tech_support: [
      {
        id: 'msg_1',
        sender: 'scammer',
        text: 'Sir, your Google Pay server connection is experiencing sync error. Please download AnyDesk from Play Store and tell me the 9-digit address so our remote engineer can clear the pending transaction cache.',
        timestamp: '01:20 PM',
        tacticsUsed: ['Technical Jargon', 'Remote Access Screen Hijack'],
        redFlagExplanation: 'Installing AnyDesk or TeamViewer gives complete remote control of your phone and banking apps to fraudsters.'
      }
    ]
  };

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages['bank_kyc']);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(initialMessages[selectedPersona] || initialMessages['bank_kyc']);
  }, [selectedPersona]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    playSound('click');
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat-scammer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            content: m.text
          })),
          persona: selectedPersona
        })
      });

      const data = await response.json();

      setIsTyping(false);
      if (data && data.scammerReply) {
        const scammerMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'scammer',
          text: data.scammerReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          tacticsUsed: data.tacticsUsed || ['Social Engineering', 'Urgency Pressure'],
          redFlagExplanation: data.redFlagExplanation || 'Fraudsters escalate pressure when victims question their authenticity.'
        };
        setMessages((prev) => [...prev, scammerMsg]);
        setActiveAnalysis(scammerMsg.redFlagExplanation || null);
        playSound('alert');
        awardXp(25);
      }
    } catch (err) {
      setIsTyping(false);
      // Fallback response if API fails
      const fallbackReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'scammer',
        text: 'Sir, I am calling from Head Office KYC verification department. If you do not cooperate immediately, your account will be reported to Cyber Crime Cell for non-compliance.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tacticsUsed: ['Aggressive Intimidation', 'Manufactured Authority'],
        redFlagExplanation: 'Notice how the scammer immediately resorts to regulatory threats when you hesitate.'
      };
      setMessages((prev) => [...prev, fallbackReply]);
      setActiveAnalysis(fallbackReply.redFlagExplanation || null);
    }
  };

  const presetResponses = [
    'I will never share my OTP. Banks strictly forbid it.',
    'What is your employee ID and which official branch are you calling from?',
    'Receiving money never requires entering a UPI PIN.',
    'I am reporting this phone number to 1930 and the cyber cell.'
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Persona Selector */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Adversarial Sandbox</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            AI Scammer Simulator & Live Trainer
          </h1>
          <p className="text-xs text-slate-500">
            Roleplay in real-time with an AI impersonating sophisticated fraudsters. Practice safe responses without real-world risk.
          </p>
        </div>

        {/* Persona Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl">
          <button
            onClick={() => setSelectedPersona('bank_kyc')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              selectedPersona === 'bank_kyc'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Bank KYC Officer
          </button>
          <button
            onClick={() => setSelectedPersona('refund_agent')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              selectedPersona === 'refund_agent'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            PhonePe Refund
          </button>
          <button
            onClick={() => setSelectedPersona('job_investment')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              selectedPersona === 'job_investment'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Telegram Task Scam
          </button>
          <button
            onClick={() => setSelectedPersona('tech_support')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              selectedPersona === 'tech_support'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            AnyDesk Support
          </button>
        </div>
      </div>

      {/* Main Chat & Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chat UI Panel */}
        <div className="lg:col-span-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden flex flex-col h-[620px]">
          {/* WhatsApp / Messaging Top Header */}
          <div className="h-16 bg-slate-900 text-white px-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center font-bold text-sm">
                  FB
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>
                    {selectedPersona === 'bank_kyc'
                      ? 'Officer Sharma (SBI Compliance)'
                      : selectedPersona === 'refund_agent'
                      ? 'Rajesh (PhonePe Refund Desk)'
                      : selectedPersona === 'job_investment'
                      ? 'Global Media Tasks HR'
                      : 'Google Pay Remote Desk'}
                  </span>
                  <span className="text-[10px] bg-red-500/20 text-red-300 px-1.5 py-0.2 rounded border border-red-500/30">
                    Simulated Bot
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {isTyping ? 'typing deceptive response...' : 'Online · Threats active'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-400">
              <Phone className="w-4 h-4 cursor-pointer hover:text-white" />
              <Video className="w-4 h-4 cursor-pointer hover:text-white" />
              <button
                onClick={() => setMessages(initialMessages[selectedPersona] || initialMessages['bank_kyc'])}
                title="Restart Conversation"
                className="hover:text-white"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/60">
            {messages.map((msg) => {
              const isScammer = msg.sender === 'scammer';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isScammer ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isScammer
                        ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'
                        : 'bg-blue-600 text-white rounded-tr-xs'
                    }`}
                  >
                    <p>{msg.text}</p>

                    {/* Attachment preview if any */}
                    {msg.hasAttachment && (
                      <div className="mt-2 p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-2 text-[11px] font-semibold">
                        <FileText className="w-4 h-4 text-red-500" />
                        <span className="truncate">{msg.attachmentName}</span>
                      </div>
                    )}

                    <div
                      className={`text-[9px] mt-1 text-right flex items-center justify-end gap-1 ${
                        isScammer ? 'text-slate-400' : 'text-blue-100'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {!isScammer && <CheckCheck className="w-3 h-3 text-blue-200" />}
                    </div>
                  </div>

                  {/* Scammer Red Flag Indicator Tag */}
                  {isScammer && msg.tacticsUsed && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {msg.tacticsUsed.map((tactic, i) => (
                        <span
                          key={i}
                          className="text-[9px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-100"
                        >
                          ⚠️ {tactic}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-2xl w-fit">
                <span className="text-[11px] text-slate-400 font-medium">Scammer is typing</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-100" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-200" />
                </span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick preset response pills */}
          <div className="px-4 py-2 bg-slate-100/70 border-t border-slate-200/60 flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
              Quick Defense:
            </span>
            {presetResponses.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(preset)}
                className="shrink-0 px-2.5 py-1 text-[11px] font-medium bg-white hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 transition-colors"
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your response to test the scammer's reaction..."
              className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-slate-100 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Red Flag & Risk Analysis Sidepanel */}
        <div className="lg:col-span-4 space-y-4">
          {/* Risk Level Gauge Card */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Threat Risk Level
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-red-100 text-red-700">
                CRITICAL THREAT
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-3xl font-black text-red-600">{riskScore}/100</div>
              <div className="text-[11px] text-slate-500 text-right">
                <div>Probability of Fraud</div>
                <strong className="text-red-600">99.4% Confidence</strong>
              </div>
            </div>

            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-red-600 rounded-full"
                style={{ width: `${riskScore}%` }}
              />
            </div>
          </div>

          {/* Active Forensic Breakdown */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>Forensic Red Flag Inspector</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-amber-50/70 p-3 rounded-2xl border border-amber-200/60">
              {activeAnalysis}
            </p>

            <div className="space-y-2 pt-2">
              <div className="text-[11px] font-bold text-slate-700 uppercase">
                Active Tactical Deceptions:
              </div>
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">1.</span>
                  <span>Time-window countdown to bypass rational critical thinking.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">2.</span>
                  <span>Authority impersonation to provoke submissive compliance.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">3.</span>
                  <span>Off-platform redirect to unmonitored links or payment handles.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Practice Recommendations */}
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-xs text-blue-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>Recommended Counter-Strategy</span>
            </div>
            <p className="text-[11px] text-blue-800 leading-relaxed">
              Never justify yourself or argue over details. Firmly state that you will authenticate via official banking telephone lines and immediately terminate communication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
