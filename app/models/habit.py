from .db import db, environment, SCHEMA, add_prefix_for_prod

class Habit(db.Model):
    __tablename__ = "habits"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    title = db.Column(db.String(50), nullable=False)
    notes = db.Column(db.String(255), nullable=True)
    recurrance_type = db.Column(db.String(50), nullable=False, default="Daily")
    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())

    # create habit < user rel
    user_habits = db.relationship(
        "User",
        back_populates="habit_users"
    )

    # define habit > completion rel
    completion_habits = db.relationship(
        "Completion",
        back_populates="habit_completions",
        cascade="all, delete-orphan"
    )

    # define habit > recurrance rel 
    recurrance_habits = db.relationship(
        "Recurrance",
        back_populates="habit_recurrances",
        cascade="all, delete-orphan"
    )

