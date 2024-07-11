from flask import Blueprint, jsonify, request
from flask_login import login_required
from .utils import HabitUtils, CompletionUtils
from app.models import User

habit_routes = Blueprint("habits", __name__)

# get all habits by user id 
@habit_routes.route('')
@login_required
def get_my_habits():
    return HabitUtils.get_all_habits()

# get details of one habit by its id 
@habit_routes.route('/<int:habitId>')
@login_required
def get_habit_details(habitId):
    return HabitUtils.get_habit_details(habitId)


# post a new habit 
@habit_routes.route('', methods=["POST"])
@login_required
def post_new_habit():
    req_body = request.get_json()
    print(req_body)
    new_habit = HabitUtils.create_new_habit(req_body)
    if new_habit == 500: 
        return jsonify({"message": "Habit Creation Failed"}), 500
    return new_habit, 201

# add recurrances to a weekly habit 

# update a habit 
@habit_routes.route('/<int:habitId>', methods=["PUT"])
@login_required
def update_habit(habitId):
    req_body = request.get_json()
    updated_habit = HabitUtils.update_habit(habitId, req_body)
    if updated_habit == 400:
        return jsonify({"message": "No habit with that id found."}), 400
    if updated_habit == 403:
        return jsonify({"message": "Not Authorized"}), 403
    if updated_habit == 500:
        return jsonify({"message": "Habit update failed."}), 500 
    return updated_habit, 201 

# add a completion to a habit 
@habit_routes.route('/<int:habitId>/completions', methods=["POST"])
def add_completion_to_habit(habitId):
    return jsonify(CompletionUtils.add_completion_to_habit(habitId))

# delete a habit 
@habit_routes.route('/<int:habitId>', methods=["DELETE"])
@login_required
def delete_habit(habitId):
    status = HabitUtils.delete_habit_by_id(habitId)
    if status == 0:
        return jsonify({"message": "success!"}), 200
    if status == -1: 
        return jsonify({"message": "Internal Server Error"}), 500 
    return status, 400

