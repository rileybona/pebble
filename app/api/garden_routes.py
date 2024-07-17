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
@garden_routes.route('/progress/<int:treeId>', methods=['DELETE'])
@login_required
def delete_dead_tree(treeId):
    return GardenUtils.delete_dead_tree(treeId)


# add finished tree to 'my garden' 
@garden_routes.route('/progress/<int:treeId>/complete', methods=["DELETE"])
@login_required
def add_tree_to_garden(treeId):
    return GardenUtils.complete_tree(treeId)


# ======== my garden routes ===========

#  Get all grown trees 
@garden_routes.route('')
@login_required
def get_all_grown_trees():
    return GardenUtils.get_grown_trees()

#  sell / delete a grown tree 
@garden_routes.route('/<int:treeId>', methods=["DELETE"])
@login_required
def sell_grown_tree(treeId):
    return GardenUtils.sell_tree(treeId)