from os import name 
from app.models import db, Habit, Recurrance, Completion, User, Tree_in_progress, Tree_grown
from flask_login import current_user
from flask import Response 
from datetime import datetime, timedelta
from flask import jsonify

# =============== HABIT UTILS ===================================== 

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
            "recurrance_type": habit_obj.recurrance_type,
            "created_at": habit_obj.created_at
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

        test = [] # DEBUGGING 

        all_habits = [HabitUtils.parse_habit_data(habit) for habit in all_habits]
        for habit in all_habits:
            # if habit is weekly, include which days it recurrs on 
            if (habit["recurrance_type"] == "weekly"):
                habit_recurs = RecurranceUtils.get_recurrances_by_habit_id(habit["id"])[0]
                if (habit_recurs == "No recurrance data found."): habit["Recurrances"] = {}
                else: habit["Recurrances"] = habit_recurs
            # call for completions of this habit and attach data to return object 
            habit_completions = CompletionUtils.get_completions_by_habit_id(habit["id"])
            habit["Completions"] = habit_completions


        return all_habits
    
    # GET VISIBLE HABITS TO DISPLAY 
    @staticmethod
    def day_helper(dayNum):
        daymap = dict()
        daymap[0] = "monday"
        daymap[1] = "tuesday"
        daymap[2] = "wednesday"
        daymap[3] = "thursday"
        daymap[4] = "friday"
        daymap[5] = "saturday"
        daymap[6] = "sunday"

        day = daymap.get(dayNum)
        print(day)
        return day

    @staticmethod
    def get_display_habits():
        """refactors all habits to visible habits """
        # get all users habits 
        all_habits = HabitUtils.get_all_habits()

        # filter out any with completions today 
        some_habits = []
        today = datetime.today()
        today = date = datetime.strftime(today, "%Y-%m-%d")
        for habit in all_habits:
            if today not in habit["Completions"]:
                some_habits.append(habit)
      

        # reduce to only Daily and Weekly due today 
        display_habits = []
        weekly_habits = []
        day = datetime.today()
        day = day.weekday()
        today = HabitUtils.day_helper(day)
  
        # testData = some_habits[1]["Recurrances"]
        # return testData
        # if testData['friday'] == True : return {"friday": "true"}
        # else: return {"friday": "false"}
        for habit in some_habits:
            if (habit["recurrance_type"] == 'Daily'):
                display_habits.append(habit)
            if (habit["recurrance_type"] == 'weekly'):
                days = habit["Recurrances"]
                weekly_habits.append(habit)
                if (today in days) and (days[today] == True):
                    display_habits.append(habit)
        

        return display_habits

    # GET HIDDEN HABITS
    @staticmethod
    def get_hidden_habits():
        """return habits that are not due today or already checked off"""
        all_habits = HabitUtils.get_all_habits()

        visible_habits = HabitUtils.get_display_habits()

        hidden_habits = []

        for habit in all_habits: 
            if habit not in visible_habits:
                hidden_habits.append(habit)
        
        return hidden_habits

    # CALCULATE STREAK HENNY 


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
            if "monday" in details and (details["monday"] == True):
                habit_recurs.monday = 1
            else: habit_recurs.monday = 0
            if "tuesday" in details and (details["tuesday"] == True):
                habit_recurs.tuesday = 1
            else: habit_recurs.tuesday = 0
            if "wednesday" in details and (details["wednesday"] == True):
                habit_recurs.wednesday = 1
            else: habit_recurs.wednesday = 0
            if "thursday" in details and (details["thursday"] == True):
                habit_recurs.thursday = 1
            else: habit_recurs.thursday = 0
            if "friday" in details and (details["friday"] == True):
                habit_recurs.friday = 1
            else: habit_recurs.friday = 0
            if "saturday" in details and (details["saturday"] == True):
                habit_recurs.saturday = 1
            else: habit_recurs.saturday = 0
            if "sunday" in details and (details["sunday"] == True):
                habit_recurs.sunday = 1
            else: habit_recurs.sunday = 0
            
            try:
                db.session.commit()
            except:
                return 500

        #  if not in db, add new recurrance data 
        else:
            new_recurrances = Recurrance(
                habit_id = habitId
            )
            db.session.add(new_recurrances)
            db.session.commit()

            if "monday" in details and (details["monday"] == True):
                new_recurrances.monday = 1
            else: new_recurrances.monday = 0
            if "tuesday" in details and (details["tuesday"] == True):
                new_recurrances.tuesday = 1
            else: new_recurrances.tuesday = 0
            if "wednesday" in details and (details["wednesday"] == True):
                new_recurrances.wednesday = 1
            else: new_recurrances.wednesday = 0
            if "thursday" in details and (details["thursday"] == True):
                new_recurrances.thursday = 1
            else: new_recurrances.thursday = 0
            if "friday" in details and (details["friday"] == True):
                new_recurrances.friday = 1
            else: new_recurrances.friday = 0
            if "saturday" in details and (details["saturday"] == True):
                new_recurrances.saturday = 1
            else: new_recurrances.saturday = 0
            if "sunday" in details and (details["sunday"] == True):
                new_recurrances.sunday = 1
            else: new_recurrances.sunday = 0
            
            db.session.commit()
            # try:

               
            # except:
            #     return 500
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
        dateobj = completion_obj.completed_at
        date = datetime.strftime(dateobj, "%Y-%m-%d")
        return date

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
        today = datetime.today()
        new_completion = Completion(
            habit_id = habit_id,
            completed_at = today
        )
        try:
            db.session.add(new_completion)
            db.session.commit()
        except Exception:
            return "failed to add completion"
        
        return CompletionUtils.parse_completion_data(new_completion)
    
    @staticmethod
    def remove_completion(habit_id):
        # get all completions for this habit
        existing_completions = Completion.query.filter(
            Completion.habit_id == habit_id
        ).all()

        # existing_completions = [CompletionUtils.parse_completion_data(comp) for comp in existing_completions]
        # define today 
        todays_completion = {}
        today = datetime.strftime(datetime.today(), "%Y-%m-%d")


        # find todays completion
        for completion in existing_completions:
            date = completion.completed_at
            date = datetime.strftime(date, "%Y-%m-%d")

            if (date == today):
                todays_completion = completion
        
        # delete it 
        db.session.delete(todays_completion)
        db.session.commit()
        
        return jsonify({"message": "deleted habit completion from today"})




# =========== GARDEN UTILS ===============================================
class GardenUtils:
    # grab info by tree type
    @staticmethod 
    def tree_types(treetype):
        # define Thale Cress 
        thale = {
            "requirements": 1,
            "resiliance": 1,
            "value": 1
        }
        
        # define Pine 
        pine = {
            "requirements": 5,
            "resiliance": 2,
            "value": 10
        }

        # define rare one? 
            # requirements - 21
            # resiliance - 0

        # create dict - key = type-string, val = type object 
        type_dict = dict()
        type_dict['Thale Cress'] = thale
        type_dict['Pine'] = pine


        # get value object by key == param treetype 
        selected_type_obj = type_dict.get(treetype)

        # return object.resiliance and object.values or just the object 
        return selected_type_obj

    # parse trees for API return 
    @staticmethod 
    def parse_treeIP(tree):
        # main parse logic 
        jsonable_obj = {
            "id": tree.id,
            "user_id": tree.user_id,
            "habit_id": tree.habit_id,
            "tree_type": tree.tree_type,
            "status": tree.status,
            "neglect": tree.neglect,
            "completion_count": tree.completion_count,
        }

        # parse created at for simple calculations
        created = tree.created_at
        createdDate = created.date()
        created_simple = str(createdDate)
        jsonable_obj['created_at'] = created_simple

        return jsonable_obj


    # create a tree 
    @staticmethod
    def plant_tree(details, habitId):
        """creates a new tree under current user"""
        new_tree = Tree_in_progress(
            user_id = AuthUtils.get_current_user()['id'],
            habit_id = habitId,
            tree_type = details["tree_type"]
        )

        try:
            db.session.add(new_tree)
            db.session.commit()
            return GardenUtils.parse_treeIP(new_tree)
        except:
            return 500



    # get trees in progress by user 
    @staticmethod
    def get_trees_in_progress():
        """gets trees in progress & updates calculations"""
        # define return array 
        return_list = []
        # get treesIP by user id 
        user_id = AuthUtils.get_current_user()['id']
        trees_in_progress = Tree_in_progress.query.filter(
            Tree_in_progress.user_id == user_id
        ).all()


        # for each tree...
        for tree in trees_in_progress:
            # parse tree ?
            parsed_tree = GardenUtils.parse_treeIP(tree)

            # get habit associated with tree 
            habit = HabitUtils.get_habit_details(tree.habit_id)

            # add 'habit title' to tree 
            parsed_tree['habit_title'] = habit["title"]
            

            # calculate neglect (created to yesterday)
            date_list = []
            neglect_count = 0      #  must start fresh for each calc
            completion_count = 0   #  must start fresh for each calc

            created_at = parsed_tree['created_at']
            this_day = datetime.today()
            today = datetime.strftime(this_day, "%Y-%m-%d")
            parsed_tree['today'] = today
            if today in habit["Completions"]:    # handle today for completion count
                completion_count += 1
            today = datetime.strptime(today, "%Y-%m-%d")

            # -- yesterday = today - timedelta(days=1)
            # parsed_tree['today'] = today
            start = datetime.strptime(created_at, "%Y-%m-%d")
            # parsed_tree['start'] = start
            # print("START: ", start)
      
            delta = today - start
            delta = int(delta.days)
            # parsed_tree['delta'] = str(delta)
            # parsed_tree['daysdelta'] = str(num_days)

            # -- reverse order list of days yesterday -> created
            days = [this_day - timedelta(days=i) for i in range(1, delta + 1)]
            parsed_days = [datetime.strftime(date, "%Y-%m-%d") for date in days]    
            date_list = parsed_days[::-1]
            parsed_tree['possible_dates'] = date_list
            parsed_tree['completion_dates'] = habit["Completions"]

            # -- for each day in possible days... 
            for day in date_list:
                # if day in habit completions
                if day in habit["Completions"]:
                    # increment completion count 
                    completion_count += 1
                # else increment neglect count 
                if day not in habit["Completions"]:
                    neglect_count += 1

            # -- add Neglect to return (and completion count for now)
            parsed_tree['completion_count'] = int(completion_count)
            parsed_tree['neglect'] = int(neglect_count)

            # -- update treeIP db to reflect new calculation 
            tree.completion_count = completion_count
            tree.neglect = neglect_count
            db.session.commit()
        

            # source 'resiliance' & 'requirements' from tree type helper 
            treetype = parsed_tree['tree_type']
            treetype_obj = GardenUtils.tree_types(treetype)
            resiliance = treetype_obj['resiliance']
            requirements = treetype_obj['requirements']
            parsed_tree['resiliance'] = resiliance
            parsed_tree['requirements'] = requirements


            # calculate growth (completions createdAt to today / requirements from treetype) [return 1 if grown]
            growth = ''
            if (completion_count == requirements):
                growth = '1'
            else:
                growth = f"{completion_count}/{requirements}"
            parsed_tree['growth'] = growth

            # calculate status, update if necessary 
            status = 'Alive'
            if (neglect_count > resiliance):
                status = "Dead."
                tree.status = "Dead."
                db.session.commit()
            parsed_tree['status'] = status

            # add object to return array 
            return_list.append(parsed_tree)

        # return return array 
        return return_list




    # complete a tree
    @staticmethod
    def complete_tree(treeId):
        # find tree in progress 
        tree = Tree_in_progress.query.filter(
            Tree_in_progress.id == treeId
        ).first() 

        # find its associated habit 
        habit = Habit.query.filter(
            Habit.id == tree.habit_id
        ).first()

        # create new tree_grown object using tree info & associated habit 
        new_grown_tree = Tree_grown(
            user_id = AuthUtils.get_current_user()['id'],
            tree_type = tree.tree_type,
            habit_name = habit.title
        )

        # add to db  - TO-DO: add try/except block?
        try:
            # TO DO validate user owns this tree 
            db.session.add(new_grown_tree)
            db.session.commit()

            # delete tree in progress from db 
            db.session.delete(tree)
            db.session.commit()
        except:
            return 500 

        return {"message": "deleted treeIP. Added to Grown"}


    # delete a dead tree 
    @staticmethod
    def delete_dead_tree(treeId):
        # find tree in progress
        tree = Tree_in_progress.query.filter(
            Tree_in_progress.id == treeId
        ).first() 

        # confirm is dead ?
        if not (tree.status == "Dead."):
            return 500
        
        db.session.delete(tree)
        db.session.commit()

        return jsonify({"message": "successfully deleted tree"})
    
    # grown tree parse 
    @staticmethod
    def parse_grown_tree(tree):
        jsonable_obj = {
            "id": tree.id,
            "user_id": tree.user_id, 
            "tree_type": tree.tree_type,
            "habit_name": tree.habit_name,
        }
        date = tree.completed_at
        date = datetime.strftime(date, "%Y-%m-%d")
        jsonable_obj["completed_at"] = date
        return jsonable_obj


    # get grown trees by user 
    @staticmethod
    def get_grown_trees():
        return_list = []
        # find grown trees where user_id == current user 
        trees = Tree_grown.query.filter(
            Tree_grown.user_id == AuthUtils.get_current_user()['id']
        ).all()

        # for each grown tree
        for tree in trees:
            # parse tree obj for return 
            parsed_tree = GardenUtils.parse_grown_tree(tree)

            # get treetype obj - grab 'value' 
            treetype_obj = GardenUtils.tree_types(tree.tree_type)
            value = treetype_obj['value']
            parsed_tree['value'] = value

            # append parsed tree to return list 
            return_list.append(parsed_tree)
            
        # return array of grown trees 
        return return_list

    # sell / delete a grown tree 
    @staticmethod
    def sell_tree(treeId):
        # find grown tree 
        tree = Tree_grown.query.filter(
            Tree_grown.id == treeId
        ).first()

        # find current user
        current_user =  User.query.filter(
            User.id == AuthUtils.get_current_user()['id']
        ).first()

        # get treetype obj - grab 'value' 
        treetype_obj = GardenUtils.tree_types(tree.tree_type)
        value = treetype_obj['value']

        # add value to user.pebbles 
        if not (isinstance(current_user.pebbles, int)):
            current_user.pebbles = value
        else: current_user.pebbles += value 

        # delete tree from db 
        db.session.delete(tree)
        db.session.commit()

        # return success msg 
        return jsonify({"message": "tree sold!"})


#  =========== AUTHUTILS ===================================================


class AuthUtils:
    @staticmethod
    def get_current_user():
        """Get the current user info"""
        if current_user.is_authenticated:
            return current_user.to_dict()
        else:
            raise Exception("User not logged in")