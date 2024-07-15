from app.models import db, Tree_in_progress, environment, SCHEMA
from sqlalchemy.sql import text 
from alembic import op 

# add seeders 
def seed_trees_inProgress():

    # define 2 trees in progress 
    # Thale Cress 
    thale_cress = Tree_in_progress(
        user_id = 1,
        habit_id = 1,
        tree_type = "Thale Cress",
    )

    # Pine - alive 
    pine_alive = Tree_in_progress(
        user_id = 1,
        habit_id = 3,
        tree_type = "Pine",
        neglect = 1,
        completion_count = 1
    )

    # Pine - dead. 
    pine_dead = Tree_in_progress(
        user_id = 1,
        habit_id = 2,
        tree_type = "Pine",
        neglect = 3,
        status = "Dead.",
        completion_count = 1
    )



    # add and comit 
    db.session.add(thale_cress)
    db.session.add(pine_alive)
    db.session.add(pine_dead)
    db.session.commit() 


# undo seeders 
def undo_trees_inProgress():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.trees_in_progress RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM trees_in_progress"))
    
    db.session.commit() 