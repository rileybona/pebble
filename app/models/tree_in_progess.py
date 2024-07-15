from .db import db, environment, SCHEMA, add_prefix_for_prod

class Tree_in_progess(db.Model):
    __tablename__ = 'trees_in_progress'

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    habit_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("habits.id")), nullable=False)
    tree_type = db.Column(db.String, nullable=False)
    status = db.Column(db.String, nullable=False, default="Alive")
    neglect = db.Column(db.Integer, nullable=False, default=0)
    completion_count = db.Column(db.Integer, nullable=False, default=0)
    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())

    # user > treeIP rel
    user_treesIP = db.relationship(
        "User",
        back_populates="treeIP_users"
    )

    # habit > treeIP rel 
    habit_treesIP = db.relationship(
        "Habit",
        back_populates="treeIP_habits"
    )

