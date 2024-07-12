import { useSelector } from "react-redux";
import "./Main.css";
import LoginFormPage from "../LoginFormPage";

function Main() {
  const user = useSelector((state) => state.session.user);
  if (!user?.id) return (
    <div className="splash-page">
      <div className="splash-left">
        <img src='../../public/splash-left.jpeg' id='spigot'/>
      </div>
      <LoginFormPage />
      <div className="splash-right">
        <p>img</p>
      </div>
    </div>
  )

  return (
    <div className="welcome-page">
      <h1>Welcome to Pebble.</h1>
      <h3>Checkout out Habits to get started on your goals</h3>
      <h3>or Garden to see the fruits of your labor!</h3>
    </div>
  );
}

export default Main;