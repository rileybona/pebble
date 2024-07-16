from flask import Blueprint, jsonify, request
from flask_login import login_required
from .utils import GardenUtils

garden_routes = Blueprint("garden", __name__)


# ======= in progress routes =========

# plant/create a tree
@garden_routes.route('/<int:habitId>', methods = ["POST"])
@login_required
def plant_new_tree(habitId):
    req_body = request.get_json()
    new_tree = GardenUtils.plant_tree(req_body, habitId)
    if new_tree == 500:
        return jsonify({ "message": "Tree creation failed."} )
    return jsonify(new_tree), 201


# get trees in progress 
@garden_routes.route('/progress')
@login_required
def get_trees_inProgress():
    return GardenUtils.get_trees_in_progress()


# delete a dead tree


# add finished tree to 'my garden' 



# ======== my garden routes ===========

#  Get all grown trees 


#  sell / delete a grown tree 