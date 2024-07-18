import { NavLink } from "react-router-dom";
import './MyGarden.css'
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { get_trees_grown } from "../../redux/garden";
import TreeTypes from "../TreeTypes/TreeTypes";
import SellModal from "./sellModal";
import OpenModalButton from "../OpenModalButton";


function MyGarden() {
    const dispatch = useDispatch();
    const [done, setDone] = useState(false);
    const [reload, setReload] = useState(1);
    const [trees, setTrees] = useState([]);

    const grownState = useSelector((state) => state.garden.trees_grown);

    useEffect(() => {
        dispatch(get_trees_grown())
    }, [dispatch, reload]);

    useEffect(() => {
        if (grownState?.length > 0) {
            setTrees(Object.values(grownState));
            setDone(true);
        }
    }, [grownState]);

    // const handleSell = (e, treeId) => {
    //     e.preventDefault();
    //     setModalContent(<SellModal treeId={treeId} />);
    //     console.log(`sell yer ${treeId} tree!?`);
    // }

    if (!done) return (
        <div className="myGarden">
            <div className="nav-buttons">
                <h3 id="thisPage">My Garden</h3>
                <NavLink to='/garden-progress' id='otherPage'>In Progress</NavLink>
                
            </div>
        </div>
    )

    return (
        <div className="myGarden">
            <div className="nav-buttons">
                <h3 id="thisPage">My Garden</h3>
                <NavLink to='/garden-progress' id='otherPage'>In Progress</NavLink>
            </div>
            <div className="garden-main">
                {trees.map((tree, i) => (
                    <div className="grown-card" key={i}>
                        <img src={TreeTypes(tree.tree_type).url} id='grownImage'/>
                        <div className="toolTip">
                            <h1>{tree.tree_type}</h1>
                            <p className="date">completed: {tree.completed_at}</p>
                            <p>Habit: &quot;{tree.habit_name}&quot;</p>
                            <p>value: {TreeTypes(tree.tree_type).value} pebbs</p>
                            <OpenModalButton 
                                className='sell-button'
                                buttonText='sell'
                                modalComponent={
                                    <SellModal
                                        treeId={tree.id}
                                        setReload={setReload}
                                        reload={reload}
                                        value={TreeTypes(tree.tree_type).value}
                                     />
                                }
                            />
                            {/* <button onClick={(e) => handleSell(e, tree.id)}>sell me</button> */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyGarden;