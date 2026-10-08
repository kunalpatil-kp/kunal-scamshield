import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  Zap,
  CheckCircle,
  AlertTriangle,
  Play,
  ArrowRight,
  TrendingUp,
  Users,
  Lock,
  QrCode,
  KeyRound,
  PhoneCall,
  MessageSquare,
  Sparkles,
  BotMessageSquare,
  BookOpen,
  FileCheck2,
  Compass,
  ChevronRight,
  ExternalLink,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GLOBAL_FRAUD_STATS, SIMULATION_SCENARIOS, FRAUD_NEWS_ARTICLES } from '../../data/mockData';

export const HomeDashboard: React.FC = () => {
  const {
    user,
    setActiveTab,
    openSimulation,
    openScanner,
    openNews,
    quickSimulationPrompt,
    playSound
  } = useApp();

  const [activeStatTab, setActiveStatTab] = useState<'india' | 'global'>('india');

  // Category breakdown metrics
  const categories = [
    { name: 'OTP Safety', score: user.categoryScores.otp, icon: KeyRound, desc: '6-digit authorization defense' },
    { name: 'QR Safety', score: user.categoryScores.qr, icon: QrCode, desc: 'Scan to pay vs receive distinction' },
    { name: 'UPI Awareness', score: user.categoryScores.upi, icon: Zap, desc: 'Collect requests & VPA safety' },
    { name: 'Phishing', score: user.categoryScores.phishing, icon: ExternalLink, desc: 'Fake URLs & cloned banking' },
    { name: 'KYC Awareness', score: user.categoryScores.kyc, icon: ShieldCheck, desc: 'Account suspension threats' },
    { name: 'Voice Fraud', score: user.categoryScores.voice, icon: PhoneCall, desc: 'Caller impersonation & panic' },
    { name: 'Investment', score: user.categoryScores.investment, icon: TrendingUp, desc: 'Pig butchering & fake apps' },
    { name: 'Social Eng.', score: user.categoryScores.socialEngineering, icon: Users, desc: 'Digital arrest & fear triggers' },
  ];

  // Featured 3 simulations
  const featuredSimulations = SIMULATION_SCENARIOS.slice(0, 3);
  const trendingNews = FRAUD_NEWS_ARTICLES.slice(0, 2);

  // Score circular stroke calculation
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (user.overallScore / 100) * circumference;

  return (
    <div className="space-y-8 pb-12">
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-blue-900/40">
        {/* Subtle background glow graphics */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>National Cyber Defense & Financial Fraud Awareness Platform</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15]">
                Learn From Scams <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400">
                  Before Scammers Teach You
                </span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                Train with high-fidelity simulations of UPI collect traps, fake KYC calls, QR inversions, and digital arrest psyops. Build reflexive digital immunity before real money is on the line.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={quickSimulationPrompt}
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Zap className="w-4 h-4" />
                <span>Start Simulation</span>
              </button>

              <button
                onClick={() => setActiveTab('assessments')}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm border border-white/20 backdrop-blur-md flex items-center gap-2 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Take Fraud Assessment</span>
              </button>

              <button
                onClick={() => setActiveTab('learning-path')}
                className="px-4 py-3 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
              >
                <Compass className="w-4 h-4 text-sky-400" />
                <span>View Learning Path</span>
              </button>
            </div>

            {/* Trust and accreditation strip */}
            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300">Target Frameworks:</span>
              <span>NPCI UPI 2.0 Safety</span>
              <span>·</span>
              <span>RBI Customer Protection</span>
              <span>·</span>
              <span>I4C 1930 Cyber Cell</span>
            </div>
          </div>

          {/* Hero Visual Mockup Shield Graphic */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm p-6 rounded-2xl bg-white/5 border border-white/15 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Defense Readiness</div>
                    <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Immunity Level: High
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-extrabold text-white">{user.overallScore}%</div>
                  <div className="text-[10px] text-slate-400">Verified Grade</div>
                </div>
              </div>

              {/* Live Threat Scenario Card preview */}
              <div className="mt-4 p-3.5 rounded-xl bg-slate-900/60 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-amber-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Incoming Threat Probe
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Live Simulation</span>
                </div>
                <p className="text-xs text-slate-200">
                  "Dear Customer, ₹4,999 refund ready. Tap Pay to credit ₹5,000 to bank."
                </p>
                <div className="p-2 rounded-lg bg-red-950/40 border border-red-800/40 text-[11px] text-red-300 font-medium">
                  Red Flag Spotted: "Tap Pay" always debits money. PIN is never required to receive refunds.
                </div>
              </div>

              {/* Quick interactive scan bar */}
              <div className="mt-4 pt-3 flex items-center justify-between text-xs">
                <span className="text-slate-300 text-[11px]">Have an unverified SMS or call?</span>
                <button
                  onClick={openScanner}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  Analyze with AI
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FRAUD STATISTICS STRIP */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Financial Fraud Threat Intelligence</h2>
            <p className="text-xs text-slate-500">Real-time aggregated indicators across national payment networks</p>
          </div>
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start">
            <button
              onClick={() => setActiveStatTab('india')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeStatTab === 'india'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              India Cyber Stats
            </button>
            <button
              onClick={() => setActiveStatTab('global')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeStatTab === 'global'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Global Analytics
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <div className="text-[11px] font-semibold text-slate-500">Losses Prevented</div>
            <div className="text-2xl font-extrabold text-blue-600">
              {activeStatTab === 'india' ? GLOBAL_FRAUD_STATS.totalLossPreventedINR : GLOBAL_FRAUD_STATS.totalLossPreventedUSD}
            </div>
            <div className="text-[10px] text-emerald-600 font-medium">Through early intervention</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <div className="text-[11px] font-semibold text-slate-500">Citizens & Students Trained</div>
            <div className="text-2xl font-extrabold text-slate-900">{GLOBAL_FRAUD_STATS.peopleTrainedCount}</div>
            <div className="text-[10px] text-blue-600 font-medium">Across 18 States & 320 Campuses</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <div className="text-[11px] font-semibold text-slate-500">Most Common Vector</div>
            <div className="text-sm font-bold text-slate-900 truncate" title={GLOBAL_FRAUD_STATS.mostCommonScam}>
              {GLOBAL_FRAUD_STATS.mostCommonScam}
            </div>
            <div className="text-[10px] text-amber-600 font-medium">41% of reported initial scams</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
            <div className="text-[11px] font-semibold text-slate-500">Trending High Risk</div>
            <div className="text-sm font-bold text-red-600 truncate" title={GLOBAL_FRAUD_STATS.trendingScam}>
              {GLOBAL_FRAUD_STATS.trendingScam}
            </div>
            <div className="text-[10px] text-red-500 font-medium">+140% spike in Q3 2026</div>
          </div>
        </div>
      </section>

      {/* 3. FRAUD AWARENESS SCORE & CATEGORY RADAR BREAKDOWN */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Circular Score Visualizer */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Fraud Awareness Score</h3>
              <p className="text-xs text-slate-500">Calculated across 8 threat dimensions</p>
            </div>
            <button
              onClick={() => setActiveTab('assessments')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Recalibrate
            </button>
          </div>

          <div className="my-6 flex flex-col items-center justify-center">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="88"
                  cy="88"
                  r={radius}
                  stroke="#e2e8f0"
                  strokeWidth="12"
                  fill="transparent"
                />
                <circle
                  cx="88"
                  cy="88"
                  r={radius}
                  stroke="#2563eb"
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                  {user.overallScore}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">out of 100</span>
                <span className="mt-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  {user.riskRating}
                </span>
              </div>
            </div>

            <div className="text-center mt-3 space-y-1">
              <div className="text-xs font-bold text-slate-900">
                Level {user.level} · {user.title}
              </div>
              <p className="text-[11px] text-slate-500 max-w-xs">
                You have passed {user.completedSimulationIds.length} of 15 simulations. Complete 2 more to qualify for Cyber Guardian Certification.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('assessments')}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>Take Diagnostic Assessment</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>

        {/* Category Breakdown Matrix */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Category Competency Breakdown</h3>
                <p className="text-xs text-slate-500">Your defense strength against specific attack vectors</p>
              </div>
              <span className="text-xs font-semibold text-slate-400">Real-time evaluation</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div
                    key={cat.name}
                    className="p-3 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-bold text-slate-800">{cat.name}</span>
                      </div>
                      <span className="text-xs font-bold text-blue-600">{cat.score}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${cat.score}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 truncate">{cat.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Weakest Vector: <strong>Investment Scam (75%)</strong></span>
            <button
              onClick={() => setActiveTab('simulations')}
              className="text-blue-600 font-semibold hover:underline"
            >
              Train Weak Vectors
            </button>
          </div>
        </div>
      </section>

      {/* 4. QUICK ACTION CARDS */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Interactive Training Hubs</h2>
          <p className="text-xs text-slate-500">Choose your preferred learning modality</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => setActiveTab('simulations')}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-400 hover:shadow-md transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Zap className="w-5 h-5" />
            </div>
            <div className="font-bold text-slate-900 text-xs">Simulations</div>
            <div className="text-[10px] text-slate-400">15 Interactive cases</div>
          </button>

          <button
            onClick={() => setActiveTab('ai-chat')}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-400 hover:shadow-md transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <BotMessageSquare className="w-5 h-5" />
            </div>
            <div className="font-bold text-slate-900 text-xs">AI Scam Chat</div>
            <div className="text-[10px] text-slate-400">Chat with FraudBot</div>
          </button>

          <button
            onClick={() => setActiveTab('voice-sim')}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-400 hover:shadow-md transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div className="font-bold text-slate-900 text-xs">Voice Simulator</div>
            <div className="text-[10px] text-slate-400">Simulated phone calls</div>
          </button>

          <button
            onClick={() => setActiveTab('sms-sim')}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-purple-400 hover:shadow-md transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="font-bold text-slate-900 text-xs">SMS Simulator</div>
            <div className="text-[10px] text-slate-400">Inbox triage test</div>
          </button>

          <button
            onClick={() => setActiveTab('learning-path')}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-orange-400 hover:shadow-md transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-3 group-hover:bg-orange-600 group-hover:text-white transition-colors">
              <Compass className="w-5 h-5" />
            </div>
            <div className="font-bold text-slate-900 text-xs">Learning Journey</div>
            <div className="text-[10px] text-slate-400">Duolingo-style XP</div>
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-amber-400 hover:shadow-md transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div className="font-bold text-slate-900 text-xs">Certificates</div>
            <div className="text-[10px] text-slate-400">Verifiable credentials</div>
          </button>
        </div>
      </section>

      {/* 5. FEATURED SCAM SIMULATIONS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Essential Scenarios</h2>
            <p className="text-xs text-slate-500">Master high-frequency fraud patterns</p>
          </div>
          <button
            onClick={() => setActiveTab('simulations')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            Explore all 15
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredSimulations.map((sim) => {
            const isDone = user.completedSimulationIds.includes(sim.id);
            return (
              <div
                key={sim.id}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-blue-600">{sim.category}</span>
                    <span className="text-[11px]">{sim.estimatedMinutes} mins</span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm leading-snug">
                    {sim.title}
                  </h4>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {sim.tagline}
                  </p>

                  <div className="text-[11px] text-slate-400 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="font-semibold text-slate-600">Impact: </span>
                    {sim.victimLossStat}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className={`text-[11px] font-semibold ${isDone ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {isDone ? '✓ Completed' : 'Unattempted'}
                  </span>
                  <button
                    onClick={() => openSimulation(sim)}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>{isDone ? 'Replay' : 'Simulate'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. FRAUD NEWS HIGHLIGHTS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Recent Fraud Bulletins</h2>
            <p className="text-xs text-slate-500">Forensic case studies verified by cybercrime desks</p>
          </div>
          <button
            onClick={() => setActiveTab('news')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View News Center
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trendingNews.map((news) => (
            <div
              key={news.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-bold text-red-600 uppercase tracking-wider">{news.category}</span>
                  <span>{news.location} · {news.date}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm leading-snug">
                  {news.headline}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2">
                  {news.summary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">
                  Loss: {news.estimatedLoss}
                </span>
                <button
                  onClick={() => openNews(news)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  Analyze Case Study
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
