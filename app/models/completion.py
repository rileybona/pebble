from .db import db, environment, SCHEMA, add_prefix_for_prod

class Completion(db.Model):
    __tablename___ = "completions"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}
    
    id = db.Column(db.Integer, primary_key=True)
    habit_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("habits.id")), nullable=False)
    completed_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())

    # define completions < habits rel
    habit_completions = db.relationship(
        "Habit",
        back_populates = "completion_habits"
    )