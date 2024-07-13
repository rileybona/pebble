import { useDispatch } from "react-redux";

function CreateHabitModal() {
    // set states, react hooks, etc 
    const dispatch = useDispatch()

    // form values 
    const [title, setTitle] = useState("");
    const [notes, setNotes] = useState(""); 
    const [recurranceType, setRecurranceType] = useState("Daily");
    // const [recurrs, setRecurrs] = useState(['sunday', 'monday','tuesday', 'wednesday','thursday', 'friday', 'saturday']);

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
        const newHabit = {
            user_id: 1, // PLEASE CHANGE lol
            title: title,
            notes: notes,
            recurrance_type: recurranceType,
        }

        console.log(newHabit);
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
                        <button onClick={(e) => setSunday(!sunday)}>Sunday</button>
                        <button onClick={(e) => setMonday(!monday)}>Monday</button>
                        <button onClick={(e) => setTuesday(!tuesday)}>Tuesday</button>
                        <button onClick={(e) => setWednesday(!wednesday)}>Wednesday</button>
                        <button onClick={(e) => setThursday(!thursday)}>Thursday</button>
                        <button onClick={(e) => setFriday(!friday)}>Friday</button>
                        <button onClick={(e) => setSaturday(!saturday)}>Saturday</button>
                    </label> 
                : <p></p>}
            </form>
        </>
    )
}

export default CreateHabitModal;