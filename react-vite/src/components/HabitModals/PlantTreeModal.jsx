// import { useModal } from '../../context/Modal'
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import './PlantTreeModal.css'
import { useModal } from '../../context/Modal';
import TreeTypeSelect from './TreeTypeSelect';
import { plant_new_tree } from '../../redux/garden';


function PlantTreeModal( {habitId} ) {
    // define dispatch & react hooks 
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [treeType, setTreeType] = useState("Thale Cress");  // form sub & render
    const [className, setClassname] = useState("hidden");
    const [radioValue, setRadioValue] = useState('');

    // function to hide / display 2nd form [handleChange1]
    const handleYNchange = (choice) => {
        // console.log(choice);
        setRadioValue(choice);
        // set classname to vis if yes (useEffect?)
        // undisable save button 
    }

    useEffect(() => {
        if (radioValue == 'yes') {
            setClassname('visible');
        } else {
            setClassname('hidden');
        }
    }, [radioValue]);


    // handleSubmit 
    const handleSubmit = (e) => {
        e.preventDefault();
        // if radio = not right now, closeModal() 
        if (radioValue == 'no') {
            closeModal();
        } else {
            // dispatch to plant tree thunk (habitId, data) 
            dispatch(plant_new_tree(habitId, treeType)).then((res) => {
                console.log(res);
                closeModal();
            });
        }        
    }
       
    return (
        <div className="plant-tree-modal">
            <div className="plant-tree-upper">
                <div className="title-save">
                    <button
                        id='save'
                        disabled={radioValue == ''}
                        onClick={(e) => handleSubmit(e)}
                     >Save</button>
                    <h3>Would you like to plant a tree for habit {habitId}?</h3>
                </div>
                <form className='yes-no'>
                    <label className='yes'>
                    <input 
                        type='radio'
                        value='yes'
                        checked={radioValue === 'yes'}
                        onChange = {() => handleYNchange('yes')}
                    />
                    <p>yes</p>
                    </label>
                    <label className='no'>
                        <input 
                            type='radio'
                            value='not yet'
                            checked={radioValue == 'no'}
                            onChange = {() => handleYNchange('no')}
                        />
                        <p>not yet</p>                       
                    </label>
                </form>      
            </div>
            <div className={className} id='plant-tree-lower'>
                <p className='labeltype'>Plant Type</p>
                <form onSubmit={handleSubmit} className='plant-form'>
                    <select 
                        className='select-treetype'
                        onChange={(e) => setTreeType(e.target.value)}
                    >
                        <option value='Thale Cress'>Thale Cress</option>
                        <option value='Pine'>Pine</option>
                    </select>
                </form>
                <TreeTypeSelect 
                    treetype={treeType}
                />
            </div>
            

        </div>
        
    )
}

export default PlantTreeModal;