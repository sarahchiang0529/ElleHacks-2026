# Challenge data for the financial literacy game
# Each level has a question with three choices: trust, question, reject

from typing import Optional

CHALLENGES = {
    1: {
        "level": 1,
        "villager_id": 1,
        "location": "Bank",
        "topic": "Delayed Gratification",
        "question": "You saved $50 for an $80 skateboard. Your favorite game is on sale for $30. What do you do?",
        "choices": {
            "trust": "Buy the game now - it's a great deal!",
            "question": "Ask someone for advice first",
            "reject": "Keep saving for the skateboard"
        },
        "correct_choice": "reject",
        "mood": "worried",
        "feedback": {
            "correct": "Great job! Delayed gratification means waiting for bigger goals. Staying focused will help you get the skateboard faster!",
            "wrong": "The game delays your skateboard by weeks. Remember: choosing one thing means giving up another. That's opportunity cost!"
        }
    },
    2: {
        "level": 2,
        "villager_id": 2,
        "location": "Store",
        "topic": "Needs vs Wants",
        "question": "Your backpack broke. Basic backpack: $20. Cool limited edition: $50. Your friend's birthday is next month (need $30 for gift). What do you buy?",
        "choices": {
            "trust": "Buy the limited edition - it's so cool!",
            "question": "Think about it more",
            "reject": "Buy the basic backpack"
        },
        "correct_choice": "reject",
        "mood": "neutral",
        "feedback": {
            "correct": "Smart choice! The basic backpack meets your need and leaves you $30 for your friend's gift. You balanced needs and wants perfectly!",
            "wrong": "The limited edition looks cool but costs $50. Now you can't afford your friend's birthday gift. Needs should come before wants!"
        }
    },
    3: {
        "level": 3,
        "villager_id": 3,
        "location": "Phone",
        "topic": "Scam Detection",
        "question": "You got a text: 'WIN FREE Nintendo Switch! Click link and enter parent's credit card.' What do you do?",
        "choices": {
            "trust": "Click the link - free Switch!",
            "question": "Ask a parent about it",
            "reject": "Delete it - this is a scam!"
        },
        "correct_choice": "reject",
        "mood": "worried",
        "feedback": {
            "correct": "Excellent! You recognized a scam! Real prizes never ask for credit card info. Always tell a trusted adult about suspicious messages.",
            "wrong": "Danger! This is a scam! Never click unknown links or share credit card info. Scammers try to steal money this way."
        }
    },
    4: {
        "level": 4,
        "villager_id": 4,
        "location": "Friend",
        "topic": "Lending Money",
        "question": "Friend asks to borrow $15. You have $40 and concert tickets go on sale in 5 days ($50). What do you do?",
        "choices": {
            "trust": "Lend them the $15",
            "question": "Ask when they can pay back",
            "reject": "Say no and explain your concert goal"
        },
        "correct_choice": "reject",
        "mood": "neutral",
        "feedback": {
            "correct": "Smart! Financial boundaries protect your goals. Real friends understand when you're budgeting for something important!",
            "wrong": "Without that $15, you can't afford concert tickets. This is why budgeting matters - planning ahead helps you reach goals!"
        }
    },
    5: {
        "level": 5,
        "villager_id": 5,
        "location": "School",
        "topic": "Peer Pressure",
        "question": "Everyone's buying $90 sneakers. You're saving $100 for art tablet ($120 total needed). What do you do?",
        "choices": {
            "trust": "Buy the sneakers to fit in",
            "question": "Wait and think about it",
            "reject": "Keep saving for the art tablet"
        },
        "correct_choice": "reject",
        "mood": "happy",
        "feedback": {
            "correct": "Amazing! You stayed true to YOUR goals despite peer pressure. The art tablet will help you create for years. That's real financial wisdom!",
            "wrong": "Spending it all feels great now, but nothing's left for your art tablet. Smart allocation means balancing today and tomorrow!"
        }
    }
}


def get_challenge(level: int) -> Optional[dict]:
    """Get challenge data for a specific level (without correct answer)"""
    if level not in CHALLENGES:
        return None

    challenge = CHALLENGES[level].copy()
    # Remove correct_choice and feedback from public response
    return {
        "level": challenge["level"],
        "villager_id": challenge["villager_id"],
        "location": challenge["location"],
        "topic": challenge["topic"],
        "question": challenge["question"],
        "choices": challenge["choices"],
        "mood": challenge["mood"]
    }


def get_challenge_full(level: int) -> Optional[dict]:
    """Get full challenge data including correct answer (for internal use)"""
    if level not in CHALLENGES:
        return None
    return CHALLENGES[level].copy()


def check_answer(level: int, choice: str) -> Optional[dict]:
    """Check if the answer is correct and return feedback"""
    if level not in CHALLENGES:
        return None

    challenge = CHALLENGES[level]
    choice = choice.lower()

    if choice not in ["trust", "question", "reject"]:
        return None

    is_correct = choice == challenge["correct_choice"]

    return {
        "correct": is_correct,
        "feedback": challenge["feedback"]["correct"] if is_correct else challenge["feedback"]["wrong"],
        "topic": challenge["topic"]
    }


def get_total_levels() -> int:
    """Return total number of levels"""
    return len(CHALLENGES)
