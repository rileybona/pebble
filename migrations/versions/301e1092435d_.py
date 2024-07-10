"""empty message

Revision ID: 301e1092435d
Revises: 87621a967cf6
Create Date: 2024-07-10 14:44:45.975292

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '301e1092435d'
down_revision = '87621a967cf6'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('completion',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('habit_id', sa.Integer(), nullable=False),
    sa.Column('completed_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
    sa.ForeignKeyConstraint(['habit_id'], ['habits.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.drop_table('completions')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('completions',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('habit_id', sa.INTEGER(), nullable=False),
    sa.Column('completed_at', sa.DATETIME(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
    sa.ForeignKeyConstraint(['habit_id'], ['habits.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.drop_table('completion')
    # ### end Alembic commands ###
