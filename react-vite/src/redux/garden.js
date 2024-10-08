// define types 
const ADD_NEW_TREE = '/garden/ADD_NEW_TREE'
const GET_TREES_IP = '/garden/GET_TREES_IP'
const GET_TREES_GROWN = '/garden/GET_TREES_GROWN'
const DELETE_TREE = '/garden/DELETE_TREE'
const REMOVE_IP_TREE = '/garden/REMOVE_IP_TREE'

// define actions 
const loadTreesIP = (trees) => {
    return {
        type: GET_TREES_IP,
        payload: trees
    }
}

const loadTreesGrown = (trees) => {
    return {
        type: GET_TREES_GROWN,
        payload: trees
    }
}

const removeIPtree = (treeid) => {
    return {
        type: REMOVE_IP_TREE,
        payload: treeid
    }
}


const sellTree = (treeid) => {
    return {
        type: DELETE_TREE,
        payload: treeid
    }
}

const addTree = (tree) => {
    return {
        type: ADD_NEW_TREE,
        payload: tree
    }
}

// define thunks 
// PLANT a new tree for a habit 
export const plant_new_tree = (habitId, treetype) => async(dispatch) => {
    try {
        const data = {
            "tree_type": treetype
        }
        const response = await fetch(`/api/garden/${habitId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const res = await response.json();
            dispatch(addTree(res))
        } else {
            throw new Error('plant tree fetch failed.')
        }
    } catch (err) {
        console.log(err)
        return err
    }
}

// GET all trees in progress 
export const get_trees_ip = () => async(dispatch) => {
    try {
        const response = await fetch('/api/garden/progress');

        if (response.ok) {
            const res = await response.json();
            dispatch(loadTreesIP(res));
        } else {
            throw new Error('get treesIP fetch failed.')
        }

    } catch (err) {
        console.log(err)
        return err
    }

}

// DELETE dead treesIP 
export const deleteDeadTree = (treeId) => async(dispatch) => {
    try {
        const options = {
            method: "DELETE",
        }; 
        const response = await fetch(`/api/garden/progress/${treeId}`, options);

        if (response.ok) {
            dispatch(removeIPtree(treeId))
        } else {
            throw new Error('failed fetch to delete dead tree.')
        }

    } catch(err) {
        console.log(err);
        return err;
    }
}


// DELETE fully grown treeIP --- send to grown 
export const complete_tree = (treeId) => async() => {
    try {
        const options = {
            method: "DELETE",
        }
        const response = await fetch(`/api/garden/progress/${treeId}/complete`, options);

        if (response.ok) {
            const res = await response.json();
            return res;
            // dispatch(removeTree(treeId))
        } else {
            throw new Error('delete treesIP fetch failed.')
        }

    } catch (err) {
        console.log(err)
        return err
    }
}


// GET all grown trees 
export const get_trees_grown = () => async(dispatch) => {
    try {
        const response = await fetch(`/api/garden`);

        if (response.ok) {
            const res = await response.json();
            dispatch(loadTreesGrown(res));
        } else {
            throw new Error('get grown trees fetch failed.')
        }

    } catch (err) {
        console.log(err)
        return err
    }
}

// SELL a grown tree 
export const sell_tree = (treeId) => async(dispatch) => {
    try {
        const options = {
            method: "DELETE",
        }
        const response = await fetch(`/api/garden/${treeId}`, options);

        if (response.ok) {
            const res = await response.json(); 
            await dispatch(sellTree(treeId))
            // console.log("wohoo!", res); 
            return res;
        } else {
            throw new Error("fetch to sell tree failed.")
        }

    } catch (err) {
        console.log(err);
        return err; 
    }
}

// define reducer 
const gardenReducer = (
    state = { trees_IP: {}, trees_grown: []},
    action
) => {
    switch (action.type) {
        case GET_TREES_IP: {
            const trees_IP = [];
            action.payload.forEach((tree) => {
                trees_IP[tree.id] = tree;
            });
            const newState = { ...state, trees_IP}
            return newState
        }       
        case REMOVE_IP_TREE: {
            const trees_IP = state.trees_IP
            delete trees_IP[action.payload];
            const newState = { ...state, trees_IP}
            return newState
        }   
        case GET_TREES_GROWN: {
            const trees_grown = [];
            action.payload.map((tree, i) => {
                trees_grown[i] = tree;
            });
            const newState = { ...state, trees_grown}
            return newState
        }
        case DELETE_TREE: {
            const trees_grown = state.trees_grown;
            delete trees_grown[action.payload];
            const newState = { ...state, trees_grown}
            return newState
        }
        default:
            return state
    }
}

// export 
export default gardenReducer;