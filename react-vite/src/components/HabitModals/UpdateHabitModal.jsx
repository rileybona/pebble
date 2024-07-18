import './CreateHabitModal.css'
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from '../../context/Modal'
import { useSelector } from 'react-redux';
import { editHabit } from '../../redux/habit';
import PlantTreeModal from './PlantTreeModal';
import DeleteHabitModal from './DeleteHabitModal';

function UpdateHabitModal({ habitId, reload, setReload}) {
    const { closeModal } = useModal();
    const { setModalContent } = useModal();
    const dispatch = useDispatch();

    // find habit in question for pre-population 
    const habits = useSelector((state) => state.habit.habits);
    const currHabit = habits.find((h) => h.id == habitId);    
    

    // form values 
    const [title, setTitle] = useState(currHabit.title);
    const [notes, setNotes] = useState(currHabit.notes); 
    const [recurranceType, setRecurranceType] = useState(currHabit.recurrance_type);

    // weekday hooks for select recurrances
    const [monday, setMonday] = useState(true);
    const [tuesday, setTuesday] = useState(true);
    const [wednesday, setWednesday] = useState(true);
    const [thursday, setThursday] = useState(true);
    const [friday, setFriday] = useState(true);
    const [saturday, setSaturday] = useState(true);
    const [sunday, setSunday] = useState(true);
    // simplify validation logic for recurrance selections 
    const oneDay = (monday || tuesday || wednesday || thursday || friday || saturday || sunday);

    // errors & validations 
    // const [errors, setErrors] = useState({}); <- literally what is this for
    const [validationErrors, setValidationErrors] = useState({});
    const [showErrors, setShowErrors] = useState(false);


    // useEffect for validations 
    useEffect(() => {
    
        const errs = {};
        if (title?.length < 1) errs.title = "Please enter a title.";
        if (title.length > 30) errs.title = "Habit title too long."; 
        if (notes?.length > 50) errs.notes = "Notes are too long.";
        if (!oneDay) errs.recurrances = "You must select at least one recurring day for a weekly habit.";

        setValidationErrors(errs);
    }, [title, notes, oneDay, reload])

    // close modal func for 'cancel' 
    const cancel = () => {
        closeModal();
    }

    // ADD DELETE FUNCTIONALITY
    const handleDelete = (e) => {
        e.preventDefault();
        setModalContent(<DeleteHabitModal habitId={habitId} reload={reload} setReload={setReload}/>)
    }


    // handle form submit !! 
    const handleSubmit = (e) => {
        e.preventDefault();
        setShowErrors(true);
        
        if (!Object.keys(validationErrors).length) {

            const updatedHabit = {
                title: title,
                notes: notes,
                recurrance_type: recurranceType
            }
            // dispatch add recurrances if its weekly 

            // dispatch to update thunk 
            dispatch(editHabit(updatedHabit, habitId)).then(() => {
                setReload(reload + 1);
            });

            closeModal();
            setModalContent(<PlantTreeModal habitId={habitId}/>);
        }
    }

    // if (!currHabit) {
    //     setReload(reload + 1);
    //     return <h1>loading</h1>
    // }

    

    return (
        <>
            <form onSubmit={handleSubmit} className="create-hab-form">
                <div className="title-cancel-submit">
                    <h1>Edit</h1>
                    <div className='buttons'>
                        <button onClick={() => cancel()} id='cancelB'>cancel</button>
                        <button type="submit" id='nextB'>next</button> 
                    </div>
                   
                </div>
                <p>warning: you will lose any plants growing for this habit!</p>
                <div className="primary-info">
                    <label>
                        {showErrors && validationErrors.title && (
                            <p className="validation-error">{validationErrors.title}</p>
                        )}
                        <p className="title-label">Title*</p>
                        <input 
                            type='text'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </label>
                    <label>
                        {showErrors && validationErrors.notes && (
                            <p className="validation-error">{validationErrors.notes}</p>
                        )}
                        <p className="notes-label">Notes</p>
                        <input
                            type='text'
                            value={notes}
                            onChange={(e) => {setNotes(e.target.value)}}
                            placeholder="add notes or description"
                        />
                    </label>
                </div>
                
                <label>
                    <p className="repeats-label">Repeats</p>
                    <select onChange={(e) => setRecurranceType(e.target.value)} 
                        defaultValue={recurranceType}>
                        <option key='Daily' value='Daily'>Daily</option>
                        <option key='Weekly' value='weekly'>Weekly</option>
                    </select>

                </label>
                {(recurranceType == 'weekly') ? 
                    <label>
                        {showErrors && validationErrors.recurrances && (
                            <p className="validation-error">{validationErrors.recurrances}</p>
                        )}
                        <p className="recurrs-label">Repeat Every</p>
                        <button onClick={(e) => {
                            e.preventDefault();
                            setSunday(!sunday)}} className={`${sunday}`} id='dayButton'>Sunday</button>
                        <button onClick={(e) => {
                            e.preventDefault();
                            setMonday(!monday)}} className={`${monday}`}>Monday</button>
                        <button onClick={(e) => {
                            e.preventDefault();
                            setTuesday(!tuesday)}} className={`${tuesday}`}>Tuesday</button>
                        <button onClick={(e) => {
                            e.preventDefault();
                            setWednesday(!wednesday)}} className={`${wednesday}`}>Wednesday</button>
                        <button onClick={(e) => {
                            e.preventDefault();
                            setThursday(!thursday)}} className={`${thursday}`}>Thursday</button>
                        <button onClick={(e) => {
                            e.preventDefault()
                            setFriday(!friday)}} className={`${friday}`}>Friday</button>
                        <button onClick={(e) => {
                            e.preventDefault();
                            setSaturday(!saturday)}} className={`${saturday}`}>Saturday</button>
                    </label> 
                : <p></p>}
            </form>
            <div className='delete-section'>
                <button onClick={(e) => handleDelete(e)} id='delete-hab'>Delete This Habit</button>
            </div>
        </>
    );
}

export default UpdateHabitModal;