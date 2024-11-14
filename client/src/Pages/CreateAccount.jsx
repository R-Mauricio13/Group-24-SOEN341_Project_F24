import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../Styles/CreateAccount.css'; 

function CreateAccount() {


  const [account, setAccount] = useState({
    first_name: "",
    last_name: "",
    user_role: "",
    username: "",
    user_password: "",
  });
  
  const navigate=useNavigate();

  //Handles reading the input field of the form
  const handleChange=(event)=>{
    setAccount((prev)=>({...prev,[event.target.name]:event.target.value}))
  }

  const submitForm = async event => {
    event.preventDefault(); // Add this line to prevent default form submission
    try {
      await axios.post("http://localhost:8080/create", account)
      navigate("/");
    }
    catch(err) {
      console.log(err)
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-10">
        <div className="card p-3">
          <h2 className="CAHighlight">Create Account</h2>
          <form onSubmit={submitForm}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="username" className="CALabel">Username</Form.Label>
              <Form.Control
                id="username"
                type="text"
                name="username"
                placeholder="Enter username"
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="password" className="CALabel">Password</Form.Label>
              <Form.Control
                id="password"
                type="password"
                name="user_password"
                placeholder="Enter Password"
                required
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="firstName" className="CALabel">First Name</Form.Label>
              <Form.Control
                id="firstName"
                type="text"
                name="first_name"
                placeholder="Enter First Name"
                required
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="lastName" className="CALabel">Last Name</Form.Label>
              <Form.Control
                id="lastName"
                type="text"
                name="last_name"
                placeholder="Enter Last Name"
                required
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <br />
              <Form.Label htmlFor="userRole" className="CALabel">Select your role</Form.Label>
              <Form.Select 
                id="userRole"
                name="user_role" 
                onChange={handleChange} 
                required
              >
                <option value="">Select a role</option>
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </Form.Select>
            </Form.Group>
            <br />
            <button className="CAButton" type="submit">
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateAccount;
