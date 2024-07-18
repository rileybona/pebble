import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import imgUrl from './logl.png'
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
// import imgUrl from './logo2.png'

function Navigation({ landing }) {
  const sessionUser = useSelector((state) => state.session.user)
  const loggedIn = (sessionUser != null);
  const [pebbles, setPebbles] = useState(0);

  useEffect(() => {
    setPebbles(sessionUser?.pebbles);
  }, [sessionUser])

  return (
    <nav id="navbar">
      <div id="navbar-left">
        <NavLink to="/" className='logo-title'>
          <img style={{ height: "3em", padding: "0.5em" }} src={imgUrl} />
          <h2>Pebble</h2>
        </NavLink>
      </div>
      <div className="merchantilism">
        {loggedIn && <img style={{ height: "1em", padding: "0.25em" }} src={imgUrl} />}
        {loggedIn && <p>{pebbles}</p>}
      </div>
      <div id="navbar-right">{landing || <ProfileButton />}</div>
    </nav>
  );
}

export default Navigation;

