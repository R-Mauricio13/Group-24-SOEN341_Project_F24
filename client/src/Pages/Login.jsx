import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import '../Styles/Login.css'; 

function Login() {

  const [user_info, setUser_info] = useState({
    username: "",
    user_password: "",
    user_role: "",
    loggedin: false,
  });

  const [login_error, setLogin_Error] = useState(null)
  const [login_success, setLogin_Success] = useState(null)

  const handleChange = (event) => {
    setUser_info((prev) => ({ ...prev, [event.target.name]: event.target.value }))
    setUser_info((prev) => ({ ...prev, loggedin: true }))
  };

  // interpret get request for this page. if there is error-msg in the query, use the setLogin_Error function to display the error message
  useEffect(() => {

    // get credential cookie and check if valid, and redirect to appropriate page
    fetch('http://localhost:8080/check_login', {
      method: 'GET',
      credentials: 'include'  // Include cookies
      })
      .then(response => {
          if (response.status === 200) {
            // If the user is already logged in, redirect to the appropriate page
            response.json().then(data => {
              if (data.user_role === "student") {
                window.location.href = 'Student_Login';
              } else if (data.user_role === "instructor") {
                window.location.href = 'Instructor_Login';
              }
            });
          }
      })
      .catch((error) => {
          console.error('Error:', error);
      });

    const url = new URL(window.location.href);
    const error_msg = url.searchParams.get("error-msg");
    const success_msg = url.searchParams.get("success-msg");
    if (error_msg) {
      setLogin_Error(<label style={{ color: 'red' }}>{error_msg}</label>);
    }
    if (success_msg) {
      setLogin_Success(<label style={{ color: 'green' }}>{success_msg}</label>);
    }
  }, []);

  const submitForm = async event => {
    event.preventDefault();

    if (!user_info.username || !user_info.user_password || !user_info.user_role) {
      throw new Error("Login parameters missings!");
    }

    const updatedUser = {
      ...user_info,
      loggedin: true,  // Mark the user as logged in
    };

    setUser_info(updatedUser);

    // TODO: Make this post request instead
    window.location.replace("http://localhost:8080/login?username=" + user_info.username + "&user_password=" + user_info.user_password + "&user_role=" + user_info.user_role);

  };

  useEffect(()=>{
    localStorage.setItem("Logged in User",JSON.stringify(user_info))
  })
  return (
    <>
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card p-3">
            <h2 className="LHighlight">Login </h2>
            <form onSubmit={submitForm}>
              <Form.Group className="mb-3">
                <Form.Label className="LLabel" htmlFor="username">Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Enter Username"
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="LLabel" htmlFor="user_password">Password</Form.Label>
                <Form.Control
                  type="password"
                  name="user_password"
                  id="user_password"
                  placeholder="Enter Password"
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label className="LLabel" htmlFor="user_role">Select your role</Form.Label>
                <Form.Select name="user_role" id="user_role" onChange={handleChange} required>
                  <option></option>
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                </Form.Select>
              </Form.Group>
              {login_error}
              {login_success}
              <br />
              <button className="LButton" type="submit" name="login" disabled={!user_info.username || !user_info.user_password || !user_info.user_role}>
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
