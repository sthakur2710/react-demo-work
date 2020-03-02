import React, { Component } from 'react';
import axios from 'axios';
import Auth from '../auth'
import { withRouter } from "react-router-dom";

class Login extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
         email:'',
         password:''
      };
    };

    handleSubmit = (e)=> {
        e.preventDefault()
        let formData = new FormData();    //formdata object
        formData.append('email', this.state.email);   //append the values with key, value pair
        formData.append('password', this.state.password);
        axios.post(`/login`,this.state)
        .then(res => {
            localStorage.setItem("token", res.token)
            Auth.authenticate();

            this.props.history.push("/manage_users");

        })
    }
    
  render() {
    return (
      <div className="App">
          <form onSubmit={this.handleSubmit}>
          <div className="row">
                <div className="input-field col s6">
                <input id="email" type="email" name="email" value={this.state.email} onChange={(e)=>this.setState({email:e.target.value})} className="validate"/>
                <label for="email">Email</label>
                </div>
            </div>
            <div className="row">
                <div className="input-field col s6">
                <input id="password" name="password" type="password" onChange={(e)=>this.setState({password:e.target.value})} value={this.state.password}  className="validate"/>
                <label for="password">Password</label>
                </div>
            </div>
            <div className="row">
            <div className="input-field col s12">
                <button type="submit" name="submit" className="waves-effect waves-light btn">Submit</button>
            </div>
            </div>
          </form>
      </div>
    );
  }
}

export default withRouter(Login);
