import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function CreateAccount() {
  const submitForm = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const payload = Object.fromEntries(formData);

    console.log(payload);
  };

  return (
    <>
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card p-3">
            <h2>Create Account</h2>
            <form onSubmit={submitForm}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="usename"
                  placeholder="Enter username"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Enter pasword"
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Create Account
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateAccount;
