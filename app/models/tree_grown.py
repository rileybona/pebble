from .db import db, environment, SCHEMA, add_prefix_for_prod

class Tree_grown(db.Model):
    __tablename__='trees_grown'

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    tree_type = db.Column(db.String, nullable=False)
    habit_name = db.Column(db.String(50), nullable=False)
    completed_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())

    # define use > treeG rel 
    user_treesG = db.relationship(
        "User",
        back_populates="treeG_users"
    )