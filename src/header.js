import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Auth from './auth'
class Header extends Component {

  login= ()=> {
    Auth.authenticate();
  }
  logout = ()=> {
    Auth.signout();
  }
  render() {
    return ( 
      <div> 
        <Link to='/'>Home</Link><br/>
        <Link to='add_user'>Public</Link><br/>
        <Link to='manage_users'>Protected</Link><br/>
        <Link to ='profile'>Profile</Link><br/>
        <button onClick={()=>this.login()}>Login</button><br/>
        <button onClick={()=>this.logout()}>Logout</button>
    </div>
    );
  }
}

export default Header;
