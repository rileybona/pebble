"""empty message

Revision ID: a143468bcae6
Revises: 
Create Date: 2024-07-15 19:46:18.914315

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a143468bcae6'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=40), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('hashed_password', sa.String(length=255), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    op.create_table('habits',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=50), nullable=False),
    sa.Column('notes', sa.String(length=255), nullable=True),
    sa.Column('recurrance_type', sa.String(length=50), nullable=False),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('trees_grown',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('tree_type', sa.String(), nullable=False),
    sa.Column('habit_name', sa.String(length=50), nullable=False),
    sa.Column('completed_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('completion',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('habit_id', sa.Integer(), nullable=False),
    sa.Column('completed_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
    sa.ForeignKeyConstraint(['habit_id'], ['habits.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('recurrances',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('habit_id', sa.Integer(), nullable=False),
    sa.Column('sunday', sa.Boolean(), nullable=False),
    sa.Column('monday', sa.Boolean(), nullable=False),
    sa.Column('tuesday', sa.Boolean(), nullable=False),
    sa.Column('wednesday', sa.Boolean(), nullable=False),
    sa.Column('thursday', sa.Boolean(), nullable=False),
    sa.Column('friday', sa.Boolean(), nullable=False),
    sa.Column('saturday', sa.Boolean(), nullable=False),
    sa.ForeignKeyConstraint(['habit_id'], ['habits.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('trees_in_progress',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('habit_id', sa.Integer(), nullable=False),
    sa.Column('tree_type', sa.String(), nullable=False),
    sa.Column('status', sa.String(), nullable=False),
    sa.Column('neglect', sa.Integer(), nullable=False),
    sa.Column('completion_count', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
    sa.ForeignKeyConstraint(['habit_id'], ['habits.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('trees_in_progress')
    op.drop_table('recurrances')
    op.drop_table('completion')
    op.drop_table('trees_grown')
    op.drop_table('habits')
    op.drop_table('users')
    # ### end Alembic commands ###