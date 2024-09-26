import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios"
import { useNavigate } from "react-router-dom";

function Login() {
  const [user_info, setUser_info] = useState({
    username: "",
    password: "",
    role: "",
  });

  const [login_error, setLogin_Error] = useState (null)

  const navigate=useNavigate();

  const handleChange=(event)=>{
    setUser_info((prev)=>({...prev,[event.target.name]:event.target.value}))
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

  return (
    <>
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card p-3">
            <h2>Login </h2>
            <form onSubmit={submitForm}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Enter username"
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Enter pasword"
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Select your role</Form.Label>
                <Form.Select name="role" onChange={handleChange} required>
                  <option></option>
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                </Form.Select>
              </Form.Group>
              { login_error }
              <br />
              <Button variant="primary" type="submit">
                Login
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
