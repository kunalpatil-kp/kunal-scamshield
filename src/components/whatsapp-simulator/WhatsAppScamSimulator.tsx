import React, { useState } from 'react';
import {
  MessagesSquare,
  Search,
  MoreVertical,
  Paperclip,
  Mic,
  Play,
  FileText,
  QrCode,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Phone,
  Video,
  CornerDownRight,
  Shield
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface WhatsAppThread {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  isForwardedManyTimes?: boolean;
  messages: {
    id: string;
    sender: 'them' | 'me';
    text: string;
    time: string;
    isForwarded?: boolean;
    attachmentType?: 'qr' | 'pdf' | 'voice';
    attachmentName?: string;
    voiceDuration?: string;
  }[];
  redFlags: string[];
  safeVerdict: string;
}

export const WhatsAppScamSimulator: React.FC = () => {
  const { playSound, awardXp } = useApp();

  const threads: WhatsAppThread[] = [
    {
      id: 'wa_1',
      name: 'Capt. R. Sharma (Indian Army OLX)',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
      lastMessage: 'Scan this Merchant QR in your GPay to receive ₹8,000...',
      time: '11:42 AM',
      unreadCount: 1,
      messages: [
        {
          id: 'm1',
          sender: 'them',
          text: 'Hello sir, I saw your sofa listed on OLX. I am Capt. Sharma from Armed Forces Base. I want to buy it immediately.',
          time: '11:40 AM'
        },
        {
          id: 'm2',
          sender: 'them',
          text: 'My company account only dispatches funds via Government Merchant Barcode. Open Google Pay, scan this attached QR, and enter your 6-digit PIN to receive ₹8,000 immediately.',
          time: '11:41 AM',
          attachmentType: 'qr',
          attachmentName: 'Army_Canteen_Refund_QR_8000.png'
        }
      ],
      redFlags: [
        'Army officer impersonation to lower user skepticism',
        'Fundamental UPI violation: Entering PIN never receives money',
        'Overeager buyer not inspecting item in person'
      ],
      safeVerdict: 'Never scan a QR code or enter your UPI PIN to receive money. Share only your UPI ID or phone number.'
    },
    {
      id: 'wa_2',
      name: '+62 881 9283 192 (HR Recruiter)',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
      lastMessage: 'Rate 3 hotels on Google Maps for ₹150...',
      time: '09:15 AM',
      unreadCount: 2,
      isForwardedManyTimes: true,
      messages: [
        {
          id: 'm3',
          sender: 'them',
          text: 'Hello! I found your resume on LinkedIn. We offer part-time remote freelance work. Earn ₹3,500/day by simply giving 5-star ratings to restaurants on Google Maps.',
          time: '09:12 AM',
          isForwarded: true
        },
        {
          id: 'm4',
          sender: 'them',
          text: 'Listen to the briefing audio below and send your UPI ID to receive the first ₹150 test reward.',
          time: '09:14 AM',
          attachmentType: 'voice',
          voiceDuration: '0:45'
        }
      ],
      redFlags: [
        'Foreign international country code (+62)',
        'Unsolicited task scam recruitment without formal interview',
        'Small initial bait payment designed to trap victim into larger deposits'
      ],
      safeVerdict: 'Block and report this number immediately. Legitimate companies never recruit or pay freelancers via anonymous WhatsApp business numbers.'
    },
    {
      id: 'wa_3',
      name: 'PM Free Device Portal Support',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
      lastMessage: 'Forwarded: Register before midnight for ₹50,000 allowance...',
      time: 'Yesterday',
      isForwardedManyTimes: true,
      messages: [
        {
          id: 'm5',
          sender: 'them',
          text: '🇮🇳 PM Youth Digital Laptop Yojana 2026. All college students eligible for free laptop and ₹50,000 stipend. Only 500 units left! Register at http://pm-device-grant.xyz and pay ₹99 delivery fee.',
          time: 'Yesterday, 8:20 PM',
          isForwarded: true,
          attachmentType: 'pdf',
          attachmentName: 'Official_Govt_Allotment_Letter_2026.pdf'
        }
      ],
      redFlags: [
        '"Forwarded many times" tag indicates viral disinformation',
        'Non-government domain (.xyz) instead of official .gov.in',
        'Demanding fee for supposedly free welfare schemes'
      ],
      safeVerdict: 'Government schemes are never hosted on .xyz domains and never charge processing fees on WhatsApp.'
    }
  ];

  const [activeThreadId, setActiveThreadId] = useState<string>(threads[0].id);
  const [evaluatedThreads, setEvaluatedThreads] = useState<Record<string, boolean>>({});

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];
  const isEvaluated = evaluatedThreads[activeThread.id];

  const handleEvaluateSafety = () => {
    playSound('success');
    setEvaluatedThreads((prev) => ({ ...prev, [activeThread.id]: true }));
    awardXp(60);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2">
            <MessagesSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted Messaging Sandbox</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            WhatsApp Fraud Simulator
          </h1>
          <p className="text-xs text-slate-500">
            Learn to spot viral forwarded scams, fake QR code receipts, and malicious APK attachments inside a authentic WhatsApp UI.
          </p>
        </div>
      </div>

      {/* Main WhatsApp Window Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 rounded-3xl bg-white border border-slate-200/80 shadow-lg overflow-hidden min-h-[580px]">
        {/* Left: Chat List Panel */}
        <div className="lg:col-span-4 border-r border-slate-200 bg-slate-50/50 flex flex-col">
          {/* Top Chat List Bar */}
          <div className="p-3.5 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between">
            <span className="font-bold text-xs text-slate-900">Chats</span>
            <div className="flex items-center gap-2 text-slate-500">
              <Search className="w-4 h-4 cursor-pointer" />
              <MoreVertical className="w-4 h-4 cursor-pointer" />
            </div>
          </div>

          {/* List items */}
          <div className="flex-1 divide-y divide-slate-100 overflow-y-auto">
            {threads.map((thread) => {
              const isSelected = thread.id === activeThreadId;
              return (
                <div
                  key={thread.id}
                  onClick={() => {
                    playSound('click');
                    setActiveThreadId(thread.id);
                  }}
                  className={`p-3 flex items-center gap-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-slate-200/70' : 'hover:bg-slate-100/60'
                  }`}
                >
                  <img
                    src={thread.avatar}
                    alt={thread.name}
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 truncate">
                        {thread.name}
                      </span>
                      <span className="text-[10px] text-slate-400">{thread.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {thread.lastMessage}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Chat Conversation & Red Flag Panel */}
        <div className="lg:col-span-8 flex flex-col bg-slate-100/60">
          {/* WhatsApp Chat Header */}
          <div className="p-3 bg-slate-200/80 border-b border-slate-300/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={activeThread.avatar}
                alt={activeThread.name}
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <div className="font-bold text-xs text-slate-900">{activeThread.name}</div>
                <div className="text-[10px] text-emerald-700 font-semibold">online</div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-600">
              <Video className="w-4 h-4 cursor-pointer" />
              <Phone className="w-4 h-4 cursor-pointer" />
              <MoreVertical className="w-4 h-4 cursor-pointer" />
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            {activeThread.messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'me' ? 'items-end' : 'items-start'}`}
              >
                <div className="max-w-[85%] sm:max-w-[70%] p-3 rounded-2xl bg-white border border-slate-200/80 text-slate-900 text-xs shadow-xs space-y-2">
                  {/* Forwarded Tag if applicable */}
                  {m.isForwarded && (
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 italic font-semibold">
                      <CornerDownRight className="w-3 h-3 text-slate-400" />
                      <span>Forwarded many times</span>
                    </div>
                  )}

                  <p className="leading-relaxed">{m.text}</p>

                  {/* Attachment types */}
                  {m.attachmentType === 'qr' && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                      <QrCode className="w-8 h-8 text-blue-600" />
                      <div>
                        <div className="font-bold text-xs text-slate-800">{m.attachmentName}</div>
                        <div className="text-[10px] text-red-600 font-semibold">
                          ⚠️ Fraud QR: Prompts UPI PIN entry
                        </div>
                      </div>
                    </div>
                  )}

                  {m.attachmentType === 'voice' && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                      <button className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <Play className="w-3.5 h-3.5 fill-white" />
                      </button>
                      <div className="flex-1">
                        <div className="h-1 bg-slate-300 rounded-full" />
                        <div className="text-[10px] text-slate-500 mt-1 font-mono">
                          {m.voiceDuration}
                        </div>
                      </div>
                    </div>
                  )}

                  {m.attachmentType === 'pdf' && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-red-500" />
                      <span className="font-semibold text-[11px] text-slate-800 truncate">
                        {m.attachmentName}
                      </span>
                    </div>
                  )}

                  <div className="text-[9px] text-slate-400 text-right">{m.time}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Forensic Triage Box */}
          <div className="p-4 bg-white border-t border-slate-200 space-y-3">
            {!isEvaluated ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Analyze this Conversation
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Verify red flags and examine safety risks
                  </div>
                </div>
                <button
                  onClick={handleEvaluateSafety}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  Expose Red Flags
                </button>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Defense Analysis Complete (+60 XP)</span>
                </div>
                <ul className="text-xs space-y-1 list-disc list-inside">
                  {activeThread.redFlags.map((flag, idx) => (
                    <li key={idx}>{flag}</li>
                  ))}
                </ul>
                <div className="text-[11px] text-emerald-900 font-semibold pt-1 border-t border-emerald-200">
                  Golden Rule: {activeThread.safeVerdict}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
