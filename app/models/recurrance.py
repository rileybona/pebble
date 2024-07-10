from .db import db, environment, SCHEMA, add_prefix_for_prod

class Recurrance(db.Model):
    __tablename__ = "recurrances"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}
    
    id = db.Column(db.Integer, primary_key=True)
    habit_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("habits.id")), nullable=False)
    sunday = db.Column(db.Boolean, nullable=False, default=False)
    monday = db.Column(db.Boolean, nullable=False, default=False)
    tuesday = db.Column(db.Boolean, nullable=False, default=False)
    wednesday = db.Column(db.Boolean, nullable=False, default=False)
    thursday = db.Column(db.Boolean, nullable=False, default=False)
    friday = db.Column(db.Boolean, nullable=False, default=False)
    saturday = db.Column(db.Boolean, nullable=False, default=False)

    habit_recurrances = db.relationship(
        "Habit",
        back_populates="recurrance_habits"
    )
