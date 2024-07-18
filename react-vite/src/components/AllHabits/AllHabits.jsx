import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { getAllHabits, getDueHabits, getHiddenHabits, markCompleted, removeCompleted } from '../../redux/habit'
import OpenModalButton from "../OpenModalButton";
import CreateHabitModal from '../HabitModals';
import './AllHabits.css'
import UpdateHabitModal from '../HabitModals/UpdateHabitModal';
import { useModal } from '../../context/Modal';


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
       let date = dates.unshift();
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
    const { setModalContent } = useModal();
    // add short circuit 
    const [done, setDone] = useState(false);
    // add reload state if necessary 
    const [reload, setReload] = useState(0);
    const [habits, setHabits] = useState([]);
    // const [visHabits, setVisHabits] = useState([]);
    const [hiddenHabits, setHiddenHabits] = useState([]);
    const [className, setClassName] = useState("hidden");    // for hiding habits completed or not due today 
    const [text, setText] = useState("show completed");      // toggle logic 

    // subscribe to habits slice of state 
    // const habitState = useSelector((state) => state.habit.habits);
    const dueState = useSelector((state) => state.habit.visible);
    const hiddenState = useSelector((state) => state.habit.hidden);

    // define weekdays by time codes 
    const WEEKDAYS = new Map();      // Legacy 
    WEEKDAYS.set(0, 'sunday');
    WEEKDAYS.set(1, 'monday');
    WEEKDAYS.set(2, 'tuesday');
    WEEKDAYS.set(3, 'wednesday');
    WEEKDAYS.set(4, 'thursday');
    WEEKDAYS.set(5, 'friday'); 
    WEEKDAYS.set(6, 'saturday');

    // dispatch to get-habits thunk to update state
    useEffect(() => {  // after first render
        dispatch(getAllHabits());
        dispatch(getDueHabits());
        dispatch(getHiddenHabits());
    }, [dispatch, reload]);

    // additional useEffect for circuit
    useEffect(() => {

        if (dueState.length > 0) {
            setHabits(dueState);
            // sortingHat(habits);
            setDone(true)
        }
        if (hiddenState.length > 0) {
            setHiddenHabits(hiddenState);
        }
    }, [dueState, habits, hiddenState, reload])

    // checkbox functionality 
    function checkbox (habitId) {
        dispatch(markCompleted(habitId)).then(() => {
            setReload(reload + 1);
        });
    }

    // uncheck a habit
    function uncheck (habitId) {
        dispatch(removeCompleted(habitId)).then(() => {
            setReload(reload + 1);
        });
    }

    // open edit modal
    function openUpdate (habitId) {
        setModalContent(<UpdateHabitModal habitId={habitId} reload={reload} setReload={setReload}/>);
    }


    // toggle visibility of hidden habits 
    function toggleHiddenHabits() {
        if (className == 'hidden') {
            setClassName("displayHidden"); 
            setText("hide completed");
        } else {
            setClassName('hidden');
            setText('show completed');
        }
    }
        



    if (!done) {
        return (
            <div className='habits-page'>
                <div className='habits-upper'>
                     <OpenModalButton 
                        className='test-modal-button'
                        buttonText='Add a Habit'
                        modalComponent={
                            <CreateHabitModal 
                                reload={reload}
                                setReload={setReload}
                            />
                        }
                    />
                </div>
            </div>
        );
    } 

    return (
        <div className='habits-page'>
            <div className='habits-upper'>
                <>
                    <OpenModalButton 
                        className='test-modal-button'
                        buttonText='Add a Habit'
                        modalComponent={
                            <CreateHabitModal 
                                reload={reload}
                                setReload={setReload}
                            />
                        }
                    />
                </>
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
            <div className='habit-toggle'>
                <p onClick={() => toggleHiddenHabits()}>{text}</p>
            </div>
            <div className={className}>
                {hiddenHabits.map((habit, i) => (
                    <div className='habit-card' key={i}>
                        <div className='checkbox-container' id='checked'>
                            <button className='checkbox' onClick={() => uncheck(habit.id)}>/</button>
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
            
        </div>
    )
}

export default AllHabits