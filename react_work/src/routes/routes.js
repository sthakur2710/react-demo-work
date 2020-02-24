import React, { Component } from "react";
import { Switch, Route,Redirect} from "react-router-dom";
import UserRegistrationLogin from "../UserRegistrationLogin";
import Signup from "../signup";
import Dashboard from "../component/Dashboard";
import Notfound from '../component/Notfound';
import Auth from '../Auth'
class Router extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={UserRegistrationLogin} />
        <Route path="/login" component={UserRegistrationLogin} />
        <Route path="/signup" component={Signup} />
        {/* <Route path="/dashboard" component={Dashboard} /> */}
        <PrivateRoute path="/dashboard" component={Dashboard} />
        <Route component={Notfound} />
      </Switch>
    );
  }
}
   
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      Auth.getAuth() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/"
          }}
        />
      )
    }
  />
);

export default Router;
