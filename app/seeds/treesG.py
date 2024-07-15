from app.models import db, Tree_grown, environment, SCHEMA
from sqlalchemy.sql import text
from alembic import op 

# add seeders 
def seed_trees_grown(): 
    
    # define a tree 
    tree1 = Tree_grown(
        user_id=1, tree_type="Pine", habit_name="Wash Face"
    )

    # add & commit 
    db.session.add(tree1)
    db.session.commit()



# undo seeders 
def undo_trees_grown():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.trees_grown RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM trees_grown"))
    
    db.session.commit() 
