import React, { Component } from "react";
import { Button, FormGroup, FormControl } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

import "./container/Login.css";
class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      password: "",
      phone: "",
      errors: {
        name: "",
        email: "",
        password: "",
        phone: ""
      }
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    if (this.handleValidation()) {
      let userData = this.state;
      axios.post(`/create`, userData)
        .then(res => {
          if (res.status === 200) {
            this.setState({
              name: "",
              email: "",
              password: "",
              phone: ""
            });
            toast.success(res.data.msg);
          }
        })
        .catch(error => {
          if (error.response.status === 400) {
            toast.error(error.response.data.msg);
          }
        });
    }
  };

  handleValidation() {
    let errors = {};
    let formIsValid = true;

    if (!this.state.name) {
      formIsValid = false;
      errors["name"] = "Name can not be empty";
    }
    if (!this.state.email) {
      formIsValid = false;
      errors["email"] = "Email can not be empty";
    }
    if (!this.state.password) {
      formIsValid = false;
      errors["password"] = "Password can not be empty";
    }
    if (!this.state.phone) {
      formIsValid = false;
      errors["phone"] = "Phone number can not be empty";
    }
    this.setState({ errors: errors });
    return formIsValid;
  }

  render() {
    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="name" bsSize="large">
            <label>Name</label>
            <FormControl
              autoFocus
              type="text"
              value={this.state.name}
              onChange={e => this.setState({ name: e.target.value })}
            />
            <span style={{ color: "red" }}>{this.state.errors["name"]}</span>
          </FormGroup>
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
          <FormGroup controlId="phone" bsSize="large">
            <label>Phone</label>
            <FormControl
              onChange={e => this.setState({ phone: e.target.value })}
              value={this.state.phone}
              type="text"
            />
            <span style={{ color: "red" }}>{this.state.errors["phone"]}</span>
          </FormGroup>

          <Button type="submit" block bsSize="large">
            Registraion
          </Button>
        </form>
        <Link block bsSize="large" style={{ marginLeft: "587px" }} to="/login">
          Go to Login page
        </Link>
        <ToastContainer />
      </div>
    );
  }
}

export default Signup;
