from flask.cli import AppGroup
from .users import seed_users, undo_users
from .completions import seed_completions, undo_completions
from .habits import seed_habits, undo_habits
from .recurrances import seed_recurrances, undo_recurrances
from .treesG import seed_trees_grown, undo_trees_grown
from .treesIP import seed_trees_inProgress, undo_trees_inProgress
from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo 
        # command, which will  truncate all tables prefixed with 
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_trees_grown()
        undo_trees_inProgress()
        undo_completions()
        undo_recurrances()
        undo_habits()
        undo_users()
        
    seed_users()
    seed_habits()
    seed_recurrances()
    seed_completions()
    seed_trees_grown()
    seed_trees_inProgress()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_trees_inProgress()
    undo_trees_grown()
    undo_completions()
    undo_recurrances()
    undo_habits()
    undo_users()
    
    # Add other undo functions here
