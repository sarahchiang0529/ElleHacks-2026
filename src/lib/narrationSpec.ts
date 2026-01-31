export type NarrationEventType =
  | "MOVE"
  | "ENTER_LOCATION"
  | "CHALLENGE_START"
  | "CHALLENGE_CORRECT"
  | "CHALLENGE_WRONG"
  | "LEVEL_UP";

export type LocationName = "bank" | "park" | "store" | "home" | "street";

export type NarrationEvent = {
  eventType: NarrationEventType;
  location: LocationName;
  level: number;
  streak?: number; // strack of how many correct answers in a row
};

export const fallbackNarration: Record<NarrationEventType, string[]> = {
  MOVE: [
    "Keep going. Slow down and stay curious.",
    "You are exploring. Remember, you can always pause and think."
  ],
  ENTER_LOCATION: [
    "New place, new clues. Take your time.",
    "Look around. Safe choices start with slowing down."
  ],
  CHALLENGE_START: [
    "A new message popped up. Let’s think first.",
    "Pause. Check who it is before you respond."
  ],
  CHALLENGE_CORRECT: [
    "Nice choice. You checked before trusting.",
    "Great work. You stayed calm and verified."
  ],
  CHALLENGE_WRONG: [
    "Tricky one. Next time, slow down and verify.",
    "That sounded convincing. You can always ask a trusted adult."
  ],
  LEVEL_UP: [
    "Level up! Your brain just got stronger.",
    "You leveled up. Careful thinking is your superpower."
  ]
};

export function shouldNarrate(eventType: NarrationEventType, randomValue: number): boolean {
  if (eventType === "MOVE") return randomValue < 0.25;
  return true;
}
