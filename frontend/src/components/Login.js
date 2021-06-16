import axios from "axios";
import React, { useState, useEffect, useRef, useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "../context/UserProvider";

function Login() {
  const [details, setDetails] = useState({ email: "", password: "" });
  const [loginData, setLoginData] = useState([]);
  const [didMount, setDidMount] = useState(false);

  const { getTokenData } = useContext(UserContext);

  const apiURL = "http://127.0.0.1:8000/api";

  const errorsRef = useRef();
  let history = useHistory();

  useEffect(() => {
    setDidMount(true);
    if (didMount) {
      getLoginData();

      history.push({
        pathname: "/allboards",
      });
    }
    return () => setDidMount(false);
  }, [loginData]);

  async function getLoginData() {
    var postData = {
      email: details.email,
      password: details.password,
    };
    let axiosConfiguration = {
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
      },
    };
    await axios
      .post(`${apiURL}/login`, postData, axiosConfiguration)
      .then((response) => {
        setLoginData(response);
        getTokenData(response);
      })
      .catch((error) => {
        if (error.response) {
          errorsRef.current.classList.remove("collapse");
          switch (error.response.status) {
            case 400:
              errorsRef.current.innerHTML =
                error.response.data.errorMessages.email !== undefined &&
                error.response.data.errorMessages.password == undefined
                  ? error.response.data.errorMessages.email
                  : error.response.data.errorMessages.password !== undefined &&
                    error.response.data.errorMessages.email == undefined
                  ? error.response.data.errorMessages.password
                  : error.response.data.errorMessages.email !== undefined &&
                    error.response.data.errorMessages.password !== undefined
                  ? error.response.data.errorMessages.email +
                    " / " +
                    error.response.data.errorMessages.password
                  : "";
              break;
            case 401:
              errorsRef.current.innerHTML =
                error.response.data.errorMessages.error;
            default:
              break;
          }
        }
      });
  }

  function submitHandler(e) {
    e.preventDefault();
    getLoginData();
  }

  const emailChange = (event) => {
    setDetails({ ...details, email: event.target.value });
  };

  const passwordChange = (event) => {
    setDetails({ ...details, password: event.target.value });
  };

  return (
    <div className="container">
      <div className="loginWrapper d-flex justify-content-center align-items-center flex-column">
        <div className="row">
          <div
            className="alert alert-danger collapse"
            role="alert"
            ref={errorsRef}
          ></div>
        </div>
        <div className="row">
          <h3>Login Page</h3>
          <form className="formLogin" onSubmit={submitHandler}>
            <div className="col-12 mt-3">
              <input
                type="text"
                placeholder="Email"
                className="form-control"
                onChange={emailChange}
              />
              <input
                type="password"
                placeholder="Password"
                className="form-control mt-3"
                onChange={passwordChange}
              />
              <button className="btn btn-primary mt-3" type="submit">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
