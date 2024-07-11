from os import name 
from app.models import db, Habit, Recurrance, Completion, User 
from flask_login import current_user
from flask import Response 
from datetime import datetime
from flask import jsonify

# FEATURE ONE UTILS done 

class HabitUtils:
    """API Habit Utility Functions"""

    # convert habit object to jsonifiable dict
    @staticmethod
    def parse_habit_data(habit_obj):
        # main parse logic 
        jsonable_obj = {
            "id": habit_obj.id,
            "user_id": habit_obj.user_id,
            "title": habit_obj.title,
            "notes": habit_obj.notes,
            "recurrance_type": habit_obj.recurrance_type
        }
        try:
           return jsonable_obj
        except:
            raise Exception("Invalid Habit Object from query")


    @staticmethod
    def get_all_habits():
        """get all of a users habits"""
        userId = AuthUtils.get_current_user()['id']
        all_habits = Habit.query.filter(
            Habit.user_id == userId
        ).all()

        all_habits = [HabitUtils.parse_habit_data(habit) for habit in all_habits]
        for habit in all_habits:
            # if habit is weekly, include which days it recurrs on 
            if (habit["recurrance_type"] == "weekly"):
                habit_recurs = RecurranceUtils.get_recurrances_by_habit_id(habit["id"])[0]
                habit["Recurrances"] = habit_recurs
            # call for completions of this habit and attach data to return object 
            habit_completions = CompletionUtils.get_completions_by_habit_id(habit["id"])
            habit["Completions"] = habit_completions

        return all_habits
    
    @staticmethod
    def get_habit_details(habitId):
        """returns details of one habit by its id"""

        habitId = int(habitId)

        # grab habit from db 
        habit = Habit.query.filter(
            Habit.id == habitId
        ).first()

        # parse it to jsonable dict
        habit = HabitUtils.parse_habit_data(habit)
        # add recurrances if necessary 
        if (habit["recurrance_type"] == "weekly"):
                habit_recurs = RecurranceUtils.get_recurrances_by_habit_id(habit["id"])[0]
                habit["Recurrances"] = habit_recurs
        # call for completions of this habit and attach data to return object 
        habit_completions = CompletionUtils.get_completions_by_habit_id(habit["id"])
        habit["Completions"] = habit_completions
        # return it babes 
        return habit 


    
    @staticmethod
    def create_new_habit(details):
        """creates a new habit under current user"""
        new_habit = Habit(
            user_id=AuthUtils.get_current_user()["id"],
            title=details['title'],
            notes=details['notes'],
        )
        # will default to 'Daily'
        if "recurrance_type" in details:
            new_habit.recurrance_type = details["recurrance_type"]

        try:
            db.session.add(new_habit)
            db.session.commit()
            return HabitUtils.parse_habit_data(new_habit)
        except:
            return 500
        
    @staticmethod
    def update_habit(habitId, details):
        """updates existing habit"""

        # grab existing habit 
        try:
            habit = Habit.query.filter(
                Habit.id == habitId
            ).first() 
        except Exception: 
            return 400
        
        # clear recurrance data if editing from a weekly habit to a daily habit 
        if "recurrance_type" in details:
            if ((habit.recurrance_type == "weekly") and (details["recurrance_type"] == "Daily")):
                msg = RecurranceUtils.delete_recurrances_by_habit_it(habitId)
                print(msg)

        # validate that user owns this habit 
        current_user = AuthUtils.get_current_user()["id"]
        if not (current_user == habit.user_id):
            return 403
        
        # update values of the habit & commit changes to database 
        try: 
            if "title" in details:
                habit.title = details["title"]
            if "notes" in details:
                habit.notes = details["notes"] # note to add a null notes attribute if empty? or ""
            if "recurrance_type" in details:
                habit.recurrance_type = details["recurrance_type"]
            db.session.commit()
        except Exception:
            return 500
        
        # grab updated habit from database and return it
        updated_habit = HabitUtils.get_habit_details(int(habitId))
        return updated_habit
    
    @staticmethod
    def delete_habit_by_id(habitId):
        """Delete and existing habit by its ID"""

        # query for habit by id provided
        habit = Habit.query.filter(
            Habit.id == habitId
        ).first()

        # return 500 i.s.e. if not in db or if not owned by current user
        if (
            isinstance(habit, Habit)
            and AuthUtils.get_current_user()["id"] == habit.user_id 
        ): # delete habit 
            db.session.delete(habit)
            db.session.commit()
            return 0
        else:
            print('not passing my validations')
            return -1


class RecurranceUtils: 
    """API Recurrance Utility Functions"""

    # format return obj
    @staticmethod
    def parse_recurrance_obj(recurrance_obj):
        try: 
            return {
                "sunday": recurrance_obj.sunday,
                "monday": recurrance_obj.monday,
                "tuesday": recurrance_obj.tuesday,
                "wednesday": recurrance_obj.wednesday,
                "thursday": recurrance_obj.thursday,
                "friday": recurrance_obj.friday,
                "saturday": recurrance_obj.saturday
            }
        except:
            raise Exception("recurrances object invalid from db query")

    # find which days a recurring habit is meant to display 
    @staticmethod
    def get_recurrances_by_habit_id(habit_id):
        habit_recurs = Recurrance.query.filter(
            Recurrance.habit_id == habit_id
        ).all()

        habit_recurs = [RecurranceUtils.parse_recurrance_obj(recurrs) for recurrs in habit_recurs] # this logic may be redundant check in the morning please
        if(len(habit_recurs) > 0):
            return habit_recurs
        # seeders & tests with 'weekly' but no recurrance data. 
        # Note: don't let users make weekly habits but not select any of the days 
        return list(["No recurrance data found."])
    
    # delete recurrance data for a habit by habit id 
    @staticmethod
    def delete_recurrances_by_habit_it(habit_id):

        habit_recurs = Recurrance.query.filter(
            Recurrance.habit_id == habit_id
        ).all()
    
        if(len(habit_recurs) > 0):
            db.session.delete(habit_recurs)
            db.session.commit()
            return "successfully deleted recurrance data for this habit"
        else: return ["No recurrance data to delete!"]

    @staticmethod
    def add_recurrances(habitId, details):
        #  query for existing recurrance data
        habit_recurs = Recurrance.query.filter(
            Recurrance.habit_id == habitId
        ).first()

        # if habit in recurrances db, update that data
        if isinstance(habit_recurs, Recurrance):
            if "monday" in details:
                habit_recurs.monday = details['monday']
            if "tuesday" in details:
                habit_recurs.tuesday = details['tuesday']
            if "wednesday" in details:
                habit_recurs.wednesday = details['wednesday']
            if "thursday" in details:
                habit_recurs.thursday = details['thursday']
            if "friday" in details:
                habit_recurs.friday = details['friday']
            if "saturday" in details:
                habit_recurs.saturday = details['saturday']
            if "sunday" in details:
                habit_recurs.sunday = details['sunday']
            
            db.session.commit()

        #  if not in db, add new recurrance data 
        else:
            new_recurrances = Recurrance(
                habit_id = habitId
            )
            if "monday" in details:
                new_recurrances.monday = details['monday']
            if "tuesday" in details:
                new_recurrances.tuesday = details['tuesday']
            if "wednesday" in details:
                new_recurrances.wednesday = details['wednesday']
            if "thursday" in details:
                new_recurrances.thursday = details['thursday']
            if "friday" in details:
                new_recurrances.friday = details['friday']
            if "saturday" in details:
                new_recurrances.saturday = details['saturday']
            if "sunday" in details:
                new_recurrances.sunday = details['sunday']
            
            db.session.add(new_recurrances)
            db.session.commit()
        
        # get updated info 
        updated_recurrances = Recurrance.query.filter(
            Recurrance.habit_id == habitId
        ).first()


        return RecurranceUtils.parse_recurrance_obj(updated_recurrances)

class CompletionUtils: 
    """API Completion Utility Functions"""

    # format completions as an array of dates 
    @staticmethod
    def parse_completion_data(completion_obj):
        return completion_obj.completed_at

    # find completion data for a given habit 
    @staticmethod
    def get_completions_by_habit_id(habit_id):
        all_completions = Completion.query.filter(
            Completion.habit_id == habit_id
        ).all() 
        all_completions = [CompletionUtils.parse_completion_data(completion) for completion in all_completions]
        return all_completions
    
    @staticmethod 
    def add_completion_to_habit(habit_id):
        new_completion = Completion(
            habit_id = habit_id
        )
        try:
            db.session.add(new_completion)
            db.session.commit()
        except Exception:
            return "failed to add completion"
        
        return CompletionUtils.parse_completion_data(new_completion)



class AuthUtils:
    @staticmethod
    def get_current_user():
        """Get the current user info"""
        if current_user.is_authenticated:
            return current_user.to_dict()
        else:
            raise Exception("User not logged in")