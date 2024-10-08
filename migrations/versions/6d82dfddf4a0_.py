"""empty message

Revision ID: 6d82dfddf4a0
Revises: d791b170b0a1
Create Date: 2024-07-19 15:57:10.758189

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6d82dfddf4a0'
down_revision = 'd791b170b0a1'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('first_name', sa.String(length=255), nullable=False))
        batch_op.add_column(sa.Column('last_name', sa.String(length=255), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('last_name')
        batch_op.drop_column('first_name')

    # ### end Alembic commands ###
