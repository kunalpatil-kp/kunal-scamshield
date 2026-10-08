export type NavigationTab = 
  | 'dashboard'
  | 'simulations'
  | 'ai-chat'
  | 'voice-sim'
  | 'sms-sim'
  | 'whatsapp-sim'
  | 'news'
  | 'learning-hub'
  | 'learning-path'
  | 'heatmap'
  | 'assessments'
  | 'achievements'
  | 'leaderboard'
  | 'certificates'
  | 'profile'
  | 'settings';

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  streakDays: number;
  overallScore: number; // 0 - 100
  riskRating: 'Very Low Risk' | 'Low Risk' | 'Moderate Risk' | 'High Risk';
  title: string;
  collegeOrOrg: string;
  city: string;
  completedSimulationIds: string[];
  earnedCertificateIds: string[];
  unlockedAchievementIds: string[];
  categoryScores: {
    otp: number;
    qr: number;
    upi: number;
    phishing: number;
    kyc: number;
    voice: number;
    investment: number;
    socialEngineering: number;
  };
}

export type ScamCategory = 
  | 'OTP Fraud'
  | 'Customer Support'
  | 'KYC Scam'
  | 'QR Code Scam'
  | 'Phishing Link'
  | 'UPI Collect'
  | 'Investment Fraud'
  | 'Deepfake & Voice'
  | 'WhatsApp Scam'
  | 'Instant Loan'
  | 'Refund Scam'
  | 'Remote Access'
  | 'Fake Govt Scheme'
  | 'Credit Card CVV'
  | 'Social Engineering';

export interface SimulationStep {
  id: string;
  prompt: string;
  contextNarrative: string;
  screenType: 'whatsapp' | 'sms' | 'upi_app' | 'bank_portal' | 'phone_call' | 'qr_scanner' | 'generic';
  screenMockupData?: {
    sender?: string;
    avatar?: string;
    messageText?: string;
    amount?: string;
    url?: string;
    appBrand?: string;
    qrData?: string;
    attachmentName?: string;
  };
  options: {
    id: string;
    text: string;
    isSafe: boolean;
    explanation: string;
    redFlagsDiscovered: string[];
    xpEarned: number;
  }[];
}

export interface SimulationScenario {
  id: string;
  title: string;
  category: ScamCategory;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  estimatedMinutes: number;
  tagline: string;
  realWorldContext: string;
  iconName: string;
  steps: SimulationStep[];
  learningTakeaways: string[];
  victimLossStat: string;
}

export interface NewsArticle {
  id: string;
  headline: string;
  category: ScamCategory;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  location: string;
  date: string;
  estimatedLoss: string;
  readTime: string;
  summary: string;
  whatHappened: string;
  howScamWorked: string[];
  redFlags: string[];
  howToStaySafe: string[];
  relatedSimulationId?: string;
  relatedCategory: string;
  source: string;
}

export interface CourseModule {
  id: string;
  title: string;
  track: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: ScamCategory;
  durationMinutes: number;
  xpReward: number;
  description: string;
  sections: {
    heading: string;
    content: string;
    goldenRule: string;
  }[];
  quizQuestions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface LearningPathNode {
  id: string;
  title: string;
  levelNumber: number;
  category: ScamCategory;
  isUnlocked: boolean;
  isCompleted: boolean;
  xpReward: number;
  icon: string;
  description: string;
  simulationId?: string;
}

export interface AchievementItem {
  id: string;
  name: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  category: string;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  institution: string;
  xp: number;
  level: number;
  shieldBadge: string;
  streak: number;
  isCurrentUser?: boolean;
}

export interface VoiceScenario {
  id: string;
  callerName: string;
  callerTitle: string;
  organization: string;
  initialTranscript: string;
  dialogueScript: {
    callerText: string;
    options: {
      userReply: string;
      callerReaction: string;
      isSafe: boolean;
      points: number;
      feedback: string;
      detectedFlags: string[];
    }[];
  }[];
  summaryAdvice: string;
}

export interface SMSItem {
  id: string;
  senderId: string;
  header: string;
  timestamp: string;
  body: string;
  isScam: boolean;
  category: ScamCategory;
  redFlags: string[];
  safeExplanation: string;
}

export interface HeatmapStateData {
  stateId: string;
  stateName: string;
  reportedCasesCount: number;
  topScamType: ScamCategory;
  riskSeverity: 'Critical Hotspot' | 'High Alert' | 'Moderate' | 'Low';
  avgVictimLoss: string;
  growthRate: string;
}

export interface CertificateData {
  id: string;
  name: string;
  credentialCode: string;
  issueDate: string;
  grade: string;
  scorePercent: number;
  levelTitle: string;
}
