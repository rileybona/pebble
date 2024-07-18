import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const [valErrors, setValErrors] = useState({}); 
  const [showValErrs, setShowValErrs] = useState('secret');


  useEffect(() => {
    const errobj = {};
    let need = false;
    // email is an email 
    if (!email.includes('@')) {
     errobj.email = 'must input an email!'
     need = true;
    }

    // username
    if (username.length < 5) {
      errobj.username = 'username must be more than 5 characters!';
      need = true;
    }
    // firstName 
    // lastName
    // password length 
    if (password.length < 5) {
      errobj.password = 'password must be more than 5 characters.'
      need = true;
    }

    if (need) setValErrors(errobj);

  }, [email, username, password])



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(valErrors).length > 0) {
      setShowValErrs('seen');
      return
    }
    

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
    }

    const serverResponse = await dispatch(
      thunkSignup({
        email,
        username,
        first_name: firstName,
        last_name: lastName,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  return (
    <>
      {errors.server && <p>{errors.server}</p>}
      <form id="signup-form" onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        <p className={showValErrs}>{valErrors.email}</p>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p>{errors.email}</p>}
        <p className={showValErrs}>{valErrors.username}</p>
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        {errors.username && <p>{errors.username}</p>}
        <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        {errors.firstName && <p>{errors.firstName}</p>}
        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        {errors.lastName && <p>{errors.lastName}</p>}
        <p className={showValErrs}>{valErrors.password}</p>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p>{errors.password}</p>}
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
        <button id="signup-button" type="submit">
          Submit
        </button>
      </form>
    </>
  );
}

export default SignupFormModal;
