import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { getAllHabits, getDueHabits, getHiddenHabits, markCompleted, removeCompleted } from '../../redux/habit'
import OpenModalButton from "../OpenModalButton";
import CreateHabitModal from '../HabitModals';
import './AllHabits.css'
import UpdateHabitModal from '../HabitModals/UpdateHabitModal';
import { useModal } from '../../context/Modal';


function AllHabits() {
    // declare dispatch, react hooks, etc. 
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
    const dueState = useSelector((state) => state.habit.visible);
    const hiddenState = useSelector((state) => state.habit.hidden);


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
                        </div>
                       
                    </div>
                ))}

            </div>
            
        </div>
    )
}

export default AllHabits