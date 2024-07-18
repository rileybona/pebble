import { useDispatch } from 'react-redux'
import './DeleteHabitModal.css'
import { deleteAHabit } from '../../redux/habit';
import { useModal } from '../../context/Modal';


function DeleteHabitModal({ habitId, reload, setReload }) {
    const dispatch = useDispatch(); 
    const { closeModal } = useModal();

    const handleDelete = (e) => {
        e.preventDefault();
        dispatch(deleteAHabit(habitId)).then(() => {
            setReload(reload + 1);
        });
        closeModal();
    }

    const cancel = () => {
        closeModal();
    }


    return (
        <div className='deleteHab-modal'>
            <h1>Are you sure you sure?</h1>
            <p>deleting habits can&apos;t be undone!</p>
            <div className='buttons'>
                <button onClick={() => cancel()} id='cancelB'>Cancel</button>
                <button className='delete-it' onClick={(e) => handleDelete(e)} id='deleteB'>Delete!</button>
            </div>
           
        </div>
    )
}

export default DeleteHabitModal;