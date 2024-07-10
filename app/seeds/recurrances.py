from app.models import db, Recurrance, environment, SCHEMA
from sqlalchemy.sql import text

def seed_recurrances():
    mwf_workout = Recurrance(
        habit_id = 2, monday=True, wednesday=True, friday=True
    )

    db.session.add(mwf_workout)
    db.session.commit()


def undo_recurrances():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.recurrances RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM recurrances"))
    
    db.session.commit()