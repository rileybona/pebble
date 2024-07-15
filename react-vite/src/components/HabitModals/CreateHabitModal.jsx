import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from '../../context/Modal'
import { createHabit } from "../../redux/habit"; 
import './CreateHabitModal.css'
import PlantTreeModal from "./PlantTreeModal";


function CreateHabitModal({ reload, setReload }) {
    // set states, react hooks, etc 
    const dispatch = useDispatch()
    const { closeModal } = useModal();
    const { setModalContent } = useModal();
    const createdHabit = useSelector((state) => state.habit.habit_details);

    // form values 
    const [title, setTitle] = useState("");
    const [notes, setNotes] = useState(""); 
    const [recurranceType, setRecurranceType] = useState("Daily");

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
    // const [errors, setErrors] = useState({});
    const [validationErrors, setValidationErrors] = useState({});
    const [showErrors, setShowErrors] = useState(false);

    // useEffect for validations 
    useEffect(() => {
    
        const errs = {};
        if (title.length < 1) errs.title = "Please enter a title.";
        if (title.length > 30) errs.title = "Habit title too long."; 
        if (notes.length > 50) errs.notes = "Notes are too long.";
        if (!oneDay) errs.recurrances = "You must select at least one recurring day for a weekly habit.";

        setValidationErrors(errs);
    }, [title, notes, oneDay])


    // close modal func for 'cancel' 
    const cancel = () => {
        closeModal();
    }



    // define handsubmit 
    const handleSubmit = async (e) => {
        e.preventDefault(); // prevent refresh & modal close 
        setShowErrors(true); // display errors on submit attempt 

        // if there are not errors...
        if (!Object.keys(validationErrors).length) {
            // create habit 
            const newHabit = {
                title: title,
                notes: notes,
                recurrance_type: recurranceType,
            }

            // handle habit days!! 

            // dispatch habit to add-habit thunk -> db 
            dispatch(createHabit(newHabit)).then(() => {
                setReload(reload + 1);

                // close modal 
                closeModal();  
                
                // open tree modal with created habit's id 
                setModalContent(<PlantTreeModal habitId={createdHabit.id}/>);
          
            });          
        }
    }


    return (
        <>
            <form onSubmit={handleSubmit} className="create-hab-form">
                <div className="title-cancel-submit">
                    <h1>Add a Habit</h1>
                    <button onClick={() => cancel()}>cancel</button>
                    <button type="submit">next</button> 
                    {/* invisible open modal button  */}
                </div>
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
                    <select onChange={(e) => setRecurranceType(e.target.value)}>
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
        </>
    )
}

export default CreateHabitModal;