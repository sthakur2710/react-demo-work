import React, { Component } from "react";
import { Button, FormGroup, FormControl } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, withRouter } from "react-router-dom";
import GoogleLogin from 'react-google-login';
import "./container/Login.css";
class UserRegistrationLogin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      errors: {
        email: "",
        password: ""
      }
    };
  }

  responseGoogle = (response) => {
    console.log('google ka mila he data', response);
  }

  handleSubmit = e => {
    e.preventDefault();
    let userLoginData = this.state;
    if (this.handleValidation()) {
      axios.post(`/login`, userLoginData).then(res => {
        localStorage.setItem("token", res.data.token);
        toast.success(res.data.msg);
        this.setState({
          email: "",
          password: ""
        });
        setTimeout(() => {
          this.props.history.push("/dashboard");
        }, 2000);
      });
    }
  };

  handleValidation() {
    let errors = {};
    let formIsValid = true;

    if (!this.state.email) {
      formIsValid = false;
      errors["email"] = "Email can not be empty";
    } else {
      errors["email"] = "";
    }
    if (!this.state.password) {
      formIsValid = false;
      errors["password"] = "Password can not be empty";
    }

    this.setState({ errors: errors });
    return formIsValid;
  }

  render() {
    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="email" bsSize="large">
            <label>Email</label>
            <FormControl
              autoFocus
              type="email"
              value={this.state.email}
              onChange={e => this.setState({ email: e.target.value })}
            />
            <span style={{ color: "red" }}>{this.state.errors["email"]}</span>
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <label>Password</label>
            <FormControl
              onChange={e => this.setState({ password: e.target.value })}
              value={this.state.password}
              type="password"
            />
            <span style={{ color: "red" }}>
              {this.state.errors["password"]}
            </span>
          </FormGroup>
          <Button type="submit" block bsSize="large">
            Login
          </Button>
        </form>
        <br></br>
        <Link block bsSize="large" style={{ marginLeft: "480px" }} to="/signup">
          Go to Registration page
        </Link>&nbsp;&nbsp;
        <GoogleLogin
        clientId="481371617706-sno5u5se3pi4rug0o9lt6400qbbnuj79.apps.googleusercontent.com" //CLIENTID NOT CREATED YET
        buttonText="LOGIN WITH GOOGLE"
        onSuccess={this.responseGoogle}
        onFailure={this.responseGoogle}
      />
        <ToastContainer />
      </div>
    );
  }
}

export default withRouter(UserRegistrationLogin);
