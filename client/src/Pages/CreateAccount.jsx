import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import '../Styles/CreateAccount.css'; 

function CreateAccount() {


  const [account, setAccount] = useState({
    firstname: "",
    lastname: "",
    role: "",
    username: "",
    password: "",
  });
  
  const navigate=useNavigate();

  //Handles reading the input field of the form
  const handleChange=(event)=>{
    setAccount((prev)=>({...prev,[event.target.name]:event.target.value}))
  }

  const submitForm = async event => {


    try{
      await axios.post("http://localhost:8080/create",account)
      navigate("/");
    }
    catch(err)
    {
      console.log(err)
    }
 
  };


  return (
    <>
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card p-3">
            <h2 class="CAHighlight">Create Account</h2>
            <form onSubmit={submitForm}>
              <Form.Group className="mb-3">
                <Form.Label class="CALabel">Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Enter username"
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label class="CALabel">Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Enter Password"
                  required
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label class="CALabel">First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstname"
                  placeholder="Enter First Name"
                  required

                  onChange={handleChange}
                ></Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label class="CALabel">Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastname"
                  placeholder="Enter Last Name"
                  required

                  onChange={handleChange}
                ></Form.Control>
              </Form.Group>
              <Form.Group>
                <br />
                <Form.Label class="CALabel">Select your role</Form.Label>
                <Form.Select name="role" onChange={handleChange} required >
                  <option></option>
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                </Form.Select>
              </Form.Group>
              <br></br>
              <button class="CAButton" variant="primary" type="submit">
                Create Account
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateAccount;
