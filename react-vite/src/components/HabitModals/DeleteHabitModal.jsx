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
        <>
            <h1>ya wanna delete yer habit?</h1>
            <button onClick={() => cancel()}>Cancel</button>
            <button className='delete-it' onClick={(e) => handleDelete(e)}>Delete!</button>
        </>
    )
}

export default DeleteHabitModal;