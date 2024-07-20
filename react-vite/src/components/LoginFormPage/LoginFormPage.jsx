import { useEffect, useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import "./LoginForm.css";
import { useModal } from "../../context/Modal";
import OpenModalButton from '../OpenModalButton';
import SignupFormModal from '../SignupFormModal';

function LoginFormPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const [validationErrors, setValidationErrors] = useState({});
  const [showValErrs, setShowValErrs] = useState("secret"); 

  // useEffect for validations 
  useEffect(() => {
    const errs = {}; 

    if (email.length < 5) {
      errs.email = "email must be at least 5 characters.";
    }
    if (password.length < 3) {
      errs.password = 'password must be at least 3 characters';
    }

    setValidationErrors(errs);

  }, [email, password])

  if (sessionUser) return <Navigate to="/" replace={true} />;

  const loginDemo = (e) => {
    e.preventDefault();
    dispatch(thunkLogin({ email: "demo@aa.io", password: "password" }));
    closeModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(validationErrors).length > 0 ) {
        setShowValErrs('seen'); 
        return;
    }

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="login-card">
      <h1>Log In</h1>
      {errors.length > 0 &&
        errors.map((message) => <p key={message}>{message}</p>)}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="email">
          <label>
            Email
            <p className={showValErrs}>{validationErrors.email}</p>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          {errors.email && <p className="seen">{errors.email}</p>}
        </div>
        <div className="password">
          <label>
            Password
            <p className={showValErrs}>{validationErrors.password}</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {errors.password && <p className="seen">{errors.password}</p>}
        </div>
        <button type="submit" className="login-button">Log In</button>
        <button id="demo-user" onClick={loginDemo}>
          Demo User
        </button>
      </form>
      <div className="login-footer">
        <p className="desc">don&apos;t have an account?</p>
        <OpenModalButton 
          className='create-account'
          buttonText='Create Account'
          modalComponent={
            <SignupFormModal />
          }
        />
      </div>
    </div>
  );
}

export default LoginFormPage;
