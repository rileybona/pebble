import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { getAllHabits } from '../../redux/habit'

import './AllHabits.css'


function sortingHat(habit) {
    if (habit) return true
    else return false
}

function dateArrToStrings(array) {
    let stringdates = []
    array.forEach((date) => {
        let string = date.toISOString().split('T')[0];
        stringdates.push(string);
    });
    return stringdates; 
}

function timeStamptoDate(dateObj) {
    if (typeof dateObj != Date) {
        dateObj = new Date(dateObj);
    }
    let date = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
    return date; 
}

function calculateStreak(habit) {
    // skip if no completion/habit data 
    if (!habit) return 0;
    if (habit.Completions.length == 0) return 0; 

    // parse & date-ify completions - remove timestamps 
    let stringCompletions = habit.Completions;
    let datecompletions = stringCompletions.map((date) => timeStamptoDate(date));
    const completions = dateArrToStrings(datecompletions);
    
    // create array of dates, starting from today, ending with createdAt -- parse to no timestamps 
    const today = new Date();
    const createdAt = new Date(habit.created_at);
    
    let currentDate = timeStamptoDate(createdAt);
    let end = timeStamptoDate(today); 

    let dates = [];

    // reverse order created -> today 
    while (currentDate < end) {
        dates.unshift(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    dates = dateArrToStrings(dates);


    // create count. if today is in completions, count + 1
    let count = 0; 
    if (completions.includes(end)) {
        count++; 
    }

    // starting from yesterday iterate backward until date not in completions or date == createdAt 
    while (dates.length) {
       let date = dates.pop();
       if (completions.includes(date)) {
            count++;
        } else {
            return count; 
        }
    }

    return count; 
}

function AllHabits() {
    const dispatch = useDispatch();
    // add short circuit 
    const [done, setDone] = useState(false);
    // const [reload, setReload] = useState(0);
    // add reload state if necessary 
    // const [reload, setReload] = useState(0);
    const [habits, setHabits] = useState([]);

    // subscribe to habits slice of state 
    const habitState = useSelector((state) => state.habit.habits);

    // dispatch to get-habits thunk to update state
    useEffect(() => {  // after first render
        dispatch(getAllHabits());
    }, [dispatch]);

    // additional useEffect to perform logic on state?
    useEffect(() => {
        if (habitState.length > 0) {
            setHabits(habitState);
            setDone(true);
        }
    }, [habitState, habits])

    // checkbox functionality 
    function checkbox (habitId) {
        alert(`checking off habit ${habitId}!`);
        return
    }

    // edit modal 
    function openUpdate (habitId) {
        alert(`opening update modal for habit ${habitId}`)
    }

    function openCreate() {
        alert('open add habit modal');
    }

    if (!done) {
        return (
            <div className='habits-page'>
                <div className='habits-upper'>
                    <button onClick={()=> alert("test")}>Add a Habit</button>
                </div>
            </div>
        )
    } 

    return (
        <div className='habits-page'>
            <div className='habits-upper'>
                <button onClick={()=> openCreate()}>Add a Habit</button>
            </div>
            <div className='habits-main'>
                {habits.map((habit, i) => (
                    <div className='habit-card' key={i}>
                        <div className='checkbox-container'>
                            <button className='checkbox' onClick={() => checkbox(habit.id)}></button>
                        </div>
                        <div className='habit-right' onClick={() => openUpdate(habit.id)}>
                            <div className='habit-content'>
                                <h2 className='habit-name'>{habit.title}</h2>
                                <p className='habit-notes'>{habit.notes}</p>
                            </div>
                            <div className='habit-streak-container'>
                                {calculateStreak(habit) > 0 ? 
                                    <div className='streak'>
                                        <p>ico</p>
                                        <p>{calculateStreak(habit)}</p>
                                    </div>
                                    : <p></p>
                                }
                                
                            </div>
                        </div>
                       
                    </div>
                ))}
            </div>
            <div className='habits-hidden'>
                <p>hidden habits</p>
            </div>
        </div>
    )
}

export default AllHabits