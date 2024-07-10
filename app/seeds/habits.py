from app.models import db, Habit, environment, SCHEMA
from sqlalchemy.sql import text
from alembic import op 

# add seeders
def seed_habits():

    # define a couple habits 
    habit_one = Habit(
        user_id = 1, title="Wash Face", notes="once am once pm"
    )

    habit_two = Habit(
        user_id = 1, title="Workout", recurrance_type="weekly"
    )

    habit_three = Habit(
        user_id = 1, title="Stretch", notes="10 min Vinyasa Flow"
    )

    # add and commit them 
    db.session.add(habit_one)
    db.session.add(habit_two)
    db.session.add(habit_three)
    db.session.commit()

# undo seeders 
def undo_habits():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.habits RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM habits"))
    
    db.session.commit() 

