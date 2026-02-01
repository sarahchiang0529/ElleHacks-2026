// Custom hooks for game API integration
import { useState, useEffect, useCallback } from 'react';
import {
  fetchUserProgress,
  fetchAllChallenges,
  submitAnswer,
  resetUserProgress,
  Challenge,
  UserProgress,
  AnswerResult,
  Choice,
} from '../services/api';

// Generate or retrieve user ID from localStorage
function getUserId(): string {
  const storageKey = 'trusttown_user_id';
  let userId = localStorage.getItem(storageKey);
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(storageKey, userId);
  }
  return userId;
}

export interface GameState {
  userId: string;
  challenges: Challenge[];
  userProgress: UserProgress | null;
  currentChallenge: Challenge | null;
  isLoading: boolean;
  error: string | null;
}

export interface GameActions {
  submitChoice: (choice: Choice) => Promise<AnswerResult | null>;
  resetGame: () => Promise<void>;
  refreshProgress: () => Promise<void>;
}

export function useGameApi(): GameState & GameActions {
  const [userId] = useState(getUserId);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get current challenge based on user progress
  const currentChallenge = userProgress && challenges.length > 0
    ? challenges.find(c => c.level === userProgress.current_level) || null
    : null;

  // Load initial data
  useEffect(() => {
    async function loadGameData() {
      setIsLoading(true);
      setError(null);

      try {
        const [challengesData, progressData] = await Promise.all([
          fetchAllChallenges(),
          fetchUserProgress(userId),
        ]);

        setChallenges(challengesData.challenges);
        setUserProgress(progressData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load game data');
        console.error('Failed to load game data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadGameData();
  }, [userId]);

  // Submit a choice (trust, question, or reject)
  const submitChoice = useCallback(async (choice: Choice): Promise<AnswerResult | null> => {
    if (!userProgress || !currentChallenge) {
      setError('No active challenge');
      return null;
    }

    try {
      const result = await submitAnswer(userId, currentChallenge.level, choice);

      // Update local progress state
      setUserProgress(prev => prev ? {
        ...prev,
        current_level: result.new_level,
        total_score: result.total_score,
        completed_levels: result.completed_levels,
      } : null);

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit answer';
      setError(errorMessage);
      console.error('Failed to submit answer:', err);
      return null;
    }
  }, [userId, userProgress, currentChallenge]);

  // Reset game progress
  const resetGame = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const progressData = await resetUserProgress(userId);
      setUserProgress({
        ...progressData,
        total_levels: challenges.length,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset game');
      console.error('Failed to reset game:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId, challenges.length]);

  // Refresh progress from server
  const refreshProgress = useCallback(async () => {
    try {
      const progressData = await fetchUserProgress(userId);
      setUserProgress(progressData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh progress');
      console.error('Failed to refresh progress:', err);
    }
  }, [userId]);

  return {
    userId,
    challenges,
    userProgress,
    currentChallenge,
    isLoading,
    error,
    submitChoice,
    resetGame,
    refreshProgress,
  };
}
