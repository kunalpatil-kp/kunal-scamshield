import React, { useState } from 'react';
import {
  FileCheck2,
  Download,
  Share2,
  Award,
  Shield,
  CheckCircle2,
  QrCode,
  Sparkles,
  Printer
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CERTIFICATES_DATA } from '../../data/mockData';

export const CertificatesView: React.FC = () => {
  const { user, playSound } = useApp();
  const [selectedCertIndex, setSelectedCertIndex] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  const cert = CERTIFICATES_DATA[selectedCertIndex] || CERTIFICATES_DATA[0];

  const handleDownload = () => {
    playSound('click');
    window.print();
  };

  const handleShare = () => {
    playSound('click');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `I just earned my official ${cert.name} on ScamShield AI with a score of ${cert.scorePercent}%! Verification ID: ${cert.credentialCode}`
      );
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold mb-2">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>National Verification Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Accredited Completion Certificates
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm max-w-xl">
            Verifiable credentials proving competency in payment security, digital arrest countermeasures, and social engineering defense.
          </p>
        </div>

        {/* Certificate Switcher */}
        <div className="flex items-center gap-1 p-1.5 bg-slate-100 rounded-2xl self-start md:self-auto">
          {CERTIFICATES_DATA.map((c, idx) => (
            <button
              key={c.id}
              onClick={() => setSelectedCertIndex(idx)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                selectedCertIndex === idx
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {c.name.split(' ')[1]} Specialist
            </button>
          ))}
        </div>
      </div>

      {/* Main Certificate Showcase Container */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Certificate Printable Canvas */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-white to-slate-50 border-8 border-slate-200/80 shadow-2xl relative overflow-hidden text-center space-y-8">
          {/* Subtle Guilloche pattern & watermark shield */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Certificate Header Strip */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                <Shield className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="font-extrabold text-slate-900 text-base tracking-tight">
                  ScamShield AI Academy
                </div>
                <div className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                  National Financial Cyber Defense Council
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Serial Code</div>
              <div className="font-mono text-xs font-extrabold text-blue-600">
                {cert.credentialCode}
              </div>
            </div>
          </div>

          {/* Certificate Body Text */}
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
              Certificate of Verified Competency
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 italic">
              {cert.name}
            </h2>

            <p className="text-xs text-slate-500">
              This is to certify that
            </p>

            <div className="text-2xl sm:text-3xl font-extrabold text-blue-900 border-b-2 border-slate-300 pb-2 inline-block px-8">
              {user.name}
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
              has completed rigorous interactive adversary simulations, successfully identifying high-risk social engineering vectors, fraudulent payment gateways, and synthetic audio impersonations with a score of <strong>{cert.scorePercent}%</strong>.
            </p>
          </div>

          {/* Verified Skills Strip */}
          <div className="pt-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Verified Skills & Standards:
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {cert.skillsVerified.map((sk, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-bold"
                >
                  ✓ {sk}
                </span>
              ))}
            </div>
          </div>

          {/* Signature and Verification QR Footer */}
          <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
            <div>
              <div className="text-xs text-slate-400">Date of Award</div>
              <div className="font-bold text-xs text-slate-800">{cert.issueDate}</div>
              <div className="text-[11px] text-emerald-600 font-semibold">{cert.grade}</div>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-slate-200">
              <QrCode className="w-12 h-12 text-slate-900" />
              <div className="text-[10px] text-slate-500">
                <div className="font-bold text-slate-900">Cryptographically Signed</div>
                <div>Scan QR to verify validity on registry</div>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <div className="font-serif italic text-base text-slate-800 font-bold">
                Dr. Arvind K. Swaminathan
              </div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">
                Director, Financial Defense Alliance
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={handleDownload}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all hover:scale-105"
          >
            <Download className="w-4 h-4" />
            <span>Download High-Res Certificate (PDF)</span>
          </button>

          <button
            onClick={handleShare}
            className="px-6 py-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-xs flex items-center gap-2 transition-colors"
          >
            <Share2 className="w-4 h-4 text-blue-600" />
            <span>{isCopied ? 'Verification Link Copied!' : 'Share Credential'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
