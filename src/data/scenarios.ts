import { Scenario, Badge } from '../types/game';

export const scenarios: Scenario[] = [
  {
    id: 'grandma-scam',
    title: 'Grandma Gift Card Scam',
    emoji: '👵',
    difficulty: 'easy',
    skill: 'Spot emotional manipulation',
    description: 'Someone claiming to be family needs urgent help',
    messages: [
      {
        text: "Hi sweetheart 💕\nI'm stuck at the store and my card isn't working.\nCan you send me a gift card code real quick?",
        sender: 'scammer',
      },
    ],
    actions: [
      {
        id: 'send-code',
        label: 'Send Code',
        isCorrect: false,
      },
      {
        id: 'verify',
        label: 'Verify First',
        isCorrect: true,
      },
      {
        id: 'ask-question',
        label: 'Ask a Question',
        isCorrect: true,
      },
    ],
    correctFeedback: "Nice catch! 🎯\nScammers often pretend to be family to rush you.",
    wrongFeedback: "Good try! This is a common trick.",
    scamSignals: [
      'Creates urgency ("right now")',
      'Asks for gift cards (big red flag!)',
      'Uses emotional pressure',
      'No way to verify it\'s really them',
    ],
    xpReward: 50,
    badgeId: 'verifier',
  },
  {
    id: 'bank-alert',
    title: 'Bank Account Alert Call',
    emoji: '📞',
    difficulty: 'medium',
    skill: 'Recognize fake authority',
    description: 'A "bank representative" calls about suspicious activity',
    messages: [
      {
        text: "🔔 URGENT: Security Alert",
        sender: 'system',
      },
      {
        text: "Hello, this is your bank's fraud department. We detected suspicious activity on your account. To secure it, please verify your account number and the code we just sent you.",
        sender: 'scammer',
        delay: 500,
      },
    ],
    actions: [
      {
        id: 'give-info',
        label: 'Share Account Info',
        isCorrect: false,
      },
      {
        id: 'hang-up',
        label: 'Hang Up & Call Bank',
        isCorrect: true,
      },
      {
        id: 'ignore',
        label: 'Ignore the Call',
        isCorrect: true,
      },
    ],
    correctFeedback: "Perfect! 🛡️\nReal banks never call asking for codes or account numbers.",
    wrongFeedback: "This one's tricky! Real banks don't call asking for your info.",
    scamSignals: [
      'Unexpected call claiming urgency',
      'Asks for private information',
      'Pressure to act immediately',
      'Real banks don\'t ask for codes over phone',
    ],
    xpReward: 75,
    badgeId: 'pause-master',
  },
  {
    id: 'overpayment',
    title: 'Overpayment Refund Trap',
    emoji: '💸',
    difficulty: 'medium',
    skill: 'Detect payment tricks',
    description: 'Someone says they paid you too much and wants money back',
    messages: [
      {
        text: "Hi! I accidentally sent you $500 instead of $50 for the item you're selling. Can you please send back the extra $450? I really need it!",
        sender: 'scammer',
      },
    ],
    actions: [
      {
        id: 'send-money',
        label: 'Send Refund',
        isCorrect: false,
      },
      {
        id: 'wait-verify',
        label: 'Wait for Payment to Clear',
        isCorrect: true,
      },
      {
        id: 'contact-platform',
        label: 'Report to Platform',
        isCorrect: true,
      },
    ],
    correctFeedback: "Smart thinking! 🧠\nOverpayment scams use fake payments that bounce later.",
    wrongFeedback: "Close call! The original payment was probably fake.",
    scamSignals: [
      'Overpayment "mistake"',
      'Pressure to send money quickly',
      'Payment might not be real',
      'Common on selling platforms',
    ],
    xpReward: 75,
    badgeId: 'smart-saver',
  },
];

export const badges: Badge[] = [
  {
    id: 'verifier',
    name: 'Verifier',
    emoji: '🕵️',
    description: 'Always checks before acting',
  },
  {
    id: 'pause-master',
    name: 'Pause Master',
    emoji: '🛑',
    description: 'Masters the art of slowing down',
  },
  {
    id: 'smart-saver',
    name: 'Smart Saver',
    emoji: '🧠',
    description: 'Protects money from tricks',
  },
  {
    id: 'scam-spotter',
    name: 'Scam Spotter',
    emoji: '👁️',
    description: 'Completed 3 scenarios',
  },
];
