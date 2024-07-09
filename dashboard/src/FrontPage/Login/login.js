import React, { useState, useEffect, useRef } from "react";
import "./login.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { NavLink, useNavigate } from "react-router-dom";
import { BsPerson, BsEnvelope, BsLock } from "react-icons/bs";
import { Toast } from "primereact/toast";
import axios from "axios";

// import {
//   MDBBtn,
//   MDBContainer,
//   MDBRow,
//   MDBCol,
//   MDBInput,
//   MDBCheckbox,
//   MDBIcon,
// } from "mdb-react-ui-kit";

function Login() {
  const toast = useRef(null);
  const [isSignIn, setIsSignIn] = useState(true);
  const [user, setUser] = useState([]);
  const toggle = () => {
    setIsSignIn(!isSignIn);
  };

  useEffect(() => {
    setTimeout(() => {
      setIsSignIn(true);
    }, 200);
  }, []);
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("User");
  console.log("Role", role);
  const onLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        localStorage.setItem("user", JSON.stringify(user));
        axios
          .post("http://localhost:8000/details", {
            email: email,
          })
          .then((res) => {
            setUser(res.data);
            console.log(res.data);
            // console.log(rows);
            if (res.data.role === "User") navigate("/dashboard");
            else if (
              res.data.role === "collector" &&
              res.data.status === "approved"
            ) {
              navigate("/dashboard_collector");
            } else {
              navigate("/login");
            }
          })
          .catch((err) => {
            console.log(err);
          });

        console.log("Details", userCredential.user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    await createUserWithEmailAndPassword(
      auth,

      email,
      password
    )
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // localStorage.setItem("user", JSON.stringify(user));
        console.log("UserDetails", user);
        if (role === "User") {
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Signed In Sucessfully",
            life: 1000,
          });

          navigate("/dashboard");
        } else {
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Approval Request Sent to Admin",
            life: 3000,
          });
          navigate("/login");
        }
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        // ..
      });
    await axios
      .post("http://localhost:8000/signUp", {
        username: username,
        email: email,
        password: password,
        role: role,
        status: "none",
      })
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res.data));
        setUser(res.data);
        if (res.data.role === "User") window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div
      id="container"
      className={`container ${isSignIn ? "sign-in" : "sign-up"}`}
      style={{ marginLeft: "0px", marginRight: "0px" }}
    >
      <Toast ref={toast} position="right" className="custom-toast" />
      {/* FORM SECTION */}
      <div className="row">
        {/* SIGN UP */}
        <div className="col align-items-center flex-col sign-up">
          <div className="form-wrapper align-items-center">
            <div className="form sign-up">
              <div className="input-group">
                <BsPerson />
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <BsEnvelope />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <BsLock />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                {/* <input
                  type="password"
                  placeholder="Role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                /> */}
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="user">User</option>
                  <option value="collector">Collector</option>
                </select>
              </div>
              <button onClick={onSubmit}>Sign up</button>
              <p>
                <span>Already have an account?</span>
                <b onClick={toggle} className="pointer">
                  Login here
                </b>
              </p>
            </div>
          </div>
        </div>
        {/* END SIGN UP */}
        {/* SIGN IN */}
        <div className="col align-items-center flex-col sign-in">
          <div className="form-wrapper align-items-center">
            <div className="form sign-in">
              <div className="input-group">
                <BsPerson />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email address"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input-group">
                <BsLock />
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button onClick={onLogin}>Log In</button>

              <p>
                <span>Don't have an account?</span>
                <b onClick={toggle} className="pointer">
                  Sign up here
                </b>
              </p>
            </div>
          </div>
          <div className="form-wrapper"></div>
        </div>
        {/* END SIGN IN */}
      </div>
      {/* END FORM SECTION */}
      {/* CONTENT SECTION */}
      <div className="row content-row">
        {/* SIGN IN CONTENT */}
        <div className="col align-items-center flex-col">
          <div className="text sign-in">
            <h2>Welcome</h2>
          </div>
          <div className="img sign-in"></div>
        </div>
        {/* END SIGN IN CONTENT */}
        {/* SIGN UP CONTENT */}
        <div className="col align-items-center flex-col">
          <div className="img sign-up"></div>
          <div className="text sign-up">
            <h2>Join with us</h2>
          </div>
        </div>
        {/* END SIGN UP CONTENT */}
      </div>
      {/* END CONTENT SECTION */}
    </div>
  );
}

export default Login;
