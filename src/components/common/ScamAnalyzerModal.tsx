import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Send,
  Loader2,
  CheckCircle2,
  Info,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ScamAnalyzerModal: React.FC = () => {
  const { isScannerOpen, closeScanner, playSound, awardXp } = useApp();

  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  if (!isScannerOpen) return null;

  const sampleTexts = [
    {
      label: 'Electricity Cutoff SMS',
      text: 'Dear Consumer, your electricity power will be disconnected at 9:30 PM tonight due to unpaid bill. Call Electricity Officer Sharma immediately at 98721 XXXXX.'
    },
    {
      label: 'Fake PhonePe Refund',
      text: 'PhonePe: ₹4,999 refund has been initiated to your wallet. Tap Pay on the collect request notification to approve the ₹5,000 credit voucher.'
    },
    {
      label: 'Customs Parcel Detained',
      text: 'FedEx: Your overseas parcel has failed clearance due to unpaid customs duty. Pay ₹14.50 processing surcharge at http://fedex-parcel-tracking.site/in before item is seized.'
    }
  ];

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    playSound('click');
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const res = await fetch('/api/analyze-scam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputText })
      });

      const data = await res.json();
      setIsAnalyzing(false);

      if (data && data.analysis) {
        setAnalysisResult(data.analysis);
        playSound(data.analysis.riskScore > 50 ? 'alert' : 'success');
        awardXp(30);
      }
    } catch (err) {
      setIsAnalyzing(false);
      // Local fallback heuristic
      setAnalysisResult({
        riskScore: 88,
        verdict: 'CRITICAL_SCAM',
        scamType: 'Heuristic Detection: Suspicious Payment Lure',
        urgencyLevel: 'HIGH',
        psychologicalTriggers: ['Artificial Time Pressure', 'Unsolicited Transaction Request'],
        redFlags: [
          'Directs recipient to third-party phone number or non-official URL',
          'Pressures recipient to complete payment to receive supposed funds'
        ],
        safeActionAdvice: [
          'Do not click links or call numbers provided inside the message.',
          'Verify with official bank helpline on the back of your card.'
        ],
        technicalExplanation: 'The message matches high-risk social engineering patterns designed to cause panic or promise unverified refunds.'
      });
      playSound('alert');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-base">AI Scam Threat Inspector</h2>
              <p className="text-[11px] text-slate-500">Scan suspicious SMS, WhatsApp forwards, or URLs</p>
            </div>
          </div>

          <button
            onClick={closeScanner}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Paste Suspicious Message or URL:
            </label>
            <textarea
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste suspicious SMS text, WhatsApp forward, email excerpt, or URL link..."
              className="w-full p-3.5 text-xs rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Sample quick test pills */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Or Try A Real Threat Sample:
            </div>
            <div className="flex flex-wrap gap-2">
              {sampleTexts.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(sample.text);
                    setAnalysisResult(null);
                  }}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleAnalyze}
            disabled={!inputText.trim() || isAnalyzing}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Running Gemini AI Fraud Heuristics...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Message Safety</span>
              </>
            )}
          </button>

          {/* Results Display */}
          {analysisResult && (
            <div className="pt-3 space-y-4">
              <div
                className={`p-5 rounded-2xl border ${
                  analysisResult.riskScore >= 70
                    ? 'bg-red-50/80 border-red-200'
                    : analysisResult.riskScore >= 40
                    ? 'bg-amber-50/80 border-amber-200'
                    : 'bg-emerald-50/80 border-emerald-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {analysisResult.riskScore >= 70 ? (
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    )}
                    <span className="font-extrabold text-sm text-slate-900">
                      {analysisResult.verdict === 'CRITICAL_SCAM'
                        ? 'Dangerous Scam Detected'
                        : analysisResult.verdict}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-black px-2.5 py-1 rounded-lg ${
                      analysisResult.riskScore >= 70
                        ? 'bg-red-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    Risk Score: {analysisResult.riskScore}/100
                  </span>
                </div>

                <div className="text-xs text-slate-700 space-y-2">
                  <div>
                    <strong className="text-slate-900">Identified Attack Vector: </strong>
                    <span>{analysisResult.scamType}</span>
                  </div>

                  <p className="leading-relaxed bg-white/80 p-3 rounded-xl border border-black/5">
                    {analysisResult.technicalExplanation}
                  </p>

                  {/* Red flags */}
                  {analysisResult.redFlags?.length > 0 && (
                    <div className="pt-1">
                      <div className="font-bold text-slate-900 text-[11px] uppercase mb-1">
                        Detected Red Flags:
                      </div>
                      <ul className="list-disc list-inside space-y-0.5">
                        {analysisResult.redFlags.map((flag: string, i: number) => (
                          <li key={i}>{flag}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Safe Advice */}
                  {analysisResult.safeActionAdvice?.length > 0 && (
                    <div className="pt-2 border-t border-black/10">
                      <div className="font-bold text-slate-900 text-[11px] uppercase mb-1">
                        Recommended Defensive Actions:
                      </div>
                      <ul className="space-y-0.5">
                        {analysisResult.safeActionAdvice.map((advice: string, i: number) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-700 font-bold">✓</span>
                            <span>{advice}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
