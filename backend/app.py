from flask import Flask, jsonify, request
from flask_cors import CORS
import sys
import os

# 添加当前目录到路径，以便导入 challenges 和 models
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from challenges import get_challenge, check_answer, get_total_levels
from models import get_user, update_user_progress, reset_user, can_access_level

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication


@app.route("/api/user/<user_id>/progress", methods=["GET"])
def get_user_progress(user_id: str):
    """Get user's current progress"""
    user = get_user(user_id)
    return jsonify({
        "user_id": user["user_id"],
        "current_level": user["current_level"],
        "total_score": user["total_score"],
        "completed_levels": user["completed_levels"],
        "total_levels": get_total_levels()
    })


@app.route("/api/user/<user_id>/answer", methods=["POST"])
def submit_answer(user_id: str):
    """Submit an answer for a level"""
    data = request.get_json()

    # Validate input
    if not data:
        return jsonify({"error": "Request body is required"}), 400

    level = data.get("level")
    choice = data.get("choice")

    if level is None:
        return jsonify({"error": "Level is required"}), 400

    if choice is None:
        return jsonify({"error": "Choice is required"}), 400

    # Validate level exists
    if not isinstance(level, int) or level < 1 or level > get_total_levels():
        return jsonify({"error": f"Level must be between 1 and {get_total_levels()}"}), 404

    # Validate choice format
    choice = str(choice).upper()
    if choice not in ["A", "B"]:
        return jsonify({"error": "Choice must be 'A' or 'B'"}), 400

    # Check if user can access this level
    user = get_user(user_id)
    if level != user["current_level"]:
        if level < user["current_level"]:
            return jsonify({"error": "You have already completed this level"}), 403
        else:
            return jsonify({"error": "Level is locked. Complete previous levels first."}), 403

    # Check the answer
    result = check_answer(level, choice)
    if result is None:
        return jsonify({"error": "Invalid level or choice"}), 400

    # Update user progress
    updated_user = update_user_progress(user_id, result["correct"], level)

    # Build response message
    if result["correct"]:
        if updated_user["current_level"] > get_total_levels():
            message = f"{result['feedback']} Congratulations! You've completed all levels!"
        else:
            message = f"{result['feedback']} Level {level + 1} unlocked!"
    else:
        message = f"{result['feedback']} Try again!"

    return jsonify({
        "correct": result["correct"],
        "new_level": updated_user["current_level"],
        "message": message,
        "total_score": updated_user["total_score"],
        "completed_levels": updated_user["completed_levels"]
    })


@app.route("/api/user/<user_id>/reset", methods=["POST"])
def reset_progress(user_id: str):
    """Reset user progress to level 1"""
    user = reset_user(user_id)
    return jsonify({
        "message": "Progress reset successfully",
        "user_id": user["user_id"],
        "current_level": user["current_level"],
        "total_score": user["total_score"],
        "completed_levels": user["completed_levels"]
    })


@app.route("/api/challenges/<int:level>", methods=["GET"])
def get_challenge_data(level: int):
    """Get challenge data for a specific level (without correct answer)"""
    # Validate level exists
    if level < 1 or level > get_total_levels():
        return jsonify({"error": f"Level {level} does not exist. Valid levels: 1-{get_total_levels()}"}), 404

    challenge = get_challenge(level)
    if challenge is None:
        return jsonify({"error": "Challenge not found"}), 404

    return jsonify(challenge)


@app.route("/api/challenges", methods=["GET"])
def get_all_challenges():
    """Get all challenges (without correct answers) for overview"""
    challenges = []
    for level in range(1, get_total_levels() + 1):
        challenge = get_challenge(level)
        if challenge:
            challenges.append(challenge)
    return jsonify({
        "total_levels": get_total_levels(),
        "challenges": challenges
    })


@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "game": "Financial Literacy for Kids"})


if __name__ == "__main__":
    app.run(debug=True, port=5001)
