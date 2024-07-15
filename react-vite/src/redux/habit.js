// define types
const GET_ALL_HABITS = '/habits/GET_ALL_HABITS';
// const GET_HABIT_DETAILS = '/habits/GET_HABIT_DETAILS';
const ADD_HABIT_COMPLETION = 'habits/ADD_HABIT_COMPLETION';
const ADD_HABIT = 'habits/ADD_HABIT';
const UPDATE_HABIT = 'habits/UPDATE_HABIT';
const DELETE_HABIT = 'habits/DELETE_HABIT';
const GET_DUE_HABITS = 'habits/GET_DUE_HABITS';
const GET_HIDDEN_HABITS = 'habits/GET_HIDDEN_HABITS';

// define actions 
const loadAllHabits = (habits) => {
    return {
        type: GET_ALL_HABITS,
        payload: habits
    }
}

// const loadSingleHabit = (habit) => {
//     return {
//         type: GET_HABIT_DETAILS,
//         payload: habit
//     }
// }

const addCompletion = (completion) => {
    return {
        type: ADD_HABIT_COMPLETION,
        payload: completion
    }
}

const addHabit = (habit) => {
    return {
        type: ADD_HABIT,
        payload: habit 
    }
}

const updateHabit = (habit) => {
    return {
        type: UPDATE_HABIT,
        payload: habit
    }
}

const deleteHabit = (habitId) => {
    return {
        type: DELETE_HABIT,
        payload: habitId
    }
}

const loadDueHabits = (habits) => {
    return {
        type: GET_DUE_HABITS,
        payload: habits
    }
}

const loadHiddenHabits = (habits) => {
    return {
        type: GET_HIDDEN_HABITS,
        payload: habits
    }
}

// THUNKS - - - - - - 
// get all user's habits 
export const getAllHabits = () => async(dispatch) => {
    try {
        const response = await fetch("/api/habits");

        if (response.ok) {
            const res = await response.json(); 
            dispatch(loadAllHabits(res));
        } else {
            throw new Error("habits fetch failed.")
        }

    } catch (err) {
        console.log(err);
        return err; 
    }
}

// get visible / due habits 
export const getDueHabits = () => async(dispatch) => {
    try {
        const response = await fetch('/api/habits/visible');

        if (response.ok) {
            const res = await response.json();
            dispatch(loadDueHabits(res));
        } else {
            throw new Error("vis hab fetch failed.");
        }

    } catch (err) {
        console.log(err)
        return err;
    }
}

// get invisible / checked habits 
export const getHiddenHabits = () => async(dispatch) => {
    try {
        const response = await fetch('/api/habits/hidden');

        if (response.ok) {
            const res = await response.json();
            dispatch(loadHiddenHabits(res));
        } else {
            throw new Error("hidden hab fetch failed.");
        }

    } catch (err) {
        console.log(err);
        return err;
    }
}

// create a new habit 
export const createHabit = (data) => async (dispatch) => {
    try {
        // console.log("~create thunk - data passed in as:", data);
        // fetch to API - create habit from data
        const response = await fetch("/api/habits", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            // console.log("create hab func-- fetch successful")
            // if success, add response obj to store 
            const res = await response.json();
            // console.log("addHab thunk - response.json = ");
            // console.log(res);
            return dispatch(addHabit(res));

        } else {
            console.log("addHab thunk - fetch failed");
            throw new Error("habit POST fetch failed");
        }
    } catch(err) {
        console.log(err);
        return(err);
    }
}


export const editHabit = (details, habitId) => async (dispatch) => {
    try {
        // define options 
        const options = {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(details),
        };

        // fetch to update API route 
        const response = await fetch(`/api/habits/${habitId}`, options);

        if (response.ok) {
            const editedHabit = await response.json();
            return dispatch(updateHabit(editedHabit));
        } else {
            throw new Error("Habit PUT fetch failed.")
        }

    } catch(err) {
        console.log(err);
        return err; 
    }
}

export const deleteAHabit = (habitId) => async (dispatch) => {
    try {
        const options = {
            method: "DELETE",
        };
        const response = await fetch(`/api/habits/${habitId}`, options);

        if (response.ok) {
            dispatch(deleteHabit(parseInt(habitId)));
            return 1;
        }
    } catch(err) {
        console.log(err);
        return err;
    }
}

// add a completion to a habit 
export const markCompleted = (habitId) => async (dispatch) => {
    try {
        const options = {
            method: "POST"
        };
        const response = await fetch(`api/habits/${habitId}/completions`, options);
        
        if (response.ok) {
            const res = await response.json();
            return dispatch(addCompletion(res));
        } else {
            throw new Error("completion fetch failed!");
        }

    } catch(err) {
        console.log(err);
        return (err);
    }
}

// remove today's completion from a habit 
export const removeCompleted = (habitId) => async () => {
    try {
        const options = {
            method: "DELETE"
        }; 
        const response = await fetch(`/api/habits/${habitId}/completions`, options);

        if (response.ok) {
            const res = await response.json();
            return res;
        } else {
            throw new Error("remove comp fetch failed.");
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}

// Reducer  - - - - - -
const habitReducer = (
    state = { habits: [], habit_details: {}, visible: [], hidden: []},
    action
) => {
    switch (action.type) {
        case GET_ALL_HABITS: {
            const habits = [];
            action.payload.map((habit, i) => {
                habits[i] = habit;
            });
            return { ...state, habits}
        }
        case ADD_HABIT: {
            state.habit_details = action.payload;
            return state
        }
        case DELETE_HABIT: {
            if (state.habits[action.habitId]) {
                delete state.habits[action.habitId]
            }
            return state;
        }
        case GET_DUE_HABITS: {
            const visible = [];
            action.payload.map((habit, i) => {
                visible[i] = habit;
            });
            return { ...state, visible }
        }
        case GET_HIDDEN_HABITS: {
            const hidden = [];
            action.payload.map((habit, i) => {
                hidden[i] = habit;
            });
            return { ...state, hidden }
        }
        default:
            return state;
    }
}

export default habitReducer;

