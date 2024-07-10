from app.models import db, Completion, environment, SCHEMA
from sqlalchemy.sql import text

# add completeion seeders 
def seed_completions():
    completion_one = Completion(
        habit_id = 1
    )

    db.session.add(completion_one)
    db.session.commit()

# under completion seeders 
def undo_completions(): 
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.completion RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM completion"))

    db.session.commit()

