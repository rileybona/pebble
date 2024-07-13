import { useState } from "react";
// import { useDispatch } from "react-redux";
import { useModal } from '../../context/Modal'
function CreateHabitModal() {
    // set states, react hooks, etc 
    // const dispatch = useDispatch()
    const { closeModal } = useModal();
    // form values 
    const [title, setTitle] = useState("");
    const [notes, setNotes] = useState(""); 
    const [recurranceType, setRecurranceType] = useState("Daily");
    const [recurrs, setRecurrs] = useState(['sunday', 'monday','tuesday', 'wednesday','thursday', 'friday', 'saturday']);

    // weekday hooks for select recurrances
    const [monday, setMonday] = useState(true);
    const [tuesday, setTuesday] = useState(true);
    const [wednesday, setWednesday] = useState(true);
    const [thursday, setThursday] = useState(true);
    const [friday, setFriday] = useState(true);
    const [saturday, setSaturday] = useState(true);
    const [sunday, setSunday] = useState(true);



    console.log("HERE WE ARE");




    // useEffect for validations 

    // useEffect for dispatching 

    // define handsubmit 
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('submitting!');
        // const newHabit = {
        //     user_id: 1, // PLEASE CHANGE lol
        //     title: title,
        //     notes: notes,
        //     recurrance_type: recurranceType,
        // }

        // console.log(newHabit);
        closeModal();
    }


    return (
        <>
            <form onSubmit={handleSubmit} className="create-hab-form">
                <div className="title-cancel-submit">
                    <h1>Add a Habit</h1>
                    <button>cancel</button>
                    <button>next</button> 
                </div>
                <div className="primary-info">
                    <label>
                        {/* errors logic */}
                        <p className="title-label">Title*</p>
                        <input 
                            type='text'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </label>
                    <label>
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
                        <p className="recurrs-label">Repeat Every</p>
                        <button onClick={(e) => {
                            e.preventDefault();
                            setSunday(!sunday)}} className={`${sunday}`}>Sunday</button>
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