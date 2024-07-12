// define types
const GET_ALL_HABITS = '/habits/GET_ALL_HABITS';
const GET_HABIT_DETAILS = '/habits/GET_HABIT_DETAILS';
const ADD_HABIT_COMPLETION = 'habits/ADD_HABIT_COMPLETION';
const ADD_HABIT = 'habits/ADD_HABIT';
const UPDATE_HABIT = 'habits/UPDATE_HABIT';


// define actions 
const loadAllHabits = (habits) => {
    return {
        type: GET_ALL_HABITS,
        payload: habits
    }
}

const loadSingleHabit = (habit) => {
    return {
        type: GET_HABIT_DETAILS,
        payload: habit
    }
}

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

// THUNKS - - - - - - 
// get all users habits 
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

// Reducer  - - - - - -
const habitReducer = (
    state = { habits: [] },
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
        default:
            return state;
    }
}

export default habitReducer;

