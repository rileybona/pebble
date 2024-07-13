import { NavLink } from "react-router-dom";
import './GardenProgress.css'

function GardenProgress() {

    return (
        <div className="garden-progress-page">
            <NavLink to="/garden">My Garden</NavLink>
            <h2>ur growing trees here</h2>
        </div>
    )
}

export default GardenProgress;