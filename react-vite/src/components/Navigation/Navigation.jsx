import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import imgUrl from './logl.png'
// import imgUrl from './logo2.png'

function Navigation({ landing }) {
  return (
    <nav id="navbar">
      <div id="navbar-left">
        <NavLink to="/" className='logo-title'>
          <img style={{ height: "3em", padding: "0.5em" }} src={imgUrl} />
          <h3>Pebble</h3>
        </NavLink>
      </div>
      <div id="navbar-right">{landing || <ProfileButton />}</div>
    </nav>
  );
}

export default Navigation;

