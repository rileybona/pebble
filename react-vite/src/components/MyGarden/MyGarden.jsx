import { NavLink } from "react-router-dom";
import './MyGarden.css'

function MyGarden() {
    return (
        <div className="myGarden">
            <NavLink to='/garden-progress'>In Progress</NavLink>
            <h1>here ur trees! theyre all grown!</h1>
        </div>
    )
}

export default MyGarden;