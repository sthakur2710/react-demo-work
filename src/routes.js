import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import AddUser from "./components/AddUser";
import Login from "./components/login";
import EditComponent from "./components/EditUser";
import ManageUser from "./components/ManageUser";
import Profile from "./components/Profile";
import Auth from "./auth";
import AddQualification from "./components/AddQualification";
import ViewQualification from './components/ViewQualification';
import EditQualification from './components/EditQualification';
import RandomNumber from './components/RandomNumber'
class Router extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/add_user" component={AddUser} />
        <Route exact path="/" component={Login} />
        <Route exact path="/edit" component={EditComponent} />
        <Route exact path="/add_qualification" component={AddQualification} />
        <Route path="/manage_users" component={ManageUser} />
        <Route path="/view_qualification" component={ViewQualification} />
        <Route path="/edit_qualification" component={EditQualification} />
        <Route path="/random_no" component={RandomNumber}/>

        <PrivateRoute path="/profile" component={Profile} />
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
