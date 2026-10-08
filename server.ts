import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Server-side Gemini initialization if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Endpoint: Analyze any suspicious SMS, WhatsApp message, Email, or UPI request
app.post('/api/analyze-scam', async (req, res) => {
  try {
    const { message, scamType } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message content is required' });
    }

    if (ai) {
      try {
        const prompt = `You are ScamShield AI, an authoritative financial cybersecurity and fraud detection intelligence engine.
Analyze the following user-submitted message/text for fraud risk, social engineering cues, and red flags.
Target domain: Digital banking, UPI, KYC, PhonePe/GooglePay/Paytm, SMS phishing, or WhatsApp scams.

Message:
"${message}"
Context/Type hint: ${scamType || 'Unknown'}

Respond strictly in valid JSON matching this structure:
{
  "riskScore": number (0 to 100, where 100 is critical scam),
  "verdict": "SAFE" | "SUSPICIOUS" | "CRITICAL_SCAM",
  "scamType": string (e.g. "KYC Suspension Threat", "UPI Collect Request Fraud", "Fake Lottery Lure", etc.),
  "urgencyLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "psychologicalTriggers": ["Fear of account lock", "Greed/Free money", "Authority impersonation", etc.],
  "redFlags": [string, string, string],
  "safeActionAdvice": [string, string],
  "technicalExplanation": string (2-3 sentences explaining why this is fraudulent or safe)
}`;

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API timeout')), 4000)
        );

        const geminiCall = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const response: any = await Promise.race([geminiCall, timeoutPromise]);

        const text = response.text;
        if (text) {
          const parsed = JSON.parse(text);
          return res.json({ success: true, analysis: parsed });
        }
      } catch (geminiError) {
        console.error('Gemini API analysis fallback triggered:', geminiError);
      }
    }

    // Heuristic Fallback Engine
    const lower = message.toLowerCase();
    const hasUrgency = /urgent|immediately|within 24 hours|blocked|suspended|action required|expire/i.test(lower);
    const hasFinancialLure = /refund|won|lottery|cashback|bonus|earn daily|double your money|investment/i.test(lower);
    const hasSuspiciousLink = /http|bit\.ly|tinyurl|\.apk|\.xyz|\.top|ngrok|update-kyc|bank-verify/i.test(lower);
    const hasCredentialDemand = /otp|pin|cvv|password|share screen|anydesk|teamviewer/i.test(lower);

    let calculatedScore = 20;
    const detectedTriggers: string[] = [];
    const detectedFlags: string[] = [];

    if (hasUrgency) {
      calculatedScore += 25;
      detectedTriggers.push('Artificial Urgency & Fear manipulation');
      detectedFlags.push('Pressuring recipient to act without verifying with official bank');
    }
    if (hasSuspiciousLink) {
      calculatedScore += 30;
      detectedTriggers.push('Deceptive Phishing URL or malicious download');
      detectedFlags.push('Non-official domain or link masked by URL shortener');
    }
    if (hasCredentialDemand) {
      calculatedScore += 35;
      detectedTriggers.push('High-risk Credential & Screen Sharing Harvesting');
      detectedFlags.push('Legitimate financial institutions and NPCI never request OTP, PIN, or AnyDesk installations');
    }
    if (hasFinancialLure) {
      calculatedScore += 20;
      detectedTriggers.push('Unrealistic financial gain / Baiting');
      detectedFlags.push('Unsolicited cashback or prize scheme requiring a fee or UPI click');
    }

    calculatedScore = Math.min(99, Math.max(15, calculatedScore));

    const verdict = calculatedScore >= 75 ? 'CRITICAL_SCAM' : calculatedScore >= 45 ? 'SUSPICIOUS' : 'SAFE';

    return res.json({
      success: true,
      analysis: {
        riskScore: calculatedScore,
        verdict,
        scamType: scamType || (hasCredentialDemand ? 'Credential / OTP Harvesting' : hasUrgency ? 'Account Suspension Phishing' : 'Suspicious Solicitation'),
        urgencyLevel: hasUrgency ? 'HIGH' : 'MEDIUM',
        psychologicalTriggers: detectedTriggers.length ? detectedTriggers : ['Unsolicited Contact'],
        redFlags: detectedFlags.length ? detectedFlags : ['Unknown sender without verified cryptographic sender ID'],
        safeActionAdvice: [
          'Never click unexpected links or forward OTPs to anyone.',
          'Verify directly via the bank\'s official helpline printed on your debit card.',
          'Report incident to national cyber crime portal (cybercrime.gov.in / 1930).'
        ],
        technicalExplanation: `The message exhibits ${detectedTriggers.length} classic social engineering traits. Genuine payment apps (NPCI, Google Pay, PhonePe) process refunds without demanding user PINs or OTPs.`
      }
    });
  } catch (err: any) {
    console.error('Server error in /api/analyze-scam:', err);
    res.status(500).json({ error: 'Internal server error analyzing message' });
  }
});

// Endpoint: Interactive Scammer Chat Persona
app.post('/api/chat-scammer', async (req, res) => {
  try {
    const { messages, persona } = req.body;

    const personaDescriptions: Record<string, string> = {
      'bank_kyc': 'You are impersonating an urgent State Bank / HDFC KYC Compliance Officer named "Officer Sharma". You tell the user their account will be permanently frozen within 3 hours unless they click a verification link or provide an OTP.',
      'refund_agent': 'You are impersonating PhonePe / Paytm senior refund executive "Rajesh". You insist you sent ₹4,999 refund by mistake, and ask them to click a UPI collect request or scan a QR code to complete the reversal.',
      'job_investment': 'You are an investment scam recruiter for a VIP Telegram Crypto group promising 300% weekly guaranteed returns on small initial deposits.',
      'tech_support': 'You are fake technical customer care asking the user to install AnyDesk or QuickSupport to fix a failed transaction on their Google Pay app.'
    };

    const personaPrompt = personaDescriptions[persona] || personaDescriptions['bank_kyc'];

    if (ai && Array.isArray(messages) && messages.length > 0) {
      try {
        const lastUserMsg = messages[messages.length - 1]?.content || 'Hello';
        const systemPrompt = `You are an educational fraud simulation actor in ScamShield AI.
${personaPrompt}

Goal: Roleplay realistically as a fraudster trying to trick the user into making a security mistake (e.g. sharing OTP, scanning QR, clicking link, installing AnyDesk).
Stay realistic, deceptive, but polite or urgent as scammers do.
Do NOT give real harmful exploit code or real victim info.
Return JSON strictly in this format:
{
  "scammerReply": string (the deceptive message sent to user),
  "tacticsUsed": [string, string],
  "redFlagExplanation": string (for educational hint bar),
  "dangerLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
}`;

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API timeout')), 4000)
        );

        const geminiCall = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `${systemPrompt}\n\nUser message: "${lastUserMsg}"\nContext history: ${JSON.stringify(messages.slice(-4))}`,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const geminiRes: any = await Promise.race([geminiCall, timeoutPromise]);

        const text = geminiRes.text;
        if (text) {
          const parsed = JSON.parse(text);
          return res.json({ success: true, ...parsed });
        }
      } catch (geminiChatErr) {
        console.error('Gemini chat fallback used:', geminiChatErr);
      }
    }

    // Heuristic response fallback
    const fallbackReplies: Record<string, { reply: string; tactics: string[]; redFlag: string; danger: string }[]> = {
      bank_kyc: [
        {
          reply: 'Dear Customer, your bank KYC has expired today. Your savings account & debit card are scheduled for block at 11:59 PM. Please verify immediately at https://sbi-kyc-update-portal.info or reply with 6-digit verification code.',
          tactics: ['Extreme Urgency', 'Fear of Frozen Assets', 'Spoofed Banking Domain'],
          redFlag: 'Banks never send non-standard domain links (.info/.xyz) or demand immediate OTP verification to stop account blocking.',
          danger: 'CRITICAL'
        },
        {
          reply: 'Sir, I am calling from Head Office KYC verification department. I just initiated an authorization token to your registered mobile. Read the 6 digits to me so I can keep your account active.',
          tactics: ['Authority Impersonation', 'OTP Harvesting'],
          redFlag: 'Bank officials never have access to or ask for your 6-digit OTP. OTP is strictly confidential.',
          danger: 'CRITICAL'
        }
      ],
      refund_agent: [
        {
          reply: 'Hello Sir, ₹3,500 has been credited to your PhonePe wallet by mistake from our merchant server. To accept the return or receive the compensation voucher, please approve the UPI request of ₹3,500 on your phone screen.',
          tactics: ['Reverse Psychology', 'UPI Collect Request Confusion'],
          redFlag: 'Entering UPI PIN always DEDUCTS money from your account. You NEVER enter a PIN to receive money or refunds.',
          danger: 'HIGH'
        }
      ],
      job_investment: [
        {
          reply: 'Hi! Our company provides part-time Telegram tasks. Like 3 YouTube videos, get ₹150 instantly. In Stage 2, invest ₹1,000 to earn ₹3,500 guaranteed within 20 minutes with crypto hedging!',
          tactics: ['Small Hook Bait', 'Ponzi / Task Fraud Escalation'],
          redFlag: 'Legitimate jobs do not require you to deposit your own money to unlock salaries or task bonuses.',
          danger: 'HIGH'
        }
      ],
      tech_support: [
        {
          reply: 'Sir your Google Pay server connection is experiencing sync error. Please download AnyDesk from Play Store and tell me the 9-digit address so our remote engineer can clear the pending transaction cache.',
          tactics: ['Technical Jargon', 'Remote Access Screen Hijack'],
          redFlag: 'Installing AnyDesk or TeamViewer gives complete remote control of your phone and banking apps to fraudsters.',
          danger: 'CRITICAL'
        }
      ]
    };

    const list = fallbackReplies[persona] || fallbackReplies['bank_kyc'];
    const chosen = list[Math.floor(Math.random() * list.length)];

    return res.json({
      success: true,
      scammerReply: chosen.reply,
      tacticsUsed: chosen.tactics,
      redFlagExplanation: chosen.redFlag,
      dangerLevel: chosen.danger
    });
  } catch (err: any) {
    console.error('Server error in /api/chat-scammer:', err);
    res.status(500).json({ error: 'Internal server error in scammer chat' });
  }
});

// Setup Vite middlewares in development, or serve dist in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, port: PORT, host: '0.0.0.0' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ScamShield AI Server running on port ${PORT}`);
  });
}

startServer();
