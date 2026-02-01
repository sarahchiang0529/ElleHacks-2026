// API service for backend communication

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Types matching backend response
export interface Challenge {
  level: number;
  location: string;
  topic: string;
  question: string;
  choices: {
    A: string;
    B: string;
  };
}

export interface ChallengesResponse {
  total_levels: number;
  challenges: Challenge[];
}

export interface UserProgress {
  user_id: string;
  current_level: number;
  total_score: number;
  completed_levels: number[];
  total_levels: number;
}

export interface AnswerResult {
  correct: boolean;
  new_level: number;
  message: string;
  total_score: number;
  completed_levels: number[];
}

// Get or create user ID
export function getUserId(): string {
  let userId = localStorage.getItem('finance-game-user-id');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('finance-game-user-id', userId);
  }
  return userId;
}

// API functions
export async function fetchAllChallenges(): Promise<ChallengesResponse> {
  const response = await fetch(`${API_BASE_URL}/api/challenges`);
  if (!response.ok) {
    throw new Error('Failed to fetch challenges');
  }
  return response.json();
}

export async function fetchChallenge(level: number): Promise<Challenge> {
  const response = await fetch(`${API_BASE_URL}/api/challenges/${level}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch challenge ${level}`);
  }
  return response.json();
}

export async function fetchUserProgress(userId: string): Promise<UserProgress> {
  const response = await fetch(`${API_BASE_URL}/api/user/${userId}/progress`);
  if (!response.ok) {
    throw new Error('Failed to fetch user progress');
  }
  return response.json();
}

export async function submitAnswer(
  userId: string,
  level: number,
  choice: 'A' | 'B'
): Promise<AnswerResult> {
  const response = await fetch(`${API_BASE_URL}/api/user/${userId}/answer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ level, choice }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to submit answer');
  }
  return response.json();
}

export async function resetUserProgress(userId: string): Promise<UserProgress> {
  const response = await fetch(`${API_BASE_URL}/api/user/${userId}/reset`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to reset progress');
  }
  return response.json();
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return response.ok;
  } catch {
    return false;
  }
}
