import { useDispatch } from 'react-redux'
import './SellModal.css'
import { sell_tree } from '../../redux/garden';
import { useModal } from '../../context/Modal';


function SellModal({ treeId, reload, setReload, value}) {
    const dispatch = useDispatch(); 
    const { closeModal } = useModal();

    const handleDelete = (e) => {
        e.preventDefault();
        dispatch(sell_tree(treeId)).then(() => {
            setReload(reload + 1);
        });
        closeModal();
    }

    const cancel = () => {
        closeModal();
    }


    return (
        <div className='sell-modal'>
            <h1>Are you sure?</h1>
            <p>+ {value} pebbles. </p>
            <p>selling can&apos;t be undone</p>
            <div className='buttons'>
                <button onClick={() => cancel()} id='cancelB'>Cancel</button>
                <button className='delete-it' onClick={(e) => handleDelete(e)} id='deleteB'>Sell!</button>
            </div>
            
        </div>
    )
}

export default SellModal;