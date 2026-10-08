/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopNav } from './components/layout/TopNav';
import { HomeDashboard } from './components/dashboard/HomeDashboard';
import { FraudSimulationsList } from './components/simulations/FraudSimulationsList';
import { InteractiveSimulationModal } from './components/simulations/InteractiveSimulationModal';
import { AIScammerChat } from './components/scammer-chat/AIScammerChat';
import { VoiceScamSimulator } from './components/voice-simulator/VoiceScamSimulator';
import { SMSScamSimulator } from './components/sms-simulator/SMSScamSimulator';
import { WhatsAppScamSimulator } from './components/whatsapp-simulator/WhatsAppScamSimulator';
import { FraudNewsCenter } from './components/news/FraudNewsCenter';
import { NewsDetailModal } from './components/news/NewsDetailModal';
import { LearningHub } from './components/learning/LearningHub';
import { LearningPathJourney } from './components/learning/LearningPathJourney';
import { FraudHeatmap } from './components/heatmap/FraudHeatmap';
import { FraudAssessmentQuiz } from './components/assessments/FraudAssessmentQuiz';
import { AchievementsView } from './components/achievements/AchievementsView';
import { LeaderboardView } from './components/leaderboard/LeaderboardView';
import { CertificatesView } from './components/certificates/CertificatesView';
import { ProfileView } from './components/profile/ProfileView';
import { SettingsView } from './components/settings/SettingsView';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { ScamAnalyzerModal } from './components/common/ScamAnalyzerModal';
import { Shield, PhoneCall, ExternalLink } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, activeSimulation, closeSimulation, activeNews, closeNews } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <HomeDashboard />;
      case 'simulations':
        return <FraudSimulationsList />;
      case 'ai-chat':
        return <AIScammerChat />;
      case 'voice-sim':
        return <VoiceScamSimulator />;
      case 'sms-sim':
        return <SMSScamSimulator />;
      case 'whatsapp-sim':
        return <WhatsAppScamSimulator />;
      case 'news':
        return <FraudNewsCenter />;
      case 'learning-hub':
        return <LearningHub />;
      case 'learning-path':
        return <LearningPathJourney />;
      case 'heatmap':
        return <FraudHeatmap />;
      case 'assessments':
        return <FraudAssessmentQuiz />;
      case 'achievements':
        return <AchievementsView />;
      case 'leaderboard':
        return <LeaderboardView />;
      case 'certificates':
        return <CertificatesView />;
      case 'profile':
        return <ProfileView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <HomeDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col">
        {/* Sticky Top Navigation */}
        <TopNav onToggleMobileMenu={() => setIsMobileMenuOpen(true)} />

        {/* Dynamic Route View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>

        {/* Global Footer & Emergency Hotline Strip */}
        <footer className="border-t border-slate-200/80 bg-white py-6 px-4 sm:px-8 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <span className="font-extrabold text-slate-900">ScamShield AI</span>
              <span>· Learn From Scams Before Scammers Teach You</span>
            </div>

            {/* Emergency Hotline Alert */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-700 font-bold">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Victim of Fraud? Dial 1930 (National Cyber Crime Helpline)</span>
            </div>

            <div className="flex items-center gap-3 text-[11px]">
              <span>cybercrime.gov.in</span>
              <span>·</span>
              <span>NPCI UPI Safety</span>
              <span>·</span>
              <span>RBI Awareness</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Global Modals */}
      {activeSimulation && (
        <InteractiveSimulationModal
          simulation={activeSimulation}
          onClose={closeSimulation}
        />
      )}

      {activeNews && (
        <NewsDetailModal
          article={activeNews}
          onClose={closeNews}
        />
      )}

      <GlobalSearchModal />
      <ScamAnalyzerModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
