export type Difficulty = 'easy' | 'medium' | 'hard';

export interface ScenarioAction {
  id: string;
  label: string;
  isCorrect: boolean;
  feedback?: string;
}

export interface ScenarioMessage {
  text: string;
  sender: 'scammer' | 'system';
  delay?: number;
}

export interface Scenario {
  id: string;
  title: string;
  emoji: string;
  difficulty: Difficulty;
  skill: string;
  description: string;
  messages: ScenarioMessage[];
  actions: ScenarioAction[];
  correctFeedback: string;
  wrongFeedback: string;
  scamSignals: string[];
  xpReward: number;
  badgeId?: string;
}

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

export interface GameState {
  xp: number;
  completedScenarios: string[];
  badges: string[];
  soundOn: boolean;
  currentScenario: string | null;
}
