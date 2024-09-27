import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import '../Styles/Login.css'; 

function Login() {

  const [user_info, setUser_info] = useState({
    username: "",
    password: "",
    role: "",
    loggedin: false,
  });

  const [login_error, setLogin_Error] = useState(null)

  const navigate = useNavigate();

  const handleChange = (event) => {
    setUser_info((prev) => ({ ...prev, [event.target.name]: event.target.value }))
    setUser_info((prev) => ({ ...prev, loggedin: true }))
  };

  const submitForm = async event => {
    event.preventDefault();

    let response = await axios.get("http://localhost:8080/login", {
      params: {
        username: user_info.username,
        password: user_info.password,
        role: user_info.role,
      }
    });
    //navigate("/StudentPage");
    if (response.data) {
      if (user_info.role === "student")
        navigate("/Student_Login");
      else if (user_info.role === "instructor")
        navigate("/Instructor_Login");
    }
    else
      setLogin_Error(<label style={{ color: 'red' }}>Incorrect Username or Password!</label>);
  };

  useEffect(()=>{
    localStorage.setItem("Logged in User",JSON.stringify(user_info))
  })
  return (
    <>
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card p-3">
            <h2 class="LHighlight">Login </h2>
            <form onSubmit={submitForm}>
              <Form.Group className="mb-3">
                <Form.Label class="LLabel">Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Enter Username"
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label class="LLabel">Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Enter Password"
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label class="LLabel">Select your role</Form.Label>
                <Form.Select name="role" onChange={handleChange} required>
                  <option></option>
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                </Form.Select>
              </Form.Group>
              {login_error}
              <br />
              <button class="LButton" type="submit">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
