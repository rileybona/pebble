import { NavLink } from "react-router-dom";
import './GardenProgress.css'
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { complete_tree, deleteDeadTree, get_trees_ip } from "../../redux/garden";




function GardenProgress() {
    // define dispatch & hooks (ex. done)
    const dispatch = useDispatch();

    const [done, setDone] = useState(false);
    const [reload, setReload] = useState(1);
    const [trees, setTrees] = useState([]);

    const treeState = useSelector((state) => state.garden.trees_IP.trees);

    // useEffect
    useEffect(() => {
        dispatch(get_trees_ip());
    }, [dispatch, reload])
    

    // useEffect 
    useEffect(() => {
        // if there's data, setDone true 
        if (treeState?.length > 0) {
            setTrees(Object.values(treeState));
            setDone(true);
        }
    }, [treeState]);


    const deleteTheDead = (treeId) => {
        dispatch(deleteDeadTree(treeId)).then(() => {
            setReload(reload + 1);
        });
    }

    const addToGarden = (treeId) => {
        dispatch(complete_tree(treeId)).then(() => {
            setReload(reload + 1);
        });
    }


    // WHICH CARD LOGIC 
    function inProgCard(tree) {

        // if dead 
        if (tree.status == "Dead.") {
            return (
                <div className="card-dead">
                    <p>dead-icon</p>
                    <h4>{tree.tree_type}</h4>
                    <p>&quot;{tree.habit_title}&quot;</p>
                    <p>{tree.status}</p>
                    <button className="delete-dead" onClick={() => deleteTheDead(tree.id)}>bin ico</button>
                </div>
            )
        }
    
        // if done growing 
        if (tree.growth == "1") {
            return (
                <div className="card-grown">
                    <p>grown-icon</p>
                    <h4>{tree.tree_type}</h4>
                    <p>&quot;{tree.habit_title}&quot;</p>
                    <p>Fully Grown!</p>
                    <button className="complete" onClick={() => addToGarden(tree.id)}>Add to Garden</button>
                </div>
            );  
        }
    
        // else if in progress 
        else return (
            <div className="card-progress">
                    <p>sprout-icon</p>
                    <h4>{tree.tree_type}</h4>
                    <p>&quot;{tree.habit_title}&quot;</p>
                    <div className="infoTag">
                        <p>neglect:</p>
                        <p>{tree.neglect} days</p>
                    </div>
                    <div className="infoTag">
                        <p>resilience:</p>
                        <p>{tree.resiliance} days</p>
                    </div>
                    <div className="infoTag">
                        <p>growth:</p>
                        <p>{tree.growth}</p>
                    </div>
                </div>
        )
    }
    

    // if not done, return (<navButtons>) 
    if (!done) return (
        <div className="garden-progress-page">
            <NavLink to="/garden">My Garden</NavLink>
            <h3>In Progress</h3>
        </div>
    )

    return (
        <div className="garden-progress-page">
            <div className="nav-buttons">
                <NavLink to="/garden" id='otherPage'>My Garden</NavLink>
                <h3 id='thisPage'>In Progress</h3>
            </div>
            <div className="treesIP-main">
                {trees.map((tree, i) => (
                    <div key={i} className="progress-card">
                        {inProgCard(tree)}
                        {/* <p key={i}>{tree.tree_type}</p> */}
                    </div>
                ))}
            </div>
        </div>
        
    )
}

export default GardenProgress;