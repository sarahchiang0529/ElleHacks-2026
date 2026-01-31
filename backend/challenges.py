# Challenge data for the financial literacy game
# Each level has a question with two choices - one correct, one wrong

CHALLENGES = {
    1: {
        "level": 1,
        "location": "Bank",
        "topic": "Delayed Gratification",
        "question": "You saved $50 for an $80 skateboard. Your favorite game is on sale for $30. What do you do?",
        "choices": {
            "A": "Keep saving for the skateboard",
            "B": "Buy the game now"
        },
        "correct_choice": "A",
        "feedback": {
            "correct": "Great job! Staying focused on your goal will help you get the skateboard faster. Delayed gratification pays off!",
            "wrong": "Oops! If you spend $30 on the game, you'll only have $20 left and be further from your skateboard goal."
        }
    },
    2: {
        "level": 2,
        "location": "Store",
        "topic": "Needs vs Wants",
        "question": "Your backpack broke. Basic backpack: $20. Cool limited edition: $50. Your friend's birthday is next month (need $30 for gift). What do you buy?",
        "choices": {
            "A": "Buy basic backpack ($20)",
            "B": "Buy limited edition ($50)"
        },
        "correct_choice": "A",
        "feedback": {
            "correct": "Smart choice! The basic backpack meets your need and leaves you $30 for your friend's gift. You balanced needs and wants perfectly!",
            "wrong": "Hmm, the limited edition looks cool but costs $50. Now you can't afford your friend's birthday gift. Needs should come before wants!"
        }
    },
    3: {
        "level": 3,
        "location": "Phone",
        "topic": "Scam Detection",
        "question": "You got a text: 'WIN FREE Nintendo Switch! Click link and enter parent's credit card.' What do you do?",
        "choices": {
            "A": "Delete and tell parent",
            "B": "Click link and enter card info"
        },
        "correct_choice": "A",
        "feedback": {
            "correct": "Excellent! You recognized a scam! Real prizes never ask for credit card info. Always tell a trusted adult about suspicious messages.",
            "wrong": "Danger! This is a scam! Never click unknown links or share credit card info. Scammers try to steal money this way."
        }
    },
    4: {
        "level": 4,
        "location": "Friend",
        "topic": "Lending Money",
        "question": "Friend asks to borrow $15. You have $40 and concert tickets go on sale in 5 days ($50). What do you do?",
        "choices": {
            "A": "Lend $15 immediately",
            "B": "Say no and explain your concert goal"
        },
        "correct_choice": "B",
        "feedback": {
            "correct": "Good decision! It's okay to say no when lending money conflicts with your goals. True friends will understand. You're protecting your concert plans!",
            "wrong": "Uh oh! If you lend $15, you'll only have $25. You won't have enough for the $50 concert tickets in 5 days!"
        }
    },
    5: {
        "level": 5,
        "location": "School",
        "topic": "Peer Pressure",
        "question": "Everyone's buying $90 sneakers. You're saving $100 for art tablet ($120 total needed). What do you do?",
        "choices": {
            "A": "Buy sneakers to fit in",
            "B": "Stick to art tablet goal"
        },
        "correct_choice": "B",
        "feedback": {
            "correct": "Amazing! You stayed true to YOUR goals despite peer pressure. The art tablet will help you create for years. That's real financial wisdom!",
            "wrong": "The sneakers might look cool, but you just spent $90 of your art tablet savings. Now you're back to only $10 saved."
        }
    }
}

def get_challenge(level: int) -> dict | None:
    """Get challenge data for a specific level (without correct answer)"""
    if level not in CHALLENGES:
        return None

    challenge = CHALLENGES[level].copy()
    # Remove correct_choice and feedback from public response
    return {
        "level": challenge["level"],
        "location": challenge["location"],
        "topic": challenge["topic"],
        "question": challenge["question"],
        "choices": challenge["choices"]
    }

def check_answer(level: int, choice: str) -> dict | None:
    """Check if the answer is correct and return feedback"""
    if level not in CHALLENGES:
        return None

    challenge = CHALLENGES[level]
    choice = choice.upper()

    if choice not in ["A", "B"]:
        return None

    is_correct = choice == challenge["correct_choice"]

    return {
        "correct": is_correct,
        "feedback": challenge["feedback"]["correct"] if is_correct else challenge["feedback"]["wrong"]
    }

def get_total_levels() -> int:
    """Return total number of levels"""
    return len(CHALLENGES)
