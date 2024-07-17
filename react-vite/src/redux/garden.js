// define types 
const ADD_NEW_TREE = '/garden/ADD_NEW_TREE'
const GET_TREES_IP = '/garden/GET_TREES_IP'
const GET_TREES_GROWN = '/garden/GET_TREES_GROWN'
const DELETE_TREE = '/garden/DELETE_TREE'



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

const removeTree = (tree) => {
    return {
        type: DELETE_TREE,
        payload: tree
    }
}

const addTree = (tree) => {
    return {
        type: ADD_NEW_TREE,
        payload: tree
    }
}

// define thunks TO-DO ! ADD OPTIONS !! 
// PLANT a new tree for a habit 
export const plant_new_tree = (habitId) => async(dispatch) => {
    try {
        const response = await fetch(`/api/garden/${habitId}`);

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


// DELETE fully grown treeIP --- send to grown 
export const complete_tree = (treeId) => async(dispatch) => {
    try {
        const response = await fetch(`/api/garden/progress/${treeId}/complete`);

        if (response.ok) {
            const res = await response.json();
            dispatch(removeTree(res));
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
            dispatch(removeTree(res));
        } else {
            throw new Error('get grown trees fetch failed.')
        }

    } catch (err) {
        console.log(err)
        return err
    }
}

// define reducer 
const gardenReducer = (
    state = {trees_IP: [], trees_grown: []},
    action
) => {
    switch (action.type) {
        case GET_TREES_IP: 
            const treesIP = [];
            action.payload.map((tree, i) => {
                treesIP[i] = tree;
            });
            return { ...state, treesIP}
        case GET_TREES_GROWN:
            const treesGrown = [];
            action.payload.map((tree, i) => {
                treesGrown[i] = tree;
            });
            return { ...state, treesGrown}
        default:
            return state
    }
}

// export 
export default gardenReducer;