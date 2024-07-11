import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import './Sidebar.css'
import * as sessionActions from '../../redux/session'; // hm for why
import { useEffect, useState } from "react";

function Sidebar() {
    const user = useSelector((state) => state.session.user);

    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        dispatch(sessionActions.thunkAuthenticate()).then(() => setIsLoaded(true))
    }, [dispatch])

    if (!isLoaded) return <h1>Loading</h1>;
    return (
        <ul id="sidebar">
            <li>
                <NavLink to="/habits" id='habitlink'>Habits</NavLink>
            </li>
            <li>
                <NavLink to='/garden-progress'>Garden</NavLink>
            </li>
            <li className="coming-soon">Store <p className="tool-tip">coming soon!</p></li>
            <li className="coming-soon">Discover</li>
            <li className="coming-soon">Analytics</li>
        </ul>
    )
}

export default Sidebar;