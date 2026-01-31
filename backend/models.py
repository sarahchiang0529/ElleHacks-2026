# In-memory user progress storage
# For demo purposes - replace with database for production

from challenges import get_total_levels

# In-memory storage for user progress
users: dict[str, dict] = {}

def get_user(user_id: str) -> dict:
    """Get user progress, create new user if doesn't exist"""
    if user_id not in users:
        users[user_id] = {
            "user_id": user_id,
            "current_level": 1,
            "total_score": 0,
            "completed_levels": []
        }
    return users[user_id]

def update_user_progress(user_id: str, correct: bool, level: int) -> dict:
    """Update user progress after answering a question"""
    user = get_user(user_id)

    if correct:
        # Only update if answering current level
        if level == user["current_level"]:
            user["total_score"] += 10
            user["completed_levels"].append(level)

            # Move to next level if not at max
            if user["current_level"] < get_total_levels():
                user["current_level"] += 1

    return user

def reset_user(user_id: str) -> dict:
    """Reset user progress to initial state"""
    users[user_id] = {
        "user_id": user_id,
        "current_level": 1,
        "total_score": 0,
        "completed_levels": []
    }
    return users[user_id]

def can_access_level(user_id: str, level: int) -> bool:
    """Check if user can access a specific level"""
    user = get_user(user_id)
    return level <= user["current_level"]
